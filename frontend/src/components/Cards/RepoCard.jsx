import { motion } from "framer-motion";
import {
  Star,
  GitFork,
  Eye,
  Calendar,
  FileText,
  Tag,
  ExternalLink,
  Users,
  Activity,
  TrendingUp,
  Clock,
  GitCommit,
  AlertCircle,
  CheckCircle,
  Zap,
  Code,
  Heart,
  Award,
  GitBranch,
} from "lucide-react";
import { format, differenceInDays, differenceInMonths } from "date-fns";

const RepoCard = ({
  repository,
  contributors = [],
  commits = [],
  languages = {},
  qualityMetrics = {},
}) => {
  if (!repository) return null;

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
    };
    return colors[language] || "#6b7280";
  };

  // Analytics Functions
  const getRepositoryHealth = () => {
    const score = Math.min(
      100,
      Math.max(
        0,
        (repository.stargazers_count > 10
          ? 20
          : repository.stargazers_count * 2) +
          (repository.forks_count > 5 ? 15 : repository.forks_count * 3) +
          (contributors.length > 3 ? 20 : contributors.length * 5) +
          (repository.open_issues_count < 10
            ? 15
            : Math.max(0, 15 - repository.open_issues_count)) +
          (repository.has_wiki ? 10 : 0) +
          (repository.license ? 10 : 0) +
          (repository.description ? 10 : 0)
      )
    );

    if (score >= 80) return { level: "Excellent", color: "green", score };
    if (score >= 60) return { level: "Good", color: "blue", score };
    if (score >= 40) return { level: "Fair", color: "yellow", score };
    return { level: "Needs Attention", color: "red", score };
  };

  const getActivityLevel = () => {
    const daysSinceUpdate = differenceInDays(
      new Date(),
      new Date(repository.updated_at)
    );
    const monthsSinceCreation = differenceInMonths(
      new Date(),
      new Date(repository.created_at)
    );

    if (daysSinceUpdate < 7)
      return { level: "Very Active", color: "green", icon: Zap };
    if (daysSinceUpdate < 30)
      return { level: "Active", color: "blue", icon: Activity };
    if (daysSinceUpdate < 90)
      return { level: "Moderate", color: "yellow", icon: Clock };
    return { level: "Inactive", color: "red", icon: AlertCircle };
  };

  const getContributorInsights = () => {
    if (!contributors.length) return null;

    const totalContributions = contributors.reduce(
      (sum, c) => sum + (c.contributions || 0),
      0
    );
    const avgContributions = totalContributions / contributors.length;
    const topContributor = contributors[0];

    return {
      total: contributors.length,
      totalContributions,
      avgContributions: Math.round(avgContributions),
      topContributor,
      diversityScore:
        contributors.length > 1
          ? Math.min(
              100,
              contributors.length * 10 +
                Math.min(
                  50,
                  (totalContributions / (topContributor?.contributions || 1)) *
                    10
                )
            )
          : 20,
    };
  };

  const getLanguageDiversity = () => {
    const languageCount = Object.keys(languages).length;
    const primaryLanguage = repository.language;
    const totalBytes = Object.values(languages).reduce(
      (sum, bytes) => sum + bytes,
      0
    );
    const primaryPercentage = primaryLanguage
      ? ((languages[primaryLanguage] || 0) / totalBytes) * 100
      : 0;

    return {
      count: languageCount,
      primary: primaryLanguage,
      primaryPercentage: Math.round(primaryPercentage),
      isDiverse: languageCount > 3 && primaryPercentage < 70,
    };
  };

  const getCommitPatterns = () => {
    if (!commits.length) return null;

    const recentCommits = commits.filter((commit) => {
      const commitDate = new Date(
        commit.commit?.author?.date || commit.commit?.committer?.date
      );
      return differenceInDays(new Date(), commitDate) <= 30;
    });

    return {
      total: commits.length,
      recent: recentCommits.length,
      frequency:
        recentCommits.length > 0
          ? Math.round((recentCommits.length / 30) * 7)
          : 0, // commits per week
    };
  };

  const health = getRepositoryHealth();
  const activity = getActivityLevel();
  const contributorInsights = getContributorInsights();
  const languageDiversity = getLanguageDiversity();
  const commitPatterns = getCommitPatterns();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg"
    >
      {/* Header Section */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold text-gray-900">
              {repository.full_name}
            </h2>
            <div className="flex items-center gap-2">
              {health.level === "Excellent" && (
                <Award className="w-5 h-5 text-yellow-500" />
              )}
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  health.color === "green"
                    ? "bg-green-100 text-green-700"
                    : health.color === "blue"
                    ? "bg-blue-100 text-blue-700"
                    : health.color === "yellow"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {health.level}
              </span>
            </div>
          </div>
          <p className="text-gray-600 mb-4 leading-relaxed">
            {repository.description || "No description available"}
          </p>
        </div>

        <motion.a
          href={repository.html_url}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors border border-gray-300"
        >
          <ExternalLink className="w-5 h-5 text-gray-600" />
        </motion.a>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-200">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-700">Stars</span>
          </div>
          <div className="text-2xl font-bold text-yellow-800">
            {repository.stargazers_count?.toLocaleString() || 0}
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <GitFork className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Forks</span>
          </div>
          <div className="text-2xl font-bold text-blue-800">
            {repository.forks_count?.toLocaleString() || 0}
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-700">
              Contributors
            </span>
          </div>
          <div className="text-2xl font-bold text-green-800">
            {contributorInsights?.total || 0}
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <activity.icon className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">
              Activity
            </span>
          </div>
          <div className="text-sm font-bold text-purple-800">
            {activity.level}
          </div>
        </div>
      </div>

      {/* Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Repository Insights */}
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Repository Health
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Health Score</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      health.color === "green"
                        ? "bg-green-500"
                        : health.color === "blue"
                        ? "bg-blue-500"
                        : health.color === "yellow"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${health.score}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {health.score}%
                </span>
              </div>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Quality Score</span>
              <span className="font-medium text-gray-900">
                {qualityMetrics.codeQualityScore
                  ? `${Math.round(qualityMetrics.codeQualityScore)}%`
                  : "N/A"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Last Activity</span>
              <span className="font-medium text-gray-900">
                {differenceInDays(new Date(), new Date(repository.updated_at))}{" "}
                days ago
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Repository Age</span>
              <span className="font-medium text-gray-900">
                {differenceInMonths(
                  new Date(),
                  new Date(repository.created_at)
                )}{" "}
                months
              </span>
            </div>
          </div>
        </div>

        {/* Contributor Insights */}
        {contributorInsights && (
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-600" />
              Community Insights
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Contributors</span>
                <span className="font-medium text-gray-900">
                  {contributorInsights.total}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Total Contributions</span>
                <span className="font-medium text-gray-900">
                  {contributorInsights.totalContributions.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Avg. per Contributor</span>
                <span className="font-medium text-gray-900">
                  {contributorInsights.avgContributions}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Community Diversity</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-green-500"
                      style={{
                        width: `${Math.min(
                          100,
                          contributorInsights.diversityScore
                        )}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {Math.round(contributorInsights.diversityScore)}%
                  </span>
                </div>
              </div>

              {contributorInsights.topContributor && (
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <img
                      src={contributorInsights.topContributor.avatar_url}
                      alt={contributorInsights.topContributor.login}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-sm text-gray-600">
                      Top:{" "}
                      <span className="font-medium">
                        {contributorInsights.topContributor.login}
                      </span>
                    </span>
                    <span className="text-xs text-gray-500">
                      ({contributorInsights.topContributor.contributions}{" "}
                      commits)
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Development Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Language Diversity */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-200">
          <div className="flex items-center gap-2 mb-3">
            <Code className="w-5 h-5 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-700">
              Languages
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-indigo-800 font-bold text-lg">
                {languageDiversity.count}
              </span>
              {languageDiversity.isDiverse && (
                <CheckCircle className="w-4 h-4 text-green-600" />
              )}
            </div>
            {languageDiversity.primary && (
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: getLanguageColor(
                      languageDiversity.primary
                    ),
                  }}
                />
                <span className="text-xs text-indigo-700">
                  {languageDiversity.primary} (
                  {languageDiversity.primaryPercentage}%)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Commit Activity */}
        {commitPatterns && (
          <div className="bg-gradient-to-br from-green-50 to-teal-50 p-4 rounded-xl border border-green-200">
            <div className="flex items-center gap-2 mb-3">
              <GitCommit className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-700">
                Commit Activity
              </span>
            </div>
            <div className="space-y-1">
              <div className="text-green-800 font-bold text-lg">
                {commitPatterns.recent}
              </div>
              <div className="text-xs text-green-700">
                commits (last 30 days)
              </div>
              <div className="text-xs text-green-600">
                ~{commitPatterns.frequency} commits/week
              </div>
            </div>
          </div>
        )}

        {/* Repository Features */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-xl border border-orange-200">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-medium text-orange-700">
              Features
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  repository.has_issues ? "bg-green-500" : "bg-gray-300"
                }`}
              />
              <span className="text-xs text-orange-700">Issues</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  repository.has_wiki ? "bg-green-500" : "bg-gray-300"
                }`}
              />
              <span className="text-xs text-orange-700">Wiki</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  repository.license ? "bg-green-500" : "bg-gray-300"
                }`}
              />
              <span className="text-xs text-orange-700">License</span>
            </div>
          </div>
        </div>
      </div>

      {/* Topics */}
      {repository.topics && repository.topics.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-600 font-medium">Topics</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {repository.topics.slice(0, 8).map((topic, index) => (
              <motion.span
                key={topic}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm border border-blue-200 hover:bg-blue-200 transition-colors"
              >
                {topic}
              </motion.span>
            ))}
            {repository.topics.length > 8 && (
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                +{repository.topics.length - 8} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Repository Metadata Footer */}
      <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-200 text-sm text-gray-600">
        {repository.language && (
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: getLanguageColor(repository.language) }}
            />
            <span>{repository.language}</span>
          </div>
        )}

        <div className="flex items-center gap-1">
          <FileText className="w-3 h-3" />
          <span>{formatLicense(repository.license)}</span>
        </div>

        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>Updated {formatDate(repository.updated_at)}</span>
        </div>

        <div className="flex items-center gap-1">
          <span className="font-medium">
            {(repository.size / 1024).toFixed(1)} MB
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default RepoCard;
