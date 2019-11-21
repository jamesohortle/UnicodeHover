import * as vscode from 'vscode';
import { makeMarkdown } from './unicodeHoverUtils';

/**
 * Provide a basic hover that recognizes Unicode escapes as used by the Unicode Consortium.
 * I.e., recognize escapes like U+ABCD, U+12345, U+A1B2C3, which refer to official codepoints.
 */
export class UnicodeHover implements vscode.HoverProvider {
    public provideHover(
        document: vscode.TextDocument, position: vscode.Position, _token: vscode.CancellationToken
    ): Thenable<vscode.Hover> {
        const unicodeRegexAny = new RegExp(/U\+([A-F\d]{4,6})/);

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
                const markdown = makeMarkdown(codePoint);

                resolve(new vscode.Hover(markdown));
            } else {
                reject("Not a Unicode escape.");
            }
        });

    }
    public dispose() { }
}