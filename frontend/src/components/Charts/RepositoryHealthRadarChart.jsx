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
    const openIssues = issues.filter((issue) => issue.state === "open").length;
    const closedIssues = issues.filter(
      (issue) => issue.state === "closed"
    ).length;
    const issueResolutionRate =
      closedIssues > 0
        ? (closedIssues / (openIssues + closedIssues)) * 100
        : 50;

    const openPRs = pullRequests.filter((pr) => pr.state === "open").length;
    const mergedPRs = pullRequests.filter((pr) => pr.state === "merged").length;
    const prMergeRate =
      mergedPRs > 0 ? (mergedPRs / (openPRs + mergedPRs)) * 100 : 50;

    const qualityScore = (issueResolutionRate + prMergeRate) / 2;

    // Maintenance Score (0-100)
    const recentCommits = commits.filter((commit) => {
      const commitDate = new Date(
        commit.commit?.author?.date || commit.commit?.committer?.date
      );
      const daysSinceCommit = (new Date() - commitDate) / (1000 * 60 * 60 * 24);
      return daysSinceCommit <= 30;
    }).length;

    const maintenanceScore = Math.min(
      100,
      recentCommits * 10 +
        (releases.length > 0 ? 30 : 0) +
        (repository.has_issues ? 20 : 0)
    );

    // Innovation Score (0-100)
    const innovationScore = Math.min(
      100,
      (repository.topics && repository.topics.length > 0
        ? repository.topics.length * 8
        : 0) +
        (releases.length > 0 ? Math.min(30, releases.length * 6) : 0) +
        (repository.has_projects ? 20 : 0) +
        (repository.has_discussions ? 15 : 0) +
        (repository.allow_forking ? 10 : 0)
    );

    return [
      {
        dimension: "Activity",
        score: Math.round(activityScore),
        fullMark: 100,
      },
      {
        dimension: "Community",
        score: Math.round(communityScore),
        fullMark: 100,
      },
      {
        dimension: "Documentation",
        score: Math.round(docScore),
        fullMark: 100,
      },
      { dimension: "Quality", score: Math.round(qualityScore), fullMark: 100 },
      {
        dimension: "Maintenance",
        score: Math.round(maintenanceScore),
        fullMark: 100,
      },
      {
        dimension: "Innovation",
        score: Math.round(innovationScore),
        fullMark: 100,
      },
    ];
  };

  const healthData = calculateHealthDimensions();
  const overallScore = Math.round(
    healthData.reduce((sum, dim) => sum + dim.score, 0) / healthData.length
  );

  const getHealthLevel = (score) => {
    if (score >= 85)
      return { level: "Exceptional", color: "#10b981", icon: Award };
    if (score >= 70)
      return { level: "Excellent", color: "#3b82f6", icon: TrendingUp };
    if (score >= 55) return { level: "Good", color: "#f59e0b", icon: Star };
    if (score >= 40) return { level: "Fair", color: "#ef4444", icon: Shield };
    return { level: "Needs Improvement", color: "#6b7280", icon: Shield };
  };

  const healthLevel = getHealthLevel(overallScore);
  const HealthIcon = healthLevel.icon;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900">{data.dimension}</p>
          <p className="text-sm text-blue-600">{data.score}/100</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="h-2 rounded-full bg-blue-500"
              style={{ width: `${data.score}%` }}
            />
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-900">
            Repository Health Analysis
          </h3>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 mb-1">
            <HealthIcon
              className="w-5 h-5"
              style={{ color: healthLevel.color }}
            />
            <span
              className="font-semibold"
              style={{ color: healthLevel.color }}
            >
              {healthLevel.level}
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {overallScore}/100
          </div>
        </div>
      </div>

      {/* Overall Health Score */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-blue-800 font-medium">
            Overall Health Score
          </span>
          <span className="text-blue-900 font-bold">{overallScore}%</span>
        </div>
        <div className="w-full bg-blue-200 rounded-full h-3">
          <div
            className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
            style={{ width: `${overallScore}%` }}
          />
        </div>
      </div>

      {/* Radar Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart
            data={healthData}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis
              dataKey="dimension"
              tick={{ fontSize: 12, fill: "#374151" }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fontSize: 10, fill: "#6b7280" }}
            />
            <Radar
              name="Health Score"
              dataKey="score"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.3}
              strokeWidth={2}
              dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Dimension Breakdown */}
      <div className="mt-6 grid grid-cols-2 lg:grid-cols-3 gap-4">
        {healthData.map((dimension, index) => {
          const dimHealth = getHealthLevel(dimension.score);
          return (
            <motion.div
              key={dimension.dimension}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  {dimension.dimension}
                </span>
                <span
                  className="text-sm font-bold"
                  style={{ color: dimHealth.color }}
                >
                  {dimension.score}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-300"
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

      {/* Health Recommendations */}
    </motion.div>
  );
};

export default RepositoryHealthRadarChart;
