import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { motion } from "framer-motion";
import { Users, Crown, Star, TrendingUp, Award, Target } from "lucide-react";

const ContributorDistributionChart = ({ contributors = [], repository }) => {
  // Process contributor data
  const processContributorData = () => {
    if (!contributors.length) return { barData: [], pieData: [], insights: {} };

    const totalContributions = contributors.reduce(
      (sum, c) => sum + (c.contributions || 0),
      0
    );

    // Prepare bar chart data (top 15 contributors)
    const barData = contributors.slice(0, 15).map((contributor, index) => ({
      name: contributor.login || `User ${index + 1}`,
      contributions: contributor.contributions || 0,
      percentage: Math.round(
        ((contributor.contributions || 0) / totalContributions) * 100
      ),
      avatar: contributor.avatar_url,
      rank: index + 1,
      isTop3: index < 3,
    }));

    // Prepare pie chart data (contribution distribution categories)
    const top1 = contributors[0]?.contributions || 0;
    const top5 = contributors
      .slice(0, 5)
      .reduce((sum, c) => sum + (c.contributions || 0), 0);
    const top10 = contributors
      .slice(0, 10)
      .reduce((sum, c) => sum + (c.contributions || 0), 0);
    const remaining = totalContributions - top10;

    const pieData = [
      { name: "Top Contributor", value: top1, color: "#ef4444" },
      { name: "Top 2-5", value: top5 - top1, color: "#f59e0b" },
      { name: "Top 6-10", value: top10 - top5, color: "#3b82f6" },
      { name: "Others", value: remaining, color: "#6b7280" },
    ].filter((item) => item.value > 0);

    // Calculate insights
    const avgContributions = totalContributions / contributors.length;
    const topContributorShare = (top1 / totalContributions) * 100;
    const coreContributors = contributors.filter(
      (c) => c.contributions > avgContributions
    ).length;

    // Diversity score calculation
    const diversityScore = Math.max(0, 100 - topContributorShare);

    // Collaboration score
    const activeContributors = contributors.filter(
      (c) => c.contributions >= avgContributions * 0.1
    ).length;
    const collaborationScore = Math.min(
      100,
      (activeContributors / contributors.length) * 100
    );

    const insights = {
      totalContributors: contributors.length,
      totalContributions,
      avgContributions: Math.round(avgContributions),
      topContributorShare: Math.round(topContributorShare),
      coreContributors,
      diversityScore: Math.round(diversityScore),
      collaborationScore: Math.round(collaborationScore),
      mostActiveContributor: contributors[0]?.login || "Unknown",
    };

    return { barData, pieData, insights };
  };

  const { barData, pieData, insights } = processContributorData();

  const getContributorLevel = (rank, percentage) => {
    if (rank === 1) return { level: "Lead", color: "#ef4444", icon: Crown };
    if (rank <= 3) return { level: "Core", color: "#f59e0b", icon: Star };
    if (percentage >= 5)
      return { level: "Active", color: "#3b82f6", icon: TrendingUp };
    return { level: "Contributor", color: "#6b7280", icon: Users };
  };

  const getDiversityLevel = (score) => {
    if (score >= 80) return { level: "Excellent", color: "#10b981" };
    if (score >= 60) return { level: "Good", color: "#3b82f6" };
    if (score >= 40) return { level: "Moderate", color: "#f59e0b" };
    return { level: "Low", color: "#ef4444" };
  };

  const BarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const level = getContributorLevel(data.rank, data.percentage);
      const LevelIcon = level.icon;

      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            {data.avatar && (
              <img
                src={data.avatar}
                alt={data.name}
                className="w-8 h-8 rounded-full"
              />
            )}
            <div>
              <p className="font-semibold text-gray-900">{data.name}</p>
              <div className="flex items-center gap-1">
                <LevelIcon className="w-3 h-3" style={{ color: level.color }} />
                <span className="text-xs" style={{ color: level.color }}>
                  {level.level}
                </span>
              </div>
            </div>
          </div>
          <div className="space-y-1 text-sm">
            <p>
              <span className="text-gray-600">Contributions:</span>{" "}
              <span className="font-medium">
                {data.contributions.toLocaleString()}
              </span>
            </p>
            <p>
              <span className="text-gray-600">Share:</span>{" "}
              <span className="font-medium">{data.percentage}%</span>
            </p>
            <p>
              <span className="text-gray-600">Rank:</span>{" "}
              <span className="font-medium">#{data.rank}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900">{data.payload.name}</p>
          <p className="text-sm text-gray-600">{data.value} contributions</p>
          <p className="text-sm text-gray-600">
            {Math.round((data.value / insights.totalContributions) * 100)}% of
            total
          </p>
        </div>
      );
    }
    return null;
  };

  if (!contributors.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No contributor data available</p>
        </div>
      </div>
    );
  }

  const diversityLevel = getDiversityLevel(insights.diversityScore);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-900">
            Contributor Distribution
          </h3>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">
            {insights.totalContributors}
          </div>
          <div className="text-sm text-gray-600">Contributors</div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-900">
            {insights.totalContributions.toLocaleString()}
          </div>
          <div className="text-sm text-blue-700">Total Contributions</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-900">
            {insights.coreContributors}
          </div>
          <div className="text-sm text-green-700">Core Contributors</div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-900">
            {insights.diversityScore}%
          </div>
          <div className="text-sm text-purple-700">Diversity Score</div>
        </div>
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-900">
            {insights.topContributorShare}%
          </div>
          <div className="text-sm text-orange-700">Top Contributor</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Contribution Bar Chart */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Top Contributors</h4>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#6b7280" }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                />
                <Tooltip content={<BarTooltip />} />
                <Bar
                  dataKey="contributions"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                >
                  {barData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.isTop3 ? "#ef4444" : "#3b82f6"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribution Pie Chart */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">
            Contribution Distribution
          </h4>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) =>
                    `${name}: ${Math.round(
                      (value / insights.totalContributions) * 100
                    )}%`
                  }
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Team Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Diversity Analysis */}
        <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
          <h4 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Team Diversity
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-purple-700">Diversity Level</span>
              <span
                className="font-semibold"
                style={{ color: diversityLevel.color }}
              >
                {diversityLevel.level}
              </span>
            </div>
            <div className="w-full bg-purple-200 rounded-full h-3">
              <div
                className="h-3 rounded-full transition-all duration-300"
                style={{
                  width: `${insights.diversityScore}%`,
                  backgroundColor: diversityLevel.color,
                }}
              />
            </div>
            <div className="text-sm text-purple-600">
              {insights.diversityScore >= 60
                ? "Well-distributed contributions across team members"
                : "Contributions concentrated among few contributors"}
            </div>
          </div>
        </div>

        {/* Collaboration Score */}
        <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
          <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
            <Award className="w-4 h-4" />
            Collaboration Score
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-green-700">Active Participation</span>
              <span className="font-semibold text-green-900">
                {insights.collaborationScore}%
              </span>
            </div>
            <div className="w-full bg-green-200 rounded-full h-3">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
                style={{ width: `${insights.collaborationScore}%` }}
              />
            </div>
            <div className="text-sm text-green-600">
              {insights.collaborationScore >= 70
                ? "High level of team collaboration"
                : "Opportunity to increase team participation"}
            </div>
          </div>
        </div>
      </div>

      {/* Top Contributors Showcase */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-3">Top Contributors</h4>
        <div className="flex flex-wrap gap-3">
          {barData.slice(0, 5).map((contributor, index) => {
            const level = getContributorLevel(
              contributor.rank,
              contributor.percentage
            );
            const LevelIcon = level.icon;

            return (
              <motion.div
                key={contributor.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2 bg-white p-3 rounded-lg border border-gray-200"
              >
                {contributor.avatar && (
                  <img
                    src={contributor.avatar}
                    alt={contributor.name}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-gray-900">
                      {contributor.name}
                    </span>
                    <LevelIcon
                      className="w-3 h-3"
                      style={{ color: level.color }}
                    />
                  </div>
                  <div className="text-xs text-gray-600">
                    {contributor.contributions.toLocaleString()} contributions (
                    {contributor.percentage}%)
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default ContributorDistributionChart;
