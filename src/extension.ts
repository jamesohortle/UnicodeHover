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
	context.subscriptions.push(vscode.languages.registerHoverProvider({ scheme: 'file' }, new UnicodeHover()));
	context.subscriptions.push(vscode.languages.registerHoverProvider({ scheme: 'file', language: 'python' }, new PythonHover()));
	context.subscriptions.push(vscode.languages.registerHoverProvider({ scheme: 'file', language: 'javascript' }, new JavascriptHover()));
	context.subscriptions.push(vscode.languages.registerHoverProvider({ scheme: 'file', language: 'typescript' }, new JavascriptHover())); // TS has same escapes as JS.
	context.subscriptions.push(vscode.languages.registerHoverProvider({ scheme: 'file', language: 'latex' }, new LatexHover()));
	context.subscriptions.push(vscode.languages.registerHoverProvider({ scheme: 'file', language: 'java' }, new JavaHover()));
	context.subscriptions.push(vscode.languages.registerHoverProvider({ scheme: 'file', language: 'html' }, new HtmlHover()));
	context.subscriptions.push(vscode.languages.registerHoverProvider({ scheme: 'file', language: 'css' }, new CssHover()));
	context.subscriptions.push(vscode.languages.registerHoverProvider({ scheme: 'file', language: 'haskell' }, new HaskellHover));
	console.log("UnicodeHover: providers pushed.");
}

// this method is called when your extension is deactivated
export function deactivate() { }
