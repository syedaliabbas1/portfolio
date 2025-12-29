import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

interface MarkdownRendererProps {
  children: string;
  className?: string;
}

export function MarkdownRenderer({ children, className }: MarkdownRendererProps) {
  return (
    <div className={cn('prose prose-sm dark:prose-invert max-w-none', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ node, ...props }) => (
            <a {...props} className="text-primary underline" target="_blank" rel="noopener noreferrer" />
          ),
          p: ({ node, ...props }) => <p {...props} className="mb-2 last:mb-0" />,
          ul: ({ node, ...props }) => <ul {...props} className="list-disc pl-4 mb-2" />,
          ol: ({ node, ...props }) => <ol {...props} className="list-decimal pl-4 mb-2" />,
          li: ({ node, ...props }) => <li {...props} className="mb-1" />,
          code: ({ node, ...props }) => (
            <code {...props} className="bg-muted px-1 rounded text-primary" />
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
