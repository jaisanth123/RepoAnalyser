import {
  CheckCircle,
  Bug,
  BookOpen,
  Globe,
  Target,
  Shield,
  Eye,
} from "lucide-react";

const CoreFeaturesCard = ({ repository }) => {
  const formatLicense = (license) => {
    if (!license) return "No License";
    return license.name || license.spdx_id || "Unknown License";
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200">
      <h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center gap-2">
        <CheckCircle className="w-5 h-5 text-indigo-600" />
        Core Features
      </h3>

      <div className="space-y-4">
        {/* Core Features Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
            <div className="flex items-center gap-2">
              <Bug className="w-4 h-4 text-indigo-600" />
              <span className="text-sm text-indigo-800">Issues</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  repository.has_issues ? "bg-green-500" : "bg-gray-300"
                }`}
              />
              <span className="text-xs text-indigo-700">
                {repository.has_issues
                  ? `${repository.open_issues_count} open`
                  : "Disabled"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span className="text-sm text-indigo-800">Wiki</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  repository.has_wiki ? "bg-green-500" : "bg-gray-300"
                }`}
              />
              <span className="text-xs text-indigo-700">
                {repository.has_wiki ? "Available" : "Disabled"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-600" />
              <span className="text-sm text-indigo-800">Pages</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  repository.has_pages ? "bg-green-500" : "bg-gray-300"
                }`}
              />
              <span className="text-xs text-indigo-700">
                {repository.has_pages ? "Deployed" : "Disabled"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-600" />
              <span className="text-sm text-indigo-800">Projects</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  repository.has_projects ? "bg-green-500" : "bg-gray-300"
                }`}
              />
              <span className="text-xs text-indigo-700">
                {repository.has_projects ? "Active" : "Disabled"}
              </span>
            </div>
          </div>
        </div>

        {/* Repository Information */}
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-600" />
              <span className="text-sm text-indigo-800">License</span>
            </div>
            <span className="text-xs font-medium text-indigo-900 bg-indigo-100 px-2 py-1 rounded">
              {repository.license
                ? formatLicense(repository.license)
                : "No License"}
            </span>
          </div>

          <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-indigo-600" />
              <span className="text-sm text-indigo-800">Visibility</span>
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
        </div>
      </div>
    </div>
  );
};

export default CoreFeaturesCard;
