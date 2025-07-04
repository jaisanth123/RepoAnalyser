import { motion } from "framer-motion";

const StatsCard = ({ title, value, icon: Icon, color, trend }) => {
  const colorClasses = {
    blue: {
      bg: "bg-blue-50",
      text: "text-blue-600",
      icon: "text-blue-500",
      border: "border-blue-200",
    },
    green: {
      bg: "bg-green-50",
      text: "text-green-600",
      icon: "text-green-500",
      border: "border-green-200",
    },
    purple: {
      bg: "bg-purple-50",
      text: "text-purple-600",
      icon: "text-purple-500",
      border: "border-purple-200",
    },
    orange: {
      bg: "bg-orange-50",
      text: "text-orange-600",
      icon: "text-orange-500",
      border: "border-orange-200",
    },
    red: {
      bg: "bg-red-50",
      text: "text-red-600",
      icon: "text-red-500",
      border: "border-red-200",
    },
  };

  const theme = colorClasses[color] || colorClasses.blue;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={`bg-white rounded-xl p-6 border ${theme.border} shadow-sm hover:shadow-md transition-all duration-200`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${theme.bg}`}>
          <Icon className={`h-6 w-6 ${theme.icon}`} />
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{title}</div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className={`text-sm font-medium ${theme.text}`}>{trend}</div>
        <div className="text-xs text-gray-400">vs last period</div>
      </div>
    </motion.div>
  );
};

export default StatsCard;
