import { Crown } from 'lucide-react';

interface VIPBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const VIPBadge = ({ size = 'md', className = '' }: VIPBadgeProps) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  };

  return (
    <div className={`inline-flex items-center gap-1 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 text-black font-bold rounded-full ${sizeClasses[size]} ${className} shadow-lg shadow-yellow-500/50 animate-pulse`}>
      <Crown size={iconSizes[size]} className="fill-black" />
      <span>VIP</span>
    </div>
  );
};

export default VIPBadge;
