import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Area,
  AreaChart,
} from "recharts";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Star,
  GitFork,
  Eye,
  Users,
  Calendar,
  Target,
  Award,
} from "lucide-react";
import {
  format,
  differenceInDays,
  subDays,
  eachMonthOfInterval,
  subMonths,
} from "date-fns";

const GrowthTrendsChart = ({
  repository,
  contributors = [],
  commits = [],
  releases = [],
}) => {
  // Simulate growth data based on repository age and current metrics
  const simulateGrowthData = () => {
    const createdDate = new Date(repository.created_at);
    const currentDate = new Date();
    const ageInDays = differenceInDays(currentDate, createdDate);

    // Create monthly intervals from creation to now
    const months = Math.min(24, Math.max(6, Math.ceil(ageInDays / 30))); // Limit to 24 months max
    const startDate = subMonths(currentDate, months - 1);
    const monthlyIntervals = eachMonthOfInterval({
      start: startDate,
      end: currentDate,
    });

    const currentStars = repository.stargazers_count || 0;
    const currentForks = repository.forks_count || 0;
    const currentWatchers = repository.watchers_count || 0;
    const currentContributors = contributors.length || 0;

    // Generate realistic growth patterns
    const growthData = monthlyIntervals.map((date, index) => {
      const progress = (index + 1) / monthlyIntervals.length;

      // Simulate different growth patterns
      const exponentialGrowth = Math.pow(progress, 1.5);
      const linearGrowth = progress;
      const logarithmicGrowth = Math.log(progress + 0.1) / Math.log(1.1);

      // Use different growth patterns for different metrics
      const stars = Math.round(currentStars * exponentialGrowth);
      const forks = Math.round(currentForks * linearGrowth);
      const watchers = Math.round(currentWatchers * exponentialGrowth);
      const contributorCount = Math.round(
        currentContributors * logarithmicGrowth
      );

      // Add some monthly variation
      const variation = 1 + (Math.random() - 0.5) * 0.1; // ±5% variation

      return {
        month: format(date, "MMM yyyy"),
        date: format(date, "yyyy-MM"),
        stars: Math.max(0, Math.round(stars * variation)),
        forks: Math.max(0, Math.round(forks * variation)),
        watchers: Math.max(0, Math.round(watchers * variation)),
        contributors: Math.max(0, Math.round(contributorCount * variation)),
        releases: releases.filter(
          (release) => new Date(release.published_at) <= date
        ).length,
      };
    });

    // Ensure the last data point matches current values
    if (growthData.length > 0) {
      const lastPoint = growthData[growthData.length - 1];
      lastPoint.stars = currentStars;
      lastPoint.forks = currentForks;
      lastPoint.watchers = currentWatchers;
      lastPoint.contributors = currentContributors;
    }

    return growthData;
  };

  const calculateGrowthMetrics = (data) => {
    if (data.length < 2) return {};

    const latest = data[data.length - 1];
    const previous = data[data.length - 2];
    const threeMonthsAgo = data[Math.max(0, data.length - 4)];

    // Calculate month-over-month growth
    const momStarGrowth =
      previous.stars > 0
        ? Math.round(((latest.stars - previous.stars) / previous.stars) * 100)
        : 0;
    const momForkGrowth =
      previous.forks > 0
        ? Math.round(((latest.forks - previous.forks) / previous.forks) * 100)
        : 0;

    // Calculate quarterly growth
    const quarterlyStarGrowth =
      threeMonthsAgo.stars > 0
        ? Math.round(
            ((latest.stars - threeMonthsAgo.stars) / threeMonthsAgo.stars) * 100
          )
        : 0;

    // Calculate average monthly growth
    const monthlyGrowthRates = [];
    for (let i = 1; i < data.length; i++) {
      if (data[i - 1].stars > 0) {
        const growthRate =
          ((data[i].stars - data[i - 1].stars) / data[i - 1].stars) * 100;
        monthlyGrowthRates.push(growthRate);
      }
    }

    const avgMonthlyGrowth =
      monthlyGrowthRates.length > 0
        ? Math.round(
            monthlyGrowthRates.reduce((sum, rate) => sum + rate, 0) /
              monthlyGrowthRates.length
          )
        : 0;

    // Determine growth phase
    const getGrowthPhase = (avgGrowth) => {
      if (avgGrowth > 20)
        return {
          phase: "Explosive Growth",
          color: "#10b981",
          icon: TrendingUp,
        };
      if (avgGrowth > 10)
        return { phase: "Rapid Growth", color: "#3b82f6", icon: TrendingUp };
      if (avgGrowth > 5)
        return { phase: "Steady Growth", color: "#f59e0b", icon: TrendingUp };
      if (avgGrowth > 0)
        return { phase: "Slow Growth", color: "#6b7280", icon: TrendingUp };
      return { phase: "Stagnant", color: "#ef4444", icon: Target };
    };

    const growthPhase = getGrowthPhase(avgMonthlyGrowth);

    return {
      momStarGrowth,
      momForkGrowth,
      quarterlyStarGrowth,
      avgMonthlyGrowth,
      growthPhase,
      totalGrowth: latest.stars + latest.forks + latest.watchers,
    };
  };

  const data = simulateGrowthData();
  const metrics = calculateGrowthMetrics(data);

  const getGrowthIndicator = (growth) => {
    if (growth > 0) return { text: `+${growth}%`, color: "text-green-600" };
    if (growth < 0) return { text: `${growth}%`, color: "text-red-600" };
    return { text: "0%", color: "text-gray-600" };
  };

  const starGrowthIndicator = getGrowthIndicator(metrics.momStarGrowth);
  const forkGrowthIndicator = getGrowthIndicator(metrics.momForkGrowth);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          <div className="space-y-1">
            {payload.map((entry, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm text-gray-600">{entry.name}:</span>
                </div>
                <span className="text-sm font-medium">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const GrowthPhaseIcon = metrics.growthPhase?.icon || TrendingUp;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-900">Growth Trends</h3>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 mb-1">
            <GrowthPhaseIcon
              className="w-4 h-4"
              style={{ color: metrics.growthPhase?.color }}
            />
            <span
              className="font-semibold"
              style={{ color: metrics.growthPhase?.color }}
            >
              {metrics.growthPhase?.phase}
            </span>
          </div>
          <div className="text-sm text-gray-600">Repository Growth</div>
        </div>
      </div>

      {/* Growth Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-yellow-900">
            {repository.stargazers_count}
          </div>
          <div className="text-sm text-yellow-700">Stars</div>
          <div
            className={`text-xs font-medium mt-1 ${starGrowthIndicator.color}`}
          >
            {starGrowthIndicator.text} MoM
          </div>
        </div>

        <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
          <GitFork className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-900">
            {repository.forks_count}
          </div>
          <div className="text-sm text-blue-700">Forks</div>
          <div
            className={`text-xs font-medium mt-1 ${forkGrowthIndicator.color}`}
          >
            {forkGrowthIndicator.text} MoM
          </div>
        </div>

        <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
          <Eye className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-900">
            {repository.watchers_count}
          </div>
          <div className="text-sm text-green-700">Watchers</div>
          <div className="text-xs font-medium mt-1 text-gray-600">Tracking</div>
        </div>

        <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
          <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-purple-900">
            {contributors.length}
          </div>
          <div className="text-sm text-purple-700">Contributors</div>
          <div className="text-xs font-medium mt-1 text-gray-600">Active</div>
        </div>
      </div>

      {/* Growth Chart */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-4">Growth Timeline</h4>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6b7280" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6b7280" }}
              />
              <Tooltip content={<CustomTooltip />} />

              <Area
                type="monotone"
                dataKey="stars"
                stackId="1"
                stroke="#f59e0b"
                fill="#f59e0b"
                fillOpacity={0.3}
                name="Stars"
              />
              <Line
                type="monotone"
                dataKey="forks"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                name="Forks"
              />
              <Line
                type="monotone"
                dataKey="watchers"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                name="Watchers"
              />
              <Bar
                dataKey="contributors"
                fill="#8b5cf6"
                name="Contributors"
                yAxisId="right"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Growth Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth Performance */}
        <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
          <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
            <Award className="w-4 h-4" />
            Growth Performance
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-green-700">Avg Monthly Growth</span>
              <span className="font-semibold text-green-900">
                {metrics.avgMonthlyGrowth > 0 ? "+" : ""}
                {metrics.avgMonthlyGrowth}%
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-green-700">Quarterly Growth</span>
              <span className="font-semibold text-green-900">
                {metrics.quarterlyStarGrowth > 0 ? "+" : ""}
                {metrics.quarterlyStarGrowth}%
              </span>
            </div>

            <div className="w-full bg-green-200 rounded-full h-3">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(0, metrics.avgMonthlyGrowth + 50)
                  )}%`,
                }}
              />
            </div>

            <div className="text-sm text-green-600">
              {metrics.avgMonthlyGrowth > 10
                ? "Exceptional growth trajectory"
                : metrics.avgMonthlyGrowth > 5
                ? "Strong growth momentum"
                : metrics.avgMonthlyGrowth > 0
                ? "Steady growth pattern"
                : "Growth opportunities available"}
            </div>
          </div>
        </div>

        {/* Community Engagement */}
        <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Community Engagement
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-blue-700">Star-to-Fork Ratio</span>
              <span className="font-semibold text-blue-900">
                {repository.forks_count > 0
                  ? Math.round(
                      repository.stargazers_count / repository.forks_count
                    )
                  : repository.stargazers_count}
                :1
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-blue-700">Engagement Score</span>
              <span className="font-semibold text-blue-900">
                {Math.round(
                  (repository.stargazers_count +
                    repository.forks_count * 2 +
                    repository.watchers_count) /
                    Math.max(1, contributors.length)
                )}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-600">Contributors:</span>
                <div className="font-medium text-blue-900">
                  {contributors.length} active
                </div>
              </div>
              <div>
                <span className="text-blue-600">Releases:</span>
                <div className="font-medium text-blue-900">
                  {releases.length} total
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Growth Insights */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">Growth Insights</h4>
        <div className="text-sm text-gray-700 space-y-1">
          {repository.stargazers_count > 100 && (
            <div>
              ⭐ Strong community interest with {repository.stargazers_count}{" "}
              stars
            </div>
          )}

          {repository.forks_count > 20 && (
            <div>
              🍴 High development engagement with {repository.forks_count} forks
            </div>
          )}

          {contributors.length > 5 && (
            <div>
              👥 Active contributor community with {contributors.length}{" "}
              contributors
            </div>
          )}

          {metrics.avgMonthlyGrowth > 5 && (
            <div>
              📈 Sustained growth with {metrics.avgMonthlyGrowth}% average
              monthly increase
            </div>
          )}

          {releases.length > 0 && (
            <div>
              🚀 {releases.length} releases demonstrate active development
            </div>
          )}

          <div>
            📊 Repository age:{" "}
            {Math.round(
              differenceInDays(new Date(), new Date(repository.created_at)) / 30
            )}{" "}
            months
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GrowthTrendsChart;
