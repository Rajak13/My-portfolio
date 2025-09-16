'use client';

import { useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function MarkdownEditor({ 
  value, 
  onChange, 
  placeholder = 'Write your post content in Markdown...', 
  className = '' 
}: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  const insertMarkdown = useCallback((before: string, after: string = '') => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newValue = 
      value.substring(0, start) + 
      before + 
      selectedText + 
      after + 
      value.substring(end);
    
    onChange(newValue);
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 0);
  }, [value, onChange]);

  const toolbarButtons = [
    {
      icon: 'B',
      title: 'Bold',
      action: () => insertMarkdown('**', '**'),
      className: 'font-bold'
    },
    {
      icon: 'I',
      title: 'Italic',
      action: () => insertMarkdown('*', '*'),
      className: 'italic'
    },
    {
      icon: 'H1',
      title: 'Heading 1',
      action: () => insertMarkdown('# '),
      className: 'text-sm'
    },
    {
      icon: 'H2',
      title: 'Heading 2',
      action: () => insertMarkdown('## '),
      className: 'text-sm'
    },
    {
      icon: '[]',
      title: 'Link',
      action: () => insertMarkdown('[', '](url)'),
      className: 'text-sm'
    },
    {
      icon: '![]',
      title: 'Image',
      action: () => insertMarkdown('![alt](', ')'),
      className: 'text-sm'
    },
    {
      icon: '```',
      title: 'Code Block',
      action: () => insertMarkdown('\n```\n', '\n```\n'),
      className: 'text-sm font-mono'
    },
    {
      icon: '•',
      title: 'Bullet List',
      action: () => insertMarkdown('- '),
      className: 'text-sm'
    },
    {
      icon: '1.',
      title: 'Numbered List',
      action: () => insertMarkdown('1. '),
      className: 'text-sm'
    },
    {
      icon: '""',
      title: 'Quote',
      action: () => insertMarkdown('> '),
      className: 'text-sm'
    },
  ];

  const containerClasses = `
    ${className}
    ${isFullscreen ? 'fixed inset-0 z-50 bg-white dark:bg-gray-900' : 'relative'}
    border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden
  `;

  return (
    <div className={containerClasses}>
      {/* Toolbar */}
      <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600 px-4 py-2">
        {/* Tabs */}
        <div className="flex">
          <button
            type="button"
            onClick={() => setActiveTab('write')}
            className={`px-3 py-1 text-sm font-medium rounded-l-md border ${
              activeTab === 'write'
                ? 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white'
                : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Write
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1 text-sm font-medium rounded-r-md border-t border-r border-b ${
              activeTab === 'preview'
                ? 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white'
                : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Preview
          </button>
        </div>

        {/* Toolbar Buttons */}
        {activeTab === 'write' && (
          <div className="flex items-center gap-1">
            {toolbarButtons.map((button, index) => (
              <button
                key={index}
                type="button"
                onClick={button.action}
                title={button.title}
                className={`px-2 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors ${button.className}`}
              >
                {button.icon}
              </button>
            ))}
            
            <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-2" />
            
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              className="px-2 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
            >
              {isFullscreen ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              )}
            </button>
          </div>
        )}

        {/* Preview Controls */}
        {activeTab === 'preview' && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {value.split(' ').length} words
            </span>
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              className="px-2 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
            >
              {isFullscreen ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className={`${isFullscreen ? 'h-[calc(100vh-60px)]' : 'h-96'} flex`}>
        {activeTab === 'write' ? (
          <textarea
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            className="w-full h-full p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border-none outline-none resize-none font-mono text-sm leading-relaxed"
            spellCheck="false"
          />
        ) : (
          <div className="w-full h-full overflow-auto">
            {value.trim() ? (
              <div className="p-4 prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight, rehypeRaw]}
                  components={{
                    h1: ({ children, ...props }) => (
                      <h1 className="text-2xl font-bold mt-6 mb-4 text-gray-900 dark:text-white" {...props}>
                        {children}
                      </h1>
                    ),
                    h2: ({ children, ...props }) => (
                      <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-900 dark:text-white" {...props}>
                        {children}
                      </h2>
                    ),
                    h3: ({ children, ...props }) => (
                      <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-900 dark:text-white" {...props}>
                        {children}
                      </h3>
                    ),
                    p: ({ children, ...props }) => (
                      <p className="mb-3 leading-relaxed text-gray-700 dark:text-gray-300" {...props}>
                        {children}
                      </p>
                    ),
                    a: ({ children, href, ...props }) => (
                      <a
                        href={href}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                        target={href?.startsWith('http') ? '_blank' : undefined}
                        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                        {...props}
                      >
                        {children}
                      </a>
                    ),
                    blockquote: ({ children, ...props }) => (
                      <blockquote
                        className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 dark:bg-blue-900/20 rounded-r"
                        {...props}
                      >
                        <div className="text-gray-700 dark:text-gray-300 italic">
                          {children}
                        </div>
                      </blockquote>
                    ),
                    pre: ({ children, ...props }) => (
                      <pre
                        className="bg-gray-900 dark:bg-gray-800 text-gray-100 p-3 rounded overflow-x-auto my-4 text-sm"
                        {...props}
                      >
                        {children}
                      </pre>
                    ),
                    code: ({ children, className, ...props }) => {
                      const isCodeBlock = className?.includes('language-');
                      
                      if (isCodeBlock) {
                        return <code className={className} {...props}>{children}</code>;
                      }
                      
                      return (
                        <code
                          className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-1 py-0.5 rounded text-sm font-mono"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                    ul: ({ children, ...props }) => (
                      <ul className="list-disc list-inside mb-3 space-y-1 text-gray-700 dark:text-gray-300" {...props}>
                        {children}
                      </ul>
                    ),
                    ol: ({ children, ...props }) => (
                      <ol className="list-decimal list-inside mb-3 space-y-1 text-gray-700 dark:text-gray-300" {...props}>
                        {children}
                      </ol>
                    ),
                  }}
                >
                  {value}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  <p>Nothing to preview yet</p>
                  <p className="text-sm">Start writing to see a preview</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="bg-gray-50 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-600 px-4 py-2 text-xs text-gray-500 dark:text-gray-400 flex justify-between">
        <div>
          {value.length} characters, {value.split(' ').filter(word => word.length > 0).length} words
        </div>
        <div>
          Markdown supported
        </div>
      </div>
    </div>
  );
}