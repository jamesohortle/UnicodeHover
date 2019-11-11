import * as vscode from 'vscode';

import { unicodeData } from './unicode_data';

const MAX_CODE_POINT = 1114111; // == 10FFFF

/**
 * Get the description/name from the object.
 */
function getUnicodeData(codePoint: number): string {
	let description = unicodeData[codePoint];
	if (codePoint > MAX_CODE_POINT) {
		description = "(Too big)";
	} else if (description === undefined || description === "" || description === null) {
		description = "(No description)";
	}
	return description;
}

/**
 * Make a nice markdown string containing:
 * - the glyph
 * - the description
 * - an external link
 */
function makeMarkdown(codePoint: number): vscode.MarkdownString {
	const glyph = codePoint <= MAX_CODE_POINT ? String.fromCodePoint(codePoint) : "\u{fffd}";
	const description = getUnicodeData(codePoint);
	const externalLink = "https://unicode-table.com/en/" + (codePoint <= MAX_CODE_POINT ? codePoint.toString(16).toUpperCase() : "");
	const markdown = `${glyph} [${description}](${externalLink}) (UnicodeHover)`;
	return new vscode.MarkdownString(markdown);
}

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
			return new Promise((resolve, _reject) => {
				resolve(); // Resolve silently.
			});
		}
		const word = document.getText(range);
		console.log(`UnicodeHover: ${word}`);
		return new Promise((resolve, reject) => {
			if (word.match(unicodeRegexAny)) {
				const codePoint = parseInt(word.match(unicodeRegexAny)![1], 16);
				console.log(`${codePoint} > ${MAX_CODE_POINT}`);

				let markdown = makeMarkdown(codePoint);
				resolve(new vscode.Hover(markdown));
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
			return new Promise((resolve, _reject) => {
				resolve(); // Resolve silently.
			});
		}
		const word = document.getText(range);
		console.log(`PyUnicodeHover: ${word}`);
		return new Promise((resolve, reject) => {
			if (word.match(unicodeRegex8)) {
				let codePoint = parseInt(word.match(unicodeRegex8)![1], 16);
				let markdown = makeMarkdown(codePoint);

				resolve(new vscode.Hover(markdown));
			} else if (word.match(unicodeRegex4)) {
				let codePoint = parseInt(word.match(unicodeRegex4)![1], 16);
				let markdown = makeMarkdown(codePoint);

				resolve(new vscode.Hover(markdown));
			} else {
				reject("Not a Unicode escape.");
			}
		});
	}

	public dispose() { }
}

/**
 * Provide a hover for JavaScript (TypeScript) files and the Unicode escapes therein.
 * Octal, hexadecimal, short-u and u-with-braces forms are supported.
 */
class JSUnicodeHover implements vscode.HoverProvider {
	public provideHover(
		document: vscode.TextDocument, position: vscode.Position, _token: vscode.CancellationToken
	): Thenable<vscode.Hover> {
		let unicodeRegexAny = new RegExp(/\\(u|x)?\{?([\da-fA-F]+)\}?/); // General form.
		let unicodeRegexOct = new RegExp(/\\([0-7]{1,3})/); // Octal-escape form: \123.
		let unicodeRegex2 = new RegExp(/\\x([\da-fA-F]{2})/); // Hex-escape form: "\xA7".
		let unicodeRegex4 = new RegExp(/\\u([\da-fA-F]{4})/); // Short form: "\uabcd".
		let unicodeRegex8 = new RegExp(/\\u\{([\da-fA-F]+)\}/); // Long form: "\u{abcd1234}".

		const range = document.getWordRangeAtPosition(position, unicodeRegexAny);

		if (range === undefined) {
			return new Promise((resolve, _reject) => {
				resolve(); // Resolve silently.
			});
		}
		const word = document.getText(range);
		console.log(`JSUnicodeHover ${word}`);

		return new Promise((resolve, reject) => {
			if (word.match(unicodeRegex8)) {
				let codePoint = parseInt(word.match(unicodeRegex8)![1], 16);
				let markdown = makeMarkdown(codePoint);

				resolve(new vscode.Hover(markdown));
				return;
			} else if (word.match(unicodeRegex4)) {
				let codePoint = parseInt(word.match(unicodeRegex4)![1], 16);
				let markdown = makeMarkdown(codePoint);

				resolve(new vscode.Hover(markdown));
				return;
			} else if (word.match(unicodeRegex2)) {
				let codePoint = parseInt(word.match(unicodeRegex2)![1], 16);
				let markdown = makeMarkdown(codePoint);

				resolve(new vscode.Hover(markdown));
				return;
			} else if (word.match(unicodeRegexOct)) {
				let codePoint = parseInt(word.match(unicodeRegexOct)![1], 8);
				let markdown = makeMarkdown(codePoint);

				resolve(new vscode.Hover(markdown));
				return;
			} else {
				reject("Not a Unicode escape.");
			}
		});
	}

	public dispose() { }
}

/**
 * Provide a hover for (La)TeX files and the Unicode escapes therein.
 * Supports \char, \Uchar and caret (TeX primitive) notation.
 */
class TexUnicodeHover implements vscode.HoverProvider {
	public provideHover(
		document: vscode.TextDocument, position: vscode.Position, _token: vscode.CancellationToken
	): Thenable<vscode.Hover> {
		let unicodeRegexAny = new RegExp(/(\\U?char['"]?[\da-fA-F]{1,8}|\^{2,6}[\da-f]{2,6})/); // General form.
		let unicodeRegexCharDec = new RegExp(/\\char([\d]{1,7})/); // Decimal form: \char98
		let unicodeRegexCharOct = new RegExp(/\\char'([0-7]{1,8})/); // Octal form: \char'98.
		let unicodeRegexCharHex = new RegExp(/\\char"([\dA-F]{1,8})/); // Hexadecimal form: \char"98.
		let unicodeRegexUcharDec = new RegExp(/\\Uchar([\d]{1,7})/); // Decimal form: \Uchar98
		let unicodeRegexUcharOct = new RegExp(/\\Uchar'([0-7]{1,8})/); // Octal form: \Uchar'98.
		let unicodeRegexUcharHex = new RegExp(/\\Uchar"([\dA-F]{1,8})/); // Hexadecimal form: \Uchar"98.
		let unicodeRegexPrimitive6 = new RegExp(/\^{6}([\da-f]{6})/); // Hexadecimal form: ^^^^^^0000ff
		let unicodeRegexPrimitive4 = new RegExp(/\^{4}([\da-f]{4})/); // 4 hexadecimal: ^^^^00ff
		let unicodeRegexPrimitive2 = new RegExp(/\^{2}([\da-f]{2})/); // 2 hexadecimal: ^^ff.

		const range = document.getWordRangeAtPosition(position, unicodeRegexAny);

		if (range === undefined) {
			return new Promise((resolve, _reject) => {
				resolve(); // Resolve silently.
			});
		}
		const word = document.getText(range);
		console.log(`TexUnicodeHover ${word}`);
		return new Promise((resolve, reject) => {
			if (word.match(unicodeRegexCharDec)) {
				let codePoint = parseInt(word.match(unicodeRegexCharDec)![1], 10);
				let markdown = makeMarkdown(codePoint);

				resolve(new vscode.Hover(markdown));
				return;
			} else if (word.match(unicodeRegexCharOct)) {
				let codePoint = parseInt(word.match(unicodeRegexCharOct)![1], 8);
				let markdown = makeMarkdown(codePoint);

				resolve(new vscode.Hover(markdown));
				return;
			} else if (word.match(unicodeRegexCharHex)) {
				let codePoint = parseInt(word.match(unicodeRegexCharHex)![1], 16);
				let markdown = makeMarkdown(codePoint);

				resolve(new vscode.Hover(markdown));
				return;
			} else if (word.match(unicodeRegexUcharDec)) {
				let codePoint = parseInt(word.match(unicodeRegexUcharDec)![1], 10);
				let markdown = makeMarkdown(codePoint);

				resolve(new vscode.Hover(markdown));
				return;
			}
			else if (word.match(unicodeRegexUcharOct)) {
				let codePoint = parseInt(word.match(unicodeRegexUcharOct)![1], 8);
				let markdown = makeMarkdown(codePoint);

				resolve(new vscode.Hover(markdown));
				return;
			} else if (word.match(unicodeRegexUcharHex)) {
				let codePoint = parseInt(word.match(unicodeRegexUcharHex)![1], 16);
				let markdown = makeMarkdown(codePoint);

				resolve(new vscode.Hover(markdown));
				return;
			} else if (word.match(unicodeRegexPrimitive6)) {
				let codePoint = parseInt(word.match(unicodeRegexPrimitive6)![1], 16);
				let markdown = makeMarkdown(codePoint);

				resolve(new vscode.Hover(markdown));
				return;
			}
			else if (word.match(unicodeRegexPrimitive4)) {
				let codePoint = parseInt(word.match(unicodeRegexPrimitive4)![1], 16);
				let markdown = makeMarkdown(codePoint);

				resolve(new vscode.Hover(markdown));
				return;
			} else if (word.match(unicodeRegexPrimitive2)) {
				let codePoint = parseInt(word.match(unicodeRegexPrimitive2)![1], 16);
				let markdown = makeMarkdown(codePoint);

				resolve(new vscode.Hover(markdown));
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
	context.subscriptions.push(vscode.languages.registerHoverProvider({ scheme: 'file', language: 'typescript' }, new JSUnicodeHover())); // TS has same escapes as JS.
	context.subscriptions.push(vscode.languages.registerHoverProvider({ scheme: 'file', language: 'latex' }, new TexUnicodeHover()));
	console.log("UnicodeHover: providers pushed.");
}

// this method is called when your extension is deactivated
export function deactivate() { }
