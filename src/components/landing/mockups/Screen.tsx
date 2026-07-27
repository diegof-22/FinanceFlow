import React from 'react';

interface ScreenProps {
  children?: React.ReactNode;
  path: string;
  alt: string;
}

export const Screen = ({ children, path, alt }: ScreenProps) => {
  return (
    <div className="w-full h-full bg-white overflow-hidden pointer-events-none">
      <img src={path} alt={alt} className="w-full h-full object-cover object-top no-scrollbar" />
      {children}
    </div>
  );
};
