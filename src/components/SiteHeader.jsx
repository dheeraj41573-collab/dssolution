"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

function isActive(url, pathname) {
  if (url === "/") return pathname === "/";
  return pathname === url || pathname.startsWith(`${url}/`);
}

function isCurrent(url, pathname) {
  return pathname === url || pathname === `${url}/`;
}

function normalizeMainMenu(items) {
  return items.map((item) => {
    if (
      item.name?.trim().toLowerCase() === "our work" ||
      item.url === "/our-portfolio"
    )
      return { ...item, name: "Portfolio", url: "/portfolio" };
    return item;
  });
}

function ThemeToggle({ isDark, onToggle }) {
  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={onToggle}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      title={`Switch to ${isDark ? "light" : "dark"} theme`}
    >
      {isDark ? (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <path d="M20.5 15.5A8.5 8.5 0 0 1 8.5 3.5 8.5 8.5 0 1 0 20.5 15.5Z" />
        </svg>
      )}
    </button>
  );
}

export default function SiteHeader({ config, menu }) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuButtonRef = useRef(null);
  const closeButtonRef = useRef(null);
  const searchButtonRef = useRef(null);
  const searchDialogRef = useRef(null);
  const searchInputRef = useRef(null);
  const mainMenu = normalizeMainMenu(menu.main);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function toggleTheme() {
    const dark = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    localStorage.setItem("ds-theme", dark ? "dark" : "light");
    setIsDark(dark);
  }

  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMenuOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event) {
      if (event.key === "Escape") setIsMenuOpen(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      menuButtonRef.current?.focus();
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const dialog = searchDialogRef.current;
    if (!dialog) return;

    if (isSearchOpen && !dialog.open) {
      dialog.showModal();
      searchInputRef.current?.focus();
    } else if (!isSearchOpen && dialog.open) {
      dialog.close();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (!isSearchOpen) return undefined;

    function handleSearchKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsSearchOpen(false);
      }
    }

    document.addEventListener("keydown", handleSearchKeyDown);
    return () => document.removeEventListener("keydown", handleSearchKeyDown);
  }, [isSearchOpen]);

  useEffect(() => {
    if (!isSearchOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
      searchButtonRef.current?.focus();
    };
  }, [isSearchOpen]);

  const phoneLink = `tel:${config.params.footer_phone.replace(/[^\d+]/g, "")}`;

  return (
    <header
      className={`header z-50 w-full transition-all duration-300 ${config.settings.sticky_header ? "fixed top-0" : ""} ${isScrolled ? "header-scrolled py-2" : "py-5"}`}
      data-menu-open={isMenuOpen}
    >
      <nav className="navbar relative z-30 container" aria-label="Primary">
        <div className="order-0 shrink-0">
          <Link
            className="site-header-brand navbar-brand inline-flex rounded-lg px-3 py-1.5 backdrop-blur-sm transition-all"
            href="/"
            aria-label={config.site.logo_text}
          >
            <img
              src={config.site.logo}
              width={config.site.logo_width}
              height={config.site.logo_height}
              alt={config.site.logo_text}
              className="h-9 w-auto object-contain"
            />
          </Link>
        </div>

        <ul className="site-header-nav navbar-nav bg-light/90 order-3 hidden w-full flex-col rounded-2xl px-6 py-6 backdrop-blur-lg lg:order-1 lg:flex lg:w-auto lg:flex-row lg:items-center lg:gap-x-0 lg:rounded-full lg:px-1 lg:py-0">
          {mainMenu.map((item) => {
            const active = item.children?.some((child) =>
              isActive(child.url, pathname),
            )
              ? true
              : isActive(item.url, pathname);

            return (
              <li
                className={`nav-item ${item.children?.length ? "nav-dropdown group relative" : ""}`}
                key={item.name}
              >
                <Link
                  className={`nav-link block ${item.emphasis ? "nav-link-emphasis" : ""} ${active ? "active" : ""}`}
                  href={item.url}
                  aria-current={
                    isCurrent(item.url, pathname) ? "page" : undefined
                  }
                >
                  {item.name}
                  {item.children?.length > 0 && (
                    <svg
                      className="ml-1 inline-block h-4 w-4 fill-current"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  )}
                </Link>
                {item.children?.length > 0 && (
                  <ul
                    className={`nav-dropdown-list invisible absolute top-full left-0 z-50 rounded-xl opacity-0 shadow-xl transition duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100 ${item.name === "Services" ? "nav-dropdown-services grid max-h-[75vh] w-[min(90vw,42rem)] grid-cols-2 gap-x-4 overflow-y-auto" : "min-w-55"}`}
                  >
                    {item.children.map((child) => (
                      <li className="nav-dropdown-item" key={child.url}>
                        <Link
                          href={child.url}
                          className={`nav-dropdown-link block ${isActive(child.url, pathname) ? "active" : ""}`}
                          aria-current={
                            isCurrent(child.url, pathname) ? "page" : undefined
                          }
                        >
                          {child.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>

        <div className="order-1 ml-auto flex items-center gap-3 lg:order-2 lg:ml-0">
          <button
            ref={searchButtonRef}
            className="theme-toggle"
            type="button"
            aria-label="Search articles"
            aria-haspopup="dialog"
            aria-expanded={isSearchOpen}
            aria-controls="header-search-dialog"
            title="Search articles"
            onClick={() => setIsSearchOpen(true)}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <circle cx="10.8" cy="10.8" r="6.8" />
              <path d="m16 16 4 4" />
            </svg>
          </button>
          <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
          {config.navigation_button.enable && (
            <a
              className="btn btn-primary hidden px-5 py-2 text-sm !text-white sm:inline-block"
              href={phoneLink}
              aria-label={`Call ${config.params.footer_phone}`}
            >
              {config.navigation_button.label}
            </a>
          )}
        </div>

        <button
          ref={menuButtonRef}
          type="button"
          className="border-border bg-light/70 text-text-dark hover:border-primary hover:text-primary order-2 ml-2 grid size-11 place-items-center rounded-xl border transition-colors lg:hidden"
          aria-label="Open navigation menu"
          aria-controls="mobile-nav-drawer"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen(true)}
        >
          <svg
            className="size-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </nav>

      <dialog
        ref={searchDialogRef}
        id="header-search-dialog"
        className="header-search-dialog"
        aria-labelledby="header-search-title"
        onClose={() => setIsSearchOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setIsSearchOpen(false);
        }}
      >
        <form action="/blog" method="get" role="search" className="header-search-panel">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2
                id="header-search-title"
                className="text-text-dark text-xl font-bold"
              >
                Search articles
              </h2>
              <p className="text-text-light mt-1 text-sm">
                Search blog posts by title, topic, or keyword.
              </p>
            </div>
            <button
              className="header-search-close"
              type="button"
              aria-label="Close search"
              onClick={() => setIsSearchOpen(false)}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
          <label className="sr-only" htmlFor="header-search-input">
            Search articles
          </label>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <input
              ref={searchInputRef}
              id="header-search-input"
              className="text-text-dark placeholder:text-text-light min-h-12 min-w-0 flex-1 rounded-full border border-border bg-light px-5"
              type="search"
              name="search"
              placeholder="Search articles, topics, or keywords..."
              required
            />
            <button
              className="btn btn-primary min-h-12 justify-center px-6 !text-white"
              type="submit"
            >
              Search
            </button>
          </div>
        </form>
      </dialog>

      <button
        type="button"
        tabIndex={isMenuOpen ? 0 : -1}
        aria-label="Close navigation menu"
        className={`bg-dark/60 fixed inset-0 z-[60] backdrop-blur-sm transition-opacity duration-300 lg:hidden ${isMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setIsMenuOpen(false)}
      />
      <aside
        id="mobile-nav-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        aria-hidden={!isMenuOpen}
        inert={!isMenuOpen}
        className={`site-header-drawer fixed inset-y-0 right-0 z-[61] flex h-dvh w-[min(92vw,28rem)] flex-col border-l shadow-2xl transition-transform duration-300 lg:hidden ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="border-border flex items-center justify-between border-b px-4 py-4">
          <Link
            className="inline-flex rounded-md bg-white px-2 py-1"
            href="/"
            aria-label={config.site.logo_text}
          >
            <img
              src={config.site.logo}
              width={config.site.logo_width}
              height={config.site.logo_height}
              alt={config.site.logo_text}
              className="max-h-10 w-auto"
            />
          </Link>
          <div className="flex items-center gap-2">
            {config.navigation_button.enable && (
              <Link
                className="btn btn-primary px-4 py-2 text-xs !text-white"
                href={config.navigation_button.link}
              >
                {config.navigation_button.label}
              </Link>
            )}
            <button
              ref={closeButtonRef}
              type="button"
              className="border-border bg-primary/5 text-text-dark hover:border-primary hover:bg-primary hover:text-on-accent grid size-9 place-items-center rounded-full border transition-colors"
              aria-label="Close navigation menu"
              onClick={() => setIsMenuOpen(false)}
            >
              <svg
                className="size-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="m18 6-12 12M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto px-6 py-4" aria-label="Main">
          <ul className="space-y-1">
            {mainMenu.map((item) => (
              <li className="border-border/70 border-b py-2" key={item.name}>
                <Link
                  href={item.url}
                  className={`hover:text-primary block py-2 text-lg font-semibold transition-colors ${item.emphasis ? "mobile-nav-payment" : isActive(item.url, pathname) ? "text-primary" : "text-text-dark"}`}
                  aria-current={
                    isCurrent(item.url, pathname) ? "page" : undefined
                  }
                >
                  {item.name}
                </Link>
                {item.children?.length > 0 && (
                  <details
                    className="mobile-nav-submenu"
                    open={item.children.some((child) =>
                      isActive(child.url, pathname),
                    )}
                  >
                    <summary className="text-text-light hover:text-primary transition-colors">
                      Explore {item.name}
                    </summary>
                    <ul className="border-primary/20 space-y-1 border-l-2 py-1 pl-4">
                      {item.children.map((child) => (
                        <li key={child.url}>
                          <Link
                            href={child.url}
                            className={`hover:text-primary transition-colors ${isActive(child.url, pathname) ? "text-primary font-semibold" : "text-text-light"}`}
                            aria-current={
                              isCurrent(child.url, pathname)
                                ? "page"
                                : undefined
                            }
                          >
                            {child.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
              </li>
            ))}
          </ul>
          <a
            className="text-text-light mt-8 block text-center text-sm"
            href={`tel:${config.params.footer_phone}`}
          >
            Call us: {config.params.footer_phone}
          </a>
        </nav>
      </aside>
    </header>
  );
}
