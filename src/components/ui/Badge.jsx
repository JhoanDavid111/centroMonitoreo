// src/components/ui/Badge.jsx
import PropTypes from 'prop-types';

const variants = {
  default: 'bg-accent-primary text-black',
  subtle: 'bg-surface-secondary text-text-secondary border border-[color:var(--border-default)]',
  warning: 'bg-[color:var(--accent-warning)] text-black',
  info: 'bg-[color:var(--accent-info)] text-black',
};

export default function Badge({ variant = 'default', className = '', children, ...rest }) {
  const base = 'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium';
  const tone = variants[variant] || variants.default;
  const composed = `${base} ${tone}${className ? ` ${className}` : ''}`;
  return (
    <span className={composed} {...rest}>
      {children}
    </span>
  );
}

Badge.propTypes = {
  variant: PropTypes.oneOf(['default', 'subtle', 'warning', 'info']),
  className: PropTypes.string,
  children: PropTypes.node,
};

