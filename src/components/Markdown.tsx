/* Minimal, dependency-free markdown renderer tuned to this app's
   Inter / parchment design. Supports: ## and ### headings, paragraphs,
   - bullet lists, > callouts, and **bold** / *italic* inline spans.
   Deliberately small — the briefing content is authored in-house so we
   only need the handful of constructs we actually use. */

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  // Split on **bold** and *italic* while keeping the delimiters.
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);
  parts.forEach((part, i) => {
    if (/^\*\*[^*]+\*\*$/.test(part)) {
      nodes.push(
        <strong key={`${keyPrefix}-b-${i}`} className="font-semibold text-primary">
          {part.slice(2, -2)}
        </strong>
      );
    } else if (/^\*[^*]+\*$/.test(part)) {
      nodes.push(
        <em key={`${keyPrefix}-i-${i}`} className="italic">
          {part.slice(1, -1)}
        </em>
      );
    } else {
      nodes.push(<span key={`${keyPrefix}-t-${i}`}>{part}</span>);
    }
  });
  return nodes;
}

export default function Markdown({ content }: { content: string }) {
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  const blocks: React.ReactNode[] = [];
  let list: string[] = [];
  let para: string[] = [];
  let key = 0;

  const flushList = () => {
    if (list.length) {
      const items = [...list];
      blocks.push(
        <ul key={`ul-${key++}`} className="flex flex-col gap-2 my-3 pl-1">
          {items.map((item, i) => (
            <li key={i} className="flex gap-2.5 font-body-md text-[16px] leading-relaxed text-on-surface">
              <span className="w-1.5 h-1.5 rounded-full bg-cobalt-accent mt-2.5 shrink-0" />
              <span>{renderInline(item, `li-${key}-${i}`)}</span>
            </li>
          ))}
        </ul>
      );
      list = [];
    }
  };

  const flushPara = () => {
    if (para.length) {
      const text = para.join(' ');
      blocks.push(
        <p key={`p-${key++}`} className="font-body-md text-[16px] leading-[28px] text-on-surface mb-4">
          {renderInline(text, `p-${key}`)}
        </p>
      );
      para = [];
    }
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushPara();
      flushList();
      continue;
    }
    if (line.startsWith('### ')) {
      flushPara();
      flushList();
      blocks.push(
        <h4 key={`h4-${key++}`} className="font-ui-label-bold text-[15px] uppercase tracking-widest text-secondary mt-6 mb-2">
          {line.slice(4)}
        </h4>
      );
    } else if (line.startsWith('## ')) {
      flushPara();
      flushList();
      blocks.push(
        <h3 key={`h3-${key++}`} className="font-headline-sm text-[22px] font-semibold text-primary mt-8 mb-3 flex items-center gap-2 border-b border-subtle pb-2">
          {line.slice(3)}
        </h3>
      );
    } else if (line.startsWith('> ')) {
      flushPara();
      flushList();
      blocks.push(
        <div key={`q-${key++}`} className="border-l-4 border-gold-accent bg-gold-accent/[0.06] pl-4 py-3 my-4 rounded-r-lg">
          <p className="font-body-md text-[16px] leading-relaxed text-on-surface italic">
            {renderInline(line.slice(2), `q-${key}`)}
          </p>
        </div>
      );
    } else if (line.startsWith('- ')) {
      flushPara();
      list.push(line.slice(2));
    } else {
      para.push(line);
    }
  }
  flushPara();
  flushList();

  return <div>{blocks}</div>;
}
