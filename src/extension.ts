import * as vscode from 'vscode';

/**
 * Provide a basic hover that recognizes Unicode escapes as used by the Unicode Consortium.
 * I.e., recognize escapes like U+ABCD, U+12345, U+A1B2C3, which refer to official codepoints.
 */
class UnicodeHover implements vscode.HoverProvider {
	public provideHover(
		document: vscode.TextDocument, position: vscode.Position, _token: vscode.CancellationToken
	): Thenable<vscode.Hover> {
		let unicodeRegexAny = new RegExp(/U\+([A-F\d]{4,6})/);

		const range = document.getWordRangeAtPosition(position, unicodeRegexAny);

		if (range === undefined) {
			return new Promise((_resolve, reject) => {
				reject("Range undefined.");
			});
		}
		const word = document.getText(range);
		console.log(`UH ${word}`);
		return new Promise((resolve, reject) => {
			if (word.match(unicodeRegexAny)) {
				let codePoint = parseInt(word.match(unicodeRegexAny)![1], 16);
				resolve(new vscode.Hover(String.fromCharCode(codePoint)));
				return;
			} else {
				reject("Not a Unicode escape.");
			}
		});

	}
	public dispose() { }
}

// Provide the hovers.
export function activate(context: vscode.ExtensionContext): void {
	context.subscriptions.push(vscode.languages.registerHoverProvider({ scheme: 'file' }, new UnicodeHover()));
	console.log("UnicodeHover: provider pushed.");
}

// this method is called when your extension is deactivated
export function deactivate() { }
