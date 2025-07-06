import { GitCommit } from "lucide-react";
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

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
      <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
        <GitCommit className="w-5 h-5 text-green-600" />
        Commit Analysis
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
            <span className="font-semibold text-green-900">
              {commitPatterns.total.toLocaleString()}
            </span>
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
