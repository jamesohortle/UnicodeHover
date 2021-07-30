import * as vscode from 'vscode';
import * as unicodeDataJson from './unicode_data.json';

const MAX_CODE_POINT = 0x10FFFF; // == 1114111 in decimal.
const unicodeData = JSON.parse(JSON.stringify(unicodeDataJson));

interface CodepointRange {
	min: number;
	max: number;
}

//Ranges defined in NerdFont source files: https://github.com/ryanoasis/nerd-fonts/tree/master/bin/scripts/lib/i_*.sh
const NerdFontRanges: CodepointRange[] = [
	//Devicons (198 icons, 7 do not have an established name)
	//Codepoints: Nerd moved E600-E6C5 → E700-E7C5
	// {min: 0xE600, max: 0xE6C5},
	{min: 0xE700, max: 0xE7C5},

	//Font Awesome (version 4.7.0, 675 icons, 111 aliases)
	//Codepoints: F000-F2E0 with holes
	{min: 0xF000, max: 0xF2E0},

	//Font Awesome Extension (170 icons)
	//Codepoints: Nerd Fonts moved E000-E0A9 → E200-E2A9
	// {min: 0xE000, max: 0xE0A9},
	{min: 0xE200, max: 0xE2A9},

	//IEC Power Symbols (5 icons)
	//Codepoints: 23FB-23FE 2B58
	{min: 0x23FB, max: 0x23FE},
	{min: 0x2B58, max: 0x2B58},

	//Font Logos (Font Linux) (44 icons)
	//Codepoints: Nerd Fonts moved F100-F12D with holes → F300-F32D
	// {min: 0xF100, max: 0xF12D},
	{min: 0xF300, max: 0xF32D},

	//Material Design Icons (2,119 icons)
	//Codepoints: F001, F847, Nerd Fonts moved F500-FD46
	{min: 0xF001, max: 0xF001},
	{min: 0xF847, max: 0xF847},
	{min: 0xF500, max: 0xFD46},

	//Octicons (172 icons)
	//Codepoints: 2665, 26A1, Nerd Fonts moved F000-F105 with holes → F400-F4A8, F27C → F67C
	{min: 0x2665, max: 0x2665},
	{min: 0x26A1, max: 0x26A1},
	// {min: 0xF000, max: 0xF105},
	{min: 0xF400, max: 0xF4A8},
	{min: 0xF67C, max: 0xF67C},

	//Powerline Extra Symbols (37 icons, 3 aliases)
	// Codepoints: E0A0-E0A3 E0B0-E0BF E0C0-E0C8 E0CC-E0CF E0D0-E0D2 E0D4
	{min: 0xE0A0, max: 0xE0A3},
	{min: 0xE0B0, max: 0xE0BF},
	{min: 0x0EC0, max: 0xE0C8},
	{min: 0xE0CC, max: 0xE0CF},
	{min: 0xE0D0, max: 0xE0D2},
	{min: 0xE0D4, max: 0xE0D4},

	//Pomicons (11 icons)
	//Codepoints: E000-E00A
	{min: 0xE000, max: 0xE00A},

	//Seti-UI + Custom (53 icons, 6 aliases)
	//Codepoints: E5FA-E62E
	{min: 0xE5FA, max: 0xE62E},

	//Weather Icons (228 icons)
	//Codepoints: F000, F0EB, Nerd Fonts moved E300-E3EB
	{min: 0xE300, max: 0xE3EB}
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

function isNerdFontCodePoint(codePoint: number): boolean {
	for (const {max, min} of NerdFontRanges) {
		if (codePoint >= min && codePoint <= max){
			return true;
		}
	}
	return false;
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
	if (!isNerdFontGlyph) {
		const description = getUnicodeData(codePoint);
		const externalLink = "https://unicode-table.com/en/" + (codePoint <= MAX_CODE_POINT ? codePoint.toString(16).toUpperCase() : "");
		const surrogateNotification = isSurrogate ? " (surrogate pair) " : "";
		// Add a zero width space to prevent `#` etc from affecting markdown rendering.
		const markdown = `\u200b${glyph} [${description}](${externalLink})${surrogateNotification} (UnicodeHover)`;
		return new vscode.MarkdownString(markdown);
	} else {
		const externalLink = `https://www.nerdfonts.com/cheat-sheet?set=${codePoint <= MAX_CODE_POINT ? codePoint.toString(16).toUpperCase() : ""}`;
		let markdownString = new vscode.MarkdownString(`[NerdFont Glyph](${externalLink}) (UnicodeHover)`);
		markdownString.appendCodeblock(`${glyph}  - ..glyph-name-here..`);
		return markdownString;
	}
}

