import * as vscode from "vscode";
import { makeMarkdown } from "./unicodeHoverUtils";

/**
 * Provide a hover for Haskell files and the Unicode escapes therein.
 * Decimal, hexadecimal and octal forms are supported.
 */
export class HaskellHover implements vscode.HoverProvider {
    public provideHover(document: vscode.TextDocument, position: vscode.Position, _token: vscode.CancellationToken): Thenable<vscode.Hover> {
        const unicodeRegexAny = new RegExp(/\\(x|o)?[a-fA-F\d]+/);
        const unicodeRegexOct = new RegExp(/\\o([0-7]+)/);
        const unicodeRegexDec = new RegExp(/\\(\d+)/);
        const unicodeRegexHex = new RegExp(/\\x([a-fA-F\d]+)/);

        const range = document.getWordRangeAtPosition(position, unicodeRegexAny);
        if (range === undefined) {
            return new Promise((resolve, _reject) => {
                resolve(); // Resolve silently.
            });
        }

        const word = document.getText(range);
        console.log(`HaskellUnicodeHover ${word}`);

        return new Promise((resolve, reject) => {
            if (word.match(unicodeRegexOct)) {
                const codePoint = parseInt(word.match(unicodeRegexOct)![1], 8);
                const markdown = makeMarkdown(codePoint);

                resolve(new vscode.Hover(markdown));
            } else if (word.match(unicodeRegexDec)) {
                const codePoint = parseInt(word.match(unicodeRegexDec)![1], 10);
                const markdown = makeMarkdown(codePoint);

                resolve(new vscode.Hover(markdown));
            } else if (word.match(unicodeRegexHex)) {
                const codePoint = parseInt(word.match(unicodeRegexHex)![1], 16);
                const markdown = makeMarkdown(codePoint);

                resolve(new vscode.Hover(markdown));
            } else {
                reject("Not a Unicode escape.");
            }

        });
    }
}