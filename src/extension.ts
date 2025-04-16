import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  const workspaceRoot = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    vscode.window.showErrorMessage("No active editor found.");
    return;
  }
  const packageJsonPath = activeEditor.document.uri.fsPath;
  const packageJsonfolderPath = path.dirname(packageJsonPath);

  if (!workspaceRoot) return;

  context.subscriptions.push(
    vscode.commands.registerCommand("extension.addBpDependency", async () => {
      const packageJsonPath = path.join(packageJsonfolderPath, "package.json");
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

      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
      if (!packageJson.bpDependencies) packageJson.bpDependencies = {};
      packageJson.bpDependencies[selected] = `../../interfaces/${selected}`;

      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      vscode.window.showInformationMessage(`Added bpDependency: ${selected}`);
    }),

    vscode.commands.registerCommand(
      "extension.removeBpDependency",
      async () => {
        const packageJsonPath = path.join(
          packageJsonfolderPath,
          "package.json"
        );
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

    vscode.commands.registerCommand("extension.addBuildScript", async () => {
      const packageJsonPath = path.join(packageJsonfolderPath, "package.json");

      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
      if (!packageJson.scripts.build) packageJson.scripts.build = "";

      if (packageJson.scripts.build === "bp add -y && bp build") {
        vscode.window.showErrorMessage("Botpress build script already exists");
        return;
      }

      packageJson.scripts.build =
        packageJson.scripts.build + "bp add -y && bp build";
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      vscode.window.showInformationMessage("Added build script");
    }),

    vscode.commands.registerCommand(
      "extension.createIntegration",
      (uri: vscode.Uri) => {
        if (!uri || !uri.fsPath) return;

        const allowedFolders = ["integrations", "bots", "plugins"];

        if (uri && uri.fsPath) {
          const selectedPath = path.basename(uri.fsPath);

          if (!allowedFolders.includes(selectedPath)) {
            vscode.window.showWarningMessage(
              "This action is only available in an 'integrations', 'bots' or 'plugins' folder."
            );
            return;
          }

          const terminal = vscode.window.createTerminal(`Botpress Init`);
          terminal.sendText("cd " + selectedPath);
          terminal.sendText(`bp init`);
          terminal.show();
        } else {
          vscode.window.showWarningMessage("No path selected.");
        }
      }
    )
  );
}

export function deactivate() {}
