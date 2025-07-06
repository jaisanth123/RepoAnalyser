import { motion } from "framer-motion";
import { Award, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const LatestReleaseCard = ({ projectInsights }) => {
  if (!projectInsights.latestRelease) return null;

  const formatRelativeTime = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "Unknown";
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200 mb-6">
      <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center gap-2">
        <Award className="w-5 h-5 text-purple-600" />
        Latest Release
      </h3>
      <div className="p-4 bg-white/60 rounded-lg border border-purple-200">
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="font-semibold text-purple-900 text-sm">
              {projectInsights.latestRelease.name ||
                projectInsights.latestRelease.tag_name}
            </div>
            <div className="text-xs text-purple-600">
              Released{" "}
              {formatRelativeTime(projectInsights.latestRelease.published_at)}
            </div>
          </div>
          <motion.a
            href={projectInsights.latestRelease.html_url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            className="p-1 bg-purple-100 hover:bg-purple-200 rounded transition-colors"
          >
            <ExternalLink className="w-3 h-3 text-purple-600" />
          </motion.a>
        </div>
        {projectInsights.latestRelease.body && (
          <div className="text-xs text-purple-700 mt-2 line-clamp-3">
            {projectInsights.latestRelease.body.substring(0, 150)}...
          </div>
        )}
      </div>
    </div>
  );
};

export default LatestReleaseCard;
