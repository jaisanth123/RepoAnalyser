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

// Import all the new components
import RepositoryHeader from "./RepositoryHeader";
import RepositoryHealthCard from "./RepositoryHealthCard";
import LanguageAnalysisCard from "./LanguageAnalysisCard";
import ProjectStatisticsCard from "./ProjectStatisticsCard";
import ContributorAnalysisCard from "./ContributorAnalysisCard";
import CommitAnalysisCard from "./CommitAnalysisCard";
import CoreFeaturesCard from "./CoreFeaturesCard";
import DevelopmentWorkflowCard from "./DevelopmentWorkflowCard";
import LatestReleaseCard from "./LatestReleaseCard";
import AdditionalInfoCard from "./AdditionalInfoCard";
import TopicsSection from "./TopicsSection";
import ProfessionalFooter from "./ProfessionalFooter";

// Import all the advanced charts
import CommitTimelineChart from "../Charts/CommitTimelineChart";
import RepositoryHealthRadarChart from "../Charts/RepositoryHealthRadarChart";
import ContributorDistributionChart from "../Charts/ContributorDistributionChart";
import IssueAndPRAnalyticsChart from "../Charts/IssueAndPRAnalyticsChart";
import CommitActivityHeatmapChart from "../Charts/CommitActivityHeatmapChart";
import GrowthTrendsChart from "../Charts/GrowthTrendsChart";
import ActivityChart from "../Charts/ActivityChart";
import LanguageChart from "../Charts/LanguageChart";

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
    // Filter out pull requests from issues (GitHub API includes PRs in issues endpoint)
    const actualIssues = issues.filter((issue) => !issue.pull_request);

    const openIssues = actualIssues.filter(
      (issue) => issue.state === "open"
    ).length;
    const closedIssues = actualIssues.filter(
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
      className="w-full max-w-none bg-white border border-gray-200 rounded-3xl shadow-xl overflow-hidden"
    >
      {/* Repository Header */}
      <RepositoryHeader
        repository={repository}
        health={health}
        activity={activity}
        commitPatterns={commitPatterns}
        isLoadingCommits={isLoadingCommits}
        hasMoreCommits={hasMoreCommits}
      />

      <div className="p-6">
        {/* Advanced Repository Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <RepositoryHealthCard
            commits={commits}
            issues={issues}
            pullRequests={pullRequests}
            releases={releases}
            repository={repository}
          />
          <LanguageAnalysisCard repository={repository} />
          <ProjectStatisticsCard projectInsights={projectInsights} />
        </div>

        {/* Contributor Analysis */}
        <ContributorAnalysisCard contributorInsights={contributorInsights} />

        {/* Advanced Development Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <CommitAnalysisCard commitPatterns={commitPatterns} />
          <CoreFeaturesCard repository={repository} />
          <DevelopmentWorkflowCard
            repository={repository}
            projectInsights={projectInsights}
            commitPatterns={commitPatterns}
            isLoadingCommits={isLoadingCommits}
            hasMoreCommits={hasMoreCommits}
          />
        </div>

        {/* Latest Release */}
        <LatestReleaseCard projectInsights={projectInsights} />

        {/* Additional Repository Information */}
        <AdditionalInfoCard repository={repository} />

        {/* Topics Section */}
        <TopicsSection repository={repository} />

        {/* Advanced Analytics Charts Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-6 h-6 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              Advanced Analytics & Insights
            </h2>
          </div>

          {/* Primary Analytics Charts */}
          <div className="grid grid-cols-1 gap-6 mb-6">
            {/* Repository Health Radar */}
            <RepositoryHealthRadarChart
              repository={repository}
              contributors={contributors}
              commits={commits}
              issues={issues}
              pullRequests={pullRequests}
              releases={releases}
            />

            {/* Growth Trends */}
            <GrowthTrendsChart
              repository={repository}
              contributors={contributors}
              commits={commits}
              releases={releases}
            />
          </div>

          {/* Commit Timeline Chart */}
          <div className="grid grid-cols-1 gap-6 mb-6">
            <CommitTimelineChart commits={commits} repository={repository} />
          </div>

          {/* Issue & PR Analytics Chart */}
          <div className="grid grid-cols-1 gap-6 mb-6">
            <IssueAndPRAnalyticsChart
              issues={issues}
              pullRequests={pullRequests}
              repository={repository}
            />
          </div>

          {/* Team & Development Patterns */}
          <div className="grid grid-cols-1 gap-6 mb-6">
            {/* Contributor Distribution */}
            <ContributorDistributionChart
              contributors={contributors}
              repository={repository}
            />

            {/* Commit Activity Heatmap */}
            <CommitActivityHeatmapChart
              commits={commits}
              repository={repository}
            />
          </div>

          {/* Enhanced Language Chart */}
          <div className="mb-6">
            <LanguageChart
              data={languageDiversity.languageBreakdown.map((lang) => ({
                name: lang.name,
                value: lang.percentage,
                bytes: lang.bytes,
              }))}
            />
          </div>
        </div>

        {/* Professional Footer */}
        <ProfessionalFooter repository={repository} />
      </div>
    </motion.div>
  );
};

export default RepoCard;
