import * as vscode from 'vscode';
import * as unicodeDataJson from './unicode_data.json';

const MAX_CODE_POINT = 0x10FFFF; // == 1114111 in decimal.
const unicodeData = JSON.parse(JSON.stringify(unicodeDataJson));

/**
 * Get the description/name from the object.
 */
function getUnicodeData(codePoint: number): string {
	const key = codePoint.toString(10);
	let description = unicodeData[key];
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
export function makeMarkdown(codePoint: number, isSurrogate: boolean = false): vscode.MarkdownString {
	const glyph = codePoint <= MAX_CODE_POINT ? String.fromCodePoint(codePoint) : "\u{fffd}";
	const description = getUnicodeData(codePoint);
	const externalLink = "https://unicode-table.com/en/" + (codePoint <= MAX_CODE_POINT ? codePoint.toString(16).toUpperCase() : "");
	const surrogateNotification = isSurrogate ? " (surrogate pair) " : "";
	const markdown = `${glyph} [${description}](${externalLink})${surrogateNotification} (UnicodeHover)`;
	return new vscode.MarkdownString(markdown);
}