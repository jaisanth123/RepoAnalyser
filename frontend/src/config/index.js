// Application Configuration
export const config = {
  // GitHub API Configuration
  github: {
    apiBase: import.meta.env.VITE_GITHUB_API_BASE || "https://api.github.com",
    graphqlApi:
      import.meta.env.VITE_GITHUB_GRAPHQL_API ||
      "https://api.github.com/graphql",
    token: import.meta.env.VITE_GITHUB_TOKEN || null,
  },

  // Application Settings
  app: {
    title: import.meta.env.VITE_APP_TITLE || "GitHub Repository Analyzer",
    description:
      import.meta.env.VITE_APP_DESCRIPTION ||
      "Comprehensive GitHub repository analysis tool",
    version: "1.0.0",
  },

  // Rate Limiting
  rateLimit: {
    unauthenticated: parseInt(import.meta.env.VITE_MAX_REQUESTS_PER_HOUR) || 60,
    authenticated:
      parseInt(import.meta.env.VITE_AUTHENTICATED_MAX_REQUESTS) || 5000,
  },

  // Feature Flags
  features: {
    securityAnalysis: import.meta.env.VITE_ENABLE_SECURITY_ANALYSIS !== "false",
    codeQuality: import.meta.env.VITE_ENABLE_CODE_QUALITY !== "false",
    dependencyAnalysis:
      import.meta.env.VITE_ENABLE_DEPENDENCY_ANALYSIS !== "false",
  },

  // Development Settings
  dev: {
    mode: import.meta.env.VITE_DEV_MODE === "true",
    debugApiCalls: import.meta.env.VITE_DEBUG_API_CALLS === "true",
    mockData:
      import.meta.env.MODE === "development" &&
      import.meta.env.VITE_USE_MOCK_DATA === "true",
  },

  // External APIs
  external: {
    sonarqube: {
      base: "https://sonarcloud.io/api",
      enabled: import.meta.env.VITE_ENABLE_SONARQUBE === "true",
    },
    codeFactor: {
      base: "https://www.codefactor.io/api",
      enabled: import.meta.env.VITE_ENABLE_CODEFACTOR === "true",
    },
  },

  // Storage Configuration
  storage: {
    tokenKey: "github_token",
    cachePrefix: "repo_analyzer_",
    cacheExpiry: 1000 * 60 * 30, // 30 minutes
  },
};

export default config;
