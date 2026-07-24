import { useContactModal } from '../context/ContactModalContext';

export default function ContactButton({ children, style, className, onMouseEnter, onMouseLeave, onClick }) {
  const { openContactModal } = useContactModal();

  const handleClick = (event) => {
    openContactModal();
    onClick?.(event);
  };

  return (
    <button
      type="button"
      className={className}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        font: 'inherit',
        padding: 0,
        ...style,
      }}
      onClick={handleClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </button>
  );
}
