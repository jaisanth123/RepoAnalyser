import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle,
  GitPullRequest,
  GitMerge,
  Clock,
  Target,
  TrendingUp,
  Activity,
  FileText,
  Smile,
} from "lucide-react";
import {
  format,
  subDays,
  differenceInDays,
  parseISO,
  eachDayOfInterval,
} from "date-fns";

const IssueAndPRAnalyticsChart = ({
  issues = [],
  pullRequests = [],
  repository,
}) => {
  // Process issues and PR data for analytics
  const processData = () => {
    const now = new Date();
    const thirtyDaysAgo = subDays(now, 30);

    // Create timeline for last 30 days
    const days = eachDayOfInterval({ start: thirtyDaysAgo, end: now });

    const timelineData = days.map((day) => {
      const dayStr = format(day, "yyyy-MM-dd");

      // Issues opened/closed on this day
      const issuesOpened = issues.filter(
        (issue) => format(parseISO(issue.created_at), "yyyy-MM-dd") === dayStr
      ).length;

      const issuesClosed = issues.filter(
        (issue) =>
          issue.closed_at &&
          format(parseISO(issue.closed_at), "yyyy-MM-dd") === dayStr
      ).length;

      // PRs opened/merged on this day
      const prsOpened = pullRequests.filter(
        (pr) => format(parseISO(pr.created_at), "yyyy-MM-dd") === dayStr
      ).length;

      const prsMerged = pullRequests.filter(
        (pr) =>
          pr.merged_at &&
          format(parseISO(pr.merged_at), "yyyy-MM-dd") === dayStr
      ).length;

      return {
        date: format(day, "MMM dd"),
        fullDate: dayStr,
        issuesOpened,
        issuesClosed,
        prsOpened,
        prsMerged,
        netIssues: issuesOpened - issuesClosed,
        netPRs: prsOpened - prsMerged,
      };
    });

    return timelineData;
  };

  const calculateMetrics = () => {
    const openIssues = issues.filter((issue) => issue.state === "open").length;
    const closedIssues = issues.filter(
      (issue) => issue.state === "closed"
    ).length;
    const totalIssues = openIssues + closedIssues;

    const openPRs = pullRequests.filter((pr) => pr.state === "open").length;
    const mergedPRs = pullRequests.filter((pr) => pr.merged_at).length;
    const closedPRs = pullRequests.filter(
      (pr) => pr.state === "closed" && !pr.merged_at
    ).length;
    const totalPRs = openPRs + mergedPRs + closedPRs;

    // Calculate resolution rates
    const issueResolutionRate =
      totalIssues > 0 ? Math.round((closedIssues / totalIssues) * 100) : 0;
    const prMergeRate =
      totalPRs > 0 ? Math.round((mergedPRs / totalPRs) * 100) : 0;

    // Calculate average resolution time for closed items
    const getAvgResolutionTime = (items, closedField) => {
      const closedItems = items.filter((item) => item[closedField]);
      if (!closedItems.length) return 0;

      const totalDays = closedItems.reduce((sum, item) => {
        const created = parseISO(item.created_at);
        const closed = parseISO(item[closedField]);
        return sum + differenceInDays(closed, created);
      }, 0);

      return Math.round(totalDays / closedItems.length);
    };

    const avgIssueResolutionTime = getAvgResolutionTime(issues, "closed_at");
    const avgPRMergeTime = getAvgResolutionTime(pullRequests, "merged_at");

    // Recent activity (last 7 days)
    const sevenDaysAgo = subDays(new Date(), 7);
    const recentIssues = issues.filter(
      (issue) => parseISO(issue.created_at) >= sevenDaysAgo
    ).length;
    const recentPRs = pullRequests.filter(
      (pr) => parseISO(pr.created_at) >= sevenDaysAgo
    ).length;

    return {
      issues: {
        open: openIssues,
        closed: closedIssues,
        total: totalIssues,
        resolutionRate: issueResolutionRate,
        avgResolutionTime: avgIssueResolutionTime,
        recent: recentIssues,
      },
      pullRequests: {
        open: openPRs,
        merged: mergedPRs,
        closed: closedPRs,
        total: totalPRs,
        mergeRate: prMergeRate,
        avgMergeTime: avgPRMergeTime,
        recent: recentPRs,
      },
    };
  };

  const timelineData = processData();
  const metrics = calculateMetrics();

  // Prepare pie chart data
  const issueStatusData = [
    { name: "Open Issues", value: metrics.issues.open, color: "#ef4444" },
    { name: "Closed Issues", value: metrics.issues.closed, color: "#10b981" },
  ].filter((item) => item.value > 0);

  const prStatusData = [
    { name: "Open PRs", value: metrics.pullRequests.open, color: "#f59e0b" },
    {
      name: "Merged PRs",
      value: metrics.pullRequests.merged,
      color: "#10b981",
    },
    {
      name: "Closed PRs",
      value: metrics.pullRequests.closed,
      color: "#6b7280",
    },
  ].filter((item) => item.value > 0);

  const getHealthLevel = (rate) => {
    if (rate >= 80) return { level: "Excellent", color: "#10b981" };
    if (rate >= 60) return { level: "Good", color: "#3b82f6" };
    if (rate >= 40) return { level: "Fair", color: "#f59e0b" };
    return { level: "Needs Attention", color: "#ef4444" };
  };

  const issueHealth = getHealthLevel(metrics.issues.resolutionRate);
  const prHealth = getHealthLevel(metrics.pullRequests.mergeRate);

  const TimelineTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-red-600">Issues Opened:</span>
              <span className="font-medium">{data.issuesOpened}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-green-600">Issues Closed:</span>
              <span className="font-medium">{data.issuesClosed}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-blue-600">PRs Opened:</span>
              <span className="font-medium">{data.prsOpened}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-purple-600">PRs Merged:</span>
              <span className="font-medium">{data.prsMerged}</span>
            </div>
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
          <p className="text-sm text-gray-600">{data.value} items</p>
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
          <Activity className="w-5 h-5 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-900">
            Issue & PR Analytics
          </h3>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">Project Management</div>
          <div className="text-lg font-semibold text-gray-900">
            {metrics.issues.total} Issues • {metrics.pullRequests.total} PRs
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
          <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-red-900">
            {metrics.issues.open}
          </div>
          <div className="text-sm text-red-700">Open Issues</div>
        </div>

        <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
          <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-900">
            {metrics.issues.resolutionRate}%
          </div>
          <div className="text-sm text-green-700">Resolution Rate</div>
        </div>

        <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
          <GitPullRequest className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-900">
            {metrics.pullRequests.open}
          </div>
          <div className="text-sm text-blue-700">Open PRs</div>
        </div>

        <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
          <GitMerge className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-purple-900">
            {metrics.pullRequests.mergeRate}%
          </div>
          <div className="text-sm text-purple-700">Merge Rate</div>
        </div>
      </div>

      {/* Timeline Chart */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-4">
          Activity Timeline (Last 30 Days)
        </h4>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={timelineData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6b7280" }}
                interval={2}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6b7280" }}
              />
              <Tooltip content={<TimelineTooltip />} />

              <Bar dataKey="issuesOpened" fill="#ef4444" name="Issues Opened" />
              <Bar dataKey="issuesClosed" fill="#10b981" name="Issues Closed" />
              <Line
                type="monotone"
                dataKey="prsOpened"
                stroke="#3b82f6"
                strokeWidth={2}
                name="PRs Opened"
              />
              <Line
                type="monotone"
                dataKey="prsMerged"
                stroke="#8b5cf6"
                strokeWidth={2}
                name="PRs Merged"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Issues Distribution */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">
            Issue Status Distribution
          </h4>
          <div className="h-64">
            {issueStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={issueStatusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={false}
                  >
                    {issueStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <Smile className="w-12 h-12 text-green-500 mb-3" />
                <div className="text-lg font-medium text-gray-700 mb-1">
                  No Issues Found!
                </div>
                <div className="text-sm text-gray-500 text-center">
                  This repository has a clean slate with no reported issues.
                  <br />
                  Great work maintaining a healthy codebase! 🎉
                </div>
              </div>
            )}
          </div>
        </div>

        {/* PR Distribution */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">
            Pull Request Status Distribution
          </h4>
          <div className="h-64">
            {prStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={prStatusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={false}
                  >
                    {prStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <FileText className="w-12 h-12 text-blue-500 mb-3" />
                <div className="text-lg font-medium text-gray-700 mb-1">
                  No Pull Requests Yet
                </div>
                <div className="text-sm text-gray-500 text-center">
                  This repository hasn't had any pull requests yet.
                  <br />
                  Ready for collaboration and code reviews! 🚀
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Issue Health */}
        <div className="p-4 bg-gradient-to-br from-red-50 to-orange-50 rounded-lg border border-red-200">
          <h4 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Issue Management Health
          </h4>
          {metrics.issues.total > 0 ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-red-700">Resolution Rate</span>
                <span
                  className="font-semibold"
                  style={{ color: issueHealth.color }}
                >
                  {issueHealth.level}
                </span>
              </div>
              <div className="w-full bg-red-200 rounded-full h-3">
                <div
                  className="h-3 rounded-full transition-all duration-300"
                  style={{
                    width: `${metrics.issues.resolutionRate}%`,
                    backgroundColor: issueHealth.color,
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-red-600">Avg Resolution:</span>
                  <div className="font-medium text-red-900">
                    {metrics.issues.avgResolutionTime} days
                  </div>
                </div>
                <div>
                  <span className="text-red-600">Recent Activity:</span>
                  <div className="font-medium text-red-900">
                    {metrics.issues.recent} new issues
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <Smile className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-sm text-red-700">
                No issues to track yet - that's a good sign!
              </div>
            </div>
          )}
        </div>

        {/* PR Health */}
        <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            PR Management Health
          </h4>
          {metrics.pullRequests.total > 0 ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-blue-700">Merge Rate</span>
                <span
                  className="font-semibold"
                  style={{ color: prHealth.color }}
                >
                  {prHealth.level}
                </span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-3">
                <div
                  className="h-3 rounded-full transition-all duration-300"
                  style={{
                    width: `${metrics.pullRequests.mergeRate}%`,
                    backgroundColor: prHealth.color,
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-600">Avg Merge Time:</span>
                  <div className="font-medium text-blue-900">
                    {metrics.pullRequests.avgMergeTime} days
                  </div>
                </div>
                <div>
                  <span className="text-blue-600">Recent Activity:</span>
                  <div className="font-medium text-blue-900">
                    {metrics.pullRequests.recent} new PRs
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <FileText className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-sm text-blue-700">
                Ready to start collaborating with pull requests!
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default IssueAndPRAnalyticsChart;
