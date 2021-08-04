import * as vscode from "vscode";
import { UnicodeHover } from "./unicodeHover";
import { PythonHover } from "./pythonHover";
import { JavascriptHover } from "./javascriptHover";
import { LatexHover } from "./latexHover";
import { JavaHover } from "./javaHover";
import { HtmlHover } from "./htmlHover";
import { CssHover } from "./cssHover";
import { HaskellHover } from "./haskellHover";

// Provide the hovers.
export function activate(context: vscode.ExtensionContext): void {
    const languageProviderMap = {
        python: PythonHover,
        javascript: JavascriptHover,
        javascriptreact: JavascriptHover,
        typescript: JavascriptHover,
        typescriptreact: JavascriptHover,
        json: JavascriptHover,
        jsonc: JavascriptHover,
        latex: LatexHover,
        java: JavaHover,
        html: HtmlHover,
        css: CssHover
        // haskell: HaskellHover
    };

    context.subscriptions.push(vscode.languages.registerHoverProvider({}, new UnicodeHover()));
    Object.entries(languageProviderMap).forEach(([language, provider]) => {
        context.subscriptions.push(vscode.languages.registerHoverProvider({ language }, new provider()));
    });

    console.log("UnicodeHover: providers pushed.");
}

// this method is called when your extension is deactivated
export function deactivate() { }
