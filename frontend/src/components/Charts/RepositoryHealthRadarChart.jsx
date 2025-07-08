import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import { Shield, Star, TrendingUp, Award } from "lucide-react";

const RepositoryHealthRadarChart = ({
  repository,
  contributors = [],
  commits = [],
  issues = [],
  pullRequests = [],
  releases = [],
}) => {
  // Calculate health dimensions
  const calculateHealthDimensions = () => {
    // Activity Score (0-100)
    const daysSinceUpdate = Math.floor(
      (new Date() - new Date(repository.updated_at)) / (1000 * 60 * 60 * 24)
    );
    const activityScore = Math.max(0, 100 - daysSinceUpdate * 2);

    // Community Score (0-100)
    const communityScore = Math.min(
      100,
      (repository.stargazers_count > 0
        ? Math.min(25, Math.log10(repository.stargazers_count + 1) * 10)
        : 0) +
        (repository.forks_count > 0
          ? Math.min(25, Math.log10(repository.forks_count + 1) * 8)
          : 0) +
        (contributors.length > 0 ? Math.min(25, contributors.length * 5) : 0) +
        (repository.watchers_count > 0
          ? Math.min(25, Math.log10(repository.watchers_count + 1) * 8)
          : 0)
    );

    // Documentation Score (0-100)
    const docScore =
      (repository.description ? 20 : 0) +
      (repository.has_wiki ? 20 : 0) +
      (repository.has_pages ? 15 : 0) +
      (repository.topics && repository.topics.length > 0 ? 15 : 0) +
      (repository.license ? 15 : 0) +
      (repository.readme ? 15 : 0); // Assume readme exists if description exists

    // Quality Score (0-100)
    // Filter out pull requests from issues (GitHub API includes PRs in issues endpoint)
    const actualIssues = issues.filter((issue) => !issue.pull_request);
    const openIssues = actualIssues.filter(
      (issue) => issue.state === "open"
    ).length;
    const closedIssues = actualIssues.filter(
      (issue) => issue.state === "closed"
    ).length;

    const qualityScore = Math.min(
      100,
      // Base score
      50 +
        // Issue management
        (closedIssues > 0
          ? Math.min(20, (closedIssues / (openIssues + closedIssues)) * 20)
          : 0) +
        // PR activity
        (pullRequests.length > 0 ? Math.min(15, pullRequests.length * 2) : 0) +
        // License presence
        (repository.license ? 10 : 0) +
        // Recent activity
        (daysSinceUpdate < 30 ? 5 : 0)
    );

    // Security Score (0-100)
    const securityScore = Math.min(
      100,
      // Base security
      40 +
        // License
        (repository.license ? 20 : 0) +
        // Recent updates
        (daysSinceUpdate < 7 ? 15 : daysSinceUpdate < 30 ? 10 : 0) +
        // Community size (larger = more eyes)
        (repository.stargazers_count > 100 ? 15 : 0) +
        // Description and documentation
        (repository.description ? 5 : 0) +
        (repository.has_wiki ? 5 : 0)
    );

    // Maintenance Score (0-100)
    const maintenanceScore = Math.min(
      100,
      // Recent activity
      (daysSinceUpdate < 7
        ? 30
        : daysSinceUpdate < 30
        ? 20
        : daysSinceUpdate < 90
        ? 10
        : 0) +
        // Releases
        (releases.length > 0 ? Math.min(25, releases.length * 5) : 0) +
        // Contributor diversity
        (contributors.length > 1 ? Math.min(20, contributors.length * 3) : 0) +
        // Pull request activity
        (pullRequests.length > 0 ? Math.min(15, pullRequests.length) : 0) +
        // Documentation
        (repository.description ? 5 : 0) +
        (repository.license ? 5 : 0)
    );

    return [
      { dimension: "Activity", score: Math.round(activityScore) },
      { dimension: "Community", score: Math.round(communityScore) },
      { dimension: "Documentation", score: Math.round(docScore) },
      { dimension: "Quality", score: Math.round(qualityScore) },
      { dimension: "Security", score: Math.round(securityScore) },
      { dimension: "Maintenance", score: Math.round(maintenanceScore) },
    ];
  };

  const healthData = calculateHealthDimensions();
  const overallScore = Math.round(
    healthData.reduce((sum, item) => sum + item.score, 0) / healthData.length
  );

  const getHealthLevel = (score) => {
    if (score >= 90) return { level: "Excellent", color: "#10b981" };
    if (score >= 75) return { level: "Very Good", color: "#3b82f6" };
    if (score >= 60) return { level: "Good", color: "#8b5cf6" };
    if (score >= 45) return { level: "Fair", color: "#f59e0b" };
    return { level: "Needs Improvement", color: "#ef4444" };
  };

  const overallHealth = getHealthLevel(overallScore);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 text-sm">{label}</p>
          <p className="text-blue-600 text-sm">Score: {payload[0].value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">
            Repository Health Overview
          </h3>
        </div>
        <div className="text-left sm:text-right">
          <div
            className="text-lg sm:text-xl font-bold"
            style={{ color: overallHealth.color }}
          >
            {overallScore}% - {overallHealth.level}
          </div>
          <div className="text-xs sm:text-sm text-gray-600">
            Overall Health Score
          </div>
        </div>
      </div>

      {/* Health Score Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-4 sm:mb-6">
        {healthData.map((dimension, index) => {
          const dimHealth = getHealthLevel(dimension.score);
          return (
            <motion.div
              key={dimension.dimension}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-2 sm:p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200"
            >
              <div
                className="text-lg sm:text-xl font-bold"
                style={{ color: dimHealth.color }}
              >
                {dimension.score}%
              </div>
              <div className="text-xs sm:text-sm text-gray-700">
                {dimension.dimension}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Chart and Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
        {/* Radar Chart - Left Side (Takes 3/5 of width on large screens) */}
        <div className="lg:col-span-3 h-64 sm:h-80 lg:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart
              data={healthData}
              margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
              }}
            >
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis
                dataKey="dimension"
                tick={{
                  fontSize: window.innerWidth < 640 ? 10 : 12,
                  fill: "#374151",
                }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{
                  fontSize: window.innerWidth < 640 ? 8 : 10,
                  fill: "#6b7280",
                }}
              />
              <Radar
                name="Health Score"
                dataKey="score"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.3}
                strokeWidth={2}
                dot={{
                  fill: "#3b82f6",
                  strokeWidth: 2,
                  r: window.innerWidth < 640 ? 3 : 4,
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Dimension Breakdown - Right Side (Takes 2/5 of width on large screens) */}
        <div className="lg:col-span-2 grid grid-cols-1 gap-2 h-64 sm:h-80 lg:h-96 overflow-y-auto">
          {healthData.map((dimension, index) => {
            const dimHealth = getHealthLevel(dimension.score);
            return (
              <motion.div
                key={dimension.dimension}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-2 sm:p-2.5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-md border border-gray-200 flex-shrink-0"
              >
                <div className="flex items-center justify-between mb-1 sm:mb-1.5">
                  <span className="text-xs sm:text-sm font-medium text-gray-700">
                    {dimension.dimension}
                  </span>
                  <span
                    className="text-sm sm:text-base font-bold"
                    style={{ color: dimHealth.color }}
                  >
                    {dimension.score}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full transition-all duration-500"
                    style={{
                      width: `${dimension.score}%`,
                      backgroundColor: dimHealth.color,
                    }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Health Recommendations */}
      <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <h4 className="text-sm sm:text-base font-semibold text-blue-900 mb-2 sm:mb-3 flex items-center gap-2">
          <Award className="w-4 h-4" />
          Health Recommendations
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
          {healthData
            .filter((item) => item.score < 70)
            .slice(0, 4)
            .map((item, index) => (
              <div key={item.dimension} className="text-blue-700">
                <span className="font-medium">Improve {item.dimension}:</span>
                <span className="ml-1">
                  {item.dimension === "Activity" && "Increase commit frequency"}
                  {item.dimension === "Community" && "Encourage contributions"}
                  {item.dimension === "Documentation" && "Add README and wiki"}
                  {item.dimension === "Quality" && "Address open issues"}
                  {item.dimension === "Security" && "Add license and updates"}
                  {item.dimension === "Maintenance" && "Regular releases"}
                </span>
              </div>
            ))}
          {healthData.every((item) => item.score >= 70) && (
            <div className="text-blue-700 col-span-full text-center">
              🎉 Excellent repository health! Keep up the great work!
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default RepositoryHealthRadarChart;
