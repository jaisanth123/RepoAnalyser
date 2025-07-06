import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";
import { Code, TrendingUp, Target, Zap } from "lucide-react";

const LanguageChart = ({ data }) => {
  // data is already an array of {name, value, bytes} objects
  const chartData = data || [];

  const COLORS = {
    JavaScript: "#f7df1e",
    TypeScript: "#3178c6",
    Python: "#3776ab",
    Java: "#ed8b00",
    "C++": "#00599c",
    "C#": "#239120",
    PHP: "#777bb4",
    Ruby: "#cc342d",
    Go: "#00add8",
    Rust: "#dea584",
    Swift: "#fa7343",
    Kotlin: "#7f52ff",
    HTML: "#e34c26",
    CSS: "#1572b6",
    Vue: "#4fc08d",
    React: "#61dafb",
    Dart: "#0175c2",
    Shell: "#89e051",
    Dockerfile: "#384d54",
    SCSS: "#cf649a",
    Less: "#1d365d",
    Stylus: "#ff6347",
    Other: "#6b7280",
  };

  const getColor = (name) => COLORS[name] || COLORS["Other"];

  // Calculate language insights
  const calculateLanguageInsights = () => {
    if (!chartData.length) return {};

    const totalBytes = chartData.reduce(
      (sum, lang) => sum + (lang.bytes || 0),
      0
    );
    const primaryLanguage = chartData[0];
    const languageCount = chartData.length;

    // Determine language diversity
    const isDiverse = languageCount > 3 && primaryLanguage.value < 70;

    // Calculate complexity score
    const complexityScore = Math.min(
      100,
      languageCount * 15 + (isDiverse ? 25 : 0)
    );

    // Determine project type based on languages
    const getProjectType = () => {
      const languages = chartData.map((l) => l.name.toLowerCase());

      if (
        languages.includes("javascript") ||
        languages.includes("typescript")
      ) {
        if (languages.includes("html") || languages.includes("css")) {
          return { type: "Web Application", icon: "🌐", color: "#3b82f6" };
        }
        return { type: "JavaScript Project", icon: "⚡", color: "#f59e0b" };
      }

      if (languages.includes("python")) {
        return { type: "Python Project", icon: "🐍", color: "#3776ab" };
      }

      if (languages.includes("java")) {
        return { type: "Java Application", icon: "☕", color: "#ed8b00" };
      }

      if (languages.includes("c++") || languages.includes("c")) {
        return { type: "Systems Programming", icon: "⚙️", color: "#00599c" };
      }

      if (languages.includes("swift")) {
        return { type: "iOS Application", icon: "📱", color: "#fa7343" };
      }

      if (languages.includes("kotlin")) {
        return { type: "Android Application", icon: "🤖", color: "#7f52ff" };
      }

      return { type: "Multi-Language Project", icon: "🔧", color: "#6b7280" };
    };

    const projectType = getProjectType();

    return {
      primaryLanguage,
      languageCount,
      isDiverse,
      complexityScore,
      projectType,
      totalBytes,
    };
  };

  const insights = calculateLanguageInsights();

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: getColor(data.payload.name) }}
            />
            <p className="font-semibold text-gray-900">{data.payload.name}</p>
          </div>
          <div className="space-y-1 text-sm">
            <p>
              <span className="text-gray-600">Percentage:</span>{" "}
              <span className="font-medium">{data.value}%</span>
            </p>
            <p>
              <span className="text-gray-600">Size:</span>{" "}
              <span className="font-medium">
                {data.payload.bytes?.toLocaleString()} bytes
              </span>
            </p>
            <p>
              <span className="text-gray-600">Lines:</span>{" "}
              <span className="font-medium">
                ~{Math.round((data.payload.bytes || 0) / 50)} lines
              </span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  if (!chartData.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
        <div className="text-center py-8">
          <Code className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No language data available</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Code className="w-5 h-5 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-900">
            Language Composition
          </h3>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{insights.projectType?.icon}</span>
            <span
              className="font-semibold"
              style={{ color: insights.projectType?.color }}
            >
              {insights.projectType?.type}
            </span>
          </div>
        </div>
      </div>

      {/* Language Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-900">
            {insights.languageCount}
          </div>
          <div className="text-sm text-blue-700">Languages</div>
        </div>

        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-900">
            {insights.complexityScore}
          </div>
          <div className="text-sm text-green-700">Complexity</div>
        </div>

        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-900">
            {insights.primaryLanguage?.value || 0}%
          </div>
          <div className="text-sm text-purple-700">Primary</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Pie Chart */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Distribution</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) =>
                    value > 5 ? `${name}: ${value}%` : ""
                  }
                  labelLine={false}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getColor(entry.name)} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">
            Language Breakdown
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData.slice(0, 6)}
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
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getColor(entry.name)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Language Details */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900">Language Details</h4>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {chartData.slice(0, 8).map((lang, index) => (
            <motion.div
              key={lang.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: getColor(lang.name) }}
                />
                <div>
                  <div className="font-medium text-gray-900">{lang.name}</div>
                  <div className="text-xs text-gray-600">
                    {lang.bytes?.toLocaleString()} bytes
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">{lang.value}%</div>
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${lang.value}%`,
                      backgroundColor: getColor(lang.name),
                    }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Language Analysis */}
      <div className="mt-6 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
        <h4 className="font-semibold text-indigo-900 mb-3 flex items-center gap-2">
          <Target className="w-4 h-4" />
          Language Analysis
        </h4>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-indigo-700">Diversity Score</span>
              <span className="font-semibold text-indigo-900">
                {insights.isDiverse ? "High" : "Moderate"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-indigo-700">Primary Language</span>
              <span className="font-semibold text-indigo-900">
                {insights.primaryLanguage?.name || "N/A"}
              </span>
            </div>
          </div>
          <div className="text-sm text-indigo-600">
            {insights.isDiverse
              ? `Diverse codebase with ${insights.languageCount} languages, promoting flexibility and multi-domain expertise.`
              : `Focused project primarily using ${insights.primaryLanguage?.name}, ensuring consistency and specialization.`}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LanguageChart;
