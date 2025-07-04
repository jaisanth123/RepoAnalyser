import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { motion } from "framer-motion";

const LanguageChart = ({ data }) => {
  // data is already an array of {name, value, bytes} objects
  const chartData = data || [];

  const COLORS = {
    JavaScript: "#f7df1e",
    TypeScript: "#3178c6",
    Python: "#3776ab",
    Java: "#ed8b00",
    "C++": "#00599c",
    Go: "#00add8",
    Rust: "#ce422b",
    CSS: "#1572b6",
    HTML: "#e34f26",
    Other: "#6b7280",
  };

  const getColor = (name) => COLORS[name] || COLORS["Other"];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-slate-800 p-3 rounded-lg shadow-lg border border-white/20 backdrop-blur-sm">
          <p className="font-semibold text-white">{data.payload.name}</p>
          <p className="text-sm text-gray-300">{data.value}%</p>
          <p className="text-xs text-gray-400">
            {data.payload.bytes?.toLocaleString()} bytes
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl"
    >
      <h3 className="text-xl font-bold text-white mb-6">
        Language Distribution
      </h3>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}%`}
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

      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        {chartData.map((entry, index) => (
          <div key={entry.name} className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: getColor(entry.name) }}
            ></div>
            <span className="text-sm text-gray-300">
              {entry.name} ({entry.value}%)
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default LanguageChart;
