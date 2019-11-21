import * as vscode from "vscode";
import { makeMarkdown } from "./unicodeHoverUtils";

/**
 * Provide a hover for CSS files and the Unicode escapes therein.
 * CSS uses a backslash `\` and 1 to 6 hexadecimal digits,
 * followed by an optional space for disambiguation.
 */
export class CssHover implements vscode.HoverProvider {
    public provideHover(document: vscode.TextDocument, position: vscode.Position, _token: vscode.CancellationToken
    ): Thenable<vscode.Hover> {
        const unicodeRegexAny = new RegExp(/\\([a-fA-F\d]{1,6})\u0020?/); // Here's an opportunity to use the extension, while developing the extension. How meta...


        const range = document.getWordRangeAtPosition(position, unicodeRegexAny);
        if (range === undefined) {
            return new Promise((resolve, _reject) => {
                resolve(); // Resolve silently.
            });
        }

        const word = document.getText(range);
        console.log(`CssUnicodeHover ${word}`);
        return new Promise((resolve, reject) => {
            if (word.match(unicodeRegexAny)) {
                console.log(word.match(unicodeRegexAny)![1]);
                const codePoint = parseInt(word.match(unicodeRegexAny)![1], 16);
                const markdown = makeMarkdown(codePoint);

                resolve(new vscode.Hover(markdown));
            } else {
                reject("Not a Unicode escape.");
            }

        });
    }

    public dispose() { }
}