
import { cn } from '@/lib/utils';

export type StatusType = 
  'pending' | 'processing' | 'completed' | 'failed' | 
  'available' | 'hired' | 'new' | 'inactive' | 'reviewing';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const StatusBadge = ({ status, className, size = 'md' }: StatusBadgeProps) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-0.5',
    lg: 'text-sm px-3 py-1'
  };
  
  const statusClasses = {
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    processing: 'bg-blue-50 text-blue-700 border-blue-200',
    reviewing: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    completed: 'bg-green-50 text-green-700 border-green-200',
    failed: 'bg-red-50 text-red-700 border-red-200',
    available: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    hired: 'bg-purple-50 text-purple-700 border-purple-200',
    new: 'bg-blue-50 text-blue-700 border-blue-200',
    inactive: 'bg-gray-50 text-gray-700 border-gray-200'
  };
  
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-medium',
        statusClasses[status],
        sizeClasses[size],
        className
      )}
    >
      <span className={cn(
        'mr-1.5 h-1.5 w-1.5 rounded-full',
        {
          'bg-yellow-400': status === 'pending',
          'bg-blue-400': status === 'processing' || status === 'new',
          'bg-indigo-400': status === 'reviewing',
          'bg-green-400': status === 'completed',
          'bg-red-400': status === 'failed',
          'bg-emerald-400': status === 'available',
          'bg-purple-400': status === 'hired',
          'bg-gray-400': status === 'inactive'
        }
      )} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default StatusBadge;
