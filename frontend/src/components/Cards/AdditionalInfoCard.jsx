import {
  Sparkles,
  GitBranch,
  MessageCircle,
  Star,
  Shield,
  Eye,
  Calendar,
  Download,
  Globe,
  UserPlus,
  Code,
} from "lucide-react";
import { format } from "date-fns";

const AdditionalInfoCard = ({ repository }) => {
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

  return (
    <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-teal-200 mb-4 sm:mb-6">
      <h3 className="text-base sm:text-lg font-bold text-teal-900 mb-4 sm:mb-6 flex items-center gap-2">
        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" />
        Additional Repository Information
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
        <div className="flex flex-col items-center text-center p-3 sm:p-4 bg-white/60 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <GitBranch className="w-3 h-3 sm:w-4 sm:h-4 text-teal-600" />
            <span className="text-xs sm:text-sm text-teal-800 font-medium">
              Default Branch
            </span>
          </div>
          <span className="text-xs font-medium text-teal-900 bg-teal-100 px-2 py-1 rounded">
            {repository.default_branch || "main"}
          </span>
        </div>

        <div className="flex flex-col items-center text-center p-3 sm:p-4 bg-white/60 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 text-teal-600" />
            <span className="text-xs sm:text-sm text-teal-800 font-medium">
              Discussions
            </span>
          </div>
          <span
            className={`text-xs font-medium px-2 py-1 rounded ${
              repository.has_discussions
                ? "text-green-900 bg-green-100"
                : "text-gray-900 bg-gray-100"
            }`}
          >
            {repository.has_discussions ? "Active" : "Disabled"}
          </span>
        </div>

        <div className="flex flex-col items-center text-center p-3 sm:p-4 bg-white/60 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-teal-600" />
            <span className="text-xs sm:text-sm text-teal-800 font-medium">
              Stargazers
            </span>
          </div>
          <span className="text-xs font-medium text-teal-900 bg-teal-100 px-2 py-1 rounded">
            {repository.stargazers_count.toLocaleString()}
          </span>
        </div>

        <div className="flex flex-col items-center text-center p-3 sm:p-4 bg-white/60 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-teal-600" />
            <span className="text-xs sm:text-sm text-teal-800 font-medium">
              License
            </span>
          </div>
          <span className="text-xs font-medium text-teal-900 bg-teal-100 px-2 py-1 rounded text-center truncate max-w-full">
            {repository.license
              ? formatLicense(repository.license)
              : "No License"}
          </span>
        </div>

        <div className="flex flex-col items-center text-center p-3 sm:p-4 bg-white/60 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-teal-600" />
            <span className="text-xs sm:text-sm text-teal-800 font-medium">
              Visibility
            </span>
          </div>
          <span
            className={`text-xs font-medium px-2 py-1 rounded ${
              repository.private
                ? "text-red-900 bg-red-100"
                : "text-green-900 bg-green-100"
            }`}
          >
            {repository.private ? "Private" : "Public"}
          </span>
        </div>

        <div className="flex flex-col items-center text-center p-3 sm:p-4 bg-white/60 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-teal-600" />
            <span className="text-xs sm:text-sm text-teal-800 font-medium">
              Created
            </span>
          </div>
          <span className="text-xs font-medium text-teal-900 bg-teal-100 px-2 py-1 rounded">
            {formatDate(repository.created_at)}
          </span>
        </div>

        <div className="flex flex-col items-center text-center p-3 sm:p-4 bg-white/60 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Download className="w-3 h-3 sm:w-4 sm:h-4 text-teal-600" />
            <span className="text-xs sm:text-sm text-teal-800 font-medium">
              Size
            </span>
          </div>
          <span className="text-xs font-medium text-teal-900 bg-teal-100 px-2 py-1 rounded">
            {(repository.size / 1024).toFixed(1)} MB
          </span>
        </div>

        <div className="flex flex-col items-center text-center p-3 sm:p-4 bg-white/60 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-teal-600" />
            <span className="text-xs sm:text-sm text-teal-800 font-medium">
              Homepage
            </span>
          </div>
          <span className="text-xs font-medium text-teal-900 bg-teal-100 px-2 py-1 rounded">
            {repository.homepage ? "Available" : "None"}
          </span>
        </div>

        <div className="flex flex-col items-center text-center p-3 sm:p-4 bg-white/60 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <UserPlus className="w-3 h-3 sm:w-4 sm:h-4 text-teal-600" />
            <span className="text-xs sm:text-sm text-teal-800 font-medium">
              Allow Forking
            </span>
          </div>
          <span
            className={`text-xs font-medium px-2 py-1 rounded ${
              repository.allow_forking
                ? "text-green-900 bg-green-100"
                : "text-red-900 bg-red-100"
            }`}
          >
            {repository.allow_forking ? "Enabled" : "Disabled"}
          </span>
        </div>

        <div className="flex flex-col items-center text-center p-3 sm:p-4 bg-white/60 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Code className="w-3 h-3 sm:w-4 sm:h-4 text-teal-600" />
            <span className="text-xs sm:text-sm text-teal-800 font-medium">
              Main Language
            </span>
          </div>
          <span className="text-xs font-medium text-teal-900 bg-teal-100 px-2 py-1 rounded">
            {repository.language || "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdditionalInfoCard;
