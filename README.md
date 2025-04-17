# 🧩 Botpress Integration Toolkit for VS Code

A Visual Studio Code extension to streamline the development of [Botpress](https://botpress.com) integrations — making your workflow faster, cleaner, and painless.

---

## ✨ Features

- 🔍 **Context Menu for `bpDependencies`**

  - Easily **add or remove dependencies** in the `bpDependencies` field of your `package.json`.
  - Auto-detect available interfaces based on your local file system.

- ⚙️ **Scaffold New Botpress Integrations**

  - Quickly bootstrap new bots, integrations or plugins from the VS Code context menu.
  - Choose your destination folder among `integrations`, `bots` or `plugins` and let the extension generate the structure.

- 📃 **Generate `hub.md` file**

  - Generate a `hub.md` file based on your `package.json` information.
  - Use the AI to generate a concise and helpful `hub.md` that documents what this project is.

- 📃 **Create key-bindings**

- Create key-bindings to work even faster and more efficiently by assigning keyboard shortcuts to the commands.

---

## 🚀 Getting Started

1. Install this extension from the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=ackermannQ.botpress-tools)
2. Right-click in your project’s `package.json` or inside the folder you want to create a new addon
3. Use the `Botpress` context menu to add/remove dependencies
4. Use the `Botpress: Scaffolding` context menu to create a new bot, integration or plugin

---

## 📦 Example

### Managing bpDependencies

```json
"bpDependencies": {
  "files-readonly": "../../interfaces/files-readonly",
  "readable": "../../interfaces/readable"
}
```

In the package.json file:

- Right-click → Botpress > Add Dependency
- Right-click → Botpress > Remove Dependency

### Create a new bot, integration or plugin

Right-click on tree view, on the `Integrations`, `Bots` or `Plugins` → Botpress: Scaffolding > Create a new bot, integration or plugin

### Generate hub.md file

Save some redacting time!

Right-click inside an empty hud.md file, Botpress > Generate hub.md file.  
This requires an OpenAI API key to be set in the `botpressHub.openaiApiKey` setting.
The generated file should be reviewed before committing it.

### Create key-bindings

You can create key-bindings to work even faster and more efficiently by assigning keyboard shortcuts to the commands:

ctrl+shift+p → `>Preferences: Open Keyboard Shortcuts (JSON)` → Type `botpress` → Add a new keybinding to the `botpress-tools.xxxx` command.

### Sanity check of integration definition file

Right-click on an `integration.definition.ts` file, Botpress > Integration > Check Integration Definition file.  
This will check if the file is [correctly configured](https://botpress.mintlify.app/for-developers/sdk/integration/publish-your-integration-on-botpress-hub#your-integration%E2%80%99s-public-information) and if all required files are present.

### Embeded documentation preview

On some keywords, show a preview of the documentation and a link to the full online documentation.

---

## 🔧 Requirements

- Node.js >= 20
- Botpress SDK (included via workspace dependencies)
- VS Code

---

## 🧪 Future Ideas

- **Botpress submenu in VS Code tree view**: Introduce a custom `Botpress` submenu accessible via right-click in the Explorer.
- **Dynamic bpDependencies editing**: Enables adding or removing `bpDependencies` entries in `package.json` via GUI without manually editing the file.
- **Set terminal path**: Set the terminal path to the integration we are working in (easier to rebuild when updating actions, entities or anything that needs to be rebuilt).
- **Add integration helper**: in the integration.definition.ts file, make it easier to add new integrations.
- **Embeded documentation preview**: On some keywords, show a preview of the documentation.

---

## 💙 Contributing

Feel free to open issues or pull requests — your feedback helps make this tool better!
[Repository](https://github.com/ackermannQ/vscode-botpress-bpdependencies)
