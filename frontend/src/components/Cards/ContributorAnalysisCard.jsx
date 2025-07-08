import { motion } from "framer-motion";
import { Users, Award, ExternalLink } from "lucide-react";

const ContributorAnalysisCard = ({ contributorInsights }) => {
  if (!contributorInsights) return null;

  return (
    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-orange-200 mb-4 sm:mb-6">
      <h3 className="text-lg sm:text-xl font-bold text-orange-900 mb-4 sm:mb-6 flex items-center gap-2">
        <Users className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
        <span className="text-base sm:text-xl">
          Contributor Analysis & Team Insights
        </span>
      </h3>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Contributor Stats */}
        <div className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-white/60 rounded-lg sm:rounded-xl p-3 sm:p-4">
              <div className="text-xl sm:text-2xl font-bold text-orange-900">
                {contributorInsights.total}
              </div>
              <div className="text-xs sm:text-sm text-orange-700">
                Total Contributors
              </div>
            </div>
            <div className="bg-white/60 rounded-lg sm:rounded-xl p-3 sm:p-4">
              <div className="text-xl sm:text-2xl font-bold text-orange-900">
                {contributorInsights.coreContributors}
              </div>
              <div className="text-xs sm:text-sm text-orange-700">
                Core Contributors
              </div>
            </div>
          </div>

          <div className="bg-white/60 rounded-lg sm:rounded-xl p-3 sm:p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm sm:text-base text-orange-700">
                Team Diversity
              </span>
              <span className="text-sm sm:text-base font-bold text-orange-900">
                {contributorInsights.diversityScore}%
              </span>
            </div>
            <div className="w-full bg-orange-200 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500"
                style={{
                  width: `${contributorInsights.diversityScore}%`,
                }}
              />
            </div>
          </div>

          <div className="bg-white/60 rounded-lg sm:rounded-xl p-3 sm:p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm sm:text-base text-orange-700">
                Collaboration Score
              </span>
              <span className="text-sm sm:text-base font-bold text-orange-900">
                {contributorInsights.collaborationScore}%
              </span>
            </div>
            <div className="w-full bg-orange-200 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500"
                style={{
                  width: `${contributorInsights.collaborationScore}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Top Contributors */}
        <div className="space-y-3 sm:space-y-4">
          <h4 className="text-base sm:text-lg font-semibold text-orange-900 flex items-center gap-2">
            <Award className="w-4 h-4" />
            Top Contributors
          </h4>
          <div className="space-y-2 sm:space-y-3 max-h-64 sm:max-h-80 overflow-y-auto">
            {contributorInsights.topContributors.map((contributor, index) => (
              <motion.div
                key={contributor.login}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white/60 rounded-lg sm:rounded-xl"
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={contributor.avatar_url}
                    alt={contributor.login}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-orange-300"
                  />
                  {index === 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-yellow-800">
                        1
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="font-semibold text-sm sm:text-base text-orange-900 truncate">
                      {contributor.login}
                    </span>
                    {index < 3 && (
                      <span className="px-2 py-1 bg-orange-200 text-orange-800 rounded-full text-xs flex-shrink-0 w-fit">
                        {index === 0 ? "Lead" : index === 1 ? "Core" : "Active"}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-orange-700">
                    <span>
                      {contributor.contributions.toLocaleString()} commits
                    </span>
                    <span>
                      {contributorInsights.contributionDistribution.find(
                        (c) => c.login === contributor.login
                      )?.percentage || 0}
                      %
                    </span>
                  </div>
                </div>
                <motion.a
                  href={contributor.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  className="p-1.5 sm:p-2 bg-orange-200 hover:bg-orange-300 rounded-lg transition-colors flex-shrink-0"
                >
                  <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 text-orange-700" />
                </motion.a>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContributorAnalysisCard;
