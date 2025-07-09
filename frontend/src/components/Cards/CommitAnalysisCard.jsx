import { GitCommit, Info } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const CommitAnalysisCard = ({ commitPatterns }) => {
  if (!commitPatterns) return null;

  const formatRelativeTime = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "Unknown";
    }
  };

  const getMethodDescription = (method) => {
    const descriptions = {
      graphql: "GraphQL API (All Branches)",
      "all-branches": "All Branches Analysis",
      "enhanced-stats": "Enhanced Stats API",
      "smart-pagination": "Smart Pagination",
      stats: "GitHub Stats API",
      pagination: "Paginated API estimate",
      estimated: "Activity-based estimate",
      sampled: "Sampled data (incomplete)",
      provided: "Provided count",
      fallback: "Fallback method",
      error: "Analysis error",
    };
    return descriptions[method] || "Unknown method";
  };

  const getMethodConfidence = (method) => {
    const highConfidenceMethods = ["graphql", "all-branches"];
    return highConfidenceMethods.includes(method) ? "high" : "medium";
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
      <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
        <GitCommit className="w-5 h-5 text-green-600" />
        Commit Analysis
        {commitPatterns.isApproximate && (
          <div className="relative group">
            <Info className="w-4 h-4 text-green-600 cursor-help" />
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-50">
              <div className="bg-gray-900 text-white text-xs rounded-lg p-3 max-w-xs shadow-lg border border-gray-700">
                <div className="whitespace-pre-line">
                  {getMethodConfidence(commitPatterns.method) === "high"
                    ? "Comprehensive commit analysis completed using advanced methods."
                    : "Commit count may be approximate due to GitHub API limitations."}
                  Method: {getMethodDescription(commitPatterns.method)}
                  Confidence: {getMethodConfidence(commitPatterns.method)}
                  {getMethodConfidence(commitPatterns.method) === "high"
                    ? "This count includes commits from all branches and uses advanced API techniques."
                    : "The actual count on GitHub.com may be higher due to commits from merged repositories or different branches."}
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          </div>
        )}
      </h3>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/60 rounded-xl p-3">
            <div className="text-xl font-bold text-green-900">
              {commitPatterns.recent7Days}
            </div>
            <div className="text-sm text-green-700">Last 7 days</div>
          </div>
          <div className="bg-white/60 rounded-xl p-3">
            <div className="text-xl font-bold text-green-900">
              {commitPatterns.weeklyFrequency}
            </div>
            <div className="text-sm text-green-700">Weekly avg</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-green-700">Total Commits</span>
            <div className="flex items-center gap-1">
              {commitPatterns.isLoading ? (
                <span className="text-green-600 animate-pulse">
                  Analyzing...
                </span>
              ) : (
                <span className="font-semibold text-green-900">
                  {commitPatterns.total?.toLocaleString() || 0}
                  {commitPatterns.isApproximate && (
                    <span className="text-sm text-green-600 ml-1">≈</span>
                  )}
                </span>
              )}
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-green-700">Unique Authors</span>
            <span className="font-semibold text-green-900">
              {commitPatterns.uniqueAuthors}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-green-700">Commit Velocity</span>
            <span
              className={`font-semibold ${
                commitPatterns.commitVelocity === "High"
                  ? "text-green-900"
                  : commitPatterns.commitVelocity === "Medium"
                  ? "text-yellow-700"
                  : "text-red-700"
              }`}
            >
              {commitPatterns.commitVelocity}
            </span>
          </div>
          {commitPatterns.isApproximate && (
            <div className="flex justify-between pt-1 border-t border-green-200">
              <span className="text-green-600 text-sm">Count Method</span>
              <span className="text-green-800 text-sm font-medium flex items-center gap-1">
                {getMethodDescription(commitPatterns.method)}
                {getMethodConfidence(commitPatterns.method) === "high" && (
                  <span className="text-green-500 text-xs">✓</span>
                )}
              </span>
            </div>
          )}
        </div>

        {commitPatterns.mostRecentCommit && (
          <div className="bg-white/60 rounded-xl p-3">
            <div className="text-sm text-green-700 mb-1">Latest Commit</div>
            <div className="font-medium text-green-900 text-sm">
              {commitPatterns.mostRecentCommit.commit.message
                .split("\n")[0]
                .substring(0, 50)}
              ...
            </div>
            <div className="text-xs text-green-600 mt-1">
              {formatRelativeTime(
                commitPatterns.mostRecentCommit.commit.author.date
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommitAnalysisCard;
