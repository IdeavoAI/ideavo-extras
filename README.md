# Ideavo Extras

Extra resources for Ideavo IDE.

## VS Code Themes

Custom color themes for Ideavo IDE located in `vscode/themes/`.

### Available Themes

- **ideavo-dark** - Dark theme for Ideavo
- **ideavo-light** - Light theme for Ideavo

## Building a .vsix Package

To create a `.vsix` package for distribution, follow these steps:

### Prerequisites

Install `vsce` (Visual Studio Code Extensions) CLI tool globally:

```bash
npm install -g @vscode/vsce
```

### Create the Package

Package the extension:

   ```bash
   vsce package
   ```

This will generate a `.vsix` file (e.g., `ideavo-themes-0.0.1.vsix`) in the directory.

### Install the Extension

To install the generated `.vsix` file:

**In VS Code / Ideavo:**
- Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
- Run `Extensions: Install from VSIX...`
- Select the generated `.vsix` file

**Via Command Line:**
```bash
code --install-extension ideavo-themes-0.0.1.vsix
```

### Additional vsce Commands

- `vsce package` - Create a .vsix package
- `vsce publish` - Publish to VS Code Marketplace
- `vsce ls` - List files included in the package

For more information, see the [VS Code Publishing Extensions documentation](https://code.visualstudio.com/api/working-with-extensions/publishing-extension).
