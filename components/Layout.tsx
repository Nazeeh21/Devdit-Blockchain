import React from 'react';

interface LayoutProps {}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      testing workflow
      {children}
    </div>
  );
};
