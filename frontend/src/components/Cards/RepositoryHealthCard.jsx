import {
  Activity,
  GitCommit,
  GitPullRequest,
  Bug,
  Tag,
  Clock,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const RepositoryHealthCard = ({
  commits = [],
  issues = [],
  pullRequests = [],
  releases = [],
  repository,
}) => {
  // Combine all activities into a single timeline
  const getRecentActivities = () => {
    const activities = [];

    // Add recent commits (last 5)
    commits.slice(0, 5).forEach((commit) => {
      activities.push({
        type: "commit",
        icon: GitCommit,
        color: "blue",
        title: commit.commit?.message?.split("\n")[0] || "Commit",
        author:
          commit.commit?.author?.name || commit.author?.login || "Unknown",
        date: commit.commit?.author?.date || commit.commit?.committer?.date,
        url: commit.html_url,
      });
    });

    // Add recent issues (last 3 open)
    issues
      .filter((issue) => issue.state === "open")
      .slice(0, 3)
      .forEach((issue) => {
        activities.push({
          type: "issue",
          icon: Bug,
          color: "red",
          title: `Issue: ${issue.title}`,
          author: issue.user?.login || "Unknown",
          date: issue.created_at,
          url: issue.html_url,
        });
      });

    // Add recent PRs (last 3)
    pullRequests.slice(0, 3).forEach((pr) => {
      activities.push({
        type: "pr",
        icon: GitPullRequest,
        color:
          pr.state === "merged"
            ? "green"
            : pr.state === "open"
            ? "blue"
            : "gray",
        title: `PR: ${pr.title}`,
        author: pr.user?.login || "Unknown",
        date: pr.created_at,
        url: pr.html_url,
        state: pr.state,
      });
    });

    // Add recent releases (last 2)
    releases.slice(0, 2).forEach((release) => {
      activities.push({
        type: "release",
        icon: Tag,
        color: "purple",
        title: `Release: ${release.name || release.tag_name}`,
        author: release.author?.login || "Unknown",
        date: release.published_at || release.created_at,
        url: release.html_url,
      });
    });

    // Sort by date (most recent first)
    return activities
      .filter((activity) => activity.date)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 8); // Show only last 8 activities
  };

  const recentActivities = getRecentActivities();

  const getColorClasses = (color) => {
    const colors = {
      blue: "text-blue-600 bg-blue-100",
      green: "text-green-600 bg-green-100",
      red: "text-red-600 bg-red-100",
      purple: "text-purple-600 bg-purple-100",
      gray: "text-gray-600 bg-gray-100",
    };
    return colors[color] || colors.gray;
  };

  const formatTimeAgo = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "Unknown time";
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
      <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5 text-blue-600" />
        Recent Activity
      </h3>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {recentActivities.length > 0 ? (
          recentActivities.map((activity, index) => {
            const IconComponent = activity.icon;
            return (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-white/60 rounded-lg hover:bg-white/80 transition-colors cursor-pointer"
                onClick={() => window.open(activity.url, "_blank")}
              >
                <div
                  className={`p-2 rounded-lg ${getColorClasses(
                    activity.color
                  )}`}
                >
                  <IconComponent className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.title}
                    </p>
                    {activity.state && activity.type === "pr" && (
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full ${
                          activity.state === "merged"
                            ? "bg-purple-100 text-purple-700"
                            : activity.state === "open"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {activity.state}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span>by {activity.author}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatTimeAgo(activity.date)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No recent activity found</p>
          </div>
        )}
      </div>

      {recentActivities.length > 0 && (
        <div className="mt-4 pt-3 border-t border-blue-200">
          <p className="text-xs text-blue-700 text-center">
            Showing {recentActivities.length} recent activities •
            <a
              href={`${repository?.html_url}/activity`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:underline ml-1"
            >
              View all
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default RepositoryHealthCard;
