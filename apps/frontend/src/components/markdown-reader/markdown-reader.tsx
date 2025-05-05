import React from 'react';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  markdownContent: string;
}

export const MarkdownReader = ({ markdownContent }: MarkdownRendererProps) => (
  <div
    style={{
      fontSize: '14px',
      maxWidth: '1000px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif',
      lineHeight: '1.6',
      padding: '40px',
    }}
  >
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        h1: ({ children }) => (
          <h1 style={{ color: '#007bff', borderBottom: '2px solid #007bff', paddingBottom: '5px' }}>
            {children}
          </h1>
        ),
        h2: ({ children }) => <h2 style={{ color: '#6c757d' }}>{children}</h2>,
        h3: ({ children }) => <h3 style={{ color: '#17a2b8' }}>{children}</h3>,
        blockquote: ({ children }) => (
          <blockquote style={{ borderLeft: '4px solid #ccc', paddingLeft: '10px', color: '#555' }}>
            {children}
          </blockquote>
        ),
        table: ({ children }) => (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            {children}
          </table>
        ),
        th: ({ children }) => (
          <th
            style={{
              border: '1px solid #ddd',
              padding: '8px',
              backgroundColor: '#007bff',
              color: 'white',
            }}
          >
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td style={{ border: '1px solid #ddd', padding: '8px' }}>{children}</td>
        ),
        img: ({ src, alt }) => (
          <img
            src={src}
            alt={alt}
            style={{ maxWidth: '100%', borderRadius: '5px', marginTop: '10px' }}
          />
        ),
        pre: ({ children }) => (
          <pre
            style={{
              wordWrap: 'break-word',
              overflowWrap: 'break-word', // modern, safer
              whiteSpace: 'pre-wrap',
            }}
          >
            {children}
          </pre>
        ),
      }}
    >
      {markdownContent}
    </ReactMarkdown>
  </div>
);
