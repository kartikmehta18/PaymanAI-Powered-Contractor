
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const isHome = location.pathname === '/';
  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-6 md:px-10 py-4",
        scrolled || !isHome
          ? "bg-white/80 backdrop-blur-lg border-b border-gray-100"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-semibold tracking-tight">
            Payman Vision
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-1">
          <NavLink to="/dashboard" active={isActive('/dashboard')}>
            Dashboard
          </NavLink>
          <NavLink to="/contractors" active={isActive('/contractors')}>
            Contractors
          </NavLink>
          <NavLink to="/payments" active={isActive('/payments')}>
            Payments
          </NavLink>
          <NavLink to="/settings" active={isActive('/settings')}>
            Settings
          </NavLink>
        </nav>

        {isHome ? (
          <div className="flex items-center space-x-4">
            <Button asChild variant="ghost" className="rounded-full px-4">
              <Link to="/dashboard">Log In</Link>
            </Button>
            <Button asChild className="rounded-full px-6 shadow-sm">
              <Link to="/dashboard">Get Started</Link>
            </Button>
          </div>
        ) : (
          <Button asChild variant="ghost" size="sm" className="rounded-full px-4">
            <Link to="/settings">
              <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                TL
              </span>
              <span>TechLaunch</span>
            </Link>
          </Button>
        )}
      </div>
    </header>
  );
};

interface NavLinkProps {
  to: string;
  active: boolean;
  children: React.ReactNode;
}

const NavLink = ({ to, active, children }: NavLinkProps) => {
  return (
    <Link
      to={to}
      className={cn(
        "px-4 py-2 rounded-full text-sm font-medium transition-colors duration-150 ease-in-out relative",
        active
          ? "text-blue-600"
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
      )}
    >
      {children}
      {active && (
        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full animate-pulse-soft" />
      )}
    </Link>
  );
};

export default Navbar;
