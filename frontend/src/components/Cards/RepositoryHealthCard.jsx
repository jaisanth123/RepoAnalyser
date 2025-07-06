import { Shield } from "lucide-react";

const RepositoryHealthCard = ({
  health,
  activity,
  contributorInsights,
  qualityMetrics,
}) => {
  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200">
      <h3 className="text-lg font-bold text-emerald-900 mb-4 flex items-center gap-2">
        <Shield className="w-5 h-5 text-emerald-600" />
        Repository Health
      </h3>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-emerald-700">Overall Score</span>
          <div className="flex items-center gap-2">
            <div className="w-24 bg-emerald-200 rounded-full h-3">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                style={{ width: `${health.score}%` }}
              />
            </div>
            <span className="text-sm font-bold text-emerald-900">
              {health.score}%
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-emerald-700">Quality Score</span>
            <span className="font-semibold text-emerald-900">
              {qualityMetrics.codeQualityScore
                ? `${Math.round(qualityMetrics.codeQualityScore)}%`
                : "N/A"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-emerald-700">Maintenance</span>
            <span className="font-semibold text-emerald-900">
              {activity.level}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-emerald-700">Community</span>
            <span className="font-semibold text-emerald-900">
              {contributorInsights
                ? contributorInsights.total > 10
                  ? "Active"
                  : contributorInsights.total > 3
                  ? "Growing"
                  : "Small"
                : "N/A"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepositoryHealthCard;
