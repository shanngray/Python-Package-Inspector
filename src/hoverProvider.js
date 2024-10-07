"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HoverProvider = void 0;
const vscode = __importStar(require("vscode"));
const pypi_1 = require("./pypi");
/**
 * HoverProvider class implements the HoverProvider interface.
 * It provides hover information for Python import statements.
 */
class HoverProvider {
    constructor() {
        // Cache to store fetched package information to reduce redundant API calls
        this.packageCache = new Map();
    }
    /**
     * Provides hover information when the user hovers over a package name in an import statement.
     * @param document - The current text document
     * @param position - The position of the cursor
     * @param token - Cancellation token
     * @returns A Hover object with package information or undefined
     */
    provideHover(document, position, token) {
        return __awaiter(this, void 0, void 0, function* () {
            // Regex to match import statements and capture the package name
            const range = document.getWordRangeAtPosition(position, /import\s+(\w+)/);
            if (!range)
                return;
            const importStatement = document.getText(range);
            const packageNameMatch = importStatement.match(/import\s+(\w+)/);
            if (!packageNameMatch)
                return;
            const packageName = packageNameMatch[1];
            if (!packageName)
                return;
            // Check if the package information is already cached
            let packageInfo = this.packageCache.get(packageName);
            if (!packageInfo) {
                // Fetch package information from PyPI and GitHub
                packageInfo = yield (0, pypi_1.fetchPackageInfo)(packageName);
                if (packageInfo) {
                    // Store the fetched information in the cache
                    this.packageCache.set(packageName, packageInfo);
                }
                else {
                    // If fetching fails, do not provide hover information
                    return;
                }
            }
            // Create markdown content for the hover tooltip
            const markdown = new vscode.MarkdownString(`**${packageName}**\n\n` +
                `⭐ Stars: ${packageInfo.stars}\n` +
                `🍴 Forks: ${packageInfo.forks}\n` +
                `👥 Maintainers: ${packageInfo.maintainers}\n` +
                `📅 Latest Release: ${packageInfo.latestRelease}`);
            return new vscode.Hover(markdown);
        });
    }
}
exports.HoverProvider = HoverProvider;
