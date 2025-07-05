import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Github,
  ExternalLink,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { AuthAPI, RateLimitAPI } from "../../services/api";

const GitHubTokenModal = ({ isOpen, onClose }) => {
  const [token, setToken] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  const handleSave = async () => {
    if (!token.trim()) return;

    setIsVerifying(true);
    setVerificationResult(null);

    try {
      // Test the token by making a rate limit request
      AuthAPI.setGitHubToken(token.trim());
      const rateLimit = await RateLimitAPI.getRateLimit();

      if (rateLimit) {
        setVerificationResult({
          success: true,
          message: `Token verified! Rate limit: ${rateLimit.rate.remaining}/${rateLimit.rate.limit}`,
        });
        setTimeout(() => {
          onClose();
          setToken("");
          setVerificationResult(null);
        }, 2000);
      }
    } catch (error) {
      setVerificationResult({
        success: false,
        message: "Invalid token or authentication failed",
      });
      AuthAPI.removeGitHubToken();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRemove = () => {
    AuthAPI.removeGitHubToken();
    setToken("");
    setVerificationResult({
      success: true,
      message: "GitHub token removed successfully",
    });
    setTimeout(() => {
      onClose();
      setVerificationResult(null);
    }, 1500);
  };

  const handleClose = () => {
    setToken("");
    setVerificationResult(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 lg:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg bg-white rounded-xl sm:rounded-2xl shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
                  <Github className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  GitHub Token
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Instructions */}
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-base sm:text-lg font-medium text-gray-900">
                  How to create a GitHub token:
                </h3>
                <ol className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-600">
                  <li className="flex items-start gap-2 sm:gap-3">
                    <span className="bg-blue-600 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      1
                    </span>
                    <span className="leading-relaxed">
                      Go to GitHub Settings → Developer settings → Personal
                      access tokens
                    </span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <span className="bg-blue-600 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      2
                    </span>
                    <span className="leading-relaxed">
                      Click "Generate new token" → "Generate new token
                      (classic)"
                    </span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <span className="bg-blue-600 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      3
                    </span>
                    <span className="leading-relaxed">
                      Select scopes:{" "}
                      <code className="bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs font-mono">
                        public_repo
                      </code>{" "}
                      (for public repos) or{" "}
                      <code className="bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs font-mono">
                        repo
                      </code>{" "}
                      (for private repos)
                    </span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <span className="bg-blue-600 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      4
                    </span>
                    <span className="leading-relaxed">
                      Copy the generated token and paste it below
                    </span>
                  </li>
                </ol>

                <a
                  href="https://github.com/settings/tokens/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors text-xs sm:text-sm font-medium"
                >
                  <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                  Create GitHub Token
                </a>
              </div>

              {/* Token Input */}
              <div className="space-y-2 sm:space-y-3">
                <label className="block text-sm font-medium text-gray-900">
                  Personal Access Token
                </label>
                <div className="relative">
                  <input
                    type={showToken ? "text" : "password"}
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-lg text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowToken(!showToken)}
                    className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    {showToken ? (
                      <EyeOff className="w-4 h-4 text-gray-500" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  Your token is stored locally in your browser and only used for
                  GitHub API requests
                </p>
              </div>

              {/* Verification Result */}
              {verificationResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 rounded-lg border ${
                    verificationResult.success
                      ? "bg-green-50 border-green-200 text-green-700"
                      : "bg-red-50 border-red-200 text-red-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {verificationResult.success ? (
                      <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    )}
                    <span className="text-xs sm:text-sm">
                      {verificationResult.message}
                    </span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-4 sm:p-6 border-t border-gray-200 gap-3 sm:gap-0">
              <div className="flex gap-3 order-2 sm:order-1">
                {AuthAPI.hasToken() && (
                  <button
                    onClick={handleRemove}
                    className="px-3 sm:px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors text-xs sm:text-sm font-medium"
                  >
                    Remove Current Token
                  </button>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 order-1 sm:order-2">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-700 transition-colors font-medium text-sm order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!token.trim() || isVerifying}
                  className="px-4 sm:px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-medium text-sm order-1 sm:order-2"
                >
                  {isVerifying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Verifying...
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
