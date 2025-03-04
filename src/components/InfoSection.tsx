import './InfoSection.css';
import { FiClock, FiTrendingUp, FiEdit3 } from 'react-icons/fi';

function InfoSection() {
  return (
    <section className="info-section">
      <div className="info-header">
        <h2>Transform Your <span className="highlight-word">Content</span> Strategy</h2>
        <p>Leverage AI to create high-quality content that drives engagement and boosts your online presence</p>
      </div>
      
      <div className="info-cards">
        <div className="info-card">
          <div className="info-card-icon">
            <FiClock />
          </div>
          <h3>10x Faster Creation</h3>
          <p>Generate complete article drafts in minutes, not days. Our AI handles the heavy lifting so you can focus on adding your unique perspective.</p>
        </div>
        
        <div className="info-card">
          <div className="info-card-icon">
            <FiTrendingUp />
          </div>
          <h3>SEO Optimized</h3>
          <p>Every article is crafted with search engines in mind, using intelligent keyword analysis to maximize visibility and drive organic traffic.</p>
        </div>
        
        <div className="info-card">
          <div className="info-card-icon">
            <FiEdit3 />
          </div>
          <h3>Complete Workflow</h3>
          <p>From ideation to publication, manage your entire content pipeline in one powerful platform with automated scheduling and status tracking.</p>
        </div>
      </div>
    </section>
  );
}

export default InfoSection; 