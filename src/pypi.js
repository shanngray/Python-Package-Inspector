"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
/**
 * Fetches package information from PyPI and associated GitHub repository.
 * @param packageName - The name of the Python package
 * @returns An object containing package details or null if fetching fails
 */
function fetchPackageInfo(packageName) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            // Fetch package data from PyPI's JSON API
            const response = yield (0, node_fetch_1.default)(`https://pypi.org/pypi/${packageName}/json`);
            const data = yield response.json();
            const githubUrl = ((_a = data.info.project_urls) === null || _a === void 0 ? void 0 : _a.GitHub) || '';
            let stars = 0;
            let forks = 0;
            if (githubUrl) {
                const repoPath = githubUrl.replace('https://github.com/', '');
                const githubResponse = yield (0, node_fetch_1.default)(`https://api.github.com/repos/${repoPath}`);
                const repoInfo = yield githubResponse.json();
                stars = repoInfo.stargazers_count;
                forks = repoInfo.forks_count;
            }
            return {
                name: packageName,
                githubUrl,
                stars,
                forks,
                maintainers: data.info.maintainers.length,
                latestRelease: data.info.version
            };
        }
        catch (error) {
            console.error(`Error fetching package info for ${packageName}:`, error);
            throw error;
        }
    });
}
// ... rest of the code ...
