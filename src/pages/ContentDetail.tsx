import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Article, fetchArticles } from '../services/api';
import ArticleContent from '../components/ArticleContent';
import Body from '../components/Body';
import './ContentDetail.css';
import { useUser } from '@clerk/clerk-react';

function ContentDetail() {
  const { user } = useUser();

  if (!user) {
    return <div>Please sign in to continue</div>
  }

  const userId = user.id;

  const { pagepath } = useParams<{ pagepath: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArticle = async () => {
      try {
        setLoading(true);
        if (!pagepath) {
          throw new Error('No pagepath provided');
        }
        
        const response = await fetchArticles(userId as string);
        // Zoek het content calendar item en het bijbehorende artikel
        let foundArticle: Article | undefined;
        let parentTitle: string | undefined;
        
        for (const item of response.publishedContentCalendarItems) {
          const article = item.articles.find(a => a.pagepath === pagepath);
          if (article) {
            foundArticle = article;
            parentTitle = item.title; // Sla de titel van het parent item op
            break;
          }
        }
        
        if (!foundArticle) {
          throw new Error('Article not found');
        }
        
        // Voeg de titel toe aan het artikel object
        setArticle({
          ...foundArticle,
          title: parentTitle // Voeg de titel toe aan het artikel
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        // Optionally redirect to home page after a delay
        setTimeout(() => navigate('/'), 3000);
      } finally {
        setLoading(false);
      }
    };
    
    loadArticle();
  }, [pagepath, navigate, userId]);

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
          <ArticleContent article={article} />
        ) : (
          <div className="content-detail-not-found">
            <h2>Article Not Found</h2>
            <p>The article you're looking for doesn't exist.</p>
            <button onClick={() => navigate('/')}>Return to Home</button>
          </div>
        )}
      </div>
    </Body>
  );
}

export default ContentDetail;
