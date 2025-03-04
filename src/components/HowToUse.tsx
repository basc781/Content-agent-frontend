import './HowToUse.css';
import { FiEdit, FiCheckCircle, FiClock, FiCalendar } from 'react-icons/fi';

function HowToUse() {
  return (
    <section className="how-to-use">
      <div className="how-to-use-header">
        <h2>How It Works</h2>
      </div>
      
      <div className="steps-container">
        <div className="step">
          <div className="step-number">1</div>
          <div className="step-icon">
            <FiEdit />
          </div>
          <h3>Fill in the Form</h3>
          <p>Enter your article details in the form including title, event, description, and keywords. Click generate and wait 20-30 seconds.</p>
        </div>
        
        <div className="step-connector">
          <div className="arrow-right"></div>
        </div>
        
        <div className="step">
          <div className="step-number">2</div>
          <div className="step-icon">
            <FiCheckCircle />
          </div>
          <h3>Review Feedback</h3>
          <p>Get feedback on your input. Click generate if your input is valid or make improvements if changes are needed.</p>
        </div>
        
        <div className="step-connector">
          <div className="arrow-right"></div>
        </div>
        
        <div className="step">
          <div className="step-number">3</div>
          <div className="step-icon">
            <FiClock />
          </div>
          <h3>Wait for Generation</h3>
          <p>After clicking generate, wait 10-15 minutes while our AI creates your high-quality article content.</p>
        </div>
        
        <div className="step-connector">
          <div className="arrow-right"></div>
        </div>
        
        <div className="step">
          <div className="step-number">4</div>
          <div className="step-icon">
            <FiCalendar />
          </div>
          <h3>View in Calendar</h3>
          <p>Your generated article appears in the content calendar. View, edit, or publish it with a single click.</p>
        </div>
      </div>
    </section>
  );
}

export default HowToUse; 