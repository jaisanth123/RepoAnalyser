import { motion } from "framer-motion";
import { useState, useEffect } from "react";
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
  GitPullRequest,
  Bug,
  Shield,
  Download,
  Globe,
  BookOpen,
  UserPlus,
  MessageCircle,
  Flame,
  Target,
  BarChart3,
  GitMerge,
  Sparkles,
} from "lucide-react";
import {
  format,
  differenceInDays,
  differenceInMonths,
  formatDistanceToNow,
} from "date-fns";

const RepoCard = ({
  repository,
  contributors = [],
  commits = [],
  languages = {},
  qualityMetrics = {},
  releases = [],
  branches = [],
  pullRequests = [],
  issues = [],
  totalCommits = null, // Optional: actual total commit count from API
}) => {
  const [actualTotalCommits, setActualTotalCommits] = useState(
    totalCommits || commits.length
  );
  const [isLoadingCommits, setIsLoadingCommits] = useState(false);
  const [hasMoreCommits, setHasMoreCommits] = useState(false);

  // Fetch actual commit count from GitHub API if not provided
  useEffect(() => {
    const fetchActualCommitCount = async () => {
      // Only fetch if totalCommits not provided and we have exactly 100 commits (likely paginated)
      if (!totalCommits && commits.length >= 100) {
        setIsLoadingCommits(true);
        try {
          const [owner, repo] = repository.full_name.split("/");
          let realTotalCommits = commits.length;

          // Method 1: Try stats/contributors endpoint
          try {
            const statsResponse = await fetch(
              `https://api.github.com/repos/${owner}/${repo}/stats/contributors`,
              {
                headers: {
                  Accept: "application/vnd.github.v3+json",
                },
              }
            );

            if (statsResponse.ok) {
              const contributors = await statsResponse.json();
              if (contributors && contributors.length > 0) {
                realTotalCommits = contributors.reduce(
                  (total, contributor) => total + contributor.total,
                  0
                );
                setActualTotalCommits(realTotalCommits);
                return; // Success, exit early
              }
            }
          } catch (error) {
            console.warn("Stats/contributors API failed:", error);
          }

          // Method 2: Try pagination approach with commits endpoint
          try {
            const commitsResponse = await fetch(
              `https://api.github.com/repos/${owner}/${repo}/commits?per_page=1&page=1`,
              {
                headers: {
                  Accept: "application/vnd.github.v3+json",
                },
              }
            );

            if (commitsResponse.ok) {
              const linkHeader = commitsResponse.headers.get("Link");
              if (linkHeader) {
                // Parse the Link header to get the last page number
                const lastPageMatch = linkHeader.match(
                  /page=(\d+)>; rel="last"/
                );
                if (lastPageMatch) {
                  const lastPage = parseInt(lastPageMatch[1]);

                  // Get the last page to count remaining commits
                  const lastPageResponse = await fetch(
                    `https://api.github.com/repos/${owner}/${repo}/commits?per_page=100&page=${lastPage}`,
                    {
                      headers: {
                        Accept: "application/vnd.github.v3+json",
                      },
                    }
                  );

                  if (lastPageResponse.ok) {
                    const lastPageCommits = await lastPageResponse.json();
                    realTotalCommits =
                      (lastPage - 1) * 100 + lastPageCommits.length;
                    setActualTotalCommits(realTotalCommits);
                    return; // Success, exit early
                  }
                }
              }
            }
          } catch (error) {
            console.warn("Pagination method failed:", error);
          }

          // Method 3: Try to estimate based on repository age and recent activity
          try {
            const repoResponse = await fetch(
              `https://api.github.com/repos/${owner}/${repo}`,
              {
                headers: {
                  Accept: "application/vnd.github.v3+json",
                },
              }
            );

            if (repoResponse.ok) {
              const repoData = await repoResponse.json();
              // If repo has been updated recently and we have 100 commits,
              // it's likely there are more than 100
              if (repoData.updated_at) {
                const daysSinceUpdate = differenceInDays(
                  new Date(),
                  new Date(repoData.updated_at)
                );

                // If recently updated and we have exactly 100 commits, estimate more
                if (daysSinceUpdate < 30 && commits.length === 100) {
                  // Conservative estimate based on activity
                  const monthsSinceCreation = differenceInMonths(
                    new Date(),
                    new Date(repoData.created_at)
                  );

                  // Rough estimation: if repo is active and old, likely more commits
                  if (monthsSinceCreation > 6) {
                    realTotalCommits = Math.max(150, commits.length * 1.5);
                    setActualTotalCommits(Math.floor(realTotalCommits));
                    return;
                  }
                }
              }
            }
          } catch (error) {
            console.warn("Repository estimation failed:", error);
          }

          // If we still have exactly 100 commits and couldn't get exact count,
          // indicate there are likely more
          if (commits.length === 100 && realTotalCommits === 100) {
            setHasMoreCommits(true);
          }
        } catch (error) {
          console.warn("Failed to fetch actual commit count:", error);
          // Keep the default value if all methods fail
        } finally {
          setIsLoadingCommits(false);
        }
      }
    };

    fetchActualCommitCount();
  }, [repository.full_name, totalCommits, commits.length]);

  if (!repository) return null;

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return "Unknown";
    }
  };

  const formatRelativeTime = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
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
      Dart: "#0175c2",
      Shell: "#89e051",
      Dockerfile: "#384d54",
    };
    return colors[language] || "#6b7280";
  };

  // Enhanced Analytics Functions
  const getRepositoryHealth = () => {
    const recentActivity =
      differenceInDays(new Date(), new Date(repository.updated_at)) < 30
        ? 15
        : 0;
    const communityHealth = contributors.length > 1 ? 10 : 0;
    const documentationScore = repository.has_wiki ? 5 : 0;
    const licenseScore = repository.license ? 5 : 0;
    const descriptionScore = repository.description ? 5 : 0;
    const topicsScore =
      repository.topics && repository.topics.length > 0 ? 5 : 0;
    const issuesScore =
      repository.open_issues_count < 20
        ? 10
        : Math.max(0, 10 - repository.open_issues_count / 2);

    const score = Math.min(
      100,
      Math.max(
        0,
        (repository.stargazers_count > 10
          ? 20
          : repository.stargazers_count * 2) +
          (repository.forks_count > 5 ? 15 : repository.forks_count * 3) +
          (contributors.length > 3 ? 20 : contributors.length * 5) +
          recentActivity +
          communityHealth +
          documentationScore +
          licenseScore +
          descriptionScore +
          topicsScore +
          issuesScore
      )
    );

    if (score >= 85)
      return { level: "Exceptional", color: "emerald", score, icon: Award };
    if (score >= 70)
      return { level: "Excellent", color: "green", score, icon: CheckCircle };
    if (score >= 55)
      return { level: "Good", color: "blue", score, icon: TrendingUp };
    if (score >= 40)
      return { level: "Fair", color: "yellow", score, icon: Clock };
    return { level: "Needs Attention", color: "red", score, icon: AlertCircle };
  };

  const getActivityLevel = () => {
    const daysSinceUpdate = differenceInDays(
      new Date(),
      new Date(repository.updated_at)
    );
    const recentCommits = commits.filter(
      (commit) =>
        differenceInDays(
          new Date(),
          new Date(
            commit.commit?.author?.date || commit.commit?.committer?.date
          )
        ) <= 7
    ).length;

    if (daysSinceUpdate < 1 && recentCommits > 5)
      return {
        level: "Extremely Active",
        color: "emerald",
        icon: Flame,
        intensity: "high",
      };
    if (daysSinceUpdate < 7 && recentCommits > 2)
      return {
        level: "Very Active",
        color: "green",
        icon: Zap,
        intensity: "high",
      };
    if (daysSinceUpdate < 30)
      return {
        level: "Active",
        color: "blue",
        icon: Activity,
        intensity: "medium",
      };
    if (daysSinceUpdate < 90)
      return {
        level: "Moderate",
        color: "yellow",
        icon: Clock,
        intensity: "low",
      };
    return {
      level: "Inactive",
      color: "red",
      icon: AlertCircle,
      intensity: "very-low",
    };
  };

  const getDetailedContributorInsights = () => {
    if (!contributors.length) return null;

    const totalContributions = contributors.reduce(
      (sum, c) => sum + (c.contributions || 0),
      0
    );
    const avgContributions = totalContributions / contributors.length;
    const topContributors = contributors.slice(0, 5);
    const coreContributors = contributors.filter(
      (c) => c.contributions > avgContributions
    );

    // Calculate contribution distribution
    const contributionDistribution = contributors.map((c) => ({
      ...c,
      percentage: Math.round((c.contributions / totalContributions) * 100),
    }));

    return {
      total: contributors.length,
      totalContributions,
      avgContributions: Math.round(avgContributions),
      topContributors,
      coreContributors: coreContributors.length,
      contributionDistribution,
      diversityScore: calculateDiversityScore(contributors),
      collaborationScore: calculateCollaborationScore(
        contributors,
        totalContributions
      ),
    };
  };

  const calculateDiversityScore = (contributors) => {
    if (contributors.length <= 1) return 15;

    const totalContributions = contributors.reduce(
      (sum, c) => sum + (c.contributions || 0),
      0
    );
    const topContributorShare =
      (contributors[0]?.contributions || 0) / totalContributions;

    // Higher score for more even distribution
    const distributionScore = Math.max(0, 50 - topContributorShare * 100);
    const countScore = Math.min(50, contributors.length * 5);

    return Math.round(distributionScore + countScore);
  };

  const calculateCollaborationScore = (contributors, totalContributions) => {
    if (contributors.length <= 1) return 20;

    const avgContributions = totalContributions / contributors.length;
    const activeContributors = contributors.filter(
      (c) => c.contributions >= avgContributions * 0.1
    );

    return Math.min(100, activeContributors.length * 15);
  };

  const getLanguageDiversity = () => {
    const languageCount = Object.keys(languages).length;
    const primaryLanguage = repository.language;
    const totalBytes = Object.values(languages).reduce(
      (sum, bytes) => sum + bytes,
      0
    );

    const languageBreakdown = Object.entries(languages)
      .map(([lang, bytes]) => ({
        name: lang,
        bytes,
        percentage: Math.round((bytes / totalBytes) * 100),
      }))
      .sort((a, b) => b.bytes - a.bytes)
      .slice(0, 5);

    const primaryPercentage = primaryLanguage
      ? ((languages[primaryLanguage] || 0) / totalBytes) * 100
      : 0;

    return {
      count: languageCount,
      primary: primaryLanguage,
      primaryPercentage: Math.round(primaryPercentage),
      languageBreakdown,
      isDiverse: languageCount > 3 && primaryPercentage < 70,
      complexityScore: Math.min(
        100,
        languageCount * 15 + (languageCount > 5 ? 25 : 0)
      ),
    };
  };

  const getAdvancedCommitPatterns = () => {
    if (!commits.length) return null;

    const now = new Date();
    const last7Days = commits.filter(
      (commit) =>
        differenceInDays(
          now,
          new Date(
            commit.commit?.author?.date || commit.commit?.committer?.date
          )
        ) <= 7
    );
    const last30Days = commits.filter(
      (commit) =>
        differenceInDays(
          now,
          new Date(
            commit.commit?.author?.date || commit.commit?.committer?.date
          )
        ) <= 30
    );

    const commitAuthors = [
      ...new Set(
        commits.map(
          (c) => c.commit?.author?.email || c.commit?.committer?.email
        )
      ),
    ];

    return {
      total: actualTotalCommits,
      recent7Days: last7Days.length,
      recent30Days: last30Days.length,
      weeklyFrequency: Math.round(last30Days.length / 4.3),
      uniqueAuthors: commitAuthors.length,
      avgCommitsPerAuthor: Math.round(
        actualTotalCommits / commitAuthors.length
      ),
      mostRecentCommit: commits[0],
      commitVelocity:
        last7Days.length > 0
          ? "High"
          : last30Days.length > 5
          ? "Medium"
          : "Low",
    };
  };

  const getProjectInsights = () => {
    const openIssues = issues.filter((issue) => issue.state === "open").length;
    const closedIssues = issues.filter(
      (issue) => issue.state === "closed"
    ).length;
    const openPRs = pullRequests.filter((pr) => pr.state === "open").length;
    const mergedPRs = pullRequests.filter((pr) => pr.state === "merged").length;

    return {
      issues: {
        open: openIssues,
        closed: closedIssues,
        total: openIssues + closedIssues,
        resolutionRate:
          closedIssues > 0
            ? Math.round((closedIssues / (openIssues + closedIssues)) * 100)
            : 0,
      },
      pullRequests: {
        open: openPRs,
        merged: mergedPRs,
        total: openPRs + mergedPRs,
        mergeRate:
          mergedPRs > 0
            ? Math.round((mergedPRs / (openPRs + mergedPRs)) * 100)
            : 0,
      },
      releases: releases.length,
      branches: branches.length,
      latestRelease: releases[0],
    };
  };

  // Calculate all insights
  const health = getRepositoryHealth();
  const activity = getActivityLevel();
  const contributorInsights = getDetailedContributorInsights();
  const languageDiversity = getLanguageDiversity();
  const commitPatterns = getAdvancedCommitPatterns();
  const projectInsights = getProjectInsights();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white border border-gray-200 rounded-3xl shadow-xl overflow-hidden"
    >
      {/* Premium Header with Gradient */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 p-6 text-white">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold">{repository.full_name}</h2>
              <div className="flex items-center gap-2">
                <health.icon className="w-5 h-5 text-yellow-300" />
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                  {health.level}
                </span>
              </div>
            </div>
            <p className="text-indigo-100 mb-3 leading-relaxed">
              {repository.description || "No description available"}
            </p>
            <div className="flex items-center gap-4 text-sm text-indigo-200">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Created {formatDate(repository.created_at)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Activity className="w-4 h-4" />
                <span>Updated {formatRelativeTime(repository.updated_at)}</span>
              </div>
            </div>
          </div>

          <motion.a
            href={repository.html_url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors backdrop-blur-sm"
          >
            <ExternalLink className="w-5 h-5" />
          </motion.a>
        </div>

        {/* Premium Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <GitCommit className="w-5 h-5 text-orange-300" />
              <span className="text-sm font-medium">Commits</span>
              {isLoadingCommits && (
                <div className="w-3 h-3 border-2 border-orange-300 border-t-transparent rounded-full animate-spin"></div>
              )}
            </div>
            <div className="text-2xl font-bold">
              {commitPatterns?.total?.toLocaleString() || 0}
              {hasMoreCommits && (
                <span className="text-lg text-orange-200">+</span>
              )}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-yellow-300" />
              <span className="text-sm font-medium">Stars</span>
            </div>
            <div className="text-2xl font-bold">
              {repository.stargazers_count?.toLocaleString() || 0}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <GitFork className="w-5 h-5 text-blue-300" />
              <span className="text-sm font-medium">Forks</span>
            </div>
            <div className="text-2xl font-bold">
              {repository.forks_count?.toLocaleString() || 0}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-5 h-5 text-green-300" />
              <span className="text-sm font-medium">Watchers</span>
            </div>
            <div className="text-2xl font-bold">
              {repository.watchers_count?.toLocaleString() || 0}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <activity.icon className="w-5 h-5 text-purple-300" />
              <span className="text-sm font-medium">Activity</span>
            </div>
            <div className="text-sm font-bold">{activity.level}</div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Advanced Repository Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Repository Health Dashboard */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200">
            <h3 className="text-lg font-bold text-emerald-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-600" />
              Repository Health
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-emerald-700">Overall Score</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-emerald-200 rounded-full h-3">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                      style={{ width: `${health.score}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-emerald-900">
                    {health.score}%
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-emerald-700">Quality Score</span>
                  <span className="font-semibold text-emerald-900">
                    {qualityMetrics.codeQualityScore
                      ? `${Math.round(qualityMetrics.codeQualityScore)}%`
                      : "N/A"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-emerald-700">Maintenance</span>
                  <span className="font-semibold text-emerald-900">
                    {activity.level}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-emerald-700">Community</span>
                  <span className="font-semibold text-emerald-900">
                    {contributorInsights
                      ? contributorInsights.total > 10
                        ? "Active"
                        : contributorInsights.total > 3
                        ? "Growing"
                        : "Small"
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Language Analysis */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
            <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
              <Code className="w-5 h-5 text-blue-600" />
              Language Analysis
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-blue-700">Languages</span>
                <span className="font-bold text-blue-900 text-lg">
                  {languageDiversity.count}
                </span>
              </div>

              <div className="space-y-2">
                {languageDiversity.languageBreakdown
                  .slice(0, 4)
                  .map((lang, index) => (
                    <div
                      key={lang.name}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: getLanguageColor(lang.name),
                          }}
                        />
                        <span className="text-sm text-blue-800">
                          {lang.name}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-blue-900">
                        {lang.percentage}%
                      </span>
                    </div>
                  ))}
              </div>

              <div className="flex justify-between pt-2 border-t border-blue-200">
                <span className="text-blue-700">Complexity</span>
                <span className="font-semibold text-blue-900">
                  {languageDiversity.isDiverse ? "High" : "Moderate"}
                </span>
              </div>
            </div>
          </div>

          {/* Project Statistics */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
            <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              Project Statistics
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-purple-700">Issues</span>
                <span className="font-semibold text-purple-900">
                  {projectInsights.issues.open}/{projectInsights.issues.total}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-purple-700">Pull Requests</span>
                <span className="font-semibold text-purple-900">
                  {projectInsights.pullRequests.open}/
                  {projectInsights.pullRequests.total}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-purple-700">Releases</span>
                <span className="font-semibold text-purple-900">
                  {projectInsights.releases}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-purple-700">Branches</span>
                <span className="font-semibold text-purple-900">
                  {projectInsights.branches}
                </span>
              </div>

              <div className="flex justify-between pt-2 border-t border-purple-200">
                <span className="text-purple-700">Resolution Rate</span>
                <span className="font-semibold text-purple-900">
                  {projectInsights.issues.resolutionRate}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Comprehensive Contributor Analysis */}
        {contributorInsights && (
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
                    <div className="text-sm text-orange-700">
                      Total Contributors
                    </div>
                  </div>
                  <div className="bg-white/60 rounded-xl p-4">
                    <div className="text-2xl font-bold text-orange-900">
                      {contributorInsights.coreContributors}
                    </div>
                    <div className="text-sm text-orange-700">
                      Core Contributors
                    </div>
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
                  {contributorInsights.topContributors.map(
                    (contributor, index) => (
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
                                {index === 0
                                  ? "Lead"
                                  : index === 1
                                  ? "Core"
                                  : "Active"}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-orange-700">
                            <span>
                              {contributor.contributions.toLocaleString()}{" "}
                              commits
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
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Advanced Development Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Commit Analysis */}
          {commitPatterns && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
              <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
                <GitCommit className="w-5 h-5 text-green-600" />
                Commit Analysis
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/60 rounded-xl p-3">
                    <div className="text-xl font-bold text-green-900">
                      {commitPatterns.recent7Days}
                    </div>
                    <div className="text-sm text-green-700">Last 7 days</div>
                  </div>
                  <div className="bg-white/60 rounded-xl p-3">
                    <div className="text-xl font-bold text-green-900">
                      {commitPatterns.weeklyFrequency}
                    </div>
                    <div className="text-sm text-green-700">Weekly avg</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-green-700">Total Commits</span>
                    <span className="font-semibold text-green-900">
                      {commitPatterns.total.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Unique Authors</span>
                    <span className="font-semibold text-green-900">
                      {commitPatterns.uniqueAuthors}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Commit Velocity</span>
                    <span
                      className={`font-semibold ${
                        commitPatterns.commitVelocity === "High"
                          ? "text-green-900"
                          : commitPatterns.commitVelocity === "Medium"
                          ? "text-yellow-700"
                          : "text-red-700"
                      }`}
                    >
                      {commitPatterns.commitVelocity}
                    </span>
                  </div>
                </div>

                {commitPatterns.mostRecentCommit && (
                  <div className="bg-white/60 rounded-xl p-3">
                    <div className="text-sm text-green-700 mb-1">
                      Latest Commit
                    </div>
                    <div className="font-medium text-green-900 text-sm">
                      {commitPatterns.mostRecentCommit.commit.message
                        .split("\n")[0]
                        .substring(0, 50)}
                      ...
                    </div>
                    <div className="text-xs text-green-600 mt-1">
                      {formatRelativeTime(
                        commitPatterns.mostRecentCommit.commit.author.date
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Enhanced Repository Features & Quality */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200">
            <h3 className="text-lg font-bold text-indigo-900 mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              Repository Features & Analysis
            </h3>

            <div className="space-y-6">
              {/* Core Features Grid */}
              <div>
                <h4 className="text-md font-semibold text-indigo-800 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Core Features
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Bug className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm text-indigo-800">Issues</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          repository.has_issues ? "bg-green-500" : "bg-gray-300"
                        }`}
                      />
                      <span className="text-xs text-indigo-700">
                        {repository.has_issues
                          ? `${repository.open_issues_count} open`
                          : "Disabled"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm text-indigo-800">Wiki</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          repository.has_wiki ? "bg-green-500" : "bg-gray-300"
                        }`}
                      />
                      <span className="text-xs text-indigo-700">
                        {repository.has_wiki ? "Available" : "Disabled"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm text-indigo-800">Pages</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          repository.has_pages ? "bg-green-500" : "bg-gray-300"
                        }`}
                      />
                      <span className="text-xs text-indigo-700">
                        {repository.has_pages ? "Deployed" : "Disabled"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm text-indigo-800">Projects</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          repository.has_projects
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      />
                      <span className="text-xs text-indigo-700">
                        {repository.has_projects ? "Active" : "Disabled"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Repository Information */}
              <div>
                <h4 className="text-md font-semibold text-indigo-800 mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Repository Information
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm text-indigo-800">License</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-indigo-900 bg-indigo-100 px-2 py-1 rounded">
                        {repository.license
                          ? formatLicense(repository.license)
                          : "No License"}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg">
                    <div className="flex items-center gap-2">
                      <GitBranch className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm text-indigo-800">
                        Default Branch
                      </span>
                    </div>
                    <span className="text-xs font-medium text-indigo-900 bg-indigo-100 px-2 py-1 rounded">
                      {repository.default_branch || "main"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Download className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm text-indigo-800">
                        Repository Size
                      </span>
                    </div>
                    <span className="text-xs font-medium text-indigo-900 bg-indigo-100 px-2 py-1 rounded">
                      {(repository.size / 1024).toFixed(1)} MB
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm text-indigo-800">
                        Visibility
                      </span>
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded ${
                        repository.private
                          ? "text-red-900 bg-red-100"
                          : "text-green-900 bg-green-100"
                      }`}
                    >
                      {repository.private ? "Private" : "Public"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Development Workflow */}
              <div>
                <h4 className="text-md font-semibold text-indigo-800 mb-3 flex items-center gap-2">
                  <GitMerge className="w-4 h-4" />
                  Development Workflow
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
                    <div className="flex items-center gap-2">
                      <GitPullRequest className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm text-indigo-800">
                        Pull Requests
                      </span>
                    </div>
                    <span className="text-xs font-medium text-indigo-900 bg-indigo-100 px-2 py-1 rounded">
                      {projectInsights.pullRequests.total}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
                    <div className="flex items-center gap-2">
                      <GitCommit className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm text-indigo-800">
                        Total Commits
                      </span>
                      {isLoadingCommits && (
                        <div className="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                      )}
                    </div>
                    <span className="text-xs font-medium text-indigo-900 bg-indigo-100 px-2 py-1 rounded">
                      {commitPatterns?.total?.toLocaleString() || 0}
                      {hasMoreCommits && (
                        <span className="text-indigo-600">+</span>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
                    <div className="flex items-center gap-2">
                      <GitBranch className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm text-indigo-800">Branches</span>
                    </div>
                    <span className="text-xs font-medium text-indigo-900 bg-indigo-100 px-2 py-1 rounded">
                      {projectInsights.branches}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm text-indigo-800">Releases</span>
                    </div>
                    <span className="text-xs font-medium text-indigo-900 bg-indigo-100 px-2 py-1 rounded">
                      {projectInsights.releases}
                    </span>
                  </div>
                </div>
              </div>

              {/* Community & Collaboration */}
              <div>
                <h4 className="text-md font-semibold text-indigo-800 mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Community & Collaboration
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg">
                    <div className="flex items-center gap-2">
                      <UserPlus className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm text-indigo-800">
                        Allow Forking
                      </span>
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded ${
                        repository.allow_forking
                          ? "text-green-900 bg-green-100"
                          : "text-red-900 bg-red-100"
                      }`}
                    >
                      {repository.allow_forking ? "Enabled" : "Disabled"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm text-indigo-800">
                        Discussions
                      </span>
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded ${
                        repository.has_discussions
                          ? "text-green-900 bg-green-100"
                          : "text-gray-900 bg-gray-100"
                      }`}
                    >
                      {repository.has_discussions ? "Active" : "Disabled"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm text-indigo-800">
                        Stargazers
                      </span>
                    </div>
                    <span className="text-xs font-medium text-indigo-900 bg-indigo-100 px-2 py-1 rounded">
                      {repository.stargazers_count.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Latest Release Information */}
              {projectInsights.latestRelease && (
                <div>
                  <h4 className="text-md font-semibold text-indigo-800 mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Latest Release
                  </h4>
                  <div className="p-4 bg-white/60 rounded-lg border border-indigo-200">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-semibold text-indigo-900 text-sm">
                          {projectInsights.latestRelease.name ||
                            projectInsights.latestRelease.tag_name}
                        </div>
                        <div className="text-xs text-indigo-600">
                          Released{" "}
                          {formatRelativeTime(
                            projectInsights.latestRelease.published_at
                          )}
                        </div>
                      </div>
                      <motion.a
                        href={projectInsights.latestRelease.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        className="p-1 bg-indigo-100 hover:bg-indigo-200 rounded transition-colors"
                      >
                        <ExternalLink className="w-3 h-3 text-indigo-600" />
                      </motion.a>
                    </div>
                    {projectInsights.latestRelease.body && (
                      <div className="text-xs text-indigo-700 mt-2 line-clamp-2">
                        {projectInsights.latestRelease.body.substring(0, 100)}
                        ...
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Repository Quality Score */}
              <div>
                <h4 className="text-md font-semibold text-indigo-800 mb-3 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Repository Quality Score
                </h4>
                <div className="p-4 bg-white/60 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-indigo-800">
                      Overall Quality
                    </span>
                    <span className="text-sm font-bold text-indigo-900">
                      {Math.round(
                        (((repository.has_issues ? 1 : 0) +
                          (repository.has_wiki ? 1 : 0) +
                          (repository.has_pages ? 1 : 0) +
                          (repository.license ? 1 : 0) +
                          (repository.description ? 1 : 0) +
                          (repository.topics && repository.topics.length > 0
                            ? 1
                            : 0)) /
                          6) *
                          100
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-indigo-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                      style={{
                        width: `${Math.round(
                          (((repository.has_issues ? 1 : 0) +
                            (repository.has_wiki ? 1 : 0) +
                            (repository.has_pages ? 1 : 0) +
                            (repository.license ? 1 : 0) +
                            (repository.description ? 1 : 0) +
                            (repository.topics && repository.topics.length > 0
                              ? 1
                              : 0)) /
                            6) *
                            100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Topics Section */}
        {repository.topics && repository.topics.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="w-5 h-5 text-gray-600" />
              <span className="text-lg font-semibold text-gray-900">
                Topics & Technologies
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {repository.topics.map((topic, index) => (
                <motion.span
                  key={topic}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-full text-sm border border-blue-200 hover:shadow-md transition-all cursor-pointer"
                >
                  {topic}
                </motion.span>
              ))}
            </div>
          </div>
        )}

        {/* Professional Footer */}
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
            {repository.language && (
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: getLanguageColor(repository.language),
                  }}
                />
                <span className="font-medium">{repository.language}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>{formatLicense(repository.license)}</span>
            </div>

            <div className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              <span>{repository.clone_url ? "Cloneable" : "Private"}</span>
            </div>

            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span>
                {repository.homepage ? (
                  <a
                    href={repository.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Website
                  </a>
                ) : (
                  "No website"
                )}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Updated {formatDate(repository.updated_at)}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RepoCard;
