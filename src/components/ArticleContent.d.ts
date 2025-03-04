import './ArticleContent.css';
import { Article } from '../services/api';
interface ArticleContentProps {
    article: Article;
}
declare function ArticleContent({ article }: ArticleContentProps): import("react/jsx-runtime").JSX.Element;
export default ArticleContent;
