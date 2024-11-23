// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "livewire-switcher" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand('livewire-switcher.switch', async () => {
    // console.log(vscode.workspace.asRelativePath(vscode.window.activeTextEditor?.document.fileName || ''));
    if (vscode.workspace.workspaceFolders && vscode.window.activeTextEditor) {
      let livewireClassPath = (await fs.existsSync(vscode.workspace.workspaceFolders[0].uri.fsPath + '/app/Http/Livewire')) ? 'app/Http/Livewire/' : 'app/Livewire/';

      if (vscode.workspace.asRelativePath(vscode.window.activeTextEditor?.document.fileName).startsWith('resources/views/livewire/')) {
        const relativePath = vscode.workspace.asRelativePath(vscode.window.activeTextEditor?.document.fileName).split('resources/views/livewire/')[1];
        let file = relativePath
          .replace('.blade.php', '')
          .split('/')
          .map((folder, index, array) =>
            folder
              .split('-')
              .map((word, index, array) => word.charAt(0).toUpperCase() + word.slice(1))
              .join('')
          )
          .join('/')
          .concat('.php');

        const document = await vscode.workspace.openTextDocument(vscode.workspace.workspaceFolders[0].uri.path + '/' + livewireClassPath + file);
        await vscode.window.showTextDocument(document);
      } else if (vscode.workspace.asRelativePath(vscode.window.activeTextEditor?.document.fileName).startsWith(livewireClassPath)) {
        const relativePath = vscode.workspace.asRelativePath(vscode.window.activeTextEditor?.document.fileName).split(livewireClassPath)[1];
        let file = relativePath
          .split('/')
          .map((d, index, array) => {
            return d
              .replace(/\.[^/.]+$/, '')
              .split('')
              .reduce((word: string[], letter: string) => {
                if (/[A-Z]/.test(letter) && word.length > 0) {
                  word.push('-');
                }
                word.push(letter.toLowerCase());
                return word;
              }, [])
              .join('');
          })
          .join('/')
          .concat('.blade.php');

        const document = await vscode.workspace.openTextDocument(vscode.workspace.workspaceFolders[0].uri.path + '/resources/views/livewire/' + file);
        await vscode.window.showTextDocument(document);
      }
    }
  });

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
