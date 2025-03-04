import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import './index.css';
import { SignedIn, SignedOut, UserButton, ClerkProvider, SignIn } from '@clerk/clerk-react';
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
    throw new Error('Missing Publishable Key');
}
createRoot(document.getElementById('root')).render(_jsx(StrictMode, { children: _jsxs(ClerkProvider, { publishableKey: PUBLISHABLE_KEY, children: [_jsxs(SignedIn, { children: [_jsx(UserButton, {}), _jsx(RouterProvider, { router: router })] }), _jsx(SignedOut, { children: _jsx(SignIn, {}) })] }) }));
