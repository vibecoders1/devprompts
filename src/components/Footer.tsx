
import React from 'react';
import { Link } from 'react-router-dom';
import { Code, Github, Twitter, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900/80 border-t border-slate-700/50 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 text-white mb-4">
              <Code className="h-8 w-8" />
              <span className="text-xl font-bold">DevPrompts</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              Curated AI prompts, Cursor rules, and multi-context prompts for modern software development. 
              Enhance your coding workflow with powerful AI tools and resources.
            </p>
            <div className="flex items-center space-x-4 mt-6">
              <a 
                href="#" 
                className="text-slate-400 hover:text-white transition-colors"
                title="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-slate-400 hover:text-white transition-colors"
                title="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <div className="space-y-3">
              <Link to="/prompts" className="block text-slate-400 hover:text-white transition-colors text-sm">
                AI Prompts
              </Link>
              <Link to="/rules" className="block text-slate-400 hover:text-white transition-colors text-sm">
                Cursor Rules
              </Link>
              <Link to="/tools" className="block text-slate-400 hover:text-white transition-colors text-sm">
                AI Tools
              </Link>
              <a href="#" className="flex items-center space-x-1 text-slate-400 hover:text-white transition-colors text-sm">
                <span>MCPs</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
          
          {/* Community */}
          <div>
            <h3 className="text-white font-semibold mb-4">Community</h3>
            <div className="space-y-3">
              <a href="#" className="block text-slate-400 hover:text-white transition-colors text-sm">
                Discord
              </a>
              <a href="#" className="block text-slate-400 hover:text-white transition-colors text-sm">
                Contribute
              </a>
              <a href="#" className="block text-slate-400 hover:text-white transition-colors text-sm">
                Documentation
              </a>
              <a href="#" className="block text-slate-400 hover:text-white transition-colors text-sm">
                Support
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-700/50 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">
              © 2024 DevPrompts. Built with ❤️ for developers.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
