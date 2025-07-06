import { BarChart3 } from "lucide-react";

const ProjectStatisticsCard = ({ projectInsights }) => {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
      <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-purple-600" />
        Project Statistics
      </h3>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-purple-700">Issues</span>
          <span className="font-semibold text-purple-900">
            {projectInsights.issues.open}/{projectInsights.issues.total}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-purple-700">Pull Requests</span>
          <span className="font-semibold text-purple-900">
            {projectInsights.pullRequests.open}/
            {projectInsights.pullRequests.total}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-purple-700">Releases</span>
          <span className="font-semibold text-purple-900">
            {projectInsights.releases}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-purple-700">Branches</span>
          <span className="font-semibold text-purple-900">
            {projectInsights.branches}
          </span>
        </div>

        <div className="flex justify-between pt-2 border-t border-purple-200">
          <span className="text-purple-700">Resolution Rate</span>
          <span className="font-semibold text-purple-900">
            {projectInsights.issues.resolutionRate}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProjectStatisticsCard;
