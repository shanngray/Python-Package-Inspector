import * as vscode from 'vscode';
import { HoverProvider } from './hoverProvider';

/**
 * This function is called when the extension is activated.
 * It registers the HoverProvider for Python files.
 * @param context - The extension context
 */
export function activate(context: vscode.ExtensionContext) {
    console.log('Activating Python Package Tracker extension.');
    const hoverProvider = new HoverProvider();

    // Register the HoverProvider for Python language
    const providerDisposable = vscode.languages.registerHoverProvider('python', hoverProvider);
    context.subscriptions.push(providerDisposable);

    // Log activation message for debugging purposes
    console.log('Python Package Tracker extension is now active!');
}