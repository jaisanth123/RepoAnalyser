import { motion } from "framer-motion";
import { Users, GitCommit, Calendar, Award, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const Contributors = () => {
  const contributors = [
    {
      id: 1,
      name: "Alice Johnson",
      username: "alice_codes",
      avatar: "👩‍💻",
      commits: 342,
      additions: 15420,
      deletions: 8320,
      firstCommit: "2024-01-15",
      lastCommit: "2024-12-14",
      languages: ["JavaScript", "TypeScript", "CSS"],
      activeMonths: 11,
      weeklyActivity: [
        { week: "W1", commits: 8 },
        { week: "W2", commits: 12 },
        { week: "W3", commits: 15 },
        { week: "W4", commits: 10 },
      ],
    },
    {
      id: 2,
      name: "Bob Smith",
      username: "bob_dev",
      avatar: "👨‍💻",
      commits: 234,
      additions: 12340,
      deletions: 5670,
      firstCommit: "2024-02-20",
      lastCommit: "2024-12-13",
      languages: ["Python", "JavaScript", "Go"],
      activeMonths: 10,
      weeklyActivity: [
        { week: "W1", commits: 6 },
        { week: "W2", commits: 9 },
        { week: "W3", commits: 11 },
        { week: "W4", commits: 7 },
      ],
    },
    {
      id: 3,
      name: "Carol Davis",
      username: "carol_design",
      avatar: "👩‍🔬",
      commits: 156,
      additions: 8900,
      deletions: 3400,
      firstCommit: "2024-03-10",
      lastCommit: "2024-12-12",
      languages: ["CSS", "HTML", "JavaScript"],
      activeMonths: 9,
      weeklyActivity: [
        { week: "W1", commits: 4 },
        { week: "W2", commits: 7 },
        { week: "W3", commits: 8 },
        { week: "W4", commits: 5 },
      ],
    },
  ];

  const teamActivity = [
    { month: "Jan", commits: 45 },
    { month: "Feb", commits: 62 },
    { month: "Mar", commits: 78 },
    { month: "Apr", commits: 89 },
    { month: "May", commits: 95 },
    { month: "Jun", commits: 112 },
    { month: "Jul", commits: 134 },
    { month: "Aug", commits: 156 },
    { month: "Sep", commits: 142 },
    { month: "Oct", commits: 168 },
    { month: "Nov", commits: 187 },
    { month: "Dec", commits: 203 },
  ];

  const getBadge = (commits) => {
    if (commits >= 300)
      return {
        text: "Core Contributor",
        color: "bg-purple-100 text-purple-800",
      };
    if (commits >= 200)
      return { text: "Active Contributor", color: "bg-blue-100 text-blue-800" };
    if (commits >= 100)
      return {
        text: "Regular Contributor",
        color: "bg-green-100 text-green-800",
      };
    return { text: "New Contributor", color: "bg-gray-100 text-gray-800" };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Contributors Analysis
        </h1>
        <p className="text-gray-600">
          Detailed insights into team contributions and activity patterns
        </p>
      </motion.div>

      {/* Team Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
        >
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {contributors.length}
              </p>
              <p className="text-sm text-gray-500">Total Contributors</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
        >
          <div className="flex items-center space-x-3">
            <GitCommit className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {contributors.reduce((sum, c) => sum + c.commits, 0)}
              </p>
              <p className="text-sm text-gray-500">Total Commits</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
        >
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-8 w-8 text-purple-500" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {contributors
                  .reduce((sum, c) => sum + c.additions, 0)
                  .toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Lines Added</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
        >
          <div className="flex items-center space-x-3">
            <Calendar className="h-8 w-8 text-orange-500" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(
                  contributors.reduce((sum, c) => sum + c.activeMonths, 0) /
                    contributors.length
                )}
              </p>
              <p className="text-sm text-gray-500">Avg. Active Months</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Team Activity Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-8"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-6">
          Team Activity Trend
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={teamActivity}>
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
              <Tooltip formatter={(value) => [`${value} commits`, "Commits"]} />
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

      {/* Contributors List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">
            Contributor Details
          </h3>
        </div>

        <div className="divide-y divide-gray-200">
          {contributors.map((contributor, index) => {
            const badge = getBadge(contributor.commits);

            return (
              <motion.div
                key={contributor.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start space-x-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl">
                      {contributor.avatar}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {contributor.name}
                      </h4>
                      <span className="text-sm text-gray-500">
                        @{contributor.username}
                      </span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}
                      >
                        {badge.text}
                      </span>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                      <div>
                        <p className="text-2xl font-bold text-blue-600">
                          {contributor.commits}
                        </p>
                        <p className="text-xs text-gray-500">Commits</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-green-600">
                          +{contributor.additions.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">Additions</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-red-600">
                          -{contributor.deletions.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">Deletions</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-purple-600">
                          {contributor.activeMonths}
                        </p>
                        <p className="text-xs text-gray-500">Active Months</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-orange-600">
                          {contributor.languages.length}
                        </p>
                        <p className="text-xs text-gray-500">Languages</p>
                      </div>
                    </div>

                    {/* Languages */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {contributor.languages.map((lang) => (
                        <span
                          key={lang}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>

                    {/* Weekly Activity Chart */}
                    <div className="h-24">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={contributor.weeklyActivity}>
                          <Bar
                            dataKey="commits"
                            fill="#3b82f6"
                            radius={[2, 2, 0, 0]}
                          />
                          <Tooltip
                            formatter={(value) => [
                              `${value} commits`,
                              "Commits",
                            ]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default Contributors;
