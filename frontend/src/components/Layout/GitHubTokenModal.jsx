import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Github,
  Info,
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
            className="relative w-full max-w-lg bg-slate-800 rounded-2xl shadow-2xl border border-white/20"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-600/20 rounded-lg">
                  <Github className="w-5 h-5 text-purple-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">
                  GitHub Token Configuration
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Info Section */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-200">
                    <p className="font-medium mb-2">Why add a GitHub token?</p>
                    <ul className="space-y-1 text-blue-300">
                      <li>
                        • Increases API rate limit from 60 to 5,000 requests per
                        hour
                      </li>
                      <li>• Access to more detailed repository information</li>
                      <li>• Faster and more reliable analysis</li>
                      <li>
                        • Access to private repositories (if token has
                        permissions)
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">
                  How to create a GitHub token:
                </h3>
                <ol className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="bg-purple-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      1
                    </span>
                    <span>
                      Go to GitHub Settings → Developer settings → Personal
                      access tokens
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-purple-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      2
                    </span>
                    <span>
                      Click "Generate new token" → "Generate new token
                      (classic)"
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-purple-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      3
                    </span>
                    <span>
                      Select scopes:{" "}
                      <code className="bg-gray-700 px-1 rounded">
                        public_repo
                      </code>{" "}
                      (for public repos) or{" "}
                      <code className="bg-gray-700 px-1 rounded">repo</code>{" "}
                      (for private repos)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-purple-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      4
                    </span>
                    <span>Copy the generated token and paste it below</span>
                  </li>
                </ol>

                <a
                  href="https://github.com/settings/tokens/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  Create GitHub Token
                </a>
              </div>

              {/* Token Input */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-white">
                  Personal Access Token
                </label>
                <div className="relative">
                  <input
                    type={showToken ? "text" : "password"}
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowToken(!showToken)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-600 rounded transition-colors"
                  >
                    {showToken ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-400">
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
                      ? "bg-green-500/10 border-green-500/20 text-green-300"
                      : "bg-red-500/10 border-red-500/20 text-red-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {verificationResult.success ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <AlertCircle className="w-4 h-4" />
                    )}
                    <span className="text-sm">
                      {verificationResult.message}
                    </span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between p-6 border-t border-white/10">
              <div className="flex gap-3">
                {AuthAPI.hasToken() && (
                  <button
                    onClick={handleRemove}
                    className="px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors text-sm"
                  >
                    Remove Current Token
                  </button>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!token.trim() || isVerifying}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
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
