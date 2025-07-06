import { Code } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const LanguageAnalysisCard = ({ languageDiversity }) => {
  const getLanguageColor = (language) => {
    const colors = {
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
      PowerShell: "#012456",
      Makefile: "#427819",
    };
    return colors[language] || "#6b7280";
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return "0 bytes";
    const k = 1024;
    const sizes = ["bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      parseFloat((bytes / Math.pow(k, i)).toFixed(2)).toLocaleString() +
      " " +
      sizes[i]
    );
  };

  // Prepare data for pie chart
  const pieData = languageDiversity.languageBreakdown.map((lang) => ({
    name: lang.name,
    value: lang.percentage,
    color: getLanguageColor(lang.name),
    bytes: lang.bytes,
  }));

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
      <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
        <Code className="w-5 h-5 text-blue-600" />
        Language Composition
      </h3>

      <div className="grid grid-cols-5 gap-4 h-48">
        {/* Pie Chart - Left Side (2 columns) */}
        <div className="col-span-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={70}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Language List - Right Side (3 columns) */}
        <div className="col-span-3 overflow-y-auto">
          <div className="space-y-2">
            {languageDiversity.languageBreakdown.map((lang, index) => (
              <div
                key={lang.name}
                className="flex items-center justify-between p-2 bg-white/60 rounded-lg"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: getLanguageColor(lang.name),
                    }}
                  />
                  <span className="text-sm font-medium text-blue-900 truncate">
                    {lang.name}
                  </span>
                </div>
                <div className="text-right ml-2 flex-shrink-0">
                  <div className="text-xs text-blue-700">
                    {formatBytes(lang.bytes)}
                  </div>
                  <div className="text-sm font-bold text-blue-900">
                    {lang.percentage}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageAnalysisCard;
