import * as vscode from "vscode";
import { makeMarkdown } from "./unicodeHoverUtils";

/**
 * Provide a hover for JavaScript (TypeScript) files and the Unicode escapes therein.
 * Octal, hexadecimal, short-u and u-with-braces forms are supported.
 */
export class JavascriptHover implements vscode.HoverProvider {
    public provideHover(
        document: vscode.TextDocument, position: vscode.Position, _token: vscode.CancellationToken
    ): Thenable<vscode.Hover> {
        const unicodeRegexAny = new RegExp(/\\(u|x)?\{?([\da-fA-F]+)\}?/); // General form.
        const unicodeRegexOct = new RegExp(/\\([0-7]{1,3})/); // Octal-escape form: \123.
        const unicodeRegex2 = new RegExp(/\\x([\da-fA-F]{2})/); // Hex-escape form: "\xA7".
        const unicodeRegex4 = new RegExp(/\\u([\da-fA-F]{4})/); // Short form: "\uabcd".
        const unicodeRegex8 = new RegExp(/\\u\{([\da-fA-F]+)\}/); // Long form: "\u{abcd1234}".

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
                const codePoint = parseInt(word.match(unicodeRegex8)![1], 16);
                const markdown = makeMarkdown(codePoint);

                resolve(new vscode.Hover(markdown));
            } else if (word.match(unicodeRegex4)) {
                const codePoint = parseInt(word.match(unicodeRegex4)![1], 16);
                const markdown = makeMarkdown(codePoint);

                resolve(new vscode.Hover(markdown));
            } else if (word.match(unicodeRegex2)) {
                const codePoint = parseInt(word.match(unicodeRegex2)![1], 16);
                const markdown = makeMarkdown(codePoint);

                resolve(new vscode.Hover(markdown));
            } else if (word.match(unicodeRegexOct)) {
                const codePoint = parseInt(word.match(unicodeRegexOct)![1], 8);
                const markdown = makeMarkdown(codePoint);

                resolve(new vscode.Hover(markdown));
            } else {
                reject("Not a Unicode escape.");
            }
        });
    }

    public dispose() { }
}