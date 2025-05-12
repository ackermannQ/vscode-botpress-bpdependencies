import { exec } from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";

const util = require("util");
const execAsync = util.promisify(exec);

import { getIntegrationRoot } from "./getIntegrationRoot";

type ConnectorInfo = {
  name: string;
  version: string;
};

export const addBpDependencyInterface = async () => {
  addBpDependency("interfaces");
};

export const addBpDependencyIntegration = async () => {
  addBpDependency("integrations");
};

export const addBpDependency = async (connectorType: string) => {
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

  const currentPath = activeEditor.document.uri.fsPath;
  const root = getIntegrationRoot(path.resolve(currentPath));

  let connectors = await getConnector(root, connectorType);
  const sortedConnectors = connectors
    .slice()
    .sort((a: ConnectorInfo, b: ConnectorInfo) => {
      const nameCompare = a.name.localeCompare(b.name);
      if (nameCompare !== 0) return nameCompare;
      return compareVersionsDesc(a.version, b.version);
    });

  const options = sortedConnectors.map(
    (connector: ConnectorInfo) => `${connector.name}@${connector.version}`
  );

  const selected = await vscode.window.showQuickPick(options, {
    placeHolder: `Select ${connectorType} to add`,
  });
  if (!selected) return;

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
  if (!packageJson.bpDependencies) packageJson.bpDependencies = {};
  packageJson.bpDependencies[selected.split("@")[0]] = `${connectorType.slice(
    0,
    -1
  )}:${selected}`;

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  vscode.window.showInformationMessage(`Added bpDependency: ${selected}`);
  await execAsync("bp add", {
    cwd: root,
  });
  vscode.window.showInformationMessage("bp add over");
};

async function getConnector(integrationRoot: string, connectorType: string) {
  try {
    vscode.window.showInformationMessage(
      "Fetching connectors, this might take a while."
    );
    const { stdout } = await execAsync(`bp ${connectorType} list --json`, {
      cwd: integrationRoot,
    });
    const connectors = JSON.parse(stdout).map((i) => ({
      name: i.name,
      version: i.version,
    }));

    return Object.values(connectors);
  } catch (error) {
    vscode.window.showErrorMessage(`Error fetching connectors: ${error}`);
  }
}

function compareVersionsDesc(v1, v2) {
  const a = v1.split(".").map(Number);
  const b = v2.split(".").map(Number);
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if ((a[i] || 0) > (b[i] || 0)) return -1;
    if ((a[i] || 0) < (b[i] || 0)) return 1;
  }
  return 0;
}
