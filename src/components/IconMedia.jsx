import { sanitizeSvg } from '../utils/sanitizeSvg';

export default function IconMedia({
  iconSvg,
  iconUrl,
  alt = '',
  className = '',
  size,
}) {
  const safeSvg = iconSvg ? sanitizeSvg(iconSvg) : '';
  const sizeStyle = size ? { width: size, height: size } : undefined;
  const classNames = className ? `icon-media ${className}` : 'icon-media';

  if (safeSvg) {
    return (
      <div
        className={classNames.trim()}
        style={sizeStyle}
        dangerouslySetInnerHTML={{ __html: safeSvg }}
        aria-hidden={alt ? undefined : true}
        role={alt ? 'img' : undefined}
        aria-label={alt || undefined}
      />
    );
  }

  const url = typeof iconUrl === 'string' ? iconUrl.trim() : '';
  if (url) {
    return (
      <img
        className={className || undefined}
        src={url}
        alt={alt}
        style={sizeStyle}
        aria-hidden={alt ? undefined : true}
      />
    );
  }

  return null;
}
