import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

interface MarkdownRendererProps {
  content: string;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 rounded bg-black/50 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/70"
    >
      {copied ? "已复制" : "复制"}
    </button>
  );
}

function CodeBlock({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const language = /language-(\w+)/.exec(className || "")?.[1];
  const rawText = String(children).replace(/\n$/, "");

  return (
    <div className="group relative my-4 overflow-hidden rounded-lg bg-[#0d1117]">
      {language ? (
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 text-xs text-gray-400">
          <span>{language}</span>
          <CopyButton text={rawText} />
        </div>
      ) : (
        <CopyButton text={rawText} />
      )}
      <pre className="!m-0 overflow-x-auto p-4">
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
}

function MermaidBlock({ content }: { content: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const render = async () => {
      try {
        const mermaid = await import("mermaid");
        if (cancelled) return;

        mermaid.default.initialize({
          startOnLoad: false,
          theme: window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "default",
        });

        if (containerRef.current) {
          const id = `mermaid-${Math.random().toString(36).slice(2)}`;
          const { svg } = await mermaid.default.render(id, content);
          if (!cancelled && containerRef.current) {
            containerRef.current.innerHTML = svg;
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "图表渲染失败");
        }
      }
    };

    render();
    return () => {
      cancelled = true;
    };
  }, [content]);

  if (error) {
    return (
      <pre className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-700 dark:border-red-700 dark:bg-red-950 dark:text-red-300">
        {error}
      </pre>
    );
  }

  return <div ref={containerRef} className="my-4 flex justify-center" />;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose-mdview">
      <Markdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeHighlight, rehypeSanitize]}
        components={{
          pre({ children }) {
            return <>{children}</>;
          },
          code({ className, children }) {
            const isMermaid = /language-mermaid/.test(className || "");
            const text = String(children).replace(/\n$/, "");

            if (isMermaid) {
              return <MermaidBlock content={text} />;
            }

            return (
              <CodeBlock className={className}>{children}</CodeBlock>
            );
          },
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}
