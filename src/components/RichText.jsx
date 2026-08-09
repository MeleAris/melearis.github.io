import { toDisplayHtml } from '../utils/sanitizeHtml';

export default function RichText({ html, className = '', style }) {
  const clean = toDisplayHtml(html);

  if (!clean) return null;

  return (
    <div
      className={`rich-text ${className}`.trim()}
      style={style}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
