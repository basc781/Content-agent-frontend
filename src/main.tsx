import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import "./index.css";
import {
  SignedIn,
  SignedOut,
  UserButton,
  ClerkProvider,
  SignIn,
  OrganizationSwitcher,
} from "@clerk/clerk-react";
import Header from "./components/Header";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}



createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <SignedIn>
        <>
          <Header
            OrganizationSwitcher={OrganizationSwitcher}
            UserButton={UserButton}
          />
          <main
            style={{
              margin: "0 auto",
              padding: "2rem 0",
            }}
          >
            <RouterProvider router={router} />
          </main>
        </>
      </SignedIn>
      <SignedOut>
        <Header
          logoOnly={true}
          OrganizationSwitcher={OrganizationSwitcher}
          UserButton={UserButton}
        />
        <div className="login-container">
          <SignIn />
        </div>
      </SignedOut>
    </ClerkProvider>
  </StrictMode>
);
