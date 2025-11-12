// src/components/ui/Panel.jsx
import PropTypes from 'prop-types';

const baseClassName =
  'bg-surface-secondary border border-[color:var(--border-default)] rounded-md shadow-soft';

export default function Panel({ className = '', children, ...rest }) {
  const composed = className ? `${baseClassName} ${className}` : baseClassName;
  return (
    <section className={composed} {...rest}>
      {children}
    </section>
  );
}

Panel.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

