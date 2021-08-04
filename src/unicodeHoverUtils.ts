import * as vscode from 'vscode';
import * as unicodeDataJson from './unicode_data.json';
import * as nerdFontDataJson from './nerd_fonts_data.json';

const MAX_CODE_POINT = 0x10FFFF; // == 1114111 in decimal.
const unicodeData = JSON.parse(JSON.stringify(unicodeDataJson));
const nerdFontData = JSON.parse(JSON.stringify(nerdFontDataJson));

const nerdFontIconSourceMapping = [
	{"prefix": "nf-dev-", "name": "Devicons"},
	{"prefix": "nf-custom-", "name": "NerdFont Custom"},
	{"prefix": "nf-fa-", "name": "Font Awesome"},
	{"prefix": "nf-fae-", "name": "Font Awesome Extension"},
	{"prefix": "nf-iec-", "name": "IEC Power Symbols"},
	{"prefix": "nf-linux-", "name": "Font Logos"},
	{"prefix": "nf-mdi-", "name": "Material Design Icons"},
	{"prefix": "nf-oct-", "name": "Octicons"},
	{"prefix": "nf-ple-", "name": "Powerline Extra Symbols"},
	{"prefix": "nf-pom-", "name": "Pomicons"},
	{"prefix": "nf-seti-", "name": "Seti-UI"},
	{"prefix": "nf-weather-", "name": "Weather Icons"}
];

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

function getNerdFontData(codePoint: number): { name: string, description:string } {
	const key = codePoint.toString(16).toUpperCase();
	let glyphName = nerdFontData[key];
	if (glyphName === undefined || glyphName === "" || glyphName === null) {
		return {name : "(No NerdFont name)", description: "(No NerdFont name)"};
	} else {
		return {name: glyphName, description: getNerdFontGlyphDescription(glyphName)};
	}
}

function getNerdFontGlyphDescription(glyphName: string): string{
	let mapping = nerdFontIconSourceMapping.find(x => glyphName.startsWith(x.prefix));
	if (mapping === undefined){
		return `${glyphName}`;
	} else {//glyphName.replace(mapping.prefix, '')
		return `${glyphName} - ${mapping.name}`;
	}
}

function isNerdFontCodePoint(codePoint: number): boolean {
	const key = codePoint.toString(16).toUpperCase();
	const description = nerdFontData[key];
	return !(description === undefined || description === "" || description === null);
}

/**
 * Make a nice markdown string containing:
 * - the glyph
 * - the description
 * - an external link
 */
export function makeMarkdown(codePoint: number, isSurrogate: boolean = false): vscode.MarkdownString {
	const glyph = codePoint <= MAX_CODE_POINT ? String.fromCodePoint(codePoint) : "\u{fffd}";
	const isNerdFontGlyph = isNerdFontCodePoint(codePoint);
	let codePoint16 = codePoint.toString(16).toUpperCase();
	if (!isNerdFontGlyph) {
		const description = getUnicodeData(codePoint);
		const externalLink = "https://unicode-table.com/en/" + (codePoint <= MAX_CODE_POINT ? codePoint16 : "");
		const surrogateNotification = isSurrogate ? " (surrogate pair) " : "";
		// Add a zero width space to prevent `#` etc from affecting markdown rendering.
		const markdown = `\u200b${glyph} [${description}](${externalLink})${surrogateNotification} (UnicodeHover)`;
		return new vscode.MarkdownString(markdown);
	} else {
		const description = getNerdFontData(codePoint);
		const externalLink = `https://www.nerdfonts.com/cheat-sheet?set=${codePoint <= MAX_CODE_POINT ? codePoint16 : ""}`;
		let markdownString = new vscode.MarkdownString(`[NerdFont Cheat Sheet (${codePoint16})](${externalLink}) (UnicodeHover)`);
		markdownString.appendCodeblock(`${glyph}  - ${description.description}`, 'plaintext');
		return markdownString;
	}
}

