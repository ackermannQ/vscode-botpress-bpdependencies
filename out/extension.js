"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const vscode = __importStar(require("vscode"));
function activate(context) {
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
        vscode.window.showErrorMessage("No active editor found.");
        return;
    }
    const packageJsonPath = activeEditor.document.uri.fsPath;
    const packageJsonfolderPath = path.dirname(packageJsonPath);
    if (!workspaceRoot)
        return;
    context.subscriptions.push(vscode.commands.registerCommand("extension.addBpDependency", async () => {
        const packageJsonPath = path.join(packageJsonfolderPath, "package.json");
        const interfacesPath = path.resolve(workspaceRoot, "interfaces");
        if (!fs.existsSync(interfacesPath)) {
            vscode.window.showErrorMessage("Interfaces folder not found at " + interfacesPath);
            return;
        }
        const options = fs
            .readdirSync(interfacesPath)
            .filter((f) => fs.lstatSync(path.join(interfacesPath, f)).isDirectory());
        const selected = await vscode.window.showQuickPick(options, {
            placeHolder: "Select an interface to add",
        });
        if (!selected)
            return;
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
        if (!packageJson.bpDependencies)
            packageJson.bpDependencies = {};
        packageJson.bpDependencies[selected] = `../../interfaces/${selected}`;
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
        vscode.window.showInformationMessage(`Added bpDependency: ${selected}`);
    }), vscode.commands.registerCommand("extension.removeBpDependency", async () => {
        const packageJsonPath = path.join(packageJsonfolderPath, "package.json");
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
        const deps = Object.keys(packageJson.bpDependencies || {});
        const selected = await vscode.window.showQuickPick(deps, {
            placeHolder: "Select a dependency to remove",
        });
        if (!selected)
            return;
        delete packageJson.bpDependencies[selected];
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
        vscode.window.showInformationMessage(`Removed bpDependency: ${selected}`);
    }), vscode.commands.registerCommand("extension.addBuildScript", async () => {
        const packageJsonPath = path.join(packageJsonfolderPath, "package.json");
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
        if (!packageJson.scripts.build)
            packageJson.scripts.build = "";
        if (packageJson.scripts.build === "bp add -y && bp build") {
            vscode.window.showErrorMessage("Botpress build script already exists");
            return;
        }
        packageJson.scripts.build =
            packageJson.scripts.build + "bp add -y && bp build";
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
        vscode.window.showInformationMessage("Added build script");
    }), vscode.commands.registerCommand("extension.createIntegration", () => {
        const terminal = vscode.window.createTerminal(`Botpress Init`);
        terminal.sendText(`bp init`);
        terminal.show();
    }));
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map