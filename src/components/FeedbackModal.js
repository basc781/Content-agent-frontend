import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import './FeedbackModal.css';
function FeedbackModal({ isValid, feedback = [], onClose, onGenerate }) {
    return (_jsx("div", { className: "modal-overlay", children: _jsxs("div", { className: "modal-content", children: [_jsx("h2", { className: "modal-title", children: isValid ? "✅ Je input ziet er goed uit!" : "❌ Je moet je input verbeteren" }), _jsx("div", { className: "feedback-list", children: feedback.map((item, index) => (_jsxs("div", { className: "feedback-item", children: [_jsx("span", { className: "bullet", children: "\u2022" }), _jsx("p", { className: "feedback-text", children: item })] }, index))) }), _jsx("div", { className: "modal-actions", children: isValid ? (_jsxs(_Fragment, { children: [_jsx("button", { className: "secondary-button", onClick: onClose, children: "Toch verbeteringen toevoegen" }), _jsx("button", { className: "primary-button", onClick: onGenerate, children: "Genereer artikel" })] })) : (_jsx("button", { className: "primary-button", onClick: onClose, children: "Verbeteringen toevoegen" })) })] }) }));
}
export default FeedbackModal;
