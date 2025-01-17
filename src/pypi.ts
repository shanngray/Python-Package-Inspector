import fetch from 'node-fetch';

// Add an interface for the PyPI API response
interface PyPIResponse {
  info: {
    project_urls: {
      GitHub?: string;
    };
    maintainers: any[];
    version: string;
  };
}

// Add an interface for the GitHub API response
interface GitHubResponse {
  stargazers_count: number;
  forks_count: number;
}

// Add this interface definition before the fetchPackageInfo function
interface PackageInfo {
  name: string;
  //version: string;
  //summary: string;
  githubUrl?: string;
  stars: number;
  forks: number;
  maintainers: number;
  latestRelease: string;
}

/**
 * Fetches package information from PyPI and associated GitHub repository.
 * @param packageName - The name of the Python package
 * @returns An object containing package details or throws an error if fetching fails
 */
export async function fetchPackageInfo(packageName: string): Promise<PackageInfo | null> {
    try {
        // Fetch package data from PyPI's JSON API
        const response = await fetch(`https://pypi.org/pypi/${packageName}/json`);
        if (!response.ok) {
            console.error(`Failed to fetch PyPI data for ${packageName}: ${response.statusText}`);
            return null;
        }
        const data = await response.json() as PyPIResponse;

        const githubUrl = data.info.project_urls?.GitHub || '';
        
        let stars = 0;
        let forks = 0;

        if (githubUrl) {
            const repoPath = githubUrl.replace('https://github.com/', '');
            const githubResponse = await fetch(`https://api.github.com/repos/${repoPath}`);
            if (!githubResponse.ok) {
                console.error(`Failed to fetch GitHub data for ${repoPath}: ${githubResponse.statusText}`);
            } else {
                const repoInfo = await githubResponse.json() as GitHubResponse;
                stars = repoInfo.stargazers_count;
                forks = repoInfo.forks_count;
            }
        }

        return {
            name: packageName,
            githubUrl,
            stars,
            forks,
            maintainers: data.info.maintainers.length,
            latestRelease: data.info.version
        };
    } catch (error) {
        console.error(`Error fetching package info for ${packageName}:`, error);
        return null;
    }
}

// ... rest of the code ...