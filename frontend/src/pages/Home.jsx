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
} from "lucide-react";
import RepoCard from "../components/Cards/RepoCard";
import StatsCard from "../components/Cards/StatsCard";
import LanguageChart from "../components/Charts/LanguageChart";
import ActivityChart from "../components/Charts/ActivityChart";

const Home = () => {
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [repoData, setRepoData] = useState(null);
  const [error, setError] = useState("");

  const extractRepoInfo = (url) => {
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    return match ? { owner: match[1], repo: match[2] } : null;
  };

  const analyzeRepository = async (e) => {
    e.preventDefault();
    if (!repoUrl.trim()) return;

    const repoInfo = extractRepoInfo(repoUrl);
    if (!repoInfo) {
      setError("Please enter a valid GitHub repository URL");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Mock API call - replace with actual GitHub API integration
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock data - replace with real API response
      setRepoData({
        name: repoInfo.repo,
        owner: repoInfo.owner,
        description:
          "A modern, feature-rich repository for building amazing applications",
        stars: 1542,
        forks: 234,
        watchers: 89,
        language: "JavaScript",
        languages: {
          JavaScript: 65.8,
          TypeScript: 20.2,
          CSS: 8.5,
          HTML: 3.8,
          Other: 1.7,
        },
        lastUpdate: "2024-12-15T10:30:00Z",
        license: "MIT",
        topics: ["react", "frontend", "javascript", "ui"],
        commits: 342,
        contributors: 12,
        issues: 15,
        pullRequests: 8,
        codeSize: "2.4 MB",
        weeklyActivity: [
          { day: "Mon", commits: 5 },
          { day: "Tue", commits: 8 },
          { day: "Wed", commits: 12 },
          { day: "Thu", commits: 6 },
          { day: "Fri", commits: 15 },
          { day: "Sat", commits: 3 },
          { day: "Sun", commits: 2 },
        ],
      });
    } catch (err) {
      setError("Failed to analyze repository. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const mockStats = [
    {
      title: "Total Commits",
      value: "342",
      icon: Code2,
      color: "blue",
      trend: "+12%",
    },
    {
      title: "Contributors",
      value: "12",
      icon: Users,
      color: "green",
      trend: "+2 this month",
    },
    {
      title: "Code Size",
      value: "2.4 MB",
      icon: TrendingUp,
      color: "purple",
      trend: "+0.3 MB",
    },
    {
      title: "Security Score",
      value: "85/100",
      icon: Shield,
      color: "orange",
      trend: "Good",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
          GitHub Repository
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {" "}
            Analyzer
          </span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Get comprehensive insights about any public GitHub repository. Analyze
          code quality, contributor activity, security metrics, and much more.
        </p>

        {/* Search Form */}
        <motion.form
          onSubmit={analyzeRepository}
          className="max-w-2xl mx-auto"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Github className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="url"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/owner/repository"
              className="block w-full pl-10 pr-32 py-4 text-lg border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-lg"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !repoUrl.trim()}
              className="absolute inset-y-0 right-0 px-6 py-2 m-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  <span>Analyze</span>
                </>
              )}
            </button>
          </div>
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm mt-2"
            >
              {error}
            </motion.p>
          )}
        </motion.form>
      </motion.div>

      {/* Results Section */}
      {repoData && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-8"
        >
          {/* Repository Overview */}
          <RepoCard data={repoData} />

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockStats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index }}
              >
                <StatsCard {...stat} />
              </motion.div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <LanguageChart data={repoData.languages} />
            </motion.div>
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <ActivityChart data={repoData.weeklyActivity} />
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Loading State */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div className="inline-flex items-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="text-lg text-gray-600">
              Analyzing repository...
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Home;
