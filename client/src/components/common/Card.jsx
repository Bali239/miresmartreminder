import React from 'react';

export const Card = ({ children, className = '', hoverEffect = false, padding = 'p-6', glow = false, ...props }) => {
  return (
    <div
      className={`glass-card transition-all duration-300 relative overflow-hidden
        ${hoverEffect ? 'glass-hover cursor-default' : ''}
        ${glow ? 'glow-border' : ''}
        ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
