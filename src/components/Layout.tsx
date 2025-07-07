
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Code, Book, Settings, Home, Wrench, LogIn, LogOut, User, Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
  };

  const getBreadcrumbs = () => {
    const path = location.pathname;
    const segments = path.split('/').filter(Boolean);
    
    const breadcrumbs = [
      { label: 'Home', href: '/' }
    ];

    if (segments.length > 0) {
      if (segments[0] === 'prompts') {
        breadcrumbs.push({ label: 'Prompts', href: '/prompts' });
        if (segments[1]) {
          breadcrumbs.push({ label: 'Details', href: path });
        }
      } else if (segments[0] === 'rules') {
        breadcrumbs.push({ label: 'Rules', href: '/rules' });
        if (segments[1]) {
          breadcrumbs.push({ label: 'Details', href: path });
        }
      } else if (segments[0] === 'tools') {
        breadcrumbs.push({ label: 'Tools', href: '/tools' });
      } else if (segments[0] === 'my-prompts') {
        breadcrumbs.push({ label: 'My Prompts', href: '/my-prompts' });
      } else if (segments[0] === 'my-rules') {
        breadcrumbs.push({ label: 'My Rules', href: '/my-rules' });
      }
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-700/50 backdrop-blur-sm bg-slate-900/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 text-white hover:text-blue-400 transition-colors">
              <Code className="h-8 w-8" />
              <span className="text-xl font-bold">DevPrompts</span>
            </Link>
            
            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                to="/" 
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive('/') 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              
              <Link 
                to="/prompts" 
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive('/prompts') 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Book className="h-4 w-4" />
                <span>Prompts</span>
              </Link>
              
              <Link 
                to="/rules" 
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive('/rules') 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Settings className="h-4 w-4" />
                <span>Rules</span>
              </Link>
              
              <Link 
                to="/tools" 
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive('/tools') 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Wrench className="h-4 w-4" />
                <span>Tools</span>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-slate-300 hover:text-white"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
            
            {/* Search and Auth - Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search prompts, rules..."
                  className="bg-slate-700/50 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-slate-300 hover:text-white">
                      <User className="h-4 w-4 mr-2" />
                      {user.email}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                    <DropdownMenuItem asChild>
                      <Link 
                        to="/my-rules"
                        className="text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer"
                      >
                        My Rules
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link 
                        to="/my-prompts"
                        className="text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer"
                      >
                        My Prompts
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={handleSignOut}
                      className="text-slate-300 hover:text-white hover:bg-slate-700"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/auth">
                  <Button variant="ghost" className="text-slate-300 hover:text-white">
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign in
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-slate-700 py-4">
              <div className="flex flex-col space-y-2">
                <Link 
                  to="/" 
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive('/') 
                      ? 'bg-blue-600 text-white' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Link>
                
                <Link 
                  to="/prompts" 
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive('/prompts') 
                      ? 'bg-blue-600 text-white' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Book className="h-4 w-4" />
                  <span>Prompts</span>
                </Link>
                
                <Link 
                  to="/rules" 
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive('/rules') 
                      ? 'bg-blue-600 text-white' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Settings className="h-4 w-4" />
                  <span>Rules</span>
                </Link>
                
                <Link 
                  to="/tools" 
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive('/tools') 
                      ? 'bg-blue-600 text-white' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Wrench className="h-4 w-4" />
                  <span>Tools</span>
                </Link>

                {/* Mobile Search */}
                <div className="relative px-3 py-2">
                  <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Mobile Auth */}
                {user ? (
                  <>
                    <Link 
                      to="/my-rules"
                      className="text-slate-300 hover:text-white hover:bg-slate-700/50 px-3 py-2 rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      My Rules
                    </Link>
                    <Link 
                      to="/my-prompts"
                      className="text-slate-300 hover:text-white hover:bg-slate-700/50 px-3 py-2 rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      My Prompts
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 text-slate-300 hover:text-white hover:bg-slate-700/50 px-3 py-2 rounded-lg text-left w-full"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign out</span>
                    </button>
                  </>
                ) : (
                  <Link 
                    to="/auth"
                    className="flex items-center space-x-2 text-slate-300 hover:text-white hover:bg-slate-700/50 px-3 py-2 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Sign in</span>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Breadcrumbs */}
      {breadcrumbs.length > 1 && (
        <div className="border-b border-slate-700/30 bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={crumb.href}>
                    <BreadcrumbItem>
                      {index === breadcrumbs.length - 1 ? (
                        <BreadcrumbPage className="text-slate-300">
                          {crumb.label}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link to={crumb.href} className="text-slate-400 hover:text-white">
                            {crumb.label}
                          </Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
