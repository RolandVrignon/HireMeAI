"use client";

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from 'next-themes';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import remarkGfm from 'remark-gfm';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { LinkPreview } from '@/components/ui/link-preview';

const CustomCode = ({ node, inline, className, children, ...props }: any) => {
    const { theme } = useTheme();

    const handleCopy = (code: string) => {
        navigator.clipboard.writeText(code).then(() => {
            alert('Code copied to clipboard!');
        });
    };

    const language = className?.replace('language-', '') || 'plaintext';
    const codeContent = String(children).replace(/\n$/, '');

    if (language === 'plaintext') {
        return <span className="font-bold">{codeContent}</span>;
    }

    const syntaxStyle = theme === 'dark' ? oneDark : oneLight;

    return (
        <div>
            <div className="font-doto font-bold bg-zinc-400/20 p-1 flex justify-between items-center rounded-t-sm mt-2 border-b-1 border-blue-600">
                <span className="text-xs">{language}</span>
                <button
                    onClick={() => handleCopy(codeContent)}
                    className="p-1 bg-white hover:bg-blue-600 hover:text-white dark:bg-zinc-800 dark:hover:bg-zinc-900 rounded-sm font-doto font-bold text-xs"
                >
                    Copy
                </button>
            </div>
            <SyntaxHighlighter language={language} style={syntaxStyle} {...props}>
                {codeContent}
            </SyntaxHighlighter>
        </div>
    );
};

const CustomTable = ({ children, ...props }: any) => {
    const extractText = (element: any): any => {
        if (typeof element === 'string') {
          return element;
        } else if (React.isValidElement<{ children?: any }>(element)) {
          return extractText(element.props.children);
        } else if (Array.isArray(element)) {
          return element.map(extractText).join('');
        } else {
          return '';
        }
      };
      
    const tableChildren = Array.isArray(children) ? children : [children];

    let headers: string[] = [];
    let rows: string[][] = [];

    // Extract headers
    const thead = tableChildren.find((child: any) => child.type === 'thead');
    if (thead && thead.props && thead.props.children) {
        const theadRow = thead.props.children;
        const theadCells = Array.isArray(theadRow.props.children)
            ? theadRow.props.children
            : [theadRow.props.children];

        headers = theadCells.map((cell: any) => extractText(cell));
    }

    // Extract rows
    const tbody = tableChildren.find((child: any) => child.type === 'tbody');
    if (tbody && tbody.props && tbody.props.children) {
        const tbodyRows = Array.isArray(tbody.props.children)
            ? tbody.props.children
            : [tbody.props.children];

        rows = tbodyRows.map((row: any) => {
            const rowCells = Array.isArray(row.props.children)
                ? row.props.children
                : [row.props.children];

            return rowCells.map((cell: any) => extractText(cell));
        });
    }

    return (
        <ScrollArea className="font-xs my-2 rounded-lg overflow-auto bg-slate-50/90 dark:bg-white/5">
            <Table {...props}>
                <TableHeader>
                    <TableRow>
                        {headers.map((headerCell: any, index: number) => (
                            <TableHead className="font-doto font-bold" key={index}>{headerCell}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((row: any, rowIndex: number) => (
                        <TableRow key={rowIndex}>
                            {row.map((cell: any, cellIndex: number) => (
                                <TableCell key={cellIndex}>{cell}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    );
};

const CustomLink = ({
    href,
    title,
    children,
  }: {
    href?: string;
    title?: string;
    children?: React.ReactNode;
  }) => {
    return (
      <LinkPreview url={href || ''} className='hello'>
        {children}
      </LinkPreview>
    );
}
export const MarkdownInterpretor = ({ content }: { content: string }) => {
    const components = {
        code: CustomCode,
        table: CustomTable,
        a: CustomLink,
    };

    return (
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
            {content}
        </ReactMarkdown>
    );
};
