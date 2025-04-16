# 🧩 Botpress Integration Toolkit for VS Code

A Visual Studio Code extension to streamline the development of [Botpress](https://botpress.com) integrations — making your workflow faster, cleaner, and painless.

---

## ✨ Features

- 🔍 **Context Menu for `bpDependencies`**

  - Easily **add or remove dependencies** in the `bpDependencies` field of your `package.json`
  - Auto-detect available interfaces based on your local file system

- ⚙️ **Scaffold New Botpress Integrations**

  - Quickly bootstrap new bots, integrations or plugins from the VS Code context menu
  - Choose your destination folder and let the extension generate the structure

---

## 🚀 Getting Started

1. Install this extension from the [Visual Studio Marketplace](https://marketplace.visualstudio.com/)
2. Right-click in your project’s `package.json` or inside the folder you want to create a new addon
3. Use the `Botpress` context menu to add dependencies or scaffold a new integration

---

## 📦 Example

```json
"bpDependencies": {
  "files-readonly": "../../interfaces/files-readonly",
  "readable": "../../interfaces/readable"
}
```

Right-click → Botpress > Add Dependency  
Right-click → Botpress > Remove Dependency

---

## 🔧 Requirements

- Node.js >= 20
- Botpress SDK (included via workspace dependencies)
- VS Code

---

## 🧪 Future Ideas

- **Botpress submenu in VS Code tree view**: Introduce a custom `Botpress` submenu accessible via right-click in the Explorer.
- **Dynamic bpDependencies editing**: Enables adding or removing `bpDependencies` entries in `package.json` via GUI without manually editing the file.
- **Automatic package.json resolution**: Dynamically finds the closest `package.json` file relative to the selected folder.
- **Hub.md**: Automatically fills `Hub.md` file for new projects to save the user some redacting time (need to be verified though, add a validation to ensure the file was read by the user).

---

## 💙 Contributing

Feel free to open issues or pull requests — your feedback helps make this tool better!
