import { jsx as _jsx } from "react/jsx-runtime";
import { createBrowserRouter } from 'react-router-dom';
import ContentCalendar from './pages/ContentCalendar';
import ContentDetail from './pages/ContentDetail';
import App from './App';
export const router = createBrowserRouter([
    {
        path: '/',
        element: _jsx(App, {}),
        children: [
            {
                path: '/',
                element: _jsx(ContentCalendar, {}),
            },
            {
                path: '/article/:pagepath',
                element: _jsx(ContentDetail, {}),
            },
        ],
    },
]);
