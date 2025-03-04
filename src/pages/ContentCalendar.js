import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import './ContentCalendar.css';
import CalendarOverview from '../components/CalendarOverview';
import ArticleGenerator from '../components/ArticleGenerator';
import { useUser } from '@clerk/clerk-react';
import IdArticleGenerator from '../components/IdArticleGenerator';
function ContentCalendar() {
    const { user } = useUser();
    if (!user) {
        return _jsx("div", { children: "Please sign in to continue" });
    }
    console.log("User ID being sent:", user.id);
    let form = null;
    let table = null;
    switch (user.id) {
        case 'user_2to4iIK0DdzKaPJLbxXXJ0NMiLJ':
            form = _jsx(IdArticleGenerator, {});
            table = _jsx(CalendarOverview, {});
            break;
        case 'user_2tcq10lxmyCfQ69VBiX5NdAD8wc':
            form = _jsx(ArticleGenerator, {});
            table = _jsx(CalendarOverview, {});
            break;
    }
    return (_jsx("div", { children: _jsxs("div", { className: "content-calendar-container", children: [_jsx("div", { className: "form-container", children: form }), _jsx("div", { className: "table-container", children: table })] }) }));
}
export default ContentCalendar;
