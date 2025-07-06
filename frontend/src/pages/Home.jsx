import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Github,
  Star,
  GitFork,
  Eye,
  Calendar,
  Users,
  Code2,
  Shield,
  TrendingUp,
  Loader2,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Info,
  Settings,
} from "lucide-react";
import RepoCard from "../components/Cards/RepoCard";
import StatsCard from "../components/Cards/StatsCard";
import LanguageChart from "../components/Charts/LanguageChart";
import ActivityChart from "../components/Charts/ActivityChart";
import GitHubTokenModal from "../components/Layout/GitHubTokenModal";
import {
  analyzeRepository,
  parseGitHubUrl,
  AuthAPI,
  RateLimitAPI,
} from "../services/api";

const Home = () => {
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [rateLimit, setRateLimit] = useState(null);

  const checkRateLimit = async () => {
    try {
      const limit = await RateLimitAPI.getRateLimit();
      setRateLimit(limit);
    } catch (error) {
      console.error("Failed to fetch rate limit:", error);
    }
  };

  const validateUrl = (url) => {
    try {
      parseGitHubUrl(url);
      return true;
    } catch {
      return false;
    }
  };

  const formatLanguageData = (languages) => {
    const total = Object.values(languages).reduce(
      (sum, bytes) => sum + bytes,
      0
    );
    return Object.entries(languages).map(([name, bytes]) => ({
      name,
      value: parseFloat(((bytes / total) * 100).toFixed(1)),
      bytes: bytes,
    }));
  };

  const formatActivityData = (commitActivity) => {
    if (!commitActivity || !Array.isArray(commitActivity)) {
      return [];
    }

    return commitActivity.slice(-12).map((week, index) => ({
      week: `Week ${index + 1}`,
      commits: week.total || week,
    }));
  };

  const calculateStats = (data) => {
    const {
      repository,
      contributors,
      commits,
      issues,
      pullRequests,
      qualityMetrics,
    } = data;

    return [
      {
        title: "Stars",
        value: repository.stargazers_count?.toLocaleString() || "0",
        change: "+12%",
        trend: "up",
        icon: Star,
        color: "yellow",
      },
      {
        title: "Forks",
        value: repository.forks_count?.toLocaleString() || "0",
        change: "+8%",
        trend: "up",
        icon: GitFork,
        color: "blue",
      },
      {
        title: "Contributors",
        value: contributors?.length?.toString() || "0",
        change: "+5%",
        trend: "up",
        icon: Users,
        color: "green",
      },
      {
        title: "Open Issues",
        value: repository.open_issues_count?.toString() || "0",
        change: "-3%",
        trend: "down",
        icon: AlertCircle,
        color: "red",
      },
      {
        title: "Code Quality",
        value: `${Math.round(qualityMetrics?.codeQualityScore || 75)}%`,
        change: "+2%",
        trend: "up",
        icon: Code2,
        color: "purple",
      },
      {
        title: "Security Score",
        value: `${Math.round(data.securityScore || 75)}%`,
        change: "+1%",
        trend: "up",
        icon: Shield,
        color: "indigo",
      },
    ];
  };

  const handleAnalyze = async () => {
    if (!repoUrl.trim()) {
      setError("Please enter a repository URL");
      return;
    }

    if (!validateUrl(repoUrl)) {
      setError(
        "Please enter a valid GitHub repository URL (e.g., https://github.com/owner/repo)"
      );
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      await checkRateLimit();
      const data = await analyzeRepository(repoUrl);
      setResults(data);
    } catch (error) {
      console.error("Analysis failed:", error);

      if (error.response?.status === 404) {
        setError(
          "Repository not found. Please check the URL and make sure the repository exists and is public."
        );
      } else if (error.response?.status === 403) {
        setError(
          "API rate limit exceeded or access denied. Please add a GitHub token to increase rate limits."
        );
      } else if (error.response?.status === 401) {
        setError("Authentication failed. Please check your GitHub token.");
      } else {
        setError(
          error.message || "Failed to analyze repository. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAnalyze();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex justify-center mb-8">
              <div className="p-4 bg-blue-100 rounded-full">
                <Github className="w-16 h-16 text-blue-600" />
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              GitHub Repository
              <span className="block text-blue-600">Analyzer</span>
            </h1>

            {/* API Status Section */}
            <div className="mb-8">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  {AuthAPI.hasToken() ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                  )}
                  <span className="text-gray-600 text-sm">
                    {AuthAPI.hasToken()
                      ? "GitHub API Connected"
                      : "Limited API Access"}
                  </span>
                </div>

                <button
                  onClick={() => setShowTokenModal(true)}
                  className="text-blue-600 hover:text-blue-700 transition-colors text-sm flex items-center gap-2 font-medium"
                >
                  <Settings className="w-4 h-4" />
                  Configure Token
                </button>
              </div>

              {rateLimit && (
                <div className="text-sm text-gray-500">
                  API Rate Limit: {rateLimit.rate.remaining}/
                  {rateLimit.rate.limit} remaining
                  {rateLimit.rate.remaining < 10 && (
                    <span className="text-yellow-600 ml-2 font-medium">
                      ⚠️ Rate limit low
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Repository Input */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter GitHub repository URL "
                  className="w-full px-6 py-4 bg-white border border-gray-300 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="absolute right-2 top-2 bottom-2 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Analyze
                    </>
                  )}
                </motion.button>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
                >
                  {error}
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Results Section */}
      {results && (
        <div className="bg-gray-50 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          >
            {/* Repository Card */}
            <div className="mb-12">
              <RepoCard
                repository={results.repository}
                contributors={results.contributors}
                commits={results.commits}
                languages={results.languages}
                qualityMetrics={results.qualityMetrics}
              />
            </div>

            {/* Stats Grid */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {calculateStats(results).map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <StatsCard {...stat} />
                </motion.div>
              ))}
            </div> */}

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <LanguageChart data={formatLanguageData(results.languages)} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <ActivityChart
                  data={formatActivityData(results.commitActivity)}
                />
              </motion.div>
            </div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Quick Stats
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {results.commits?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Recent Commits</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {Object.keys(results.languages).length}
                  </div>
                  <div className="text-sm text-gray-600">Languages</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {results.releases?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Releases</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">
                    {results.qualityMetrics?.linesOfCode?.toLocaleString() ||
                      "N/A"}
                  </div>
                  <div className="text-sm text-gray-600">Lines of Code</div>
                </div>
              </div>
            </motion.div>

            {/* Navigation Hint */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-12 text-center"
            >
              <p className="text-gray-600 mb-4">
                Explore more detailed analysis in the navigation sections above
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  Dashboard
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  Contributors
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  Codebase
                </span>
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                  Security
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}

      {/* GitHub Token Modal */}
      <GitHubTokenModal
        isOpen={showTokenModal}
        onClose={() => setShowTokenModal(false)}
      />
    </div>
  );
};

export default Home;
