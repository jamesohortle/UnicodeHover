import * as vscode from "vscode";
import * as namedEntitiesJson from "./entities.json";
import { makeMarkdown } from "./unicodeHoverUtils";

/**
 * HTML named entities.
 * Data from https://html.spec.whatwg.org/entities.json and
 * https://html.spec.whatwg.org/multipage/named-characters.html#named-character-references
 */
const namedEntities = JSON.parse(JSON.stringify(namedEntitiesJson));

/**
 * Provide a hover for HTML file and the Unicode escapes therein.
 * Syntax for escape sequences (aka character references) defined here:
 * https://html.spec.whatwg.org/multipage/syntax.html#syntax-charref
 */
export class HtmlHover implements vscode.HoverProvider {
    /**
     * Get code point from HTML named entities.
     */
    private getCodePointsFromName(name: string): Array<number> {
        const codePoints = namedEntities[name]["codepoints"];
        if (codePoints === undefined) {
            return [];
        }
        return codePoints;
    }
    public provideHover(document: vscode.TextDocument, position: vscode.Position, _token: vscode.CancellationToken
    ): Thenable<vscode.Hover> {
        const unicodeRegexAny = new RegExp(/\&\#?[a-zA-Z\d]+\;/);
        const unicodeRegexHex = new RegExp(/\&\#x([a-fA-F\d]+)\;/);
        const unicodeRegexDec = new RegExp(/\&\#(\d+)\;/);
        const namedEntityRegex = new RegExp(/\&[a-zA-Z]{2,33}\;/);


        const range = document.getWordRangeAtPosition(position, unicodeRegexAny);
        if (range === undefined) {
            return new Promise((resolve, _reject) => {
                resolve(); // Resolve silently.
            });
        }

        const word = document.getText(range);
        console.log(`HtmlUnicodeHover ${word}`);
        return new Promise((resolve, reject) => {
            if (word.match(unicodeRegexHex)) {
                const codePoint = parseInt(word.match(unicodeRegexHex)![1], 16);
                const markdown = makeMarkdown(codePoint);

                resolve(new vscode.Hover(markdown));
            } else if (word.match(unicodeRegexDec)) {
                const codePoint = parseInt(word.match(unicodeRegexDec)![1], 10);
                const markdown = makeMarkdown(codePoint);

                resolve(new vscode.Hover(markdown));
            } else if (word.match(namedEntityRegex)) {
                const codePoints = this.getCodePointsFromName(word.match(namedEntityRegex)![0]);
                if (codePoints.length < 1) {
                    reject(`Named character entity ${word} detected, but name not found.`);
                }

                /** 
                 * Make new markdown when there are multiple code points for a single named sequence.
                 * E.g. &NotSquareSuperset; -> \u2290\u0338
                 */
                const markdown = new vscode.MarkdownString(
                    // Get each code point's markdown as a string
                    // Can't simply pass makeMarkdown, since it takes a second optional value...
                    codePoints.map(cp => makeMarkdown(cp).value)
                        .join("\n\n") // Separate with newlines.
                );

                resolve(new vscode.Hover(markdown));
            } else {
                reject("Not a Unicode escape.");
            }

        });
    }

    public dispose() { }
}