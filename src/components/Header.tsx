import type React from "react";

import { useEffect, useState } from "react";
import "./Header.css";
import { getOrganizationModules } from "../services/api";
import { ModuleHeader } from "../types/module";

interface HeaderProps {
  OrganizationSwitcher: React.ComponentType<{ hidePersonal: boolean }>;
  UserButton: React.ComponentType;
  logoOnly?: boolean;
}

export default function Header({
  logoOnly = false,
  OrganizationSwitcher,
  UserButton,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [modules, setModules] = useState<ModuleHeader[]>([]);

  useEffect(() => {
    const fetchModules = async () => {
      const modules = await getOrganizationModules();
      setModules(modules);
    };
    fetchModules();
  }, []);

  // Simple Menu and X icons since we're not using lucide-react
  const MenuIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 12H21M3 6H21M3 18H21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const XIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18 6L6 18M6 6L18 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  if (logoOnly) {
    return (
      <header className="header">
        <div className="header__container">
          {/* Logo/Brand */}
          <div className="header__logo-container">
            <img
              src="/icon.svg"
              alt="Content-Agent Logo"
              className="header__logo-image"
            />
            <a href="/" className="header__logo">
              Content-Agent
            </a>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="header">
      <div className="header__container">
        {/* Logo/Brand */}
        <div className="header__logo-container">
          <img
            src="/icon.svg"
            alt="Content-Agent Logo"
            className="header__logo-image"
          />
          <a href="/" className="header__logo">
            Content-Agent
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="header__nav">
          {modules.map((module) => (
            <a href={`/module/${module.slug}`} className="header__nav-link">
              {module.name}
            </a>
          ))}
        </nav>

        {/* Auth Components */}
        <div className="header__auth">
          <div className="header__auth-item">
            <OrganizationSwitcher hidePersonal={true} />
          </div>
          <div className="header__auth-item">
            <UserButton />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="header__menu-button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <XIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="header__mobile-menu">
          <nav className="header__mobile-nav">
            {modules.map((module) => (
              <a
                href={`/module/${module.slug}`}
                className="header__mobile-nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                {module.name}
              </a>
            ))}
            <div className="header__mobile-auth">
              <div className="header__mobile-auth-item">
                <OrganizationSwitcher hidePersonal={true} />
              </div>
              <div className="header__mobile-auth-item">
                <UserButton />
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
