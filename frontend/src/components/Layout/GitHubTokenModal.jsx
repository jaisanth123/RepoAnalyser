import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Github,
  Key,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Info,
} from "lucide-react";
import { AuthAPI } from "../../services/api";

const GitHubTokenModal = ({ isOpen, onClose }) => {
  const [token, setToken] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!token.trim()) {
      setError("Please enter a valid GitHub token");
      return;
    }

    setSaving(true);
    setError("");

    try {
      // Test the token by making a simple API call
      const response = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `token ${token}`,
          "User-Agent": "RepoAnalyzer",
        },
      });

      if (!response.ok) {
        throw new Error("Invalid token or insufficient permissions");
      }

      // Save the token
      AuthAPI.setGitHubToken(token);
      setToken("");
      onClose();
    } catch (error) {
      setError(error.message || "Failed to validate token");
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = () => {
    AuthAPI.removeGitHubToken();
    setToken("");
    setError("");
    onClose();
  };

  const handleClose = () => {
    setToken("");
    setError("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md md:max-w-lg max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center gap-2 sm:gap-3">
                <Github className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  GitHub API Token
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6">
              {/* Current Status */}
              <div className="mb-4 sm:mb-6">
                <div className="flex items-center gap-2 mb-2">
                  {AuthAPI.hasToken() ? (
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                  )}
                  <span className="text-sm sm:text-base font-medium text-gray-900">
                    Current Status
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 ml-6 sm:ml-7">
                  {AuthAPI.hasToken()
                    ? "GitHub API token is configured and active"
                    : "No GitHub token configured - you have limited API access"}
                </p>
              </div>

              {/* Info Section */}
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-2 sm:gap-3">
                  <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm sm:text-base font-medium text-blue-900 mb-2">
                      Why add a GitHub token?
                    </h3>
                    <ul className="space-y-1 text-xs sm:text-sm text-blue-700">
                      <li>
                        • Increase API rate limit from 60 to 5,000 requests/hour
                      </li>
                      <li>
                        • Access private repositories (if token has permissions)
                      </li>
                      <li>• Get more detailed repository information</li>
                      <li>• Faster and more reliable analysis</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Token Input */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                  GitHub Personal Access Token
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  />
                  <Key className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                </div>
                {error && (
                  <p className="mt-2 text-xs sm:text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                    {error}
                  </p>
                )}
              </div>

              {/* Instructions */}
              <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm sm:text-base font-medium text-gray-900 mb-2 sm:mb-3">
                  How to create a GitHub token:
                </h4>
                <ol className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600">
                  <li>1. Go to GitHub Settings → Developer settings</li>
                  <li>
                    2. Click "Personal access tokens" → "Tokens (classic)"
                  </li>
                  <li>3. Click "Generate new token"</li>
                  <li>4. Select "repo" scope for full repository access</li>
                  <li>5. Copy and paste the token here</li>
                </ol>
                <a
                  href="https://github.com/settings/tokens"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 sm:gap-2 mt-2 sm:mt-3 text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                  Create GitHub Token
                </a>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                {AuthAPI.hasToken() && (
                  <button
                    onClick={handleRemove}
                    className="flex-1 px-4 py-2 sm:py-3 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors text-sm sm:text-base font-medium"
                  >
                    Remove Token
                  </button>
                )}
                <button
                  onClick={handleSave}
                  disabled={saving || !token.trim()}
                  className="flex-1 px-4 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base font-medium flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    "Save Token"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default GitHubTokenModal;
