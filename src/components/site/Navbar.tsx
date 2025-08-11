import { Link, NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";

const navItems = [
  { href: "#about", label: "О проекте" },
  { href: "#stats", label: "Функции" },
  { href: "#screens", label: "Скриншоты" },
  { href: "#contact", label: "Контакты" },
];

const Navbar = ({ showFullNav = true }: { showFullNav?: boolean }) => {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const sectionIds = useMemo(() => navItems.map(n => n.href.replace('#', '')).filter(Boolean), []);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Smooth scroll handler for in-page anchors
  useEffect(() => {
    const handleClick = (e: Event) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;
      const id = anchor.getAttribute('href')?.slice(1);
      const el = id ? document.getElementById(id) : null;
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setMobileOpen(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [pathname]);

  // Scrollspy: highlight current section
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const observers: IntersectionObserver[] = [];
    const onIntersect: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };
    const opts: IntersectionObserverInit = { rootMargin: '-40% 0px -50% 0px', threshold: [0, 1] };
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(onIntersect, opts);
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [sectionIds]);

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
      <div className="container flex h-16 items-center justify-between">
        <Link
          to="/"
          onClick={(e) => {
            if (pathname === '/') {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setMobileOpen(false);
            }
          }}
          className="font-display text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:opacity-90 transition-opacity"
        >
          Ability School
        </Link>
        {showFullNav && (
          <>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`transition-colors ${activeId === item.href.replace('#', '') ? 'text-gray-900 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="hidden md:flex items-center gap-2">
              <NavLink to="/login">
                <Button variant="outline" className="text-gray-800 hover:text-gray-900">Войти</Button>
              </NavLink>
              <NavLink to="/register">
                <Button variant="hero">Зарегистрироваться</Button>
              </NavLink>
            </div>
            {/* Mobile burger */}
            <button
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border bg-white/70"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Меню"
            >
              <span className="block w-5 h-0.5 bg-gray-800" />
              <span className="block w-5 h-0.5 bg-gray-800 mt-1" />
              <span className="block w-5 h-0.5 bg-gray-800 mt-1" />
            </button>
            {mobileOpen && (
              <div className="absolute left-0 right-0 top-16 bg-white/90 backdrop-blur border-b md:hidden">
                <div className="container py-3">
                  <nav className="flex flex-col gap-2">
                    {navItems.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        className={`px-2 py-2 rounded-lg transition-colors ${activeId === item.href.replace('#', '') ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'}`}
                      >
                        {item.label}
                      </a>
                    ))}
                  </nav>
                  <div className="mt-2 flex gap-2">
                    <NavLink to="/login" onClick={() => setMobileOpen(false)} className="flex-1">
                      <Button variant="outline" className="w-full text-gray-800 hover:text-gray-900">Войти</Button>
                    </NavLink>
                    <NavLink to="/register" onClick={() => setMobileOpen(false)} className="flex-1">
                      <Button variant="hero" className="w-full">Зарегистрироваться</Button>
                    </NavLink>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
