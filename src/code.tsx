// Syntax-highlighted code and markdown. highlight.js core + a fixed language
// set keeps the bundle small; because this package is a federation singleton
// the highlighter loads once for the host and every deck.
//
// Colours come from the --syntax-* tokens in styles.css, so each scheme and
// each deck can recolour code without touching highlight.js themes.
import { useMemo } from 'react';
import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import cpp from 'highlight.js/lib/languages/cpp';
import css from 'highlight.js/lib/languages/css';
import go from 'highlight.js/lib/languages/go';
import java from 'highlight.js/lib/languages/java';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import kotlin from 'highlight.js/lib/languages/kotlin';
import python from 'highlight.js/lib/languages/python';
import sql from 'highlight.js/lib/languages/sql';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import yaml from 'highlight.js/lib/languages/yaml';
import { Marked } from 'marked';

const languages = { bash, cpp, css, go, java, javascript, json, kotlin, python, sql, typescript, xml, yaml };
for (const [name, lang] of Object.entries(languages)) hljs.registerLanguage(name, lang);
hljs.registerAliases(['sh', 'shell', 'zsh'], { languageName: 'bash' });
hljs.registerAliases(['c', 'c++', 'h', 'hpp'], { languageName: 'cpp' });
hljs.registerAliases(['js', 'jsx', 'mjs'], { languageName: 'javascript' });
hljs.registerAliases(['ts', 'tsx'], { languageName: 'typescript' });
hljs.registerAliases(['kt', 'kts'], { languageName: 'kotlin' });
hljs.registerAliases(['py'], { languageName: 'python' });
hljs.registerAliases(['html', 'svg'], { languageName: 'xml' });
hljs.registerAliases(['yml'], { languageName: 'yaml' });

function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Highlighted HTML for `code`. Unknown or missing languages come back escaped, unhighlighted. */
export function highlight(code: string, lang?: string): string {
  if (lang && hljs.getLanguage(lang)) {
    return hljs.highlight(code, { language: lang, ignoreIllegals: true }).value;
  }
  return escapeHtml(code);
}

/** Languages CodeBlock/Markdown can highlight (aliases included). */
export function isHighlightable(lang: string) {
  return Boolean(hljs.getLanguage(lang));
}

export function CodeBlock({ code, lang, className }: { code: string; lang?: string; className?: string }) {
  const html = useMemo(() => highlight(code.replace(/\n$/, ''), lang), [code, lang]);
  return (
    <pre className={`coach-code${className ? ` ${className}` : ''}`} data-lang={lang || undefined}>
      <code className="hljs" dangerouslySetInnerHTML={{ __html: html }} />
    </pre>
  );
}

const md = new Marked({
  renderer: {
    code({ text, lang }) {
      const l = (lang ?? '').trim().split(/\s+/)[0];
      const attr = l ? ` data-lang="${escapeHtml(l)}"` : '';
      return `<pre class="coach-code"${attr}><code class="hljs">${highlight(text, l)}</code></pre>\n`;
    },
  },
});

/**
 * Markdown → HTML with fenced code highlighted. Like `marked` itself this does
 * NOT sanitise: only feed it content from our own backends / the claude CLI,
 * never third-party HTML.
 */
export function renderMarkdown(source: string): string {
  return md.parse(source, { async: false }) as string;
}

/** Rendered markdown inside a `.coach-prose` container (base heading/list/code styles). */
export function Markdown({ source, className }: { source: string; className?: string }) {
  const html = useMemo(() => renderMarkdown(source), [source]);
  return (
    <div className={`coach-prose${className ? ` ${className}` : ''}`} dangerouslySetInnerHTML={{ __html: html }} />
  );
}
