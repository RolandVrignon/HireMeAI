"use client";

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from 'next-themes'; // Si vous utilisez Next.js et le package next-themes

export const MarkdownInterpretor = ({ content }: { content: string }) => {
  const { theme } = useTheme(); // Obtenez le thème actuel (light ou dark)

  // Fonction de copie dans le presse-papiers
  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      alert('Code copié dans le presse-papiers!');
    });
  };

  return (
    <ReactMarkdown
      children={content}
      components={{
        code({ node, inline, className, children, ...props }: { node: any, inline: boolean, className: string, children: React.ReactNode }) {
          if (inline) {
            return <code className={className} {...props}>{children}</code>;
          }

          // Récupérer le nom du langage
          const language = className?.replace('language-', '') || 'plaintext';
          const codeContent = String(children).replace(/\n$/, '');

          // Choisir le style en fonction du thème
          const syntaxStyle = theme === 'dark' ? oneDark : oneLight;

          return (
            <div>
              <div className="font-doto font-bold bg-zinc-400/20 p-1 flex justify-between items-center rounded-t-sm mt-2 border-b-1 border-blue-600">
                <span className='text-xs'>{language}</span>
                <button
                  onClick={() => handleCopy(codeContent)}
                  className='p-1 bg-white hover:bg-blue-600 hover:text-white dark:bg-zinc-800 dark:hover:bg-zinc-900 rounded-sm font-doto font-bold text-xs'
                >
                  Copier
                </button>
              </div>
              <SyntaxHighlighter language={language} style={syntaxStyle} {...props}>
                {codeContent}
              </SyntaxHighlighter>
            </div>
          );
        },
      }}
    />
  );
};
