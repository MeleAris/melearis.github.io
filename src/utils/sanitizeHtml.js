import DOMPurify from 'dompurify';

const ALLOWED_TAGS = [
  'p',
  'br',
  'strong',
  'b',
  'em',
  'i',
  'u',
  's',
  'ul',
  'ol',
  'li',
  'a',
  'h2',
  'h3',
  'blockquote',
];

const ALLOWED_ATTR = ['href', 'target', 'rel', 'class'];

export function sanitizeHtml(html) {
  if (typeof html !== 'string' || !html.trim()) return '';

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
  });
}

/** Plain text or legacy content → safe HTML paragraph(s) for display */
export function toDisplayHtml(value) {
  if (typeof value !== 'string' || !value.trim()) return '';

  const trimmed = value.trim();
  if (trimmed.startsWith('<')) {
    return sanitizeHtml(trimmed);
  }

  return sanitizeHtml(
    trimmed
      .split(/\n{2,}/)
      .map((block) => `<p>${block.replace(/\n/g, '<br>')}</p>`)
      .join(''),
  );
}
