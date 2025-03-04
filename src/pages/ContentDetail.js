import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchArticles } from '../services/api';
import ArticleContent from '../components/ArticleContent';
import Body from '../components/Body';
import './ContentDetail.css';
import { useUser } from '@clerk/clerk-react';
function ContentDetail() {
    const { user } = useUser();
    if (!user) {
        return _jsx("div", { children: "Please sign in to continue" });
    }
    const userId = user.id;
    const { pagepath } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const loadArticle = async () => {
            try {
                setLoading(true);
                if (!pagepath) {
                    throw new Error('No pagepath provided');
                }
                const response = await fetchArticles(userId);
                // Zoek het content calendar item en het bijbehorende artikel
                let foundArticle;
                let parentTitle;
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
            }
            catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                // Optionally redirect to home page after a delay
                setTimeout(() => navigate('/'), 3000);
            }
            finally {
                setLoading(false);
            }
        };
        loadArticle();
    }, [pagepath, navigate, userId]);
    if (loading) {
        return (_jsx(Body, { children: _jsx("div", { className: "content-detail-loading", children: "Loading article..." }) }));
    }
    if (error) {
        return (_jsx(Body, { children: _jsxs("div", { className: "content-detail-error", children: [_jsx("h2", { children: "Error" }), _jsx("p", { children: error }), _jsx("p", { children: "Redirecting to home page..." })] }) }));
    }
    return (_jsx(Body, { children: _jsx("div", { className: "content-detail", children: article ? (_jsx(ArticleContent, { article: article })) : (_jsxs("div", { className: "content-detail-not-found", children: [_jsx("h2", { children: "Article Not Found" }), _jsx("p", { children: "The article you're looking for doesn't exist." }), _jsx("button", { onClick: () => navigate('/'), children: "Return to Home" })] })) }) }));
}
export default ContentDetail;
