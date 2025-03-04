import { createBrowserRouter } from 'react-router-dom';
import ContentCalendar from './pages/ContentCalendar';
import ContentDetail from './pages/ContentDetail';
import App from './App';


export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <ContentCalendar />,
        },
      {
        path: '/article/:pagepath',
        element: <ContentDetail />,
      },
    ],
  },
]);