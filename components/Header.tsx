
import React from 'react';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-white tracking-tight">{title}</h1>
    </div>
  );
};

export default Header;
