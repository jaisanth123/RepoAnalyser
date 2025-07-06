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
    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 p-6 text-white">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold">{repository.full_name}</h2>
            <div className="flex items-center gap-2">
              <health.icon className="w-5 h-5 text-yellow-300" />
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                {health.level}
              </span>
            </div>
          </div>
          <p className="text-indigo-100 mb-3 leading-relaxed">
            {repository.description || "No description available"}
          </p>
          <div className="flex items-center gap-4 text-sm text-indigo-200">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Created {formatDate(repository.created_at)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Activity className="w-4 h-4" />
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
          className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors backdrop-blur-sm"
        >
          <ExternalLink className="w-5 h-5" />
        </motion.a>
      </div>

      {/* Premium Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <GitCommit className="w-5 h-5 text-orange-300" />
            <span className="text-sm font-medium">Commits</span>
            {isLoadingCommits && (
              <div className="w-3 h-3 border-2 border-orange-300 border-t-transparent rounded-full animate-spin"></div>
            )}
          </div>
          <div className="text-2xl font-bold">
            {commitPatterns?.total?.toLocaleString() || 0}
            {hasMoreCommits && (
              <span className="text-lg text-orange-200">+</span>
            )}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5 text-yellow-300" />
            <span className="text-sm font-medium">Stars</span>
          </div>
          <div className="text-2xl font-bold">
            {repository.stargazers_count?.toLocaleString() || 0}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <GitFork className="w-5 h-5 text-blue-300" />
            <span className="text-sm font-medium">Forks</span>
          </div>
          <div className="text-2xl font-bold">
            {repository.forks_count?.toLocaleString() || 0}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-5 h-5 text-green-300" />
            <span className="text-sm font-medium">Watchers</span>
          </div>
          <div className="text-2xl font-bold">
            {repository.watchers_count?.toLocaleString() || 0}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <activity.icon className="w-5 h-5 text-purple-300" />
            <span className="text-sm font-medium">Activity</span>
          </div>
          <div className="text-sm font-bold">{activity.level}</div>
        </div>
      </div>
    </div>
  );
};

export default RepositoryHeader;
