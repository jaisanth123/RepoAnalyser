import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Github,
  Search,
  BarChart3,
  Users,
  Code,
  Shield,
  Settings,
  CheckCircle,
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthAPI } from "../../services/api";
import GitHubTokenModal from "./GitHubTokenModal";

const Header = () => {
  const location = useLocation();
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/", icon: Search, label: "Analyzer" },
    // { path: "/dashboard", icon: BarChart3, label: "Dashboard" },
    // { path: "/contributors", icon: Users, label: "Contributors" },
    // { path: "/codebase", icon: Code, label: "Codebase" },
    // { path: "/security", icon: Shield, label: "Security" },
  ];

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center space-x-2 sm:space-x-3"
              onClick={closeMobileMenu}
            >
              <div className="relative">
                <Github className="h-6 w-6 sm:h-8 sm:w-8 text-gray-900" />
                <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
              <span className="text-lg sm:text-xl font-bold text-gray-900">
                RepoAnalyzer
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative px-3 lg:px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                      isActive
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="font-medium text-sm lg:text-base">
                      {item.label}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-blue-50 rounded-lg -z-10"
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.6,
                        }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Side - GitHub Token Status & Settings */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Token Status Indicator - Hidden on small screens */}
              <div className="hidden sm:flex items-center space-x-2">
                {AuthAPI.hasToken() ? (
                  <div className="flex items-center space-x-1 sm:space-x-2 text-green-400">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-xs font-medium hidden lg:inline">
                      API Connected
                    </span>
                    <span className="text-xs font-medium lg:hidden">
                      Connected
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 sm:space-x-2 text-gray-400">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span className="text-xs font-medium hidden lg:inline">
                      Limited Access
                    </span>
                    <span className="text-xs font-medium lg:hidden">
                      Limited
                    </span>
                  </div>
                )}
              </div>

              {/* Settings Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowTokenModal(true)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                title="Configure GitHub Token"
              >
                <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.button>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Toggle mobile menu"
                >
                  {mobileMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </motion.button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-sm"
              >
                <div className="px-2 pt-2 pb-3 space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={closeMobileMenu}
                        className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium transition-colors ${
                          isActive
                            ? "text-blue-600 bg-blue-50"
                            : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}

                  {/* Mobile Token Status */}
                  <div className="px-3 py-3 border-t border-gray-200 mt-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {AuthAPI.hasToken() ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm font-medium text-green-600">
                              GitHub API Connected
                            </span>
                          </>
                        ) : (
                          <>
                            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                            <span className="text-sm font-medium text-gray-500">
                              Limited API Access
                            </span>
                          </>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          setShowTokenModal(true);
                          closeMobileMenu();
                        }}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Configure
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* GitHub Token Modal */}
      <GitHubTokenModal
        isOpen={showTokenModal}
        onClose={() => setShowTokenModal(false)}
      />
    </>
  );
};

export default Header;
