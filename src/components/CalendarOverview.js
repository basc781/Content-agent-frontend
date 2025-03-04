import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import './CalendarOverview.css';
import { useState, useEffect } from 'react';
import { fetchArticles } from '../services/api';
import { FiRefreshCw } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
function CalendarOverview() {
    const { user } = useUser();
    const userId = user?.id;
    if (!userId) {
        return _jsx("div", { children: "Please sign in to continue" });
    }
    const [contentItems, setContentItems] = useState([]);
    const [error, setError] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    useEffect(() => {
        loadArticles();
        //Set up automatic refresh every 10 seconds
        const refreshInterval = setInterval(() => {
            loadArticles();
        }, 10000);
        // Clean up interval on component unmount
        return () => clearInterval(refreshInterval);
    }, []);
    const loadArticles = async () => {
        try {
            setIsRefreshing(true);
            const data = await fetchArticles(userId);
            setContentItems(data.publishedContentCalendarItems);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        }
        finally {
            setIsRefreshing(false);
        }
    };
    const handleRefresh = async () => {
        setIsRefreshing(true);
        await loadArticles();
        setIsRefreshing(false);
    };
    if (error)
        return _jsx("div", { className: "error-message", children: error });
    // Helper function to get the most recent article for a content item
    const getLatestArticle = (contentItem) => {
        if (!contentItem.articles || contentItem.articles.length === 0) {
            return null;
        }
        // Sort articles by createdAt date (newest first)
        const sortedArticles = [...contentItem.articles].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return sortedArticles[0];
    };
    // Format date to a more readable format
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('nl-NL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };
    return (_jsxs("div", { className: "calendar-overview", children: [_jsxs("div", { className: "component-header", children: [_jsx("h2", { children: "Content Calendar" }), _jsx("p", { children: "View and manage all your scheduled and published content" })] }), _jsx("div", { className: "calendar-header", children: _jsxs("button", { className: `refresh-button ${isRefreshing ? 'refreshing' : ''}`, onClick: handleRefresh, disabled: isRefreshing, children: [_jsx(FiRefreshCw, { className: "refresh-icon" }), "Refresh"] }) }), _jsxs("table", { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Title" }), _jsx("th", { children: "Status" }), _jsx("th", { children: "Date" }), _jsx("th", { children: "Event" }), _jsx("th", { children: "Actions" })] }) }), _jsx("tbody", { children: contentItems.map(item => {
                            const latestArticle = getLatestArticle(item);
                            return (_jsxs("tr", { children: [_jsx("td", { children: item.title }), _jsx("td", { children: _jsx("span", { className: `status-badge status-${item.status.toLowerCase()}`, children: item.status }) }), _jsx("td", { children: item.dateCreated ? formatDate(item.dateCreated) : 'N/A' }), _jsx("td", { children: item.formData.event || 'N/A' }), _jsx("td", { children: latestArticle && latestArticle.pagepath ? (_jsx(Link, { to: `/article/${latestArticle.pagepath}`, className: "view-article-link", children: "View Article" })) : (_jsx("span", { className: "no-article", children: "No article available" })) })] }, item.id));
                        }) })] })] }));
}
export default CalendarOverview;
