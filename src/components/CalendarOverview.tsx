import "./CalendarOverview.css";
import { useState, useEffect } from "react";
import { Article, fetchArticles } from "../services/api";
import { FiRefreshCw } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { deleteArticle } from "../services/api";
// Nieuwe interface voor de aangepaste datastructuur
interface ContentCalendarItem {
  id: number;
  orgId: string;
  title: string;
  dateCreated: string;
  formData: {
    datum: string;
    titel: string;
    beschrijving: string;
    potentialKeywords: string;
    winkelvoorbeelden: string;
  };
  status: string;
  articles: Article[];
}

function CalendarOverview({ moduleId }: { moduleId: string }) {
  const [contentItems, setContentItems] = useState<ContentCalendarItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadArticles = async () => {
    console.log("Starting to fetch articles");
    try {
      setIsRefreshing(true);
      const data = await fetchArticles(moduleId);
      setContentItems(data.publishedContentCalendarItems);
    } catch (err) {
      console.error(
        "Error fetching articles:",
        err instanceof Error ? err.message : "An error occurred"
      );
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteArticle(id);
      await loadArticles();
    } catch (err) {
      console.error("Error deleting article:", err);
      setError(err instanceof Error ? err.message : "An error occurred while deleting");
    }
  };

  useEffect(() => {
    loadArticles();

    //Set up automatic refresh every 10 seconds
    const refreshInterval = setInterval(() => {
      loadArticles();
    }, 60000);

    // Clean up interval on component unmount
    return () => clearInterval(refreshInterval);
  }, []);

  const { user } = useUser();
  const userId = user?.id;

  if (!userId) {
    return <div>Please sign in to continue</div>;
  }

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadArticles();
    setIsRefreshing(false);
  };

  if (error) return <div className="error-message">{error}</div>;

  // Helper function to get the most recent article for a content item
  const getLatestArticle = (contentItem: ContentCalendarItem) => {
    if (!contentItem.articles || contentItem.articles.length === 0) {
      return null;
    }

    // Sort articles by createdAt date (newest first)
    const sortedArticles = [...contentItem.articles].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return sortedArticles[0];
  };

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("nl-NL", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("nl-NL", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Helper function to calculate expected article time (20 mins after creation)
  const getExpectedArticleTime = (dateCreated: string) => {
    const date = new Date(dateCreated);
    date.setMinutes(date.getMinutes() + 20);
    return formatTime(date.toISOString());
  };

  console.log(contentItems);

  return (
    <div className="calendar-overview">
      <div className="component-header">
        <h2>Content Calendar</h2>
        <p>View and manage all your scheduled and published content</p>
      </div>

      <div className="calendar-header">
        <button
          className={`refresh-button ${isRefreshing ? "refreshing" : ""}`}
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <FiRefreshCw className="refresh-icon" />
          Refresh
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contentItems.map((item) => {
            const latestArticle = getLatestArticle(item);
            return (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td>
                  <span
                    className={`status-badge status-${item.status.toLowerCase()}`}
                  >
                    {item.status}
                  </span>
                </td>
                <td>
                  {item.dateCreated ? formatDate(item.dateCreated) : "N/A"}
                </td>
                <td>
                  {latestArticle && latestArticle.pagepath ? (
                    <Link
                      to={`/article/${latestArticle.pagepath}`}
                      className="view-article-link"
                    >
                      View Article
                    </Link>
                  ) : item.status === "Failed" ? (
                    <button
                      className="view-article-link delete-button"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  ) : (
                    <span className="no-article">
                      Article expected to be available at {getExpectedArticleTime(item.dateCreated)}
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default CalendarOverview;
