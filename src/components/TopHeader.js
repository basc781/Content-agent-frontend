import { jsx as _jsx } from "react/jsx-runtime";
import './TopHeader.css';
function TopHeader({ backgroundImage, title }) {
    return (_jsx("div", { className: "top-bar top-image large-image", style: { backgroundImage: `url('${backgroundImage}')` }, children: _jsx("div", { className: "background", children: _jsx("div", { className: "wrap", children: _jsx("h1", { children: title }) }) }) }));
}
export default TopHeader;
