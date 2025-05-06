import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchArticle, RenderArticle } from "../services/api";
import ArticleContent from "../components/ArticleContent";
import Body from "../components/Body";
import "./ContentDetail.css";

function ContentDetail() {
  const { pagepath } = useParams<{ pagepath: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<RenderArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  
  useEffect(() => {

    const loadArticle = async () => {

      console.log('HALOOOOO')
      try {
        setLoading(true);
        if (!pagepath) {
          throw new Error("No pagepath provided");
        }

        const article = await fetchArticle(pagepath);

        console.log('dit is de article format',article.outputFormat)

        if (!article) {
          throw new Error("Article not found");
        }

        // Voeg de titel toe aan het artikel object
        setArticle(article);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        // Optionally redirect to home page after a delay
        // setTimeout(() => navigate("/"), 3000);
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [pagepath, navigate]);

  if (loading) {
    return (
      <Body>
        <div className="content-detail-loading">Loading article...</div>
      </Body>
    );
  }

  if (error) {
    return (
      <Body>
        <div className="content-detail-error">
          <h2>Error</h2>
          <p>{error}</p>
          <p>Redirecting to home page...</p>
        </div>
      </Body>
    );
  }

  return (
    <Body>
      <div className="content-detail">
        {article ? (
          <ArticleContent article={article} outputFormat={article.outputFormat} />
        ) : (
          <div className="content-detail-not-found">
            <h2>Article Not Found</h2>
            <p>The article you're looking for doesn't exist.</p>
            <button onClick={() => navigate("/")}>Return to Home</button>
          </div>
        )}
      </div>
    </Body>
  );
}

export default ContentDetail;
