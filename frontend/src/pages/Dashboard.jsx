import { useState, useEffect } from "react";
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
  TrendingUp,
  BarChart3,
  Activity,
  Clock,
  Filter,
  SortAsc,
  Grid,
  List,
} from "lucide-react";

const Dashboard = () => {
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("updated");
  const [viewMode, setViewMode] = useState("grid");
  const [filterBy, setFilterBy] = useState("all");

  // Mock data for demonstration
  const mockRepositories = [
    {
      id: 1,
      name: "awesome-react-components",
      full_name: "user/awesome-react-components",
      description:
        "A collection of awesome React components for modern web applications",
      language: "JavaScript",
      stargazers_count: 1250,
      forks_count: 180,
      watchers_count: 95,
      updated_at: "2024-01-15T10:30:00Z",
      topics: ["react", "components", "ui", "frontend"],
      private: false,
      html_url: "https://github.com/user/awesome-react-components",
    },
    {
      id: 2,
      name: "ml-dataset-analyzer",
      full_name: "user/ml-dataset-analyzer",
      description:
        "Python toolkit for analyzing and preprocessing machine learning datasets",
      language: "Python",
      stargazers_count: 890,
      forks_count: 120,
      watchers_count: 65,
      updated_at: "2024-01-12T14:20:00Z",
      topics: ["python", "machine-learning", "data-science", "analysis"],
      private: false,
      html_url: "https://github.com/user/ml-dataset-analyzer",
    },
    {
      id: 3,
      name: "api-gateway-service",
      full_name: "user/api-gateway-service",
      description: "Microservices API gateway built with Node.js and Express",
      language: "TypeScript",
      stargazers_count: 456,
      forks_count: 78,
      watchers_count: 32,
      updated_at: "2024-01-10T09:15:00Z",
      topics: ["nodejs", "typescript", "api", "microservices"],
      private: true,
      html_url: "https://github.com/user/api-gateway-service",
    },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setRepositories(mockRepositories);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredRepositories = repositories
    .filter((repo) => {
      const matchesSearch =
        repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        repo.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        filterBy === "all" ||
        (filterBy === "public" && !repo.private) ||
        (filterBy === "private" && repo.private) ||
        (filterBy === "starred" && repo.stargazers_count > 500);

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "stars":
          return b.stargazers_count - a.stargazers_count;
        case "updated":
          return new Date(b.updated_at) - new Date(a.updated_at);
        case "forks":
          return b.forks_count - a.forks_count;
        default:
          return 0;
      }
    });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  const RepoCard = ({ repo }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 hover:shadow-lg transition-all duration-200 hover:border-blue-300"
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3 sm:mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2 truncate">
            {repo.name}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {repo.description || "No description available"}
          </p>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {repo.private && (
            <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
              Private
            </span>
          )}
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
            {repo.language || "Unknown"}
          </span>
        </div>
      </div>

      {/* Topics */}
      {repo.topics && repo.topics.length > 0 && (
        <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
          {repo.topics.slice(0, 4).map((topic, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
            >
              {topic}
            </span>
          ))}
          {repo.topics.length > 4 && (
            <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded text-xs">
              +{repo.topics.length - 4}
            </span>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>{repo.stargazers_count.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <GitFork className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>{repo.forks_count.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>{repo.watchers_count.toLocaleString()}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-right">
          <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>{formatDate(repo.updated_at)}</span>
        </div>
      </div>
    </motion.div>
  );

  const RepoListItem = ({ repo }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200 hover:shadow-md transition-all duration-200"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
              {repo.name}
            </h3>
            <div className="flex items-center gap-2 flex-shrink-0">
              {repo.private && (
                <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-xs">
                  Private
                </span>
              )}
              <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">
                {repo.language || "Unknown"}
              </span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 line-clamp-1">
            {repo.description || "No description available"}
          </p>
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 flex-shrink-0">
          <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{repo.stargazers_count.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <GitFork className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{repo.forks_count.toLocaleString()}</span>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            {formatDate(repo.updated_at)}
          </div>
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12">
        <div className="animate-pulse">
          <div className="h-8 sm:h-10 bg-gray-200 rounded w-1/3 mb-6 sm:mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-48 sm:h-56 bg-gray-200 rounded-xl"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Repository Dashboard
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Manage and explore your analyzed repositories
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search repositories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            {/* Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="pl-10 pr-8 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none bg-white min-w-0 w-full sm:w-auto"
              >
                <option value="all">All Repos</option>
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="starred">Popular</option>
              </select>
            </div>

            {/* Sort */}
            <div className="relative">
              <SortAsc className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-10 pr-8 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none bg-white min-w-0 w-full sm:w-auto"
              >
                <option value="updated">Recently Updated</option>
                <option value="name">Name</option>
                <option value="stars">Most Stars</option>
                <option value="forks">Most Forks</option>
              </select>
            </div>

            {/* View Mode */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-2 sm:py-3 flex items-center justify-center transition-colors text-sm ${
                  viewMode === "grid"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-2 sm:py-3 flex items-center justify-center transition-colors text-sm border-l border-gray-300 ${
                  viewMode === "list"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 sm:p-4 rounded-lg">
          <div className="flex items-center gap-2 sm:gap-3">
            <Github className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            <div>
              <div className="text-lg sm:text-2xl font-bold text-blue-900">
                {repositories.length}
              </div>
              <div className="text-xs sm:text-sm text-blue-700">
                Repositories
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 sm:p-4 rounded-lg">
          <div className="flex items-center gap-2 sm:gap-3">
            <Star className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            <div>
              <div className="text-lg sm:text-2xl font-bold text-green-900">
                {repositories
                  .reduce((sum, repo) => sum + repo.stargazers_count, 0)
                  .toLocaleString()}
              </div>
              <div className="text-xs sm:text-sm text-green-700">
                Total Stars
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 sm:p-4 rounded-lg">
          <div className="flex items-center gap-2 sm:gap-3">
            <GitFork className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            <div>
              <div className="text-lg sm:text-2xl font-bold text-purple-900">
                {repositories
                  .reduce((sum, repo) => sum + repo.forks_count, 0)
                  .toLocaleString()}
              </div>
              <div className="text-xs sm:text-sm text-purple-700">
                Total Forks
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-3 sm:p-4 rounded-lg">
          <div className="flex items-center gap-2 sm:gap-3">
            <Code2 className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
            <div>
              <div className="text-lg sm:text-2xl font-bold text-orange-900">
                {
                  new Set(
                    repositories.map((repo) => repo.language).filter(Boolean)
                  ).size
                }
              </div>
              <div className="text-xs sm:text-sm text-orange-700">
                Languages
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            {filteredRepositories.length} Repositories
          </h2>
        </div>

        {filteredRepositories.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <Github className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">
              No repositories found
            </h3>
            <p className="text-sm sm:text-base text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                : "space-y-3 sm:space-y-4"
            }
          >
            {filteredRepositories.map((repo) =>
              viewMode === "grid" ? (
                <RepoCard key={repo.id} repo={repo} />
              ) : (
                <RepoListItem key={repo.id} repo={repo} />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
