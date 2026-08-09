export function sanitizeSvg(input) {
  if (typeof input !== 'string') return '';

  const trimmed = input.trim();
  if (!/<svg[\s>]/i.test(trimmed)) return '';

  let svg = trimmed;
  svg = svg.replace(/<script[\s\S]*?<\/script>/gi, '');
  svg = svg.replace(/\s+on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '');
  svg = svg.replace(/javascript:/gi, '');

  return svg;
}
