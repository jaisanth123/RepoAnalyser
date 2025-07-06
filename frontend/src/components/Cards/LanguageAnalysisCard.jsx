import { Code } from "lucide-react";

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
    };
    return colors[language] || "#6b7280";
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
      <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
        <Code className="w-5 h-5 text-blue-600" />
        Language Analysis
      </h3>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-blue-700">Languages</span>
          <span className="font-bold text-blue-900 text-lg">
            {languageDiversity.count}
          </span>
        </div>

        <div className="space-y-2">
          {languageDiversity.languageBreakdown
            .slice(0, 4)
            .map((lang, index) => (
              <div
                key={lang.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: getLanguageColor(lang.name),
                    }}
                  />
                  <span className="text-sm text-blue-800">{lang.name}</span>
                </div>
                <span className="text-sm font-medium text-blue-900">
                  {lang.percentage}%
                </span>
              </div>
            ))}
        </div>

        <div className="flex justify-between pt-2 border-t border-blue-200">
          <span className="text-blue-700">Complexity</span>
          <span className="font-semibold text-blue-900">
            {languageDiversity.isDiverse ? "High" : "Moderate"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LanguageAnalysisCard;
