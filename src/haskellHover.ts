import * as vscode from "vscode";
import * as haskellEscapesJson from "./haskellEscapes.json";
import { makeMarkdown } from "./unicodeHoverUtils";

// Parse the Haskell-specific escapes.
const haskellEscapes = JSON.parse(JSON.stringify(haskellEscapesJson));

/**
 * Provide a hover for Haskell files and the Unicode escapes therein.
 * Decimal, hexadecimal and octal forms are supported.
 */
export class HaskellHover implements vscode.HoverProvider {
    public provideHover(document: vscode.TextDocument, position: vscode.Position, _token: vscode.CancellationToken): Thenable<vscode.Hover> {

        /**
         * Check for Haskell-specific escapes first.
         * If they don't resolve, continue to Unicode regexes.
         */
        const singleCharEscape = new RegExp(/\\[0abfnrtv"&'\\]/);
        const asciiAbbr = new RegExp(/\\[1234ABCDEFGHIKLMNOPQRSTUVXY]{2,3}/);
        const charEscapes = new RegExp(/\\\^[A-Z@\\\[\]\^_]/);

        const r1 = document.getWordRangeAtPosition(position, singleCharEscape);
        if (r1 !== undefined) {
            const word = document.getText(r1);
            console.log(`SCES ${word}`);

            const esc = haskellEscapes![word];
            if (esc !== undefined) {
                const markdown = makeMarkdown(esc);
                return new Promise((resolve, _reject) => {
                    resolve(new vscode.Hover(markdown));
                });
            }

        }

        const r2 = document.getWordRangeAtPosition(position, asciiAbbr);
        if (r2 !== undefined) {
            const word = document.getText(r2);
            console.log(`AABBR ${word}`);

            const esc = haskellEscapes![word];
            if (esc !== undefined) {
                const markdown = makeMarkdown(esc);
                return new Promise((resolve, _reject) => {
                    resolve(new vscode.Hover(markdown));
                });
            }
        }

        const r3 = document.getWordRangeAtPosition(position, charEscapes);
        if (r3 !== undefined) {
            const word = document.getText(r3);
            console.log(`CESC ${document.getText(r3)}`);

            const esc = haskellEscapes![word];
            if (esc !== undefined) {
                const markdown = makeMarkdown(esc);
                return new Promise((resolve, _reject) => {
                    resolve(new vscode.Hover(markdown));
                });
            }
        }

        /**
         * Check Unicode regexes.
         */
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