import { motion } from "framer-motion";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Lock,
  Key,
  Bug,
  Zap,
  Eye,
  Clock,
} from "lucide-react";
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

const Security = () => {
  const securityScore = 85;

  const securityMetrics = [
    {
      title: "Security Score",
      value: `${securityScore}/100`,
      icon: Shield,
      color: "green",
      trend: "Excellent",
    },
    {
      title: "Vulnerabilities",
      value: "3",
      icon: AlertTriangle,
      color: "red",
      trend: "2 critical, 1 medium",
    },
    {
      title: "Dependencies",
      value: "147",
      icon: Lock,
      color: "blue",
      trend: "12 outdated",
    },
    {
      title: "Last Scan",
      value: "2 hrs ago",
      icon: Clock,
      color: "purple",
      trend: "Up to date",
    },
    {
      title: "Security Tests",
      value: "89%",
      icon: CheckCircle,
      color: "green",
      trend: "Well covered",
    },
    {
      title: "Code Secrets",
      value: "0",
      icon: Key,
      color: "green",
      trend: "None detected",
    },
  ];

  const vulnerabilities = [
    {
      id: "CVE-2024-1234",
      severity: "critical",
      title: "Cross-Site Scripting (XSS)",
      description: "Potential XSS vulnerability in user input validation",
      file: "src/components/UserInput.jsx",
      line: 45,
      status: "open",
      cvssScore: 9.1,
      firstDetected: "2024-12-10",
    },
    {
      id: "CVE-2024-5678",
      severity: "critical",
      title: "SQL Injection",
      description: "Unsanitized database query in user service",
      file: "src/api/userService.js",
      line: 128,
      status: "open",
      cvssScore: 8.8,
      firstDetected: "2024-12-12",
    },
    {
      id: "CVE-2024-9101",
      severity: "medium",
      title: "Insecure Direct Object Reference",
      description: "Missing authorization check for user data access",
      file: "src/middleware/auth.js",
      line: 67,
      status: "in_progress",
      cvssScore: 6.5,
      firstDetected: "2024-12-13",
    },
  ];

  const dependencies = [
    {
      name: "react",
      version: "18.2.0",
      latestVersion: "18.2.0",
      status: "up-to-date",
      vulnerabilities: 0,
    },
    {
      name: "axios",
      version: "0.27.2",
      latestVersion: "1.6.2",
      status: "outdated",
      vulnerabilities: 2,
    },
    {
      name: "lodash",
      version: "4.17.20",
      latestVersion: "4.17.21",
      status: "outdated",
      vulnerabilities: 1,
    },
    {
      name: "express",
      version: "4.18.1",
      latestVersion: "4.18.2",
      status: "minor-update",
      vulnerabilities: 0,
    },
    {
      name: "bcrypt",
      version: "5.0.1",
      latestVersion: "5.1.0",
      status: "minor-update",
      vulnerabilities: 0,
    },
  ];

  const securityTrends = [
    { month: "Jan", vulnerabilities: 8, resolved: 6 },
    { month: "Feb", vulnerabilities: 12, resolved: 10 },
    { month: "Mar", vulnerabilities: 6, resolved: 8 },
    { month: "Apr", vulnerabilities: 15, resolved: 12 },
    { month: "May", vulnerabilities: 9, resolved: 11 },
    { month: "Jun", vulnerabilities: 7, resolved: 9 },
    { month: "Jul", vulnerabilities: 4, resolved: 6 },
    { month: "Aug", vulnerabilities: 11, resolved: 8 },
    { month: "Sep", vulnerabilities: 6, resolved: 9 },
    { month: "Oct", vulnerabilities: 3, resolved: 5 },
    { month: "Nov", vulnerabilities: 5, resolved: 4 },
    { month: "Dec", vulnerabilities: 3, resolved: 2 },
  ];

  const vulnerabilityDistribution = [
    { name: "Critical", value: 2, color: "#ef4444" },
    { name: "High", value: 0, color: "#f97316" },
    { name: "Medium", value: 1, color: "#eab308" },
    { name: "Low", value: 0, color: "#22c55e" },
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "up-to-date":
        return "bg-green-100 text-green-800";
      case "outdated":
        return "bg-red-100 text-red-800";
      case "minor-update":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "open":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "in_progress":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "resolved":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Security Analysis
        </h1>
        <p className="text-gray-600">
          Comprehensive security assessment and vulnerability management
        </p>
      </motion.div>

      {/* Security Score Overview */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 mb-8"
      >
        <div className="text-center">
          <div
            className={`text-6xl font-bold mb-4 ${getScoreColor(
              securityScore
            )}`}
          >
            {securityScore}/100
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Security Score
          </h3>
          <p className="text-gray-600">
            Your repository has a good security posture with room for
            improvement
          </p>
          <div className="mt-6 w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full ${
                securityScore >= 80
                  ? "bg-green-500"
                  : securityScore >= 60
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
              style={{ width: `${securityScore}%` }}
            ></div>
          </div>
        </div>
      </motion.div>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {securityMetrics.map((metric, index) => (
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

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Security Trends */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Security Trends
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={securityTrends}>
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
                <Tooltip />
                <Bar
                  dataKey="vulnerabilities"
                  fill="#ef4444"
                  name="New Vulnerabilities"
                  radius={[2, 2, 0, 0]}
                />
                <Bar
                  dataKey="resolved"
                  fill="#22c55e"
                  name="Resolved"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Vulnerability Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Current Vulnerabilities
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={vulnerabilityDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) =>
                    value > 0 ? `${name}: ${value}` : ""
                  }
                >
                  {vulnerabilityDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Vulnerabilities List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-8"
      >
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">
            Active Vulnerabilities
          </h3>
        </div>

        <div className="divide-y divide-gray-200">
          {vulnerabilities.map((vuln, index) => (
            <motion.div
              key={vuln.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 pt-1">
                    {getStatusIcon(vuln.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {vuln.title}
                      </h4>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSeverityColor(
                          vuln.severity
                        )}`}
                      >
                        {vuln.severity}
                      </span>
                      <span className="text-sm text-gray-500">
                        CVSS: {vuln.cvssScore}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{vuln.description}</p>
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <span>
                        📁 {vuln.file}:{vuln.line}
                      </span>
                      <span>🔍 {vuln.id}</span>
                      <span>📅 Detected: {vuln.firstDetected}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Dependencies Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">
            Dependency Security
          </h3>
          <p className="text-gray-600 mt-1">
            Security status of your project dependencies
          </p>
        </div>

        <div className="divide-y divide-gray-200">
          {dependencies.map((dep, index) => (
            <motion.div
              key={dep.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm">
                        📦
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">
                      {dep.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Current: {dep.version} → Latest: {dep.latestVersion}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      dep.status
                    )}`}
                  >
                    {dep.status.replace("-", " ")}
                  </span>
                  {dep.vulnerabilities > 0 && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {dep.vulnerabilities} vuln
                      {dep.vulnerabilities > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Security;
