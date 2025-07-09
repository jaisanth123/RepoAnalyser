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
  Info,
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
  const [commitCountMethod, setCommitCountMethod] = useState("provided"); // Track which method was used
  const [isCommitCountApproximate, setIsCommitCountApproximate] =
    useState(false);
  const [commitCountProgress, setCommitCountProgress] = useState("");
  const [showLoadingCount, setShowLoadingCount] = useState(false); // New state for loading display

  // New state for comprehensive contributor counting
  const [actualTotalContributors, setActualTotalContributors] = useState(
    contributors.length
  );
  const [isLoadingContributors, setIsLoadingContributors] = useState(false);
  const [contributorCountMethod, setContributorCountMethod] =
    useState("provided");
  const [isContributorCountApproximate, setIsContributorCountApproximate] =
    useState(false);
  const [contributorCountProgress, setContributorCountProgress] = useState("");
  const [showLoadingContributorCount, setShowLoadingContributorCount] =
    useState(false);
  const [enhancedContributors, setEnhancedContributors] =
    useState(contributors);

  // Enhanced commit counting with multiple strategies
  const fetchComprehensiveCommitCount = async (owner, repo) => {
    const methods = [];

    try {
      // Method 1: GraphQL API for comprehensive commit count
      const graphqlCount = await fetchCommitCountGraphQL(owner, repo);
      if (graphqlCount) {
        methods.push({
          method: "graphql",
          count: graphqlCount,
          confidence: "high",
        });
      }
    } catch (error) {
      console.warn("GraphQL method failed:", error);
    }

    try {
      // Method 2: All branches comprehensive count
      const branchCount = await fetchCommitCountAllBranches(owner, repo);
      if (branchCount) {
        methods.push({
          method: "all-branches",
          count: branchCount,
          confidence: "high",
        });
      }
    } catch (error) {
      console.warn("All branches method failed:", error);
    }

    try {
      // Method 3: Enhanced stats/contributors with all pages
      const statsCount = await fetchCommitCountEnhancedStats(owner, repo);
      if (statsCount) {
        methods.push({
          method: "enhanced-stats",
          count: statsCount,
          confidence: "medium",
        });
      }
    } catch (error) {
      console.warn("Enhanced stats method failed:", error);
    }

    try {
      // Method 4: Smart pagination with multiple strategies
      const paginationCount = await fetchCommitCountSmartPagination(
        owner,
        repo
      );
      if (paginationCount) {
        methods.push({
          method: "smart-pagination",
          count: paginationCount,
          confidence: "medium",
        });
      }
    } catch (error) {
      console.warn("Smart pagination method failed:", error);
    }

    // Return the best result
    if (methods.length > 0) {
      // Prefer high-confidence methods, then highest count
      const highConfidenceMethods = methods.filter(
        (m) => m.confidence === "high"
      );
      const bestMethod =
        highConfidenceMethods.length > 0
          ? highConfidenceMethods.reduce((a, b) => (a.count > b.count ? a : b))
          : methods.reduce((a, b) => (a.count > b.count ? a : b));

      return bestMethod;
    }

    return null;
  };

  // Method 1: GraphQL API for comprehensive commit counting
  const fetchCommitCountGraphQL = async (owner, repo) => {
    setCommitCountProgress("Trying GraphQL API...");

    const query = `
      query($owner: String!, $repo: String!) {
        repository(owner: $owner, name: $repo) {
          refs(refPrefix: "refs/heads/", first: 100) {
            nodes {
              name
              target {
                ... on Commit {
                  history(first: 1) {
                    totalCount
                  }
                }
              }
            }
          }
          defaultBranchRef {
            target {
              ... on Commit {
                history(first: 1) {
                  totalCount
                }
              }
            }
          }
        }
      }
    `;

    const token = localStorage.getItem("github_token");
    if (!token) {
      throw new Error("No GitHub token available for GraphQL");
    }

    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables: { owner, repo } }),
    });

    if (!response.ok) {
      throw new Error(`GraphQL query failed: ${response.status}`);
    }

    const data = await response.json();

    if (data.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
    }

    // Get unique commits across all branches
    const branches = data.data.repository.refs.nodes;
    const defaultBranchCount =
      data.data.repository.defaultBranchRef?.target?.history?.totalCount || 0;

    // Use the highest count from any branch as the baseline
    let maxCount = defaultBranchCount;
    for (const branch of branches) {
      const branchCount = branch.target?.history?.totalCount || 0;
      if (branchCount > maxCount) {
        maxCount = branchCount;
      }
    }

    return maxCount;
  };

  // Method 2: Fetch commits from all branches
  const fetchCommitCountAllBranches = async (owner, repo) => {
    setCommitCountProgress("Analyzing all branches...");

    // First, get all branches
    const branchesResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/branches?per_page=100`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          ...(localStorage.getItem("github_token") && {
            Authorization: `token ${localStorage.getItem("github_token")}`,
          }),
        },
      }
    );

    if (!branchesResponse.ok) {
      throw new Error(`Failed to fetch branches: ${branchesResponse.status}`);
    }

    const branchesData = await branchesResponse.json();
    let maxCommitCount = 0;
    const uniqueCommits = new Set();

    // Process branches in batches to avoid rate limiting
    const batchSize = 5;
    for (let i = 0; i < branchesData.length; i += batchSize) {
      const batch = branchesData.slice(i, i + batchSize);

      const branchPromises = batch.map(async (branch) => {
        try {
          setCommitCountProgress(`Analyzing branch: ${branch.name}...`);

          // Get commit count for this branch
          const commitsResponse = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/commits?sha=${branch.commit.sha}&per_page=1`,
            {
              headers: {
                Accept: "application/vnd.github.v3+json",
                ...(localStorage.getItem("github_token") && {
                  Authorization: `token ${localStorage.getItem(
                    "github_token"
                  )}`,
                }),
              },
            }
          );

          if (commitsResponse.ok) {
            const linkHeader = commitsResponse.headers.get("Link");
            let branchCommitCount = 1;

            if (linkHeader) {
              const lastPageMatch = linkHeader.match(/page=(\d+)>; rel="last"/);
              if (lastPageMatch) {
                branchCommitCount = parseInt(lastPageMatch[1]);
              }
            }

            // Also collect unique commit SHAs for deduplication
            const recentCommitsResponse = await fetch(
              `https://api.github.com/repos/${owner}/${repo}/commits?sha=${branch.commit.sha}&per_page=100`,
              {
                headers: {
                  Accept: "application/vnd.github.v3+json",
                  ...(localStorage.getItem("github_token") && {
                    Authorization: `token ${localStorage.getItem(
                      "github_token"
                    )}`,
                  }),
                },
              }
            );

            if (recentCommitsResponse.ok) {
              const recentCommits = await recentCommitsResponse.json();
              recentCommits.forEach((commit) => uniqueCommits.add(commit.sha));
            }

            return { branch: branch.name, count: branchCommitCount };
          }
        } catch (error) {
          console.warn(
            `Failed to get commits for branch ${branch.name}:`,
            error
          );
          return { branch: branch.name, count: 0 };
        }
      });

      const batchResults = await Promise.all(branchPromises);

      // Update max count
      batchResults.forEach((result) => {
        if (result.count > maxCommitCount) {
          maxCommitCount = result.count;
        }
      });

      // Small delay to avoid rate limiting
      if (i + batchSize < branchesData.length) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    // Return the higher of: max branch count or unique commits count
    return Math.max(maxCommitCount, uniqueCommits.size);
  };

  // Method 3: Enhanced stats/contributors with proper handling
  const fetchCommitCountEnhancedStats = async (owner, repo) => {
    setCommitCountProgress("Using enhanced stats API...");

    const statsResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/stats/contributors`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          ...(localStorage.getItem("github_token") && {
            Authorization: `token ${localStorage.getItem("github_token")}`,
          }),
        },
      }
    );

    if (statsResponse.status === 202) {
      // Stats are being computed, wait and retry
      setCommitCountProgress("Stats computing, retrying...");
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const retryResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/stats/contributors`,
        {
          headers: {
            Accept: "application/vnd.github.v3+json",
            ...(localStorage.getItem("github_token") && {
              Authorization: `token ${localStorage.getItem("github_token")}`,
            }),
          },
        }
      );

      if (retryResponse.ok) {
        const contributors = await retryResponse.json();
        if (contributors && contributors.length > 0) {
          return contributors.reduce(
            (total, contributor) => total + contributor.total,
            0
          );
        }
      }
    } else if (statsResponse.ok) {
      const contributors = await statsResponse.json();
      if (contributors && contributors.length > 0) {
        return contributors.reduce(
          (total, contributor) => total + contributor.total,
          0
        );
      }
    }

    throw new Error("Enhanced stats method failed");
  };

  // Method 4: Smart pagination with multiple strategies
  const fetchCommitCountSmartPagination = async (owner, repo) => {
    setCommitCountProgress("Using smart pagination...");

    // Try different approaches to get better pagination info
    const strategies = [
      // Strategy 1: Default branch with since parameter for better traversal
      async () => {
        const response = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/commits?per_page=1&page=1`,
          {
            headers: {
              Accept: "application/vnd.github.v3+json",
              ...(localStorage.getItem("github_token") && {
                Authorization: `token ${localStorage.getItem("github_token")}`,
              }),
            },
          }
        );

        if (response.ok) {
          const linkHeader = response.headers.get("Link");
          if (linkHeader) {
            const lastPageMatch = linkHeader.match(/page=(\d+)>; rel="last"/);
            if (lastPageMatch) {
              const lastPage = parseInt(lastPageMatch[1]);

              // Get the last page to count remaining commits
              const lastPageResponse = await fetch(
                `https://api.github.com/repos/${owner}/${repo}/commits?per_page=100&page=${lastPage}`,
                {
                  headers: {
                    Accept: "application/vnd.github.v3+json",
                    ...(localStorage.getItem("github_token") && {
                      Authorization: `token ${localStorage.getItem(
                        "github_token"
                      )}`,
                    }),
                  },
                }
              );

              if (lastPageResponse.ok) {
                const lastPageCommits = await lastPageResponse.json();
                return (lastPage - 1) * 100 + lastPageCommits.length;
              }
            }
          }
        }
        throw new Error("Strategy 1 failed");
      },

      // Strategy 2: Use repository creation date for better estimation
      async () => {
        const repoResponse = await fetch(
          `https://api.github.com/repos/${owner}/${repo}`,
          {
            headers: {
              Accept: "application/vnd.github.v3+json",
              ...(localStorage.getItem("github_token") && {
                Authorization: `token ${localStorage.getItem("github_token")}`,
              }),
            },
          }
        );

        if (repoResponse.ok) {
          const repoData = await repoResponse.json();
          const createdDate = new Date(repoData.created_at);
          const monthsOld = differenceInMonths(new Date(), createdDate);

          // Fetch recent commits to estimate velocity
          const recentResponse = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/commits?per_page=100`,
            {
              headers: {
                Accept: "application/vnd.github.v3+json",
                ...(localStorage.getItem("github_token") && {
                  Authorization: `token ${localStorage.getItem(
                    "github_token"
                  )}`,
                }),
              },
            }
          );

          if (recentResponse.ok) {
            const recentCommits = await recentResponse.json();
            const recentCommitDates = recentCommits
              .map((c) => new Date(c.commit.author.date))
              .filter((date) => !isNaN(date.getTime()));

            if (recentCommitDates.length > 10) {
              const oldestRecent = Math.min(...recentCommitDates);
              const newestRecent = Math.max(...recentCommitDates);
              const daysSpan = Math.max(
                1,
                (newestRecent - oldestRecent) / (1000 * 60 * 60 * 24)
              );
              const commitsPerDay = recentCommits.length / daysSpan;
              const totalDays =
                (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24);

              return Math.round(commitsPerDay * totalDays * 0.8); // Conservative estimate
            }
          }
        }
        throw new Error("Strategy 2 failed");
      },
    ];

    // Try strategies in order
    for (const strategy of strategies) {
      try {
        const result = await strategy();
        if (result > 0) {
          return result;
        }
      } catch (error) {
        console.warn("Strategy failed:", error);
      }
    }

    throw new Error("All smart pagination strategies failed");
  };

  const fetchContributorCountGraphQL = async (owner, repo) => {
    setContributorCountProgress("Fetching total contributors...");

    const query = `
      query($owner: String!, $repo: String!) {
        repository(owner: $owner, name: $repo) {
          mentionableUsers {
            totalCount
          }
          defaultBranchRef {
            target {
              ... on Commit {
                history(first: 1) {
                  totalCount
                }
              }
            }
          }
        }
      }
    `;

    const token = localStorage.getItem("github_token");
    if (!token) {
      throw new Error("No GitHub token available for GraphQL");
    }

    // First try GraphQL API for total count
    const graphqlResponse = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables: { owner, repo } }),
    });

    if (graphqlResponse.ok) {
      const graphqlData = await graphqlResponse.json();
      const totalCount =
        graphqlData.data?.repository?.mentionableUsers?.totalCount || 0;

      // Now get the contributor details using REST API
      const detailResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contributors?per_page=100`,
        {
          headers: {
            Accept: "application/vnd.github.v3+json",
            Authorization: `token ${token}`,
          },
        }
      );

      let contributors = [];
      if (detailResponse.ok) {
        contributors = await detailResponse.json();
        contributors = contributors.map((c) => ({
          login: c.login || "anonymous",
          avatar_url:
            c.avatar_url || "https://github.com/identicons/default.png",
          html_url: c.html_url || "#",
          contributions: c.contributions || 0,
        }));
      }

      // If GraphQL gives us a count, use it, otherwise fall back to REST API pagination
      if (totalCount > 0) {
        return {
          count: totalCount,
          contributors: contributors,
          confidence: "high",
        };
      }
    }

    // Fallback to REST API pagination if GraphQL fails
    const restResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contributors?per_page=1&anon=1`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          Authorization: `token ${token}`,
        },
      }
    );

    let totalCount = 0;
    if (restResponse.ok) {
      const linkHeader = restResponse.headers.get("Link");
      if (linkHeader) {
        const matches = linkHeader.match(/page=(\d+)>; rel="last"/);
        if (matches) {
          totalCount = parseInt(matches[1]);
        }
      }
    }

    return {
      count: totalCount || contributors.length,
      contributors: contributors,
      confidence: "high",
    };
  };

  // Remove other contributor counting methods that were causing overcounting
  const fetchComprehensiveContributorCount = async (owner, repo) => {
    try {
      const result = await fetchContributorCountGraphQL(owner, repo);
      return {
        count: result.count,
        contributors: result.contributors,
        method: "graphql",
        confidence: "high",
      };
    } catch (error) {
      console.warn("Contributor count failed:", error);
      return null;
    }
  };

  // Main contributor count fetching logic
  useEffect(() => {
    const fetchActualContributorCount = async () => {
      if (contributors.length < 100) {
        setContributorCountMethod("sampled");
        setIsContributorCountApproximate(false);
        return;
      }

      // Start loading state
      setIsLoadingContributors(true);
      setShowLoadingContributorCount(true);
      setContributorCountProgress("Fetching contributors...");

      // Set a placeholder while loading
      setActualTotalContributors(null);

      try {
        const [owner, repo] = repository.full_name.split("/");
        const result = await fetchComprehensiveContributorCount(owner, repo);

        if (result) {
          setActualTotalContributors(result.count);
          setContributorCountMethod(result.method);
          setIsContributorCountApproximate(false);
          setContributorCountProgress("Complete!");

          // Update contributors list if we got better data
          if (result.contributors && result.contributors.length > 0) {
            setEnhancedContributors(result.contributors);
          }
        } else {
          // Fallback to original count
          setActualTotalContributors(contributors.length);
          setContributorCountMethod("fallback");
          setIsContributorCountApproximate(true);
        }
      } catch (error) {
        console.warn("Contributor count failed:", error);
        setActualTotalContributors(contributors.length);
        setContributorCountMethod("error");
        setIsContributorCountApproximate(true);
      } finally {
        setIsLoadingContributors(false);
        setShowLoadingContributorCount(false);
        setContributorCountProgress("");
      }
    };

    fetchActualContributorCount();
  }, [repository.full_name, contributors.length]);

  // Main commit count fetching logic
  useEffect(() => {
    const fetchActualCommitCount = async () => {
      if (totalCommits) {
        setCommitCountMethod("provided");
        return;
      }

      if (commits.length < 100) {
        setCommitCountMethod("sampled");
        setIsCommitCountApproximate(false);
        return;
      }

      // Start loading state - hide the default 100 count
      setIsLoadingCommits(true);
      setShowLoadingCount(true);
      setCommitCountProgress("Starting comprehensive analysis...");

      // Set a placeholder while loading
      setActualTotalCommits(null);

      try {
        const [owner, repo] = repository.full_name.split("/");

        const result = await fetchComprehensiveCommitCount(owner, repo);

        if (result) {
          setActualTotalCommits(result.count);
          setCommitCountMethod(result.method);
          setIsCommitCountApproximate(result.confidence !== "high");
          setCommitCountProgress("Analysis complete!");
        } else {
          // Fallback to original logic
          setActualTotalCommits(commits.length);
          setHasMoreCommits(true);
          setIsCommitCountApproximate(true);
          setCommitCountMethod("fallback");
        }
      } catch (error) {
        console.warn("Comprehensive commit count failed:", error);
        setActualTotalCommits(commits.length);
        setCommitCountMethod("error");
        setIsCommitCountApproximate(true);
      } finally {
        setIsLoadingCommits(false);
        setShowLoadingCount(false);
        setCommitCountProgress("");
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
    // Use enhanced contributors if available, otherwise fall back to original
    const contributorsToUse =
      enhancedContributors.length > 0 ? enhancedContributors : contributors;

    // Show loading state or actual data
    const displayTotal = showLoadingContributorCount
      ? null
      : actualTotalContributors || contributorsToUse.length;
    const isLoading = showLoadingContributorCount || isLoadingContributors;

    if (!contributorsToUse.length && !isLoading) return null;

    const totalContributions = contributorsToUse.reduce(
      (sum, c) => sum + (c.contributions || 0),
      0
    );
    const avgContributions = totalContributions / contributorsToUse.length;
    const topContributors = contributorsToUse.slice(0, 5);
    const coreContributors = contributorsToUse.filter(
      (c) => c.contributions > avgContributions
    );

    // Calculate contribution distribution
    const contributionDistribution = contributorsToUse.map((c) => ({
      ...c,
      percentage: Math.round((c.contributions / totalContributions) * 100),
    }));

    return {
      total: displayTotal,
      totalContributions,
      avgContributions: Math.round(avgContributions),
      topContributors,
      coreContributors: coreContributors.length,
      contributionDistribution,
      diversityScore: calculateDiversityScore(contributorsToUse),
      collaborationScore: calculateCollaborationScore(
        contributorsToUse,
        totalContributions
      ),
      // Add loading and method information
      isLoading: isLoading,
      method: contributorCountMethod,
      isApproximate: isContributorCountApproximate,
      progress: contributorCountProgress,
    };
  };

  const calculateDiversityScore = (contributors) => {
    if (!contributors || contributors.length <= 1) return 15;

    const totalContributions = contributors.reduce(
      (sum, c) => sum + (c.contributions || 0),
      0
    );

    if (totalContributions === 0) return 15;

    const topContributorShare =
      (contributors[0]?.contributions || 0) / totalContributions;

    // Higher score for more even distribution
    const distributionScore = Math.max(0, 50 - topContributorShare * 100);
    const countScore = Math.min(50, contributors.length * 5);

    return Math.round(distributionScore + countScore);
  };

  const calculateCollaborationScore = (contributors, totalContributions) => {
    if (!contributors || contributors.length <= 1) return 20;
    if (totalContributions === 0) return 20;

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

    // Show loading state or actual data
    const displayTotal = showLoadingCount
      ? null
      : actualTotalCommits || commits.length;
    const isLoading = showLoadingCount || isLoadingCommits;

    return {
      total: displayTotal,
      recent7Days: last7Days.length,
      recent30Days: last30Days.length,
      weeklyFrequency: Math.round(last30Days.length / 4.3),
      uniqueAuthors: commitAuthors.length,
      avgCommitsPerAuthor: displayTotal
        ? Math.round(displayTotal / commitAuthors.length)
        : 0,
      mostRecentCommit: commits[0],
      commitVelocity:
        last7Days.length > 0
          ? "High"
          : last30Days.length > 5
          ? "Medium"
          : "Low",
      method: commitCountMethod,
      isApproximate: isCommitCountApproximate,
      isLoading: isLoading,
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
        contributorInsights={contributorInsights}
        isLoadingCommits={isLoadingCommits}
        hasMoreCommits={hasMoreCommits}
        commitCountProgress={commitCountProgress}
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
              contributors={
                enhancedContributors.length > 0
                  ? enhancedContributors
                  : contributors
              }
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
