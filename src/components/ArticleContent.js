import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import './ArticleContent.css';
import ReactMarkdown from 'react-markdown';
import { JsonEditor } from 'json-edit-react';
function ArticleContent({ article }) {
    if (!article) {
        return _jsx("div", { children: "No article data available" });
    }
    return (_jsxs("div", { className: "article-content", children: [_jsxs("div", { className: "article-header", children: [_jsx("h1", { children: article.title || 'Untitled Article' }), _jsx("div", { className: "article-meta", children: _jsx("span", { className: "article-date", children: new Date(article.createdAt).toLocaleDateString('nl-NL', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            }) }) })] }), _jsx("div", { className: "article-body", children: article.outputFormat === "json" ? (_jsx(JsonEditor, { data: JSON.parse(article.text), viewOnly: true, collapse: true })) : (_jsx(ReactMarkdown, { children: article.text || '' })) })] }));
}
export default ArticleContent;
