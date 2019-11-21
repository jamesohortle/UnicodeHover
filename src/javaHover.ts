import * as vscode from "vscode";
import { makeMarkdown } from "./unicodeHoverUtils";

/**
 * Provide a hover for Java files and the Unicode escapes therein.
 * Support \u1234 form and surrogate pair form.
 */
export class JavaHover implements vscode.HoverProvider {

    // Java encodes code points in [U+010000, U+10FFF] as surrogate pairs,
    // called leading and trailing, or high and low, surrogates.
    private leadingSurrogateRange = [0xD800, 0xDBFF];
    private trailingSurrogateRange = [0xDC00, 0xDFFF];

    private convertSurrogatePair(leadSurrogate: string, trailSurrogate: string): number {
        const lead = parseInt(leadSurrogate, 16);
        const trail = parseInt(trailSurrogate, 16);

        if (!(this.leadingSurrogateRange[0] <= lead || lead <= this.leadingSurrogateRange[1])) {
            return -1;
        }
        if (!(this.trailingSurrogateRange[0] <= trail || trail <= this.trailingSurrogateRange[1])) {
            return -1;
        }

        const codePoint = 0x10000 + (0x400 * (lead - 0xD800)) + (trail - 0xDC00);
        return codePoint;
    }

    public provideHover(
        document: vscode.TextDocument, position: vscode.Position, _token: vscode.CancellationToken
    ): Thenable<vscode.Hover> {
        const unicodeRegexAny = new RegExp(/(\\(u+)([\da-fA-F]{4})){1,2}/); // General form.
        const surrogatePairRegex = new RegExp(/\\(u+)([dD][89AB][\da-fA-F]{2})\\(u+)([dD][c-fC-F][\da-fA-F]{2})/);
        const range = document.getWordRangeAtPosition(position, unicodeRegexAny);

        if (range === undefined) {
            return new Promise((resolve, _reject) => {
                resolve(); // Resolve silently.
            });
        }
        const word = document.getText(range);
        console.log(`JavaUnicodeHover ${word}`);

        return new Promise((resolve, reject) => {
            if (word.match(surrogatePairRegex)) {
                const leading = word.match(surrogatePairRegex)![2];
                const trailing = word.match(surrogatePairRegex)![4];
                const codePoint = this.convertSurrogatePair(leading, trailing);
                if (codePoint < 0x0000 || codePoint > 0x10FFFF) {
                    reject(`Surrogate pair ${word} detected, but final codepoint ${codePoint.toString(16)} not found.`);
                }
                const markdown = makeMarkdown(codePoint, true);

                resolve(new vscode.Hover(markdown));
            } else if (word.match(unicodeRegexAny)) {
                const codePoint = parseInt(word.match(unicodeRegexAny)![3], 16);
                const markdown = makeMarkdown(codePoint);

                resolve(new vscode.Hover(markdown));
            } else {
                reject("Not a Unicode escape.");
            }
        });
    }

    public dispose() { }
}