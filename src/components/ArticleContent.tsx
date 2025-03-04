import './ArticleContent.css';
import { Article } from '../services/api';
import ReactMarkdown from 'react-markdown';
import { JsonEditor } from 'json-edit-react';

interface ArticleContentProps {
  article: Article;
}

function ArticleContent({ article }: ArticleContentProps) {
  if (!article) {
    return <div>No article data available</div>;
  }

  return (
    <div className="article-content">
      <div className="article-header">
        <h1>{article.title || 'Untitled Article'}</h1>
        <div className="article-meta">
          <span className="article-date">
            {new Date(article.createdAt).toLocaleDateString('nl-NL', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </div>
      </div>
      <div className="article-body">
        {article.outputFormat === "json" ? (
          <JsonEditor 
            data={JSON.parse(article.text)}
            viewOnly={true}
            collapse={true}
          />
        ) : (
          <ReactMarkdown>{article.text || ''}</ReactMarkdown>
        )}
      </div>
    </div>
  );
}

export default ArticleContent; 