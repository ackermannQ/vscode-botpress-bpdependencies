# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),  
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

---

## [0.2.1] - 2025-04-17

### Add

- Rebuild project command.
- Deploy project command.

## [0.1.8] - 2025-04-17

### Add

- Possibility to key bind the commands to a keyboard shortcut.
- Automated integration definition file sanity check.
- Preview of the documentation and a link to the full online documentation on some keywords.
- Quick add interface in `integration.definition.ts` file.

## [0.1.7] - 2025-04-16

### Updated

- Replace storing of api key from settings to secure storage.

## [0.1.6] - 2025-04-16

### Updated

- Split scaffoldings and fix cross platform issues.

## [0.1.5] - 2025-04-16

### Updated

- Slight modification of the hub.md template to fit guidelines.
- Fix scaffolding issue.

## [0.1.4] - 2025-04-16

### Added

- Generate hub.md file using AI and package.json information.

### Updated

- Fix only first opened json was modified for managing bpDependencies.

## [0.1.3] - 2025-04-16

### Updated

- Fix typos in readme.
- Fix add build command issue.

---

## [0.1.2] - 2025-04-16

### Added

- Folder type validation: Add programmatic check to ensure creation action is only executed on valid directories.
- Add changelog and readme files.

### Updated

- Narrow the scaffolding choices to only `integrations`, `bots` and `plugins` folder.

---

## [0.1.1] - 2025-04-15

### Added

- Create scaffolding to create a new botpress add-ons.

---

## [0.1.0] - 2025-04-15

### Added

- Initial stable release of the VS Code extension focused on improving the developer experience for Botpress integration development.
- Includes right-click bpDependency management.
