
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Copy, Download, Heart } from 'lucide-react';

const PromptDetail = () => {
  const { id } = useParams();
  
  // Sample data - in a real app, this would be fetched based on the ID
  const prompt = {
    id: '1',
    title: 'Full-Stack Software Developer',
    description: 'Act as a full-stack software developer who can provide guidance on designing, developing, and deploying full-stack applications.',
    category: 'Fullstack',
    views: 4013,
    copies: 1552,
    likes: 87,
    tags: ['React', 'Node.js', 'Database', 'API Design'],
    content: `I want you to act as a full-stack software developer, who can provide guidance on designing, developing, and deploying full-stack applications. Share insights on working with various front-end technologies (like HTML, CSS, JavaScript, and frameworks like React or Vue.js), back-end technologies (like Node.js, Python, or Ruby), and databases (like SQL or MongoDB). Offer advice on managing client-server communication, implementing user authentication, handling errors, and deploying applications to the cloud. My first request is '{{request}}'`
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.content);
    console.log('Copied to clipboard');
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([prompt.content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${prompt.title.toLowerCase().replace(/\s+/g, '-')}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          to="/prompts"
          className="inline-flex items-center space-x-2 text-slate-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to prompts</span>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-sm font-medium text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full">
              {prompt.category}
            </span>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">{prompt.title}</h1>
          <p className="text-xl text-slate-300 leading-relaxed">{prompt.description}</p>
        </div>

        {/* Stats */}
        <div className="flex items-center space-x-6 mb-8 text-slate-400">
          <span>{prompt.views.toLocaleString()} views</span>
          <span>{prompt.copies.toLocaleString()} copies</span>
          <span className="flex items-center space-x-1">
            <Heart className="h-4 w-4" />
            <span>{prompt.likes}</span>
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {prompt.tags.map((tag, index) => (
            <span
              key={index}
              className="text-sm text-slate-300 bg-slate-700/50 px-3 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={handleCopy}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <Copy className="h-4 w-4" />
            <span>Copy Prompt</span>
          </button>
          
          <button
            onClick={handleDownload}
            className="flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </button>
        </div>

        {/* Prompt Content */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Prompt</h3>
          <div className="bg-slate-900/50 border border-slate-600 rounded-lg p-4">
            <pre className="text-slate-200 font-mono text-sm leading-relaxed whitespace-pre-wrap">
              {prompt.content}
            </pre>
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="mt-8 bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">How to Use</h3>
          <div className="text-slate-300 space-y-2">
            <p>1. Copy the prompt above</p>
            <p>2. Replace <code className="bg-slate-700 px-2 py-1 rounded text-sm">{'{{request}}'}</code> with your specific question or request</p>
            <p>3. Paste into your AI assistant for optimal results</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptDetail;
