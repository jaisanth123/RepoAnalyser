# GitHub Repository Analyzer - API Integration Guide

## Overview

This application has been transformed from a mock data system to a fully functional GitHub repository analyzer using real-time APIs. It integrates with multiple services to provide comprehensive repository analysis.

## 🚀 Features & APIs Integrated

### 1. GitHub API Integration

- **REST API**: Repository data, contributors, commits, languages, issues, pull requests
- **GraphQL API**: Complex queries for detailed analysis
- **Rate Limiting**: Handles both authenticated (5,000/hour) and unauthenticated (60/hour) requests
- **Security**: Vulnerability alerts and dependency scanning

### 2. Code Quality Analysis

- **CodeFactor API**: Automated code review and quality metrics
- **Custom Metrics**: Lines of code, complexity analysis, maintainability index
- **Technical Debt**: Calculation and tracking

### 3. Security Analysis

- **GitHub Security API**: Vulnerability scanning
- **Dependency Analysis**: CVE detection and security scoring
- **Security Scoring**: Custom algorithm based on repository characteristics

## 🔧 Setup Instructions

### 1. Clone and Install

```bash
git clone <repository-url>
cd RepoAnalyzer
cd frontend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the frontend directory:

```env
# GitHub API Configuration
VITE_GITHUB_API_BASE=https://api.github.com
VITE_GITHUB_GRAPHQL_API=https://api.github.com/graphql

# Optional: Set default GitHub token (recommended to use UI instead)
# VITE_GITHUB_TOKEN=your_token_here

# Feature flags
VITE_ENABLE_SECURITY_ANALYSIS=true
VITE_ENABLE_CODE_QUALITY=true
VITE_ENABLE_DEPENDENCY_ANALYSIS=true

# Development
VITE_DEV_MODE=false
VITE_DEBUG_API_CALLS=false
```

### 3. GitHub Token Setup (Recommended)

#### Option 1: Through the UI (Recommended)

1. Start the application: `npm run dev`
2. Click the Settings icon in the header
3. Follow the in-app instructions to create and configure your GitHub token

#### Option 2: Manual Setup

1. Go to [GitHub Settings > Personal Access Tokens](https://github.com/settings/tokens)
2. Click "Generate new token" → "Generate new token (classic)"
3. Select scopes:
   - `public_repo` (for public repositories)
   - `repo` (for private repositories, if needed)
   - `read:user` (for user information)
4. Copy the token and either:
   - Use the in-app configuration modal
   - Set `VITE_GITHUB_TOKEN` in your `.env` file

### 4. Start the Application

```bash
npm run dev
```

## 📊 Available Analysis Features

### Repository Overview

- Basic repository information (stars, forks, watchers)
- Language breakdown and statistics
- License and ownership details
- Repository topics and metadata

### Contributor Analysis

- Contributor rankings and statistics
- Commit activity patterns
- Contribution trends over time
- Badge system for contributor recognition

### Code Quality Metrics

- **Maintainability Index**: Code maintainability scoring
- **Technical Debt**: Estimated hours of technical debt
- **Test Coverage**: Code coverage percentage
- **Complexity Analysis**: Cyclomatic complexity assessment
- **Code Duplications**: Duplicate code detection
- **Lines of Code**: Total codebase size metrics

### Security Assessment

- **Security Score**: Overall repository security rating
- **Vulnerability Scanning**: Known CVE detection
- **Dependency Analysis**: Third-party package security
- **Security Trends**: Historical security improvements

### Activity Analysis

- **Commit Patterns**: Daily/weekly commit activity
- **Issue Tracking**: Open/closed issue analysis
- **Pull Request Metrics**: PR merge rates and patterns
- **Release History**: Version release tracking

## 🔌 API Endpoints Used

### GitHub REST API

- `GET /repos/{owner}/{repo}` - Repository information
- `GET /repos/{owner}/{repo}/contributors` - Contributor data
- `GET /repos/{owner}/{repo}/commits` - Commit history
- `GET /repos/{owner}/{repo}/languages` - Language statistics
- `GET /repos/{owner}/{repo}/issues` - Issue tracking
- `GET /repos/{owner}/{repo}/pulls` - Pull requests
- `GET /repos/{owner}/{repo}/releases` - Release information
- `GET /repos/{owner}/{repo}/stats/commit_activity` - Activity stats
- `GET /rate_limit` - Rate limit monitoring

### GitHub GraphQL API

- Complex queries for detailed repository analysis
- Batch data fetching for performance optimization

### External APIs

- **CodeFactor API**: `https://www.codefactor.io/api/v1/repositories/github/{owner}/{repo}`
- **Security APIs**: Various endpoints for vulnerability data

## 🛡️ Rate Limiting & Best Practices

### Rate Limits

- **Unauthenticated**: 60 requests per hour
- **Authenticated**: 5,000 requests per hour
- **GraphQL**: 5,000 points per hour

### Best Practices Implemented

1. **Parallel Requests**: Multiple API calls executed simultaneously
2. **Error Handling**: Comprehensive error catching and user feedback
3. **Caching**: Local storage caching for repeated requests
4. **Rate Limit Monitoring**: Real-time rate limit display
5. **Graceful Degradation**: Fallback to cached or mock data when APIs fail

## 🚦 Error Handling

The application handles various error scenarios:

- **404 Errors**: Repository not found or doesn't exist
- **403 Errors**: Rate limit exceeded or access denied
- **401 Errors**: Invalid or expired GitHub token
- **Network Errors**: Connection issues and timeouts
- **API Timeouts**: Graceful handling of slow responses

## 🔍 Testing Repository Examples

Try analyzing these public repositories:

- `facebook/react` - Large JavaScript project
- `microsoft/vscode` - TypeScript project
- `python/cpython` - Python project
- `torvalds/linux` - C project
- `vuejs/vue` - JavaScript framework

## 🛠️ Development Features

### Configuration Management

- Centralized config in `src/config/index.js`
- Environment variable support
- Feature flags for enabling/disabling functionality

### Component Architecture

- **Services**: API integration layer (`src/services/api.js`)
- **Components**: Reusable UI components
- **Pages**: Main application views
- **Configuration**: Environment and feature management

### Mock Data Fallback

The application includes comprehensive mock data for development and demonstration purposes when API limits are reached.

## 🔒 Security Considerations

1. **Token Storage**: GitHub tokens are stored locally in browser storage
2. **HTTPS Only**: All API requests use secure HTTPS connections
3. **No Server Storage**: No tokens or personal data stored on servers
4. **Rate Limiting**: Respect for GitHub's rate limiting policies
5. **Error Handling**: Secure error messages without exposing sensitive data

## 📈 Performance Optimizations

1. **Parallel API Calls**: Concurrent request execution
2. **Data Caching**: Local storage for API response caching
3. **Lazy Loading**: Components loaded on demand
4. **Code Splitting**: Optimized bundle sizes
5. **Memoization**: React optimization techniques

## 🐛 Troubleshooting

### Common Issues

1. **"API rate limit exceeded"**

   - Add a GitHub token through the settings modal
   - Wait for rate limit reset (displays countdown)

2. **"Repository not found"**

   - Verify the repository URL is correct
   - Ensure the repository is public (unless token has private access)

3. **"Authentication failed"**

   - Check if your GitHub token is valid
   - Regenerate token if expired

4. **Slow loading**
   - Large repositories take longer to analyze
   - Some APIs may have delayed responses

### Support

For issues or questions, please check the application's error messages and rate limit status in the UI. The application provides detailed feedback for troubleshooting.

---

## 🎯 Next Steps

This application is ready for production use with real GitHub repositories. The integration provides comprehensive analysis capabilities while maintaining good performance and user experience.
