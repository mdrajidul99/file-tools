import React from 'react';
import * as LucideIcons from 'lucide-react';

interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

export const Icon: React.FC<IconProps> = ({ name, className = 'w-5 h-5', size = 20 }) => {
  // Lookup icon in lucide-react exports
  const IconComponent = (LucideIcons as Record<string, any>)[name] || LucideIcons.File;
  return <IconComponent className={className} size={size} />;
};
