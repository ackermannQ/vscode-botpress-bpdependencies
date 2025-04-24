import * as fs from "fs";
import * as path from "path";
import { Project } from "ts-morph";
import * as vscode from "vscode";

import {
  addBpDependencyIntegration,
  addBpDependencyInterface,
} from "./bpDependencies";
import { addBuildScript, rebuildBpProject } from "./build";
import { getBotpressKeywordDoc } from "./doc/doc";
import { getIntegrationRoot } from "./getIntegrationRoot";
import { openAi } from "./openAi";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "botpress-tools.addBpDependencyInterface",
      addBpDependencyInterface
    ),

    vscode.commands.registerCommand(
      "botpress-tools.addBpDependencyIntegration",
      addBpDependencyIntegration
    ),

    vscode.commands.registerCommand(
      "botpress-tools.removeBpDependency",
      async () => {
        const workspaceRoot = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
        const activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor) {
          vscode.window.showErrorMessage("No active editor found.");
          return;
        }

        let packageJsonPath = activeEditor.document.uri.fsPath;
        const packageJsonfolderPath = path.dirname(packageJsonPath);

        if (!workspaceRoot) return;

        packageJsonPath = path.join(packageJsonfolderPath, "package.json");
        const packageJson = JSON.parse(
          fs.readFileSync(packageJsonPath, "utf-8")
        );
        const deps = Object.keys(packageJson.bpDependencies || {});
        const selected = await vscode.window.showQuickPick(deps, {
          placeHolder: "Select a dependency to remove",
        });
        if (!selected) return;

        delete packageJson.bpDependencies[selected];
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
        vscode.window.showInformationMessage(
          `Removed bpDependency: ${selected}`
        );
      }
    ),

    vscode.commands.registerCommand(
      "botpress-tools.addBuildScript",
      addBuildScript
    ),
    vscode.commands.registerCommand(
      "botpress-tools.rebuildBpProject",
      rebuildBpProject
    ),

    vscode.commands.registerCommand("botpress-tools.deployBpProject", () => {
      const terminal = vscode.window.createTerminal(`Botpress Deploy`);
      const activeEditor = vscode.window.activeTextEditor;
      const currentPath = activeEditor.document.uri.fsPath;
      const integrationRoot = getIntegrationRoot(path.resolve(currentPath));

      terminal.sendText(`bp deploy --workDir ${integrationRoot}`);
      terminal.show();
    }),

    vscode.commands.registerCommand("botpress-tools.createIntegration", () => {
      const terminal = vscode.window.createTerminal(`Botpress Init`);
      terminal.sendText(`bp init --workDir integrations --type integration`);
      terminal.show();
    }),

    vscode.commands.registerCommand("botpress-tools.createBot", () => {
      const terminal = vscode.window.createTerminal(`Botpress Init`);
      terminal.sendText(`bp init --workDir bots --type bot`);
      terminal.show();
    }),

    vscode.commands.registerCommand("botpress-tools.createPlugin", () => {
      const terminal = vscode.window.createTerminal(`Botpress Init`);
      terminal.sendText(`bp init --workDir plugins --type plugin`);
      terminal.show();
    }),

    vscode.commands.registerCommand(
      "botpress-tools.generateHubFile",
      async (uri: vscode.Uri) => {
        if (uri && uri.fsPath.endsWith("hub.md")) {
          const activeEditor = vscode.window.activeTextEditor;
          if (!activeEditor) return;

          const filePath = activeEditor.document.uri.fsPath;
          const folderPath = path.dirname(filePath);
          const packageJsonPath =
            path.dirname(filePath) + path.sep + "package.json";

          if (!fs.existsSync(packageJsonPath)) {
            vscode.window.showErrorMessage(
              "package.json not detected at " + packageJsonPath
            );
            return;
          }

          // This will be the check to subscribe
          // const extensionSettingsService = extensionSettings(context);
          // if (
          //   !await extensionSettingsService.userProvidedApiKey &&
          //   await extensionSettingsService.currentUsage >= 5
          // ) {
          //   vscode.window
          //     .showInformationMessage(
          //       "You've used all your free hub.md generations. Most users upgrade after seeing the value 😄",
          //       "Upgrade",
          //       "Enter API Key",
          //       "Cancel"
          //     )
          //     .then((selection) => {
          //       if (selection === "Upgrade") {
          //         vscode.env.openExternal(
          //           vscode.Uri.parse("https://your-upgrade-page.com")
          //         );
          //       } else if (selection === "Enter API Key") {
          //         vscode.commands.executeCommand(
          //           "workbench.action.openSettings",
          //           "botpressHub.openaiApiKey"
          //         );
          //       }
          //     });
          //   return;
          // }

          const openAiService = await openAi(context);
          const packageJson = openAiService.getPackageJsonContent(
            path.dirname(filePath) + path.sep + "package.json"
          );

          const hubMd = await openAiService.generateHubMd(packageJson);

          openAiService.writeHubMd(folderPath, hubMd);
        } else {
          vscode.window.showWarningMessage(
            "This is not hub.md. Run this command in a hub.md file"
          );
        }
      }
    ),

    vscode.commands.registerCommand(
      "botpress-tools.integrationSanityCheck",
      (uri: vscode.Uri) => {
        const filePath = uri.fsPath;

        if (path.basename(filePath) !== "integration.definition.ts") {
          vscode.window.showErrorMessage(
            "Please run this command on an 'integration.definition.ts' file."
          );
          return;
        }

        if (!fs.existsSync(filePath)) {
          vscode.window.showErrorMessage(
            `integration.definition.ts not found at ${filePath}`
          );
          return;
        }

        const project = new Project();
        const sourceFile = project.addSourceFileAtPath(filePath);

        const integrationDefinition = sourceFile.getFirstDescendant((node) =>
          node.getText().startsWith("new IntegrationDefinition")
        );

        if (!integrationDefinition) {
          vscode.window.showErrorMessage(
            "Could not find IntegrationDefinition in the file."
          );
          return;
        }

        const requiredFields = ["title", "description", "icon", "readme"];
        const missingFields: string[] = [];

        requiredFields.forEach((field) => {
          if (!integrationDefinition.getText().includes(`${field}:`)) {
            missingFields.push(field);
          }
        });

        const parentFolder = path.dirname(filePath);
        const missingFiles: string[] = [];
        if (!fs.existsSync(path.join(parentFolder, "hub.md")))
          missingFiles.push("hub.md");
        if (!fs.existsSync(path.join(parentFolder, "icon.svg")))
          missingFiles.push("icon.svg");

        if (missingFields.length || missingFiles.length) {
          const msg = [
            missingFields.length
              ? `Missing field${
                  missingFields.length > 1 ? "s" : ""
                }: ${missingFields.join(", ")}`
              : "",
            missingFiles.length
              ? `Missing file${
                  missingFields.length > 1 ? "s" : ""
                }: ${missingFiles.join(", ")}`
              : "",
          ]
            .filter(Boolean)
            .join("\n");

          vscode.window.showErrorMessage(`Validation failed:\n${msg}`);
          return;
        }

        vscode.window.showInformationMessage(
          "✅ Integration is correctly configured!"
        );
      }
    ),

    vscode.languages.registerHoverProvider("typescript", {
      provideHover(document, position) {
        const range = document.getWordRangeAtPosition(
          position,
          /['"`]?[a-zA-Z0-9_-]+['"`]?/
        );
        if (!range) return null;

        const word = document.getText(range).replace(/^['"`]|['"`]$/g, "");
        const doc = getBotpressKeywordDoc(word);

        if (!doc) return null;

        const markdown = new vscode.MarkdownString(doc);
        markdown.isTrusted = true;
        return new vscode.Hover(markdown, range);
      },
    }),

    vscode.commands.registerCommand(
      "botpress-tools.addExtendInterface",
      async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
          vscode.window.showErrorMessage("No active editor");
          return;
        }

        let packageJsonPath = editor.document.uri.fsPath;
        const packageJsonfolderPath = path.dirname(packageJsonPath);

        packageJsonPath = path.join(packageJsonfolderPath, "package.json");

        const packageJson = JSON.parse(
          fs.readFileSync(packageJsonPath, "utf-8")
        );
        const options = Object.keys(packageJson.bpDependencies);

        const dependency = await vscode.window.showQuickPick(options, {
          placeHolder: "Select an interface to add",
        });

        if (!dependency) return;

        const importLine = `import ${dependency} from './bp_modules/${dependency}'\n`;
        const extendSnippet = `\n  .extend(${dependency}, ({ entities }) => ({\n    // TODO: fill in entities/actions\n  }))`;

        const doc = editor.document;

        const importPos = new vscode.Position(0, 0);
        const extendPos = new vscode.Position(doc.lineCount - 1, 0);

        await editor.edit((editBuilder) => {
          editBuilder.insert(importPos, importLine);
          editBuilder.insert(extendPos, extendSnippet);
        });

        vscode.window.showInformationMessage(
          `Added ${dependency} import and extend.`
        );
      }
    )
  );
}

export function deactivate() {}
