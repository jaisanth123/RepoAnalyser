import { motion } from "framer-motion";
import {
  Folder,
  File,
  Code2,
  FileText,
  Layers,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const Codebase = () => {
  const fileStructure = [
    {
      name: "src/",
      type: "folder",
      size: "2.1 MB",
      files: 156,
      children: [
        { name: "components/", type: "folder", size: "890 KB", files: 42 },
        { name: "pages/", type: "folder", size: "654 KB", files: 28 },
        { name: "utils/", type: "folder", size: "234 KB", files: 18 },
        { name: "styles/", type: "folder", size: "123 KB", files: 12 },
      ],
    },
    { name: "public/", type: "folder", size: "345 KB", files: 23 },
    { name: "docs/", type: "folder", size: "89 KB", files: 8 },
    { name: "tests/", type: "folder", size: "567 KB", files: 34 },
  ];

  const codeMetrics = [
    {
      title: "Total Files",
      value: "234",
      icon: File,
      color: "blue",
      trend: "+12 this month",
    },
    {
      title: "Lines of Code",
      value: "45,672",
      icon: Code2,
      color: "green",
      trend: "+2,340 added",
    },
    {
      title: "Code Complexity",
      value: "6.2/10",
      icon: TrendingUp,
      color: "orange",
      trend: "Moderate",
    },
    {
      title: "Test Coverage",
      value: "78%",
      icon: CheckCircle,
      color: "purple",
      trend: "+5% improved",
    },
    {
      title: "Documentation",
      value: "65%",
      icon: FileText,
      color: "blue",
      trend: "Good coverage",
    },
    {
      title: "Technical Debt",
      value: "2.1 hrs",
      icon: Clock,
      color: "red",
      trend: "-30 min this week",
    },
  ];

  const languageBreakdown = [
    { name: "JavaScript", value: 15420, color: "#f7df1e" },
    { name: "TypeScript", value: 8930, color: "#3178c6" },
    { name: "CSS", value: 3420, color: "#1572b6" },
    { name: "HTML", value: 1890, color: "#e34f26" },
    { name: "JSON", value: 567, color: "#000000" },
  ];

  const complexityData = [
    { file: "UserController.js", complexity: 8.9, lines: 234 },
    { file: "DatabaseHelper.js", complexity: 7.8, lines: 189 },
    { file: "AuthMiddleware.js", complexity: 6.7, lines: 156 },
    { file: "ApiRoutes.js", complexity: 6.2, lines: 145 },
    { file: "ValidationUtils.js", complexity: 5.8, lines: 123 },
  ];

  const hotspots = [
    {
      file: "src/components/Dashboard.jsx",
      issues: 8,
      type: "complexity",
      severity: "high",
    },
    {
      file: "src/utils/dataProcessor.js",
      issues: 6,
      type: "duplication",
      severity: "medium",
    },
    {
      file: "src/pages/Settings.jsx",
      issues: 5,
      type: "maintainability",
      severity: "medium",
    },
    {
      file: "src/api/userService.js",
      issues: 4,
      type: "security",
      severity: "high",
    },
    {
      file: "src/components/Chart.jsx",
      issues: 3,
      type: "performance",
      severity: "low",
    },
  ];

  const getIcon = (type) => {
    return type === "folder" ? (
      <Folder className="h-5 w-5 text-blue-500" />
    ) : (
      <File className="h-5 w-5 text-gray-500" />
    );
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Codebase Analysis
        </h1>
        <p className="text-gray-600">
          Deep insights into code structure, quality, and complexity
        </p>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {codeMetrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-${metric.color}-50`}>
                <metric.icon className={`h-6 w-6 text-${metric.color}-500`} />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {metric.value}
                </div>
                <div className="text-sm text-gray-500">{metric.title}</div>
              </div>
            </div>
            <div className={`text-sm font-medium text-${metric.color}-600`}>
              {metric.trend}
            </div>
          </motion.div>
        ))}
      </div>

      {/* File Structure and Language Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* File Structure */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            File Structure
          </h3>
          <div className="space-y-3">
            {fileStructure.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center space-x-3">
                  {getIcon(item.type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">
                        {item.name}
                      </span>
                      <span className="text-sm text-gray-500">{item.size}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {item.files} files
                    </div>
                  </div>
                </div>
                {item.children && (
                  <div className="mt-3 ml-8 space-y-2">
                    {item.children.map((child, childIndex) => (
                      <div
                        key={childIndex}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center space-x-2">
                          {getIcon(child.type)}
                          <span className="text-gray-700">{child.name}</span>
                        </div>
                        <div className="text-gray-500">
                          {child.size} • {child.files} files
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Language Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Lines of Code by Language
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={languageBreakdown}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {languageBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [
                    `${value.toLocaleString()} lines`,
                    "Lines",
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Complexity Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-8"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-6">
          Code Complexity Analysis
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={complexityData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="file"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6b7280" }}
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6b7280" }}
              />
              <Tooltip
                formatter={(value) => [`${value}`, "Complexity Score"]}
              />
              <Bar dataKey="complexity" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Code Quality Hotspots */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">
            Code Quality Hotspots
          </h3>
          <p className="text-gray-600 mt-1">
            Files that need attention based on various quality metrics
          </p>
        </div>

        <div className="divide-y divide-gray-200">
          {hotspots.map((hotspot, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <AlertCircle
                      className={`h-6 w-6 ${
                        hotspot.severity === "high"
                          ? "text-red-500"
                          : hotspot.severity === "medium"
                          ? "text-yellow-500"
                          : "text-green-500"
                      }`}
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">
                      {hotspot.file}
                    </h4>
                    <p className="text-sm text-gray-500 capitalize">
                      {hotspot.type} issues
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-bold text-gray-900">
                    {hotspot.issues}
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSeverityColor(
                      hotspot.severity
                    )}`}
                  >
                    {hotspot.severity} priority
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Codebase;
