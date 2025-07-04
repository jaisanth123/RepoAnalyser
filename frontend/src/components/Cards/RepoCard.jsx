import { motion } from "framer-motion";
import {
  Star,
  GitFork,
  Eye,
  Calendar,
  FileText,
  Tag,
  ExternalLink,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const RepoCard = ({ data }) => {
  const {
    name,
    owner,
    description,
    stars,
    forks,
    watchers,
    language,
    lastUpdate,
    license,
    topics,
  } = data;

  const lastUpdateFormatted = formatDistanceToNow(new Date(lastUpdate), {
    addSuffix: true,
  });

  const getLanguageColor = (lang) => {
    const colors = {
      JavaScript: "bg-yellow-400",
      TypeScript: "bg-blue-500",
      Python: "bg-green-500",
      Java: "bg-orange-500",
      "C++": "bg-pink-500",
      Go: "bg-cyan-500",
      Rust: "bg-orange-600",
      default: "bg-gray-500",
    };
    return colors[lang] || colors.default;
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
    >
      <div className="p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-2xl font-bold text-gray-900">
                {owner}/{name}
              </h2>
              <a
                href={`https://github.com/${owner}/${name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-600 transition-colors"
              >
                <ExternalLink className="h-5 w-5" />
              </a>
            </div>
            <p className="text-gray-600 text-lg leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-yellow-500 mb-1">
              <Star className="h-4 w-4" />
              <span className="font-semibold text-gray-900">
                {stars.toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-gray-500">Stars</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-blue-500 mb-1">
              <GitFork className="h-4 w-4" />
              <span className="font-semibold text-gray-900">
                {forks.toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-gray-500">Forks</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-green-500 mb-1">
              <Eye className="h-4 w-4" />
              <span className="font-semibold text-gray-900">
                {watchers.toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-gray-500">Watchers</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-purple-500 mb-1">
              <Calendar className="h-4 w-4" />
              <span className="font-semibold text-gray-900 text-xs">
                {lastUpdateFormatted}
              </span>
            </div>
            <p className="text-sm text-gray-500">Updated</p>
          </div>
        </div>

        {/* Language and License */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${getLanguageColor(language)}`}
            ></div>
            <span className="text-sm font-medium text-gray-700">
              {language}
            </span>
          </div>

          <div className="flex items-center space-x-1 text-gray-600">
            <FileText className="h-4 w-4" />
            <span className="text-sm">{license}</span>
          </div>
        </div>

        {/* Topics */}
        <div className="flex flex-wrap gap-2">
          {topics.map((topic, index) => (
            <motion.span
              key={topic}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors cursor-pointer"
            >
              <Tag className="h-3 w-3 mr-1" />
              {topic}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default RepoCard;
