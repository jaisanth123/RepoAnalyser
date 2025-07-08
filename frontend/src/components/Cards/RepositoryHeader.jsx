import { motion } from "framer-motion";
import {
  Star,
  GitFork,
  Eye,
  Calendar,
  GitCommit,
  Activity,
  ExternalLink,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

const RepositoryHeader = ({
  repository,
  health,
  activity,
  commitPatterns,
  isLoadingCommits,
  hasMoreCommits,
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

  return (
    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 p-3 sm:p-4 md:p-6 text-white">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 sm:mb-6 gap-3 sm:gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold truncate">
              {repository.full_name}
            </h2>
            <div className="flex items-center gap-2 flex-shrink-0">
              <health.icon className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300" />
              <span className="px-2 sm:px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs sm:text-sm font-medium">
                {health.level}
              </span>
            </div>
          </div>
          <p className="text-indigo-100 mb-3 leading-relaxed text-sm sm:text-base">
            {repository.description || "No description available"}
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-indigo-200">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span>Created {formatDate(repository.created_at)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Activity className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span>Updated {formatRelativeTime(repository.updated_at)}</span>
            </div>
          </div>
        </div>

        <motion.a
          href={repository.html_url}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors backdrop-blur-sm self-start flex-shrink-0"
        >
          <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
        </motion.a>
      </div>

      {/* Premium Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4">
          <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
            <GitCommit className="w-4 h-4 sm:w-5 sm:h-5 text-orange-300 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium">Commits</span>
            {isLoadingCommits && (
              <div className="w-2 h-2 sm:w-3 sm:h-3 border-2 border-orange-300 border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
            )}
          </div>
          <div className="text-lg sm:text-xl lg:text-2xl font-bold">
            {commitPatterns?.total?.toLocaleString() || 0}
            {hasMoreCommits && (
              <span className="text-sm sm:text-lg text-orange-200">+</span>
            )}
          </div>
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
