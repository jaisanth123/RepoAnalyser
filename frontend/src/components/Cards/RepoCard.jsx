import { motion } from "framer-motion";
import {
  Star,
  GitFork,
  Eye,
  Calendar,
  FileText,
  Tag,
  ExternalLink,
  Users,
} from "lucide-react";
import { format } from "date-fns";

const RepoCard = ({ repository }) => {
  if (!repository) return null;

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return "Unknown";
    }
  };

  const formatLicense = (license) => {
    if (!license) return "No License";
    return license.name || license.spdx_id || "Unknown License";
  };

  const getLanguageColor = (language) => {
    const colors = {
      JavaScript: "#f7df1e",
      TypeScript: "#3178c6",
      Python: "#3776ab",
      Java: "#ed8b00",
      "C++": "#00599c",
      "C#": "#239120",
      PHP: "#777bb4",
      Ruby: "#cc342d",
      Go: "#00add8",
      Rust: "#dea584",
      Swift: "#fa7343",
      Kotlin: "#7f52ff",
      HTML: "#e34c26",
      CSS: "#1572b6",
      Vue: "#4fc08d",
      React: "#61dafb",
    };
    return colors[language] || "#6b7280";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg"
    >
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Repository Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {repository.full_name}
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                {repository.description || "No description available"}
              </p>
            </div>

            <motion.a
              href={repository.html_url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors border border-gray-300"
            >
              <ExternalLink className="w-5 h-5 text-gray-600" />
            </motion.a>
          </div>

          {/* Repository Stats */}
          <div className="flex flex-wrap gap-6 mb-6">
            <div className="flex items-center gap-2 text-gray-700">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="font-medium">
                {repository.stargazers_count?.toLocaleString() || 0}
              </span>
              <span className="text-sm">stars</span>
            </div>

            <div className="flex items-center gap-2 text-gray-700">
              <GitFork className="w-5 h-5 text-blue-500" />
              <span className="font-medium">
                {repository.forks_count?.toLocaleString() || 0}
              </span>
              <span className="text-sm">forks</span>
            </div>

            <div className="flex items-center gap-2 text-gray-700">
              <Eye className="w-5 h-5 text-green-500" />
              <span className="font-medium">
                {repository.watchers_count?.toLocaleString() || 0}
              </span>
              <span className="text-sm">watchers</span>
            </div>

            {repository.open_issues_count !== undefined && (
              <div className="flex items-center gap-2 text-gray-700">
                <Users className="w-5 h-5 text-orange-500" />
                <span className="font-medium">
                  {repository.open_issues_count}
                </span>
                <span className="text-sm">open issues</span>
              </div>
            )}
          </div>

          {/* Repository Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {repository.language && (
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{
                    backgroundColor: getLanguageColor(repository.language),
                  }}
                />
                <span className="text-gray-700">{repository.language}</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-gray-700">
              <FileText className="w-4 h-4" />
              <span>{formatLicense(repository.license)}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-700">
              <Calendar className="w-4 h-4" />
              <span>Created {formatDate(repository.created_at)}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-700">
              <Calendar className="w-4 h-4" />
              <span>Updated {formatDate(repository.updated_at)}</span>
            </div>
          </div>

          {/* Topics */}
          {repository.topics && repository.topics.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-600 font-medium">
                  Topics
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {repository.topics.slice(0, 8).map((topic, index) => (
                  <motion.span
                    key={topic}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm border border-blue-200"
                  >
                    {topic}
                  </motion.span>
                ))}
                {repository.topics.length > 8 && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    +{repository.topics.length - 8} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Repository Metadata */}
        <div className="lg:w-80">
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Repository Info
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Size</span>
                <span className="text-gray-900">
                  {(repository.size / 1024).toFixed(1)} MB
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Default Branch</span>
                <span className="text-gray-900">
                  {repository.default_branch || "main"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Visibility</span>
                <span
                  className={`text-gray-900 ${
                    repository.private ? "text-orange-600" : "text-green-600"
                  }`}
                >
                  {repository.private ? "Private" : "Public"}
                </span>
              </div>

              {repository.archived && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className="text-yellow-600">Archived</span>
                </div>
              )}

              {repository.disabled && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className="text-red-600">Disabled</span>
                </div>
              )}

              {repository.fork && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Type</span>
                  <span className="text-blue-600">Fork</span>
                </div>
              )}

              {repository.has_issues !== undefined && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Issues</span>
                  <span
                    className={
                      repository.has_issues ? "text-green-600" : "text-gray-600"
                    }
                  >
                    {repository.has_issues ? "Enabled" : "Disabled"}
                  </span>
                </div>
              )}

              {repository.has_wiki !== undefined && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Wiki</span>
                  <span
                    className={
                      repository.has_wiki ? "text-green-600" : "text-gray-600"
                    }
                  >
                    {repository.has_wiki ? "Enabled" : "Disabled"}
                  </span>
                </div>
              )}
            </div>

            {/* Owner Info */}
            {repository.owner && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-600 mb-3">
                  Owner
                </h4>
                <div className="flex items-center gap-3">
                  <img
                    src={repository.owner.avatar_url}
                    alt={repository.owner.login}
                    className="w-10 h-10 rounded-full border-2 border-gray-300"
                  />
                  <div>
                    <div className="font-medium text-gray-900">
                      {repository.owner.login}
                    </div>
                    <div className="text-sm text-gray-600 capitalize">
                      {repository.owner.type}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RepoCard;
