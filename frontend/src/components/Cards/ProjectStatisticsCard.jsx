import { BarChart3 } from "lucide-react";

const ProjectStatisticsCard = ({ projectInsights }) => {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
      <h3 className="text-lg font-bold text-purple-900 mb-3 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-purple-600" />
        Project Statistics
      </h3>

      <div className="space-y-3">
        {/* Issues */}
        <div className="bg-white/60 rounded-lg p-3">
          <div className="flex justify-between items-center">
            <span className="text-purple-700 font-medium">Issues</span>
            <span className="font-bold text-purple-900">
              {projectInsights.issues.open}/{projectInsights.issues.total}
            </span>
          </div>
          <div className="mt-1 text-xs text-purple-600">
            {projectInsights.issues.open} open •{" "}
            {projectInsights.issues.total - projectInsights.issues.open} closed
          </div>
        </div>

        {/* Pull Requests */}
        <div className="bg-white/60 rounded-lg p-3">
          <div className="flex justify-between items-center">
            <span className="text-purple-700 font-medium">Pull Requests</span>
            <span className="font-bold text-purple-900">
              {projectInsights.pullRequests.open}/
              {projectInsights.pullRequests.total}
            </span>
          </div>
          <div className="mt-1 text-xs text-purple-600">
            {projectInsights.pullRequests.mergeRate}% merge rate
          </div>
        </div>

        {/* Repository Info */}
        <div className="bg-white/60 rounded-lg p-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-purple-600">Releases</div>
              <div className="font-bold text-purple-900">
                {projectInsights.releases}
              </div>
            </div>
            <div>
              <div className="text-xs text-purple-600">Branches</div>
              <div className="font-bold text-purple-900">
                {projectInsights.branches}
              </div>
            </div>
          </div>
        </div>

        {/* Resolution Rate */}
        <div className="bg-white/60 rounded-lg p-3">
          <div className="flex justify-between items-center">
            <span className="text-purple-700 font-medium">Resolution Rate</span>
            <span className="font-bold text-purple-900">
              {projectInsights.issues.resolutionRate}%
            </span>
          </div>
          <div className="mt-2 w-full bg-purple-200 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${projectInsights.issues.resolutionRate}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectStatisticsCard;
