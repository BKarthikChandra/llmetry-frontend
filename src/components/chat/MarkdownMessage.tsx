import { useState, type ImgHTMLAttributes } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Register only the languages likely to appear in AI chat responses
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql';
import yaml from 'react-syntax-highlighter/dist/esm/languages/prism/yaml';
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css';
import markdown from 'react-syntax-highlighter/dist/esm/languages/prism/markdown';
import rust from 'react-syntax-highlighter/dist/esm/languages/prism/rust';
import go from 'react-syntax-highlighter/dist/esm/languages/prism/go';
import java from 'react-syntax-highlighter/dist/esm/languages/prism/java';

SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('js', javascript);
SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('ts', typescript);
SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('py', python);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('sh', bash);
SyntaxHighlighter.registerLanguage('shell', bash);
SyntaxHighlighter.registerLanguage('sql', sql);
SyntaxHighlighter.registerLanguage('yaml', yaml);
SyntaxHighlighter.registerLanguage('yml', yaml);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('markdown', markdown);
SyntaxHighlighter.registerLanguage('md', markdown);
SyntaxHighlighter.registerLanguage('rust', rust);
SyntaxHighlighter.registerLanguage('go', go);
SyntaxHighlighter.registerLanguage('java', java);

import { useTheme } from '../../hooks/useTheme';
import './MarkdownMessage.css';

interface Props {
  content: string;
}

function MarkdownImage({ src, alt, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  return (
    <span className={`md-image-frame ${status === 'loaded' ? 'loaded' : ''}`}>
      {status === 'loading' && (
        <span className="md-image-loading" aria-label="Loading image">
          <span className="md-image-spinner" aria-hidden="true" />
        </span>
      )}
      {status === 'error' && <span className="md-image-error">Image failed to load</span>}
      {src && (
        <img
          {...props}
          src={src}
          alt={alt ?? ''}
          loading="lazy"
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
        />
      )}
    </span>
  );
}

export function MarkdownMessage({ content }: Props) {
  const { theme } = useTheme();
  const codeStyle = theme === 'dark' ? vscDarkPlus : vs;

  return (
    <div className="md-content">
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children }) {
            const match = /language-(\w+)/.exec(className || '');
            if (match) {
              return (
                <SyntaxHighlighter
                  style={codeStyle}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{
                    margin: 0,
                    borderRadius: '6px',
                    fontSize: '13px',
                    lineHeight: '1.55',
                    fontFamily: 'ui-monospace, "Cascadia Code", Consolas, monospace',
                  }}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              );
            }
            return <code className="md-code">{children}</code>;
          },
          pre({ children }) {
            return <div className="md-pre">{children}</div>;
          },
          table({ children }) {
            return (
              <div className="md-table-wrap">
                <table>{children}</table>
              </div>
            );
          },
          a({ href, children }) {
            return (
              <a href={href ?? '#'} target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            );
          },
          img({ src, alt, ...props }) {
            return <MarkdownImage {...props} src={src} alt={alt} />;
          },
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}
