import React from 'react';

export function Logo({ size = 28 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: 'linear-gradient(45deg,#0EA5E9,#22C55E,#EAB308)' }} />
  );
}

export default Logo;
