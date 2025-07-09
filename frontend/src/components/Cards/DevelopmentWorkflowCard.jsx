import {
  GitMerge,
  GitPullRequest,
  GitCommit,
  GitBranch,
  Tag,
  UserPlus,
  Download,
  Info,
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

          <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg relative group">
            <div className="flex items-center gap-2">
              <GitCommit className="w-4 h-4 text-orange-600" />
              <span className="text-sm text-orange-800">Total Commits</span>
              {isLoadingCommits && (
                <div className="w-3 h-3 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
              )}
              {commitPatterns?.isApproximate && (
                <div className="relative">
                  <Info className="w-3 h-3 text-orange-600 cursor-help" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-50">
                    <div className="bg-gray-900 text-white text-xs rounded-lg p-3 max-w-xs shadow-lg border border-gray-700">
                      <div className="whitespace-pre-line">
                        Commit count is approximate due to GitHub API
                        limitations. The actual count on GitHub.com may be
                        higher.
                      </div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <span className="text-xs font-medium text-orange-900 bg-orange-100 px-2 py-1 rounded">
              {isLoadingCommits ? (
                <span className="text-orange-600 animate-pulse">Analyzing...</span>
              ) : (
                <>
              {commitPatterns?.total?.toLocaleString() || 0}
              {hasMoreCommits && <span className="text-orange-600">+</span>}
                  {commitPatterns?.isApproximate && (
                    <span className="text-orange-600 ml-1">≈</span>
                  )}
                </>
              )}
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

        {/* Workflow Quality Indicators */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-orange-700">PR Merge Rate</span>
            <span className="font-semibold text-orange-900">
              {projectInsights.pullRequests.mergeRate}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-orange-700">Issue Resolution</span>
            <span className="font-semibold text-orange-900">
              {projectInsights.issues.resolutionRate}%
            </span>
          </div>
        </div>

        {/* Additional Workflow Info */}
        <div className="bg-white/60 rounded-xl p-3">
          <div className="text-sm text-orange-700 mb-2">
            Development Activity
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-orange-600">Recent commits (7d)</span>
              <span className="text-orange-800 font-medium">
                {commitPatterns?.recent7Days || 0}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-orange-600">Weekly frequency</span>
              <span className="text-orange-800 font-medium">
                {commitPatterns?.weeklyFrequency || 0}
            </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevelopmentWorkflowCard;
