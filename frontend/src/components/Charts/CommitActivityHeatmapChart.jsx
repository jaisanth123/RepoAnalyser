import { motion } from "framer-motion";
import { Clock, Calendar, Users, TrendingUp, Activity } from "lucide-react";
import { format, parseISO, getDay, getHours } from "date-fns";

const CommitActivityHeatmapChart = ({ commits = [], repository }) => {
  // Process commit data for heatmap
  const processHeatmapData = () => {
    if (!commits.length) return { heatmapData: [], insights: {} };

    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const hours = Array.from({ length: 24 }, (_, i) => i);

    // Initialize heatmap grid
    const heatmapGrid = {};
    days.forEach((day) => {
      heatmapGrid[day] = {};
      hours.forEach((hour) => {
        heatmapGrid[day][hour] = 0;
      });
    });

    // Count commits by day of week and hour
    commits.forEach((commit) => {
      try {
        const commitDate = parseISO(
          commit.commit?.author?.date || commit.commit?.committer?.date
        );
        const dayOfWeek = days[getDay(commitDate)];
        const hourOfDay = getHours(commitDate);

        heatmapGrid[dayOfWeek][hourOfDay]++;
      } catch (error) {
        // Skip invalid dates
      }
    });

    // Convert to array format for rendering
    const heatmapData = [];
    days.forEach((day, dayIndex) => {
      hours.forEach((hour) => {
        heatmapData.push({
          day,
          dayIndex,
          hour,
          commits: heatmapGrid[day][hour],
          dayHour: `${day}-${hour}`,
        });
      });
    });

    return { heatmapData, heatmapGrid };
  };

  const calculateInsights = (heatmapGrid) => {
    const days = Object.keys(heatmapGrid);
    const hours = Array.from({ length: 24 }, (_, i) => i);

    // Find peak activity periods
    let maxCommits = 0;
    let peakDay = "";
    let peakHour = 0;

    days.forEach((day) => {
      hours.forEach((hour) => {
        if (heatmapGrid[day][hour] > maxCommits) {
          maxCommits = heatmapGrid[day][hour];
          peakDay = day;
          peakHour = hour;
        }
      });
    });

    // Calculate day-wise totals
    const dayTotals = days.map((day) => ({
      day,
      total: hours.reduce((sum, hour) => sum + heatmapGrid[day][hour], 0),
    }));

    // Calculate hour-wise totals
    const hourTotals = hours.map((hour) => ({
      hour,
      total: days.reduce((sum, day) => sum + heatmapGrid[day][hour], 0),
    }));

    // Find most active day and hour
    const mostActiveDay = dayTotals.reduce((max, current) =>
      current.total > max.total ? current : max
    );

    const mostActiveHour = hourTotals.reduce((max, current) =>
      current.total > max.total ? current : max
    );

    // Calculate working patterns
    const weekdayCommits = dayTotals
      .filter((d) => !["Saturday", "Sunday"].includes(d.day))
      .reduce((sum, d) => sum + d.total, 0);

    const weekendCommits = dayTotals
      .filter((d) => ["Saturday", "Sunday"].includes(d.day))
      .reduce((sum, d) => sum + d.total, 0);

    const totalCommits = weekdayCommits + weekendCommits;
    const weekendPercentage =
      totalCommits > 0 ? Math.round((weekendCommits / totalCommits) * 100) : 0;

    // Business hours analysis (9 AM - 5 PM)
    const businessHourCommits = hourTotals
      .filter((h) => h.hour >= 9 && h.hour <= 17)
      .reduce((sum, h) => sum + h.total, 0);

    const businessHourPercentage =
      totalCommits > 0
        ? Math.round((businessHourCommits / totalCommits) * 100)
        : 0;

    // Time zone analysis (rough estimate based on peak hours)
    const getTimeZoneEstimate = (peakHour) => {
      if (peakHour >= 9 && peakHour <= 17) return "Standard Business Hours";
      if (peakHour >= 18 && peakHour <= 23) return "Evening Hours";
      if (peakHour >= 0 && peakHour <= 6) return "Night Hours";
      return "Early Morning Hours";
    };

    return {
      peakActivity: {
        day: peakDay,
        hour: peakHour,
        commits: maxCommits,
        timeZone: getTimeZoneEstimate(peakHour),
      },
      mostActiveDay: mostActiveDay.day,
      mostActiveHour: mostActiveHour.hour,
      weekendPercentage,
      businessHourPercentage,
      totalCommits,
      dayTotals,
      hourTotals,
    };
  };

  const { heatmapData, heatmapGrid } = processHeatmapData();
  const insights = calculateInsights(heatmapGrid);

  // Get color intensity based on commit count
  const getHeatmapColor = (commits, maxCommits) => {
    if (commits === 0) return "#f9fafb";
    const intensity = commits / maxCommits;
    if (intensity <= 0.2) return "#dbeafe";
    if (intensity <= 0.4) return "#93c5fd";
    if (intensity <= 0.6) return "#60a5fa";
    if (intensity <= 0.8) return "#3b82f6";
    return "#1d4ed8";
  };

  const maxCommits = Math.max(...heatmapData.map((d) => d.commits));

  const formatHour = (hour) => {
    if (hour === 0) return "12 AM";
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return "12 PM";
    return `${hour - 12} PM`;
  };

  const getWorkPatternInsight = () => {
    if (insights.businessHourPercentage >= 70) {
      return {
        text: "Traditional business hours pattern",
        color: "text-blue-600",
        icon: "🏢",
      };
    }
    if (insights.weekendPercentage >= 30) {
      return {
        text: "High weekend activity",
        color: "text-purple-600",
        icon: "🌙",
      };
    }
    if (insights.peakActivity.hour >= 18 || insights.peakActivity.hour <= 6) {
      return {
        text: "Night owl development pattern",
        color: "text-indigo-600",
        icon: "🌙",
      };
    }
    return {
      text: "Flexible working hours",
      color: "text-green-600",
      icon: "⚡",
    };
  };

  const workPattern = getWorkPatternInsight();

  if (!commits.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No commit data available for heatmap</p>
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
          <Clock className="w-5 h-5 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-900">
            Commit Activity Heatmap
          </h3>
        </div>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <Calendar className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <div className="text-lg font-bold text-blue-900">
            {insights.mostActiveDay}
          </div>
          <div className="text-sm text-blue-700">Most Active Day</div>
        </div>

        <div className="text-center p-3 bg-green-50 rounded-lg">
          <Clock className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <div className="text-lg font-bold text-green-900">
            {formatHour(insights.mostActiveHour)}
          </div>
          <div className="text-sm text-green-700">Peak Hour</div>
        </div>

        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <Users className="w-6 h-6 text-purple-600 mx-auto mb-2" />
          <div className="text-lg font-bold text-purple-900">
            {insights.weekendPercentage}%
          </div>
          <div className="text-sm text-purple-700">Weekend Activity</div>
        </div>

        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <TrendingUp className="w-6 h-6 text-orange-600 mx-auto mb-2" />
          <div className="text-lg font-bold text-orange-900">
            {insights.businessHourPercentage}%
          </div>
          <div className="text-sm text-orange-700">Business Hours</div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-900">
            Weekly Activity Pattern
          </h4>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Less</span>
            <div className="flex gap-1">
              {[0, 0.2, 0.4, 0.6, 0.8, 1].map((intensity, index) => (
                <div
                  key={index}
                  className="w-3 h-3 rounded-sm"
                  style={{
                    backgroundColor: getHeatmapColor(
                      intensity * maxCommits,
                      maxCommits
                    ),
                  }}
                />
              ))}
            </div>
            <span>More</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* Hour labels */}
            <div className="flex mb-2">
              <div className="w-20"></div> {/* Space for day labels */}
              {Array.from({ length: 24 }, (_, hour) => (
                <div
                  key={hour}
                  className="flex-shrink-0 w-6 h-6 text-xs text-gray-600 text-center"
                >
                  {hour % 4 === 0 ? hour : ""}
                </div>
              ))}
            </div>

            {/* Heatmap grid */}
            {[
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ].map((day) => (
              <div key={day} className="flex items-center mb-1">
                <div className="w-20 text-sm text-gray-700 text-right pr-2">
                  {day.slice(0, 3)}
                </div>
                {Array.from({ length: 24 }, (_, hour) => {
                  const commits = heatmapGrid[day]?.[hour] || 0;
                  return (
                    <motion.div
                      key={`${day}-${hour}`}
                      className="flex-shrink-0 w-6 h-6 rounded-sm border border-gray-200 cursor-pointer relative group"
                      style={{
                        backgroundColor: getHeatmapColor(commits, maxCommits),
                      }}
                      whileHover={{ scale: 1.2, zIndex: 10 }}
                      title={`${day} ${formatHour(hour)}: ${commits} commits`}
                    >
                      {/* Tooltip on hover */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                        {day} {formatHour(hour)}: {commits} commits
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Day Distribution */}
        <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Daily Distribution
          </h4>
          <div className="space-y-2">
            {insights.dayTotals
              .sort((a, b) => b.total - a.total)
              .slice(0, 7)
              .map((day, index) => (
                <div
                  key={day.day}
                  className="flex items-center justify-between"
                >
                  <span className="text-blue-700 text-sm">{day.day}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-blue-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-blue-600"
                        style={{
                          width: `${
                            (day.total / insights.dayTotals[0].total) * 100
                          }%`,
                        }}
                      />
                    </div>
                    <span className="text-blue-900 font-medium text-sm w-8 text-right">
                      {day.total}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Work Pattern Analysis */}
        <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
          <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Work Pattern Analysis
          </h4>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{workPattern.icon}</span>
              <span className={`font-medium ${workPattern.color}`}>
                {workPattern.text}
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-green-700">Peak Activity:</span>
                <span className="text-green-900 font-medium">
                  {insights.peakActivity.day} at{" "}
                  {formatHour(insights.peakActivity.hour)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-green-700">Time Zone Pattern:</span>
                <span className="text-green-900 font-medium">
                  {insights.peakActivity.timeZone}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-green-700">Work-Life Balance:</span>
                <span className="text-green-900 font-medium">
                  {insights.weekendPercentage < 20
                    ? "Good"
                    : "High weekend work"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Insights Summary */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">Activity Insights</h4>
        <div className="text-sm text-gray-700 space-y-1">
          <div>
            📊 Peak activity occurs on {insights.mostActiveDay}s at{" "}
            {formatHour(insights.mostActiveHour)} with{" "}
            {insights.peakActivity.commits} commits
          </div>

          {insights.businessHourPercentage >= 60 ? (
            <div>
              🏢 {insights.businessHourPercentage}% of commits happen during
              business hours (9 AM - 5 PM)
            </div>
          ) : (
            <div>
              🌙 Flexible working schedule with{" "}
              {100 - insights.businessHourPercentage}% of commits outside
              business hours
            </div>
          )}

          {insights.weekendPercentage >= 25 ? (
            <div>
              ⚠️ High weekend activity ({insights.weekendPercentage}%) -
              consider work-life balance
            </div>
          ) : (
            <div>
              ✅ Healthy work-life balance with {insights.weekendPercentage}%
              weekend activity
            </div>
          )}

          <div>
            🕒 Development spans across{" "}
            {insights.hourTotals.filter((h) => h.total > 0).length} different
            hours of the day
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CommitActivityHeatmapChart;
