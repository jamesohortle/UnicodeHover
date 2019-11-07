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

/**
 * Provide a hover for Python files and the Unicode escapes therein.
 * Python has two simple forms: \u1234 (small u and 4 hexadecimal digits)
 * or \U1234abcd (big U and 8 hexadecimal digits).
 */
class PyUnicodeHover implements vscode.HoverProvider {
	public provideHover(
		document: vscode.TextDocument, position: vscode.Position, _token: vscode.CancellationToken
	): Thenable<vscode.Hover> {
		let unicodeRegexAny = new RegExp(/\\(u|U)([\da-fA-F]{4,8})/); // General form.
		let unicodeRegex4 = new RegExp(/\\u([\da-fA-F]{4})/); // Short form: "\uabcd".
		let unicodeRegex8 = new RegExp(/\\U([\da-fA-F]{8})/); // Long form: "\Uabcd1234".

		const range = document.getWordRangeAtPosition(position, unicodeRegexAny);
		if (range === undefined) {
			return new Promise((_resolve, reject) => {
				reject("Range undefined.");
			});
		}
		const word = document.getText(range);
		console.log(`PH ${word}`);
		return new Promise((resolve, reject) => {
			if (word.match(unicodeRegex8)) {
				let codePoint = parseInt(word.match(unicodeRegex8)![1], 16);
				resolve(new vscode.Hover(String.fromCharCode(codePoint)));
			} else if (word.match(unicodeRegex4)) {
				let codePoint = parseInt(word.match(unicodeRegex4)![1], 16);
				resolve(new vscode.Hover(String.fromCharCode(codePoint)));
			} else {
				reject("Not a Unicode escape.");
			}
		});
	}

	public dispose() { }
}

class JSUnicodeHover implements vscode.HoverProvider {
	public provideHover(
		document: vscode.TextDocument, position: vscode.Position, _token: vscode.CancellationToken
	): Thenable<vscode.Hover> {
		let unicodeRegexAny = new RegExp(/\\(u|x)?\{?([\da-fA-F]{1,6})\}?/); // General form.
		let unicodeRegexOct = new RegExp(/\\([0-7]){1,3}/); // Octal-escape form: \123.
		let unicodeRegex2 = new RegExp(/\\x([\da-fA-F]{2})/); // Hex-escape form: "\xA7".
		let unicodeRegex4 = new RegExp(/\\u([\da-fA-F]{4})/); // Short form: "\uabcd".
		let unicodeRegex8 = new RegExp(/\\u\{([\da-fA-F]{1,6})\}/); // Long form: "\u{abcd1234}".

		const range = document.getWordRangeAtPosition(position, unicodeRegexAny);

		if (range === undefined) {
			return new Promise((_resolve, reject) => {
				reject("Range undefined.");
			});
		}
		const word = document.getText(range);
		console.log(`JS ${word}`);

		return new Promise((resolve, reject) => {
			if (word.match(unicodeRegex8)) {
				let codePoint = parseInt(word.match(unicodeRegex8)![1], 16);
				resolve(new vscode.Hover(String.fromCharCode(codePoint)));
				return;
			} else if (word.match(unicodeRegex4)) {
				let codePoint = parseInt(word.match(unicodeRegex4)![1], 16);
				resolve(new vscode.Hover(String.fromCharCode(codePoint)));
				return;
			} else if (word.match(unicodeRegex2)) {
				let codePoint = parseInt(word.match(unicodeRegex2)![1], 16);
				resolve(new vscode.Hover(String.fromCharCode(codePoint)));
				return;
			} else if (word.match(unicodeRegexOct)) {
				let codePoint = parseInt(word.match(unicodeRegexOct)![1], 8);
				resolve(new vscode.Hover(String.fromCharCode(codePoint)));
				return;
			} else {
				reject("Not a Unicode escape.");
			}
		});
	}

	public dispose() { }
}

class TexUnicodeHover implements vscode.HoverProvider {
	public provideHover(
		document: vscode.TextDocument, position: vscode.Position, _token: vscode.CancellationToken
	): Thenable<vscode.Hover> {
		let unicodeRegexAny = new RegExp(/(\\U?char['"]?[\da-fA-F]{1,8}|\^{2,6}[\da-f]{2,6})/); // General form.
		let unicodeRegexCharDec = new RegExp(/\\char([\d]{1,7})/); // Decimal form: \char98
		let unicodeRegexCharOct = new RegExp(/\\char'([\da-fA-F]{1,8})/); // Octal form: \char'98.
		let unicodeRegexCharHex = new RegExp(/\\char"([\da-fA-F]{1,8})/); // Hexadecimal form: \char"98.
		let unicodeRegexUcharDec = new RegExp(/\\Uchar([\d]{1,7})/); // Decimal form: \Uchar98
		let unicodeRegexUcharOct = new RegExp(/\\Uchar'([0-7]{1,8})/); // Octal form: \Uchar'98.
		let unicodeRegexUcharHex = new RegExp(/\\Uchar"([\da-fA-F]{1,8})/); // Hexadecimal form: \Uchar"98.
		let unicodeRegexPrimitive6 = new RegExp(/\^{6}([\da-f]{6})/); // Hexadecimal form: ^^^^^^0000ff
		let unicodeRegexPrimitive4 = new RegExp(/\^{4}([\da-f]{4})/); // 4 hexadecimal: ^^^^00ff
		let unicodeRegexPrimitive2 = new RegExp(/\^{2}([\da-f]{2})/); // 2 hexadecimal: ^^ff.

		const range = document.getWordRangeAtPosition(position, unicodeRegexAny);

		if (range === undefined) {
			return new Promise((_resolve, reject) => {
				reject("Range undefined.");
			});
		}
		const word = document.getText(range);
		console.log(`TX ${word}`);
		return new Promise((resolve, reject) => {
			if (word.match(unicodeRegexCharDec)) {
				let codePoint = parseInt(word.match(unicodeRegexCharDec)![1], 10);
				resolve(new vscode.Hover(String.fromCharCode(codePoint)));
				return;
			} else if (word.match(unicodeRegexCharOct)) {
				let codePoint = parseInt(word.match(unicodeRegexCharOct)![1], 8);
				resolve(new vscode.Hover(String.fromCharCode(codePoint)));
				return;
			} else if (word.match(unicodeRegexCharHex)) {
				let codePoint = parseInt(word.match(unicodeRegexCharHex)![1], 16);
				resolve(new vscode.Hover(String.fromCharCode(codePoint)));
				return;
			} else if (word.match(unicodeRegexUcharDec)) {
				let codePoint = parseInt(word.match(unicodeRegexUcharDec)![1], 10);
				resolve(new vscode.Hover(String.fromCharCode(codePoint)));
				return;
			}
			else if (word.match(unicodeRegexUcharOct)) {
				let codePoint = parseInt(word.match(unicodeRegexUcharOct)![1], 8);
				resolve(new vscode.Hover(String.fromCharCode(codePoint)));
				return;
			} else if (word.match(unicodeRegexUcharHex)) {
				let codePoint = parseInt(word.match(unicodeRegexUcharHex)![1], 16);
				resolve(new vscode.Hover(String.fromCharCode(codePoint)));
				return;
			} else if (word.match(unicodeRegexPrimitive6)) {
				let codePoint = parseInt(word.match(unicodeRegexPrimitive6)![1], 16);
				resolve(new vscode.Hover(String.fromCharCode(codePoint)));
				return;
			}
			else if (word.match(unicodeRegexPrimitive4)) {
				let codePoint = parseInt(word.match(unicodeRegexPrimitive4)![1], 16);
				resolve(new vscode.Hover(String.fromCharCode(codePoint)));
				return;
			} else if (word.match(unicodeRegexPrimitive2)) {
				let codePoint = parseInt(word.match(unicodeRegexPrimitive2)![1], 16);
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
	context.subscriptions.push(vscode.languages.registerHoverProvider({ scheme: 'file', language: 'python' }, new PyUnicodeHover()));
	context.subscriptions.push(vscode.languages.registerHoverProvider({ scheme: 'file', language: 'javascript' }, new JSUnicodeHover()));
	context.subscriptions.push(vscode.languages.registerHoverProvider({ scheme: 'file', language: 'latex' }, new TexUnicodeHover()));
	console.log("UnicodeHover: providers pushed.");
}

// this method is called when your extension is deactivated
export function deactivate() { }
