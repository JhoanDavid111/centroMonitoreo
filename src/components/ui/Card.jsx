// src/components/ui/Card.jsx
import { forwardRef } from 'react';
import PropTypes from 'prop-types';

const baseClassName =
  'bg-surface-primary border border-[color:var(--border-subtle)] rounded-lg shadow-soft';

const Card = forwardRef(function Card({ className = '', children, ...rest }, ref) {
  const composed = className ? `${baseClassName} ${className}` : baseClassName;
  return (
    <div ref={ref} className={composed} {...rest}>
      {children}
    </div>
  );
});

Card.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export default Card;

