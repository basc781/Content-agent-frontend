import { createBrowserRouter } from "react-router-dom";
import ContentCalendar from "./pages/ContentCalendar";
import ContentDetail from "./pages/ContentDetail";
import App from "./App";
import Settings from "./pages/Settings";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <ContentCalendar />,
      },
      {
        path: "/article/:pagepath",
        element: <ContentDetail />,
      },
      {
        path: "/module/:slug",
        element: <ContentCalendar />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },

    ],
  },
]);
