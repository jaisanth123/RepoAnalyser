import {
  FolderOpen,
  File,
  Folder,
  Code,
  FileText,
  Image,
  Archive,
  Settings,
  ChevronRight,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { GitHubAPI } from "../../services/api";

const LanguageAnalysisCard = ({ repository }) => {
  const [fileStructure, setFileStructure] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [folderContents, setFolderContents] = useState({}); // Store contents of each folder
  const [loadingFolders, setLoadingFolders] = useState(new Set()); // Track which folders are loading
  const [error, setError] = useState(null);

  // Fetch repository file structure
  useEffect(() => {
    const fetchFileStructure = async () => {
      if (!repository) {
        console.warn("No repository object provided");
        return;
      }

      if (!repository.full_name) {
        console.error(
          "Repository object missing full_name property:",
          repository
        );
        setError("Invalid repository data");
        return;
      }

      setLoading(true);
      setError(null);
      try {
        console.log("Fetching file structure for:", repository.full_name);

        const [owner, repo] = repository.full_name.split("/");

        if (!owner || !repo) {
          throw new Error("Invalid repository format");
        }

        // Use the authenticated API service instead of raw fetch
        const contents = await GitHubAPI.getContents(owner, repo);

        console.log("File structure API response:", {
          count: contents?.length || 0,
          isArray: Array.isArray(contents),
          firstItem: contents?.[0],
        });

        if (Array.isArray(contents)) {
          setFileStructure(contents.slice(0, 20)); // Limit to first 20 items
        } else if (contents && typeof contents === "object") {
          // Handle single file case (if repo has only one file in root)
          console.log("Single file response, converting to array:", contents);
          setFileStructure([contents].slice(0, 20));
        } else {
          console.warn("API response is not an array or object:", contents);
          setFileStructure([]);
        }
      } catch (error) {
        console.error("Error fetching file structure:", error);
        setError(error.message || "Failed to fetch file structure");
        setFileStructure([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFileStructure();
  }, [repository]);

  // Fetch contents of a specific folder
  const fetchFolderContents = async (folderPath, folderName) => {
    if (!repository) return;

    const [owner, repo] = repository.full_name.split("/");
    setLoadingFolders((prev) => new Set([...prev, folderPath]));

    try {
      console.log(`Fetching contents of folder: ${folderPath}`);
      const contents = await GitHubAPI.getContents(owner, repo, folderPath);

      if (Array.isArray(contents)) {
        setFolderContents((prev) => ({
          ...prev,
          [folderPath]: contents.slice(0, 15), // Limit subfolder contents
        }));
      } else if (contents && typeof contents === "object") {
        setFolderContents((prev) => ({
          ...prev,
          [folderPath]: [contents],
        }));
      }
    } catch (error) {
      console.error(`Error fetching folder contents for ${folderPath}:`, error);
      setFolderContents((prev) => ({
        ...prev,
        [folderPath]: [], // Empty array on error
      }));
    } finally {
      setLoadingFolders((prev) => {
        const newSet = new Set(prev);
        newSet.delete(folderPath);
        return newSet;
      });
    }
  };

  const getFileIcon = (item) => {
    if (item.type === "dir") {
      return expandedFolders.has(item.path) ? FolderOpen : Folder;
    }

    const extension = item.name.split(".").pop()?.toLowerCase();
    const fileType = getFileType(extension, item.name);

    switch (fileType) {
      case "code":
        return Code;
      case "text":
        return FileText;
      case "image":
        return Image;
      case "archive":
        return Archive;
      case "config":
        return Settings;
      default:
        return File;
    }
  };

  const getFileType = (extension, filename) => {
    const codeExtensions = [
      "js",
      "jsx",
      "ts",
      "tsx",
      "py",
      "java",
      "cpp",
      "c",
      "cs",
      "php",
      "rb",
      "go",
      "rs",
      "swift",
      "kt",
    ];
    const textExtensions = ["md", "txt", "json", "yml", "yaml", "xml", "csv"];
    const imageExtensions = ["png", "jpg", "jpeg", "gif", "svg", "ico", "webp"];
    const archiveExtensions = ["zip", "tar", "gz", "rar", "7z"];
    const configFiles = [
      "package.json",
      "tsconfig.json",
      "webpack.config.js",
      "babel.config.js",
      ".gitignore",
      "dockerfile",
    ];

    if (codeExtensions.includes(extension)) return "code";
    if (textExtensions.includes(extension)) return "text";
    if (imageExtensions.includes(extension)) return "image";
    if (archiveExtensions.includes(extension)) return "archive";
    if (configFiles.includes(filename.toLowerCase())) return "config";

    return "file";
  };

  const getFileColor = (item) => {
    if (item.type === "dir") {
      return "text-blue-600";
    }

    const extension = item.name.split(".").pop()?.toLowerCase();
    const fileType = getFileType(extension, item.name);

    switch (fileType) {
      case "code":
        return "text-green-600";
      case "text":
        return "text-gray-600";
      case "image":
        return "text-purple-600";
      case "archive":
        return "text-orange-600";
      case "config":
        return "text-yellow-600";
      default:
        return "text-gray-500";
    }
  };

  const formatFileSize = (size) => {
    if (!size) return "";
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const toggleFolder = async (item) => {
    const folderPath = item.path || item.name;
    const isExpanded = expandedFolders.has(folderPath);

    const newExpanded = new Set(expandedFolders);
    if (isExpanded) {
      newExpanded.delete(folderPath);
    } else {
      newExpanded.add(folderPath);

      // Fetch folder contents if not already loaded
      if (!folderContents[folderPath]) {
        await fetchFolderContents(folderPath, item.name);
      }
    }
    setExpandedFolders(newExpanded);
  };

  const renderFileItem = (item, depth = 0) => {
    const IconComponent = getFileIcon(item);
    const isFolder = item.type === "dir";
    const folderPath = item.path || item.name;
    const isExpanded = expandedFolders.has(folderPath);
    const isLoading = loadingFolders.has(folderPath);
    const hasContents = folderContents[folderPath];

    return (
      <div key={`${folderPath}-${depth}`}>
        {/* Main item */}
        <div
          className={`flex items-center gap-2 p-2 rounded-lg hover:bg-white/60 transition-colors ${
            isFolder ? "cursor-pointer" : ""
          }`}
          style={{ paddingLeft: `${8 + depth * 16}px` }}
          onClick={() => isFolder && toggleFolder(item)}
        >
          {/* Chevron for folders */}
          {isFolder && (
            <div className="w-4 h-4 flex items-center justify-center">
              {isLoading ? (
                <Loader2 className="w-3 h-3 animate-spin text-gray-400" />
              ) : isExpanded ? (
                <ChevronDown className="w-3 h-3 text-gray-400" />
              ) : (
                <ChevronRight className="w-3 h-3 text-gray-400" />
              )}
            </div>
          )}

          {/* File/Folder icon */}
          <IconComponent
            className={`w-4 h-4 ${getFileColor(item)} flex-shrink-0`}
          />

          {/* Name and size */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span
                className={`text-sm font-medium truncate ${
                  isFolder ? "text-blue-900" : "text-gray-900"
                }`}
              >
                {item.name}
              </span>
              <div className="flex items-center gap-2 text-xs text-gray-500 ml-2">
                {!isFolder && item.size && (
                  <span>{formatFileSize(item.size)}</span>
                )}
                {isFolder && hasContents && (
                  <span className="text-blue-600 font-medium">
                    {hasContents.length} items
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Nested contents */}
        {isFolder && isExpanded && hasContents && (
          <div className="ml-2">
            {hasContents
              .sort((a, b) => {
                // Directories first, then files
                if (a.type === "dir" && b.type === "file") return -1;
                if (a.type === "file" && b.type === "dir") return 1;
                return a.name.localeCompare(b.name);
              })
              .map((childItem) => renderFileItem(childItem, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const sortedFiles = [...fileStructure].sort((a, b) => {
    // Directories first, then files
    if (a.type === "dir" && b.type === "file") return -1;
    if (a.type === "file" && b.type === "dir") return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl p-6 border border-gray-200">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <FolderOpen className="w-5 h-5 text-gray-600" />
        File Structure
      </h3>

      {loading ? (
        <div className="flex items-center justify-center min-h-32">
          <div className="flex items-center gap-2 text-gray-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading files...</span>
          </div>
        </div>
      ) : (
        <div className="max-h-44 overflow-y-auto">
          <div className="space-y-1">
            {sortedFiles.length > 0 ? (
              sortedFiles.map((item) => renderFileItem(item, 0))
            ) : (
              <div className="text-center py-6 text-gray-500">
                <FolderOpen className="w-6 h-6 mx-auto mb-2 opacity-50" />
                {error ? (
                  <div>
                    <p className="text-sm text-red-600 font-medium mb-1">
                      Failed to load files
                    </p>
                    <p className="text-xs text-gray-500">{error}</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm">No files found</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Repository might be empty or private
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* File count indicator */}
      {sortedFiles.length > 0 && (
        <div className="mt-2 pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Showing {sortedFiles.length} items at root level
            {Object.keys(folderContents).length > 0 && (
              <span>
                {" "}
                • {Object.keys(folderContents).length} folders expanded
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default LanguageAnalysisCard;
