import './FeedbackModal.css';
interface FeedbackModalProps {
    isValid: boolean;
    feedback: string[];
    onClose: () => void;
    onGenerate?: () => void;
}
declare function FeedbackModal({ isValid, feedback, onClose, onGenerate }: FeedbackModalProps): import("react/jsx-runtime").JSX.Element;
export default FeedbackModal;
