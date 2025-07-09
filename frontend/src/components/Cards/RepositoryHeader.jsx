import { motion } from "framer-motion";
import {
  Star,
  GitFork,
  Eye,
  Calendar,
  GitCommit,
  Activity,
  ExternalLink,
  Info,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

const RepositoryHeader = ({
  repository,
  health,
  activity,
  commitPatterns,
  isLoadingCommits,
  hasMoreCommits,
  commitCountProgress, // Add this prop
}) => {
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return "Unknown";
    }
  };

  const formatRelativeTime = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "Unknown";
    }
  };

  const getCommitCountTooltip = () => {
    if (!commitPatterns?.isApproximate) {
      return "Total commits in this repository";
    }

    const methodDescriptions = {
      graphql: "Count from GitHub GraphQL API (includes all branches)",
      "all-branches": "Comprehensive count across all branches",
      "enhanced-stats": "Enhanced GitHub Stats API with retry logic",
      "smart-pagination": "Advanced pagination analysis",
      stats:
        "Count from GitHub Stats API (may not include all branches/commits)",
      pagination: "Count from GitHub Commits API (paginated estimate)",
      estimated: "Estimated count based on repository activity",
      sampled: "Based on sampled commit data (likely incomplete)",
      fallback: "Fallback count (likely incomplete)",
      error: "Error occurred during counting",
    };

    return `${methodDescriptions[commitPatterns.method] || "Approximate count"}.

Note: GitHub's API has limitations and may not include all commits from merged repositories, different branches, or certain commit types. This analysis attempts to overcome those limitations by using multiple methods.`;
  };

  const getMethodDisplayName = (method) => {
    const displayNames = {
      graphql: "GraphQL API",
      "all-branches": "All Branches",
      "enhanced-stats": "Enhanced Stats",
      "smart-pagination": "Smart Analysis",
      stats: "API Count",
      pagination: "Estimated",
      estimated: "Estimated",
      sampled: "Sampled",
      fallback: "Fallback",
      error: "Error",
    };
    return displayNames[method] || method;
  };

  return (
    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 p-3 sm:p-4 md:p-6 text-white">
      {/* Header Content */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold truncate">
              {repository.name}
            </h1>
            <motion.a
              href={repository.html_url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              className="p-1.5 sm:p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
            >
              <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.a>
          </div>
          {repository.description && (
            <p className="text-sm sm:text-base text-gray-300 mb-3 sm:mb-4 line-clamp-2">
              {repository.description}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              Created {formatDate(repository.created_at)}
            </span>
            <span className="flex items-center gap-1">
              <Activity className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              Updated {formatRelativeTime(repository.updated_at)}
            </span>
          </div>
        </div>

        {/* Health Badge */}
        <div className="flex-shrink-0">
          <div
            className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium bg-${health.color}-500/20 text-${health.color}-200 border border-${health.color}-500/30`}
          >
            <health.icon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span>{health.level}</span>
            <span className="text-xs opacity-75">({health.score}%)</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 relative group">
          <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
            <GitCommit className="w-4 h-4 sm:w-5 sm:h-5 text-orange-300 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium">Commits</span>
            {isLoadingCommits && (
              <div className="w-2 h-2 sm:w-3 sm:h-3 border-2 border-orange-300 border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
            )}
            {commitPatterns?.isApproximate && (
              <div className="relative">
                <Info className="w-3 h-3 text-orange-200 cursor-help" />
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-50">
                  <div className="bg-gray-900 text-white text-xs rounded-lg p-3 max-w-xs shadow-lg border border-gray-700">
                    <div className="whitespace-pre-line">
                      {getCommitCountTooltip()}
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="text-lg sm:text-xl lg:text-2xl font-bold">
            {isLoadingCommits ? (
              <span className="text-orange-200 animate-pulse">
                Analyzing...
              </span>
            ) : (
              <>
                {commitPatterns?.total?.toLocaleString() || 0}
                {hasMoreCommits && (
                  <span className="text-sm sm:text-lg text-orange-200">+</span>
                )}
                {commitPatterns?.isApproximate && (
                  <span className="text-xs sm:text-sm text-orange-200 ml-1">
                    ≈
                  </span>
                )}
              </>
            )}
          </div>
          {/* Progress indicator */}
          {isLoadingCommits && commitCountProgress && (
            <div className="text-xs text-orange-200 mt-1 opacity-75 animate-pulse">
              {commitCountProgress}
            </div>
          )}
          {/* Method indicator */}
          {commitPatterns?.isApproximate && !isLoadingCommits && (
            <div className="text-xs text-orange-200 mt-1 opacity-75">
              {getMethodDisplayName(commitPatterns.method)}
              {commitPatterns.method === "graphql" ||
              commitPatterns.method === "all-branches" ? (
                <span className="text-green-200 ml-1">✓</span>
              ) : (
                ""
              )}
            </div>
          )}
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4">
          <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
            <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium">Stars</span>
          </div>
          <div className="text-lg sm:text-xl lg:text-2xl font-bold">
            {repository.stargazers_count?.toLocaleString() || 0}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4">
          <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
            <GitFork className="w-4 h-4 sm:w-5 sm:h-5 text-blue-300 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium">Forks</span>
          </div>
          <div className="text-lg sm:text-xl lg:text-2xl font-bold">
            {repository.forks_count?.toLocaleString() || 0}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4">
          <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
            <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-green-300 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium">Watchers</span>
          </div>
          <div className="text-lg sm:text-xl lg:text-2xl font-bold">
            {repository.watchers_count?.toLocaleString() || 0}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 col-span-2 sm:col-span-1">
          <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
            <activity.icon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-300 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium">Activity</span>
          </div>
          <div className="text-sm sm:text-base font-bold">{activity.level}</div>
        </div>
      </div>
    </div>
  );
};

export default RepositoryHeader;
