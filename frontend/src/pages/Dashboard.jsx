import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  GitCommit,
  Star,
  GitFork,
  Clock,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Code2,
} from "lucide-react";
import StatsCard from "../components/Cards/StatsCard";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  // Mock data - replace with real data from props or API
  const stats = [
    {
      title: "Total Commits",
      value: "1,234",
      icon: GitCommit,
      color: "blue",
      trend: "+15% this month",
    },
    {
      title: "Active Contributors",
      value: "24",
      icon: Users,
      color: "green",
      trend: "+3 this week",
    },
    {
      title: "Stars Growth",
      value: "89",
      icon: Star,
      color: "purple",
      trend: "+12 this week",
    },
    {
      title: "Forks",
      value: "156",
      icon: GitFork,
      color: "orange",
      trend: "+8 this month",
    },
    {
      title: "Issues Open",
      value: "23",
      icon: AlertTriangle,
      color: "red",
      trend: "-5 resolved",
    },
    {
      title: "Pull Requests",
      value: "12",
      icon: CheckCircle,
      color: "green",
      trend: "4 merged today",
    },
  ];

  const commitTrend = [
    { date: "2024-12-09", commits: 12 },
    { date: "2024-12-10", commits: 19 },
    { date: "2024-12-11", commits: 8 },
    { date: "2024-12-12", commits: 25 },
    { date: "2024-12-13", commits: 15 },
    { date: "2024-12-14", commits: 30 },
    { date: "2024-12-15", commits: 18 },
  ];

  const topContributors = [
    { name: "Alice Johnson", commits: 142, avatar: "👩‍💻" },
    { name: "Bob Smith", commits: 98, avatar: "👨‍💻" },
    { name: "Carol Davis", commits: 76, avatar: "👩‍🔬" },
    { name: "David Wilson", commits: 54, avatar: "👨‍🎨" },
    { name: "Eva Brown", commits: 42, avatar: "👩‍💼" },
  ];

  const recentActivity = [
    {
      action: "Merged PR #45",
      user: "Alice Johnson",
      time: "2 hours ago",
      type: "merge",
    },
    {
      action: "Opened issue #123",
      user: "Bob Smith",
      time: "4 hours ago",
      type: "issue",
    },
    {
      action: "Pushed 3 commits",
      user: "Carol Davis",
      time: "6 hours ago",
      type: "commit",
    },
    {
      action: "Created release v2.1.0",
      user: "David Wilson",
      time: "1 day ago",
      type: "release",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Repository Dashboard
          </h1>
          <p className="text-gray-600">
            Comprehensive overview of repository metrics and activity
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div key={stat.title} variants={itemVariants}>
              <StatsCard {...stat} />
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Commit Trend Chart */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Commit Trend (Last 7 Days)
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={commitTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    tickFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                  />
                  <Tooltip
                    labelFormatter={(value) =>
                      new Date(value).toLocaleDateString()
                    }
                    formatter={(value) => [`${value} commits`, "Commits"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="commits"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: "#3b82f6", strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, stroke: "#3b82f6", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Top Contributors */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Top Contributors
            </h3>
            <div className="space-y-4">
              {topContributors.map((contributor, index) => (
                <div
                  key={contributor.name}
                  className="flex items-center space-x-4"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg">
                      {contributor.avatar}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {contributor.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {contributor.commits} commits
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        index === 0
                          ? "bg-yellow-100 text-yellow-800"
                          : index === 1
                          ? "bg-gray-100 text-gray-800"
                          : index === 2
                          ? "bg-orange-100 text-orange-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      #{index + 1}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => {
              const getIcon = (type) => {
                switch (type) {
                  case "merge":
                    return <CheckCircle className="h-5 w-5 text-green-500" />;
                  case "issue":
                    return (
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    );
                  case "commit":
                    return <GitCommit className="h-5 w-5 text-blue-500" />;
                  case "release":
                    return <Star className="h-5 w-5 text-purple-500" />;
                  default:
                    return <Code2 className="h-5 w-5 text-gray-500" />;
                }
              };

              return (
                <motion.div
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-shrink-0">{getIcon(activity.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-500">
                      by {activity.user} • {activity.time}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
