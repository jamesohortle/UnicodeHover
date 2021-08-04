import * as vscode from "vscode";
import { makeMarkdown } from "./unicodeHoverUtils";

/**
 * Provide a hover for (La)TeX files and the Unicode escapes therein.
 * Supports \char, \Uchar and caret (TeX primitive) notation.
 */
export class LatexHover implements vscode.HoverProvider {
    public provideHover(
        document: vscode.TextDocument, position: vscode.Position, _token: vscode.CancellationToken
    ): Thenable<vscode.Hover | undefined> {
        const unicodeRegexAny = new RegExp(/(\\U?char['"]?[\da-fA-F]{1,8}|\^{2,6}[\da-f]{2,6})/); // General form.
        const unicodeRegexCharDec = new RegExp(/\\char([\d]{1,7})/); // Decimal form: \char98
        const unicodeRegexCharOct = new RegExp(/\\char'([0-7]{1,8})/); // Octal form: \char'98.
        const unicodeRegexCharHex = new RegExp(/\\char"([\dA-F]{1,8})/); // Hexadecimal form: \char"98.
        const unicodeRegexUcharDec = new RegExp(/\\Uchar([\d]{1,7})/); // Decimal form: \Uchar98
        const unicodeRegexUcharOct = new RegExp(/\\Uchar'([0-7]{1,8})/); // Octal form: \Uchar'98.
        const unicodeRegexUcharHex = new RegExp(/\\Uchar"([\dA-F]{1,8})/); // Hexadecimal form: \Uchar"98.
        const unicodeRegexPrimitive6 = new RegExp(/\^{6}([\da-f]{6})/); // Hexadecimal form: ^^^^^^0000ff
        const unicodeRegexPrimitive4 = new RegExp(/\^{4}([\da-f]{4})/); // 4 hexadecimal: ^^^^00ff
        const unicodeRegexPrimitive2 = new RegExp(/\^{2}([\da-f]{2})/); // 2 hexadecimal: ^^ff.

        const range = document.getWordRangeAtPosition(position, unicodeRegexAny);

        if (range === undefined) {
            return new Promise((resolve, _reject) => {
                resolve(undefined); // Resolve silently.
            });
        }
        const word = document.getText(range);
        console.log(`TexUnicodeHover ${word}`);
        return new Promise((resolve, reject) => {
            if (word.match(unicodeRegexCharDec)) {
                const codePoint = parseInt(word.match(unicodeRegexCharDec)![1], 10);
                const markdown = makeMarkdown(codePoint);

                resolve(new vscode.Hover(markdown));
            } else if (word.match(unicodeRegexCharOct)) {
                const codePoint = parseInt(word.match(unicodeRegexCharOct)![1], 8);
                const markdown = makeMarkdown(codePoint);

                resolve(new vscode.Hover(markdown));
            } else if (word.match(unicodeRegexCharHex)) {
                const codePoint = parseInt(word.match(unicodeRegexCharHex)![1], 16);
                const markdown = makeMarkdown(codePoint);

                resolve(new vscode.Hover(markdown));
            } else if (word.match(unicodeRegexUcharDec)) {
                const codePoint = parseInt(word.match(unicodeRegexUcharDec)![1], 10);
                const markdown = makeMarkdown(codePoint);

                resolve(new vscode.Hover(markdown));
            }
            else if (word.match(unicodeRegexUcharOct)) {
                const codePoint = parseInt(word.match(unicodeRegexUcharOct)![1], 8);
                const markdown = makeMarkdown(codePoint);

                resolve(new vscode.Hover(markdown));
            } else if (word.match(unicodeRegexUcharHex)) {
                const codePoint = parseInt(word.match(unicodeRegexUcharHex)![1], 16);
                const markdown = makeMarkdown(codePoint);

                resolve(new vscode.Hover(markdown));
            } else if (word.match(unicodeRegexPrimitive6)) {
                const codePoint = parseInt(word.match(unicodeRegexPrimitive6)![1], 16);
                const markdown = makeMarkdown(codePoint);

                resolve(new vscode.Hover(markdown));
            }
            else if (word.match(unicodeRegexPrimitive4)) {
                const codePoint = parseInt(word.match(unicodeRegexPrimitive4)![1], 16);
                const markdown = makeMarkdown(codePoint);

                resolve(new vscode.Hover(markdown));
            } else if (word.match(unicodeRegexPrimitive2)) {
                const codePoint = parseInt(word.match(unicodeRegexPrimitive2)![1], 16);
                const markdown = makeMarkdown(codePoint);

                resolve(new vscode.Hover(markdown));
            } else {
                reject("Not a Unicode escape.");
            }
        });
    }

    public dispose() { }
}