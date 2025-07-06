import { motion } from "framer-motion";
import { Users, Award, ExternalLink } from "lucide-react";

const ContributorAnalysisCard = ({ contributorInsights }) => {
  if (!contributorInsights) return null;

  return (
    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200 mb-6">
      <h3 className="text-xl font-bold text-orange-900 mb-6 flex items-center gap-2">
        <Users className="w-6 h-6 text-orange-600" />
        Contributor Analysis & Team Insights
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contributor Stats */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/60 rounded-xl p-4">
              <div className="text-2xl font-bold text-orange-900">
                {contributorInsights.total}
              </div>
              <div className="text-sm text-orange-700">Total Contributors</div>
            </div>
            <div className="bg-white/60 rounded-xl p-4">
              <div className="text-2xl font-bold text-orange-900">
                {contributorInsights.coreContributors}
              </div>
              <div className="text-sm text-orange-700">Core Contributors</div>
            </div>
          </div>

          <div className="bg-white/60 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-orange-700">Team Diversity</span>
              <span className="font-bold text-orange-900">
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

          <div className="bg-white/60 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-orange-700">Collaboration Score</span>
              <span className="font-bold text-orange-900">
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
        <div className="space-y-4">
          <h4 className="font-semibold text-orange-900 flex items-center gap-2">
            <Award className="w-4 h-4" />
            Top Contributors
          </h4>
          <div className="space-y-3">
            {contributorInsights.topContributors.map((contributor, index) => (
              <motion.div
                key={contributor.login}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-3 bg-white/60 rounded-xl"
              >
                <div className="relative">
                  <img
                    src={contributor.avatar_url}
                    alt={contributor.login}
                    className="w-12 h-12 rounded-full border-2 border-orange-300"
                  />
                  {index === 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-yellow-800">
                        1
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-orange-900">
                      {contributor.login}
                    </span>
                    {index < 3 && (
                      <span className="px-2 py-1 bg-orange-200 text-orange-800 rounded-full text-xs">
                        {index === 0 ? "Lead" : index === 1 ? "Core" : "Active"}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-orange-700">
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
                  className="p-2 bg-orange-200 hover:bg-orange-300 rounded-lg transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-orange-700" />
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
