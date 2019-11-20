import * as vscode from 'vscode';
import { makeMarkdown } from './unicodeHoverUtils';

/**
 * Provide a hover for Python files and the Unicode escapes therein.
 * Python has two simple forms: \u1234 (small u and 4 hexadecimal digits)
 * or \U1234abcd (big U and 8 hexadecimal digits).
 */
export class PythonHover implements vscode.HoverProvider {
    public provideHover(
        document: vscode.TextDocument, position: vscode.Position, _token: vscode.CancellationToken
    ): Thenable<vscode.Hover> {
        const unicodeRegexAny = new RegExp(/\\(u|U)([\da-fA-F]{4,8})/); // General form.
        const unicodeRegex4 = new RegExp(/\\u([\da-fA-F]{4})/); // Short form: "\uabcd".
        const unicodeRegex8 = new RegExp(/\\U([\da-fA-F]{8})/); // Long form: "\Uabcd1234".

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
                const codePoint = parseInt(word.match(unicodeRegex8)![1], 16);
                const markdown = makeMarkdown(codePoint);

                resolve(new vscode.Hover(markdown));
            } else if (word.match(unicodeRegex4)) {
                const codePoint = parseInt(word.match(unicodeRegex4)![1], 16);
                const markdown = makeMarkdown(codePoint);

                resolve(new vscode.Hover(markdown));
            } else {
                reject("Not a Unicode escape.");
            }
        });
    }

    public dispose() { }
}