import './FeedbackModal.css';

interface FeedbackModalProps {
  isValid: boolean;
  feedback: string[];
  onClose: () => void;
  onGenerate?: () => void;
}

function FeedbackModal({ isValid, feedback = [], onClose, onGenerate }: FeedbackModalProps) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">{isValid ? "✅ Je input ziet er goed uit!" : "❌ Je moet je input verbeteren"}</h2>
        
        <div className="feedback-list">
          {feedback.map((item, index) => (
            <div key={index} className="feedback-item">
              <span className="bullet">•</span>
              <p className="feedback-text">{item}</p>
            </div>
          ))}
        </div>

        <div className="modal-actions">
          {isValid ? (
            <>
              <button className="secondary-button" onClick={onClose}>
                Toch verbeteringen toevoegen
              </button>
              <button className="primary-button" onClick={onGenerate}>
                Genereer artikel
              </button>
            </>
          ) : (
            <button className="primary-button" onClick={onClose}>
              Verbeteringen toevoegen
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default FeedbackModal; 