import './ArticleContent.css';
import { Article } from '../services/api';
import ReactMarkdown from 'react-markdown';
import { JsonEditor } from 'json-edit-react';

interface ArticleContentProps {
  article: Article;
}

function ArticleContent({ article }: ArticleContentProps) {
  if (!article) {
    console.log('No article provided');
    return <div>No article data available</div>;
  }

  console.log('Article received:', article);
  console.log('Article text type:', typeof article.text);
  console.log('Article text content:', article.text);

  const renderJsonContent = (jsonText: string) => {
    try {
      const parsedData = JSON.parse(jsonText);
      console.log('Successfully parsed JSON:', parsedData);
      return (
        <JsonEditor 
          data={parsedData}
          viewOnly={true}
          collapse={true}
        />
      );
    } catch (error) {
      console.error('JSON Parse Error:', error);
      console.log('Raw text that failed to parse:', jsonText.substring(0, 100) + '...');
      return <div>Error parsing JSON content</div>;
    }
  };

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
        {article.outputFormat === "json" 
          ? renderJsonContent(article.text)
          : <ReactMarkdown>{article.text || ''}</ReactMarkdown>
        }
      </div>
    </div>
  );
}

export default ArticleContent; 