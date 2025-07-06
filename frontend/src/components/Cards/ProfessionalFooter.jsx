import { FileText, Download, Globe, Calendar } from "lucide-react";
import { format } from "date-fns";

const ProfessionalFooter = ({ repository }) => {
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return "Unknown";
    }
  };

  const formatLicense = (license) => {
    if (!license) return "No License";
    return license.name || license.spdx_id || "Unknown License";
  };

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
    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
      <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
        {repository.language && (
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: getLanguageColor(repository.language),
              }}
            />
            <span className="font-medium">{repository.language}</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          <span>{formatLicense(repository.license)}</span>
        </div>

        <div className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          <span>{repository.clone_url ? "Cloneable" : "Private"}</span>
        </div>

        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4" />
          <span>
            {repository.homepage ? (
              <a
                href={repository.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                Website
              </a>
            ) : (
              "No website"
            )}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>Updated {formatDate(repository.updated_at)}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalFooter;
