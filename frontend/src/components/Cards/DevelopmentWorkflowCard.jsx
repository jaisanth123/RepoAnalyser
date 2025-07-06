import {
  GitMerge,
  GitPullRequest,
  GitCommit,
  GitBranch,
  Tag,
  UserPlus,
  Download,
} from "lucide-react";

const DevelopmentWorkflowCard = ({
  repository,
  projectInsights,
  commitPatterns,
  isLoadingCommits,
  hasMoreCommits,
}) => {
  return (
    <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-6 border border-orange-200">
      <h3 className="text-lg font-bold text-orange-900 mb-4 flex items-center gap-2">
        <GitMerge className="w-5 h-5 text-orange-600" />
        Development Workflow
      </h3>

      <div className="space-y-4">
        {/* Development Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
            <div className="flex items-center gap-2">
              <GitPullRequest className="w-4 h-4 text-orange-600" />
              <span className="text-sm text-orange-800">Pull Requests</span>
            </div>
            <span className="text-xs font-medium text-orange-900 bg-orange-100 px-2 py-1 rounded">
              {projectInsights.pullRequests.total}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
            <div className="flex items-center gap-2">
              <GitCommit className="w-4 h-4 text-orange-600" />
              <span className="text-sm text-orange-800">Total Commits</span>
              {isLoadingCommits && (
                <div className="w-3 h-3 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
              )}
            </div>
            <span className="text-xs font-medium text-orange-900 bg-orange-100 px-2 py-1 rounded">
              {commitPatterns?.total?.toLocaleString() || 0}
              {hasMoreCommits && <span className="text-orange-600">+</span>}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-orange-600" />
              <span className="text-sm text-orange-800">Branches</span>
            </div>
            <span className="text-xs font-medium text-orange-900 bg-orange-100 px-2 py-1 rounded">
              {projectInsights.branches}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-orange-600" />
              <span className="text-sm text-orange-800">Releases</span>
            </div>
            <span className="text-xs font-medium text-orange-900 bg-orange-100 px-2 py-1 rounded">
              {projectInsights.releases}
            </span>
          </div>
        </div>

        {/* Repository Quality Score */}
        <div className="bg-white/60 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-orange-800 font-medium">
              Repository Quality
            </span>
            <span className="text-sm font-bold text-orange-900">
              {Math.round(
                (((repository.has_issues ? 1 : 0) +
                  (repository.has_wiki ? 1 : 0) +
                  (repository.has_pages ? 1 : 0) +
                  (repository.license ? 1 : 0) +
                  (repository.description ? 1 : 0) +
                  (repository.topics && repository.topics.length > 0 ? 1 : 0)) /
                  6) *
                  100
              )}
              %
            </span>
          </div>
          <div className="w-full bg-orange-200 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500"
              style={{
                width: `${Math.round(
                  (((repository.has_issues ? 1 : 0) +
                    (repository.has_wiki ? 1 : 0) +
                    (repository.has_pages ? 1 : 0) +
                    (repository.license ? 1 : 0) +
                    (repository.description ? 1 : 0) +
                    (repository.topics && repository.topics.length > 0
                      ? 1
                      : 0)) /
                    6) *
                    100
                )}%`,
              }}
            />
          </div>
        </div>

        {/* Community Info */}
        <div className="space-y-2">
          <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg">
            <div className="flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-orange-600" />
              <span className="text-sm text-orange-800">Allow Forking</span>
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

          <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg">
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-orange-600" />
              <span className="text-sm text-orange-800">Size</span>
            </div>
            <span className="text-xs font-medium text-orange-900 bg-orange-100 px-2 py-1 rounded">
              {(repository.size / 1024).toFixed(1)} MB
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevelopmentWorkflowCard;
