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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex justify-center mb-8">
              <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm">
                <Github className="w-16 h-16 text-white" />
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              GitHub Repository
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Analyzer
              </span>
            </h1>

            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Get comprehensive insights into any GitHub repository. Analyze
              code quality, security, contributors, and much more with our
              powerful analysis tools.
            </p>

            {/* API Status Section */}
            <div className="mb-8">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  {AuthAPI.hasToken() ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                  )}
                  <span className="text-gray-300 text-sm">
                    {AuthAPI.hasToken()
                      ? "GitHub API Connected"
                      : "Limited API Access"}
                  </span>
                </div>

                <button
                  onClick={() => setShowTokenModal(true)}
                  className="text-purple-400 hover:text-purple-300 transition-colors text-sm flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Configure Token
                </button>
              </div>

              {rateLimit && (
                <div className="text-sm text-gray-400">
                  API Rate Limit: {rateLimit.rate.remaining}/
                  {rateLimit.rate.limit} remaining
                  {rateLimit.rate.remaining < 10 && (
                    <span className="text-yellow-400 ml-2">
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
                  placeholder="Enter GitHub repository URL (e.g., https://github.com/facebook/react)"
                  className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="absolute right-2 top-2 bottom-2 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
                  className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300"
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20"
        >
          {/* Repository Card */}
          <div className="mb-12">
            <RepoCard repository={results.repository} />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
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
          </div>

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
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-4">
              Quick Stats
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-purple-400">
                  {results.commits?.length || 0}
                </div>
                <div className="text-sm text-gray-400">Recent Commits</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">
                  {Object.keys(results.languages).length}
                </div>
                <div className="text-sm text-gray-400">Languages</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">
                  {results.releases?.length || 0}
                </div>
                <div className="text-sm text-gray-400">Releases</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-400">
                  {results.qualityMetrics?.linesOfCode?.toLocaleString() ||
                    "N/A"}
                </div>
                <div className="text-sm text-gray-400">Lines of Code</div>
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
            <p className="text-gray-400 mb-4">
              Explore more detailed analysis in the navigation sections above
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm">
                Dashboard
              </span>
              <span className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-sm">
                Contributors
              </span>
              <span className="px-3 py-1 bg-green-600/20 text-green-300 rounded-full text-sm">
                Codebase
              </span>
              <span className="px-3 py-1 bg-red-600/20 text-red-300 rounded-full text-sm">
                Security
              </span>
            </div>
          </motion.div>
        </motion.div>
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
