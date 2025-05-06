import "./ArticleContent.css";
import { RenderArticle } from "../services/api";
import ReactMarkdown from "react-markdown";
import { JsonEditor } from "json-edit-react";

interface ArticleContentProps {
  article: RenderArticle;
  outputFormat: string;
}

function ArticleContent({ article, outputFormat }: ArticleContentProps) {
  if (!article) {
    console.log("No article provided");
    return <div>No article data available</div>;
  }

  const renderJsonContent = (jsonText: string) => {
    try {
      const parsedData = JSON.parse(jsonText);
      console.log("Successfully parsed JSON:", parsedData);
      return <JsonEditor data={parsedData} viewOnly={true} collapse={true} />;
    } catch (error) {
      console.error("JSON Parse Error:", error);
      console.log(
        "Raw text that failed to parse:",
        jsonText.substring(0, 100) + "..."
      );
      return <div>Error parsing JSON content</div>;
    }
  };

  if (outputFormat === "markdown") return (
    <div className="article-content">
      <div className="article-header">
        <div className="article-meta">
          <span className="article-date">
            {new Date(article.createdAt).toLocaleDateString("nl-NL", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
      <div className="article-body">
        {article.outputFormat === "json" ? (
          renderJsonContent(article.text)
        ) : (
          <ReactMarkdown>{article.text || ""}</ReactMarkdown>
        )}
      </div>
    </div>
  );
  if (outputFormat === "emailHTML") return (
    <div className="article-content">
      <div className="article-header">
        <div className="article-meta">
          <span className="article-date">
            {new Date(article.createdAt).toLocaleDateString("nl-NL", {
              year: "numeric",
              month: "long", 
              day: "numeric",
            })}
          </span>
        </div>
      </div>
      <div className="article-body">
        {article.outputFormat === "json" ? (
          renderJsonContent(article.text)
        ) : (
          <iframe
            srcDoc={article.text || ""}
            style={{
              width: "100%",
              height: "800px", // You may want to adjust this
              border: "none",
              overflow: "auto"
            }}
            title="Email Preview"
            sandbox="allow-same-origin"
          />
        )}
      </div>
    </div>
  );
}

export default ArticleContent;
