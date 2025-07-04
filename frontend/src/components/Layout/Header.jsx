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
} from "lucide-react";
import { motion } from "framer-motion";
import { AuthAPI } from "../../services/api";
import GitHubTokenModal from "./GitHubTokenModal";

const Header = () => {
  const location = useLocation();
  const [showTokenModal, setShowTokenModal] = useState(false);

  const navItems = [
    { path: "/", icon: Search, label: "Analyzer" },
    { path: "/dashboard", icon: BarChart3, label: "Dashboard" },
    { path: "/contributors", icon: Users, label: "Contributors" },
    { path: "/codebase", icon: Code, label: "Codebase" },
    { path: "/security", icon: Shield, label: "Security" },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="relative">
                <Github className="h-8 w-8 text-gray-900" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
              <span className="text-xl font-bold text-gray-900">
                RepoAnalyzer
              </span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                      isActive
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="font-medium">{item.label}</span>
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

            {/* GitHub Token Status & Settings */}
            <div className="flex items-center space-x-3">
              {/* Token Status Indicator */}
              <div className="hidden sm:flex items-center space-x-2">
                {AuthAPI.hasToken() ? (
                  <div className="flex items-center space-x-2 text-green-400">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-xs font-medium">API Connected</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-gray-400">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span className="text-xs font-medium">Limited Access</span>
                  </div>
                )}
              </div>

              {/* Settings Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowTokenModal(true)}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                title="Configure GitHub Token"
              >
                <Settings className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
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
