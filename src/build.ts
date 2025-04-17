import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { getIntegrationRoot } from "./getIntegrationRoot";

export const addBuildScript = async () => {
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

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
  if (!packageJson.scripts.build) packageJson.scripts.build = "";

  if (packageJson.scripts.build === "bp add -y && bp build") {
    vscode.window.showErrorMessage("Botpress build script already exists");
    return;
  }

  packageJson.scripts.build =
    packageJson.scripts.build + " && bp add -y && bp build";
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  vscode.window.showInformationMessage("Added build script");
};

export const rebuildBpProject = () => {
  const terminal = vscode.window.createTerminal(`Botpress Rebuild`);
  const activeEditor = vscode.window.activeTextEditor;
  const currentPath = activeEditor.document.uri.fsPath;
  const integrationRoot = getIntegrationRoot(path.resolve(currentPath));

  terminal.sendText(`bp build --workDir ${integrationRoot}`);
  terminal.show();
};
