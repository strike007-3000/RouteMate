import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

interface PolicyLayoutProps {
  title: string;
  markdownContent: string;
}

export function PolicyLayout({ title, markdownContent }: PolicyLayoutProps) {
  // Simple markdown-to-React parser to keep pages perfectly synced with .md files
  const parseMarkdown = (md: string) => {
    const lines = md.split('\n');
    const elements: React.ReactNode[] = [];
    let listItems: React.ReactNode[] = [];
    let insideList = false;

    const flushList = (key: string | number) => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`ul-${key}`} className="list-disc pl-5 mb-6 space-y-2 text-zinc-400">
            {listItems}
          </ul>
        );
        listItems = [];
        insideList = false;
      }
    };

    const parseInline = (text: string): React.ReactNode[] => {
      let currentText = text;
      // Split by bold (**text**)
      const boldParts = currentText.split(/\*\*([^*]+)\*\*/g);
      const elements: React.ReactNode[] = [];

      boldParts.forEach((part, index) => {
        if (index % 2 === 1) {
          elements.push(<strong key={`bold-${index}`} className="text-zinc-100 font-semibold">{part}</strong>);
        } else {
          // Split by links ([label](url))
          const linkParts = part.split(/\[([^\]]+)\]\(([^)]+)\)/g);
          for (let i = 0; i < linkParts.length; i++) {
            if (i % 3 === 0) {
              if (linkParts[i]) {
                elements.push(linkParts[i]);
              }
            } else if (i % 3 === 1) {
              const label = linkParts[i];
              const url = linkParts[i + 1];
              elements.push(
                <a
                  key={`link-${index}-${i}`}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 underline underline-offset-4 transition-colors font-medium"
                >
                  {label}
                </a>
              );
            }
          }
        }
      });
      return elements;
    };

    lines.forEach((line, idx) => {
      const trimmed = line.trim();

      if (trimmed.startsWith('*')) {
        insideList = true;
        const content = trimmed.replace(/^\*\s*/, '');
        listItems.push(
          <li key={`li-${idx}`} className="text-sm leading-relaxed text-zinc-400 pl-1">
            {parseInline(content)}
          </li>
        );
      } else {
        flushList(idx);

        if (trimmed.startsWith('# ')) {
          elements.push(
            <h1 key={idx} className="text-2xl font-black text-white tracking-tighter mt-4 mb-6 flex items-center gap-3">
              <Shield className="w-6 h-6 text-primary shrink-0" />
              {parseInline(trimmed.substring(2))}
            </h1>
          );
        } else if (trimmed.startsWith('## ')) {
          elements.push(
            <h2 key={idx} className="text-lg font-bold text-white tracking-tight mt-8 mb-4 border-b border-white/5 pb-2">
              {parseInline(trimmed.substring(3))}
            </h2>
          );
        } else if (trimmed.startsWith('### ')) {
          elements.push(
            <h3 key={idx} className="text-sm font-semibold text-zinc-200 tracking-tight mt-5 mb-2">
              {parseInline(trimmed.substring(4))}
            </h3>
          );
        } else if (trimmed === '---') {
          elements.push(
            <hr key={idx} className="my-8 border-white/5" />
          );
        } else if (trimmed.length > 0) {
          elements.push(
            <p key={idx} className="text-sm text-zinc-400 leading-relaxed mb-4">
              {parseInline(trimmed)}
            </p>
          );
        }
      }
    });

    flushList('final');
    return elements;
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col font-sans p-6 relative overflow-x-hidden">
      {/* Ambient backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Header Navigation */}
      <div className="w-full z-10 mb-8">
        <Link 
          href="/login"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>
      </div>

      {/* Document Card */}
      <div className="w-full z-10 bg-zinc-950/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 sm:p-8 flex-1">
        {parseMarkdown(markdownContent)}
      </div>

      {/* Footer */}
      <footer className="w-full z-10 text-center py-8 text-[10px] font-black text-zinc-600 uppercase tracking-widest">
        RouteMate &copy; {new Date().getFullYear()} &bull; All Rights Reserved
      </footer>
    </main>
  );
}
