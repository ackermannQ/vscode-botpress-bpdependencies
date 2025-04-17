import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";

import { extensionSettings } from "./extensionSettings";
import { openAi } from "./openAi";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "botpress-tools.addBpDependency",
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
        const interfacesPath = path.resolve(workspaceRoot, "interfaces");
        if (!fs.existsSync(interfacesPath)) {
          vscode.window.showErrorMessage(
            "Interfaces folder not found at " + interfacesPath
          );
          return;
        }

        const options = fs
          .readdirSync(interfacesPath)
          .filter((f) =>
            fs.lstatSync(path.join(interfacesPath, f)).isDirectory()
          );

        const selected = await vscode.window.showQuickPick(options, {
          placeHolder: "Select an interface to add",
        });
        if (!selected) return;

        const packageJson = JSON.parse(
          fs.readFileSync(packageJsonPath, "utf-8")
        );
        if (!packageJson.bpDependencies) packageJson.bpDependencies = {};
        packageJson.bpDependencies[selected] = `../../interfaces/${selected}`;

        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
        vscode.window.showInformationMessage(`Added bpDependency: ${selected}`);
      }
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
        if (!packageJson.scripts.build) packageJson.scripts.build = "";

        if (packageJson.scripts.build === "bp add -y && bp build") {
          vscode.window.showErrorMessage(
            "Botpress build script already exists"
          );
          return;
        }

        packageJson.scripts.build =
          packageJson.scripts.build + " && bp add -y && bp build";
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
        vscode.window.showInformationMessage("Added build script");
      }
    ),

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
    )
  );
}

export function deactivate() {}
