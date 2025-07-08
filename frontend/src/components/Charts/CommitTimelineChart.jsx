import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceLine,
} from "recharts";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Calendar } from "lucide-react";
import {
  format,
  subDays,
  differenceInDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
} from "date-fns";

const CommitTimelineChart = ({ commits = [], repository }) => {
  // Process commit data for timeline
  const processCommitTimeline = () => {
    if (!commits.length) return [];

    const now = new Date();
    const thirtyDaysAgo = subDays(now, 30);

    // Create array of last 30 days
    const days = eachDayOfInterval({ start: thirtyDaysAgo, end: now });

    const timelineData = days.map((day) => {
      const dayCommits = commits.filter((commit) => {
        const commitDate = new Date(
          commit.commit?.author?.date || commit.commit?.committer?.date
        );
        return format(commitDate, "yyyy-MM-dd") === format(day, "yyyy-MM-dd");
      });

      return {
        date: format(day, "MMM dd"),
        fullDate: format(day, "yyyy-MM-dd"),
        commits: dayCommits.length,
        weekday: format(day, "EEEE"),
        isWeekend: day.getDay() === 0 || day.getDay() === 6,
      };
    });

    return timelineData;
  };

  const calculateTrends = (data) => {
    if (data.length < 14) return { trend: "stable", change: 0 };

    const recentWeek = data
      .slice(-7)
      .reduce((sum, day) => sum + day.commits, 0);
    const previousWeek = data
      .slice(-14, -7)
      .reduce((sum, day) => sum + day.commits, 0);

    if (previousWeek === 0) return { trend: "stable", change: 0 };

    const change = ((recentWeek - previousWeek) / previousWeek) * 100;

    if (change > 10) return { trend: "up", change: Math.round(change) };
    if (change < -10)
      return { trend: "down", change: Math.round(Math.abs(change)) };
    return { trend: "stable", change: Math.round(Math.abs(change)) };
  };

  const getActivityLevel = (commits) => {
    if (commits > 10) return { level: "Very High", color: "#10b981" };
    if (commits > 5) return { level: "High", color: "#3b82f6" };
    if (commits > 2) return { level: "Medium", color: "#f59e0b" };
    if (commits > 0) return { level: "Low", color: "#ef4444" };
    return { level: "None", color: "#6b7280" };
  };

  const timelineData = processCommitTimeline();
  const trends = calculateTrends(timelineData);
  const totalCommits = timelineData.reduce((sum, day) => sum + day.commits, 0);
  const avgDaily = Math.round(totalCommits / 30);
  const maxCommits = Math.max(...timelineData.map((d) => d.commits));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const activity = getActivityLevel(data.commits);

      return (
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 text-sm sm:text-base">
            {label}
          </p>
          <p className="text-xs sm:text-sm text-gray-600">{data.weekday}</p>
          <div className="flex items-center gap-2 mt-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: activity.color }}
            />
            <span className="text-xs sm:text-sm font-medium">
              {data.commits} commits
            </span>
            <span className="text-xs text-gray-500">({activity.level})</span>
          </div>
        </div>
      );
    }
    return null;
  };

  const TrendIcon = () => {
    if (trends.trend === "up")
      return <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />;
    if (trends.trend === "down")
      return <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />;
    return <Minus className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />;
  };

  const getTrendColor = () => {
    if (trends.trend === "up") return "text-green-600";
    if (trends.trend === "down") return "text-red-600";
    return "text-gray-600";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">
            Commit Timeline
          </h3>
        </div>
        <div className="text-left sm:text-right">
          <div className="text-xs sm:text-sm text-gray-600">Last 30 days</div>
          <div className="flex items-center gap-1 text-xs sm:text-sm font-medium">
            <TrendIcon />
            <span className={getTrendColor()}>
              {trends.change}% vs prev week
            </span>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="text-center p-2 sm:p-3 bg-blue-50 rounded-lg">
          <div className="text-lg sm:text-2xl font-bold text-blue-900">
            {totalCommits}
          </div>
          <div className="text-xs sm:text-sm text-blue-700">Total Commits</div>
        </div>
        <div className="text-center p-2 sm:p-3 bg-green-50 rounded-lg">
          <div className="text-lg sm:text-2xl font-bold text-green-900">
            {avgDaily}
          </div>
          <div className="text-xs sm:text-sm text-green-700">Daily Average</div>
        </div>
        <div className="text-center p-2 sm:p-3 bg-purple-50 rounded-lg">
          <div className="text-lg sm:text-2xl font-bold text-purple-900">
            {maxCommits}
          </div>
          <div className="text-xs sm:text-sm text-purple-700">Peak Day</div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 sm:h-80 lg:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={timelineData}
            margin={{
              top: 20,
              right: 10,
              left: 10,
              bottom: 5,
            }}
          >
            <defs>
              <linearGradient id="commitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#6b7280" }}
              interval={window.innerWidth < 640 ? 4 : 2}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#6b7280" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              y={avgDaily}
              stroke="#10b981"
              strokeDasharray="5 5"
            />
            <Area
              type="monotone"
              dataKey="commits"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#commitGradient)"
              dot={{
                fill: "#3b82f6",
                strokeWidth: 2,
                r: window.innerWidth < 640 ? 2 : 4,
              }}
              activeDot={{
                r: window.innerWidth < 640 ? 4 : 6,
                stroke: "#3b82f6",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Activity Pattern Analysis */}
      <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-2">
          Activity Insights
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
          <div>
            <span className="text-gray-600">Most active period:</span>
            <span className="ml-2 font-medium text-gray-900">
              {timelineData.reduce(
                (max, day) => (day.commits > max.commits ? day : max),
                timelineData[0]
              )?.date || "N/A"}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Weekend activity:</span>
            <span className="ml-2 font-medium text-gray-900">
              {Math.round(
                (timelineData
                  .filter((d) => d.isWeekend)
                  .reduce((sum, d) => sum + d.commits, 0) /
                  totalCommits) *
                  100
              )}
              %
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CommitTimelineChart;
