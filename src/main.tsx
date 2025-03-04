import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import './index.css'
import { SignedIn, SignedOut, UserButton, ClerkProvider, SignIn } from '@clerk/clerk-react'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY; 

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <SignedIn>
        <UserButton />
        <RouterProvider router={router} />
      </SignedIn>
      <SignedOut>
        <SignIn />
      </SignedOut>
    </ClerkProvider>
  </StrictMode>,
)
