
import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { cn } from '@/lib/utils';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);
  const isHome = location.pathname === '/';

  // Handle page transitions
  useEffect(() => {
    setIsPageTransitioning(true);
    const timer = setTimeout(() => {
      setIsPageTransitioning(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [location.pathname]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main 
        className={cn(
          "flex-1 transition-opacity duration-300 ease-in-out",
          isPageTransitioning ? "opacity-0" : "opacity-100",
          isHome ? "pt-0" : "pt-20 px-6 md:px-10"
        )}
      >
        <div 
          className={cn(
            "w-full mx-auto",
            isHome ? "max-w-full" : "max-w-7xl"
          )}
        >
          {children}
        </div>
      </main>
      
      {!isHome && (
        <footer className="py-6 px-6 md:px-10 border-t border-gray-100">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Payman Vision. All rights reserved.
            </p>
            <div className="flex items-center mt-4 md:mt-0 space-x-6">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Privacy</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Terms</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Support</a>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;
