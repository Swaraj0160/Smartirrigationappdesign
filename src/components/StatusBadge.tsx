interface StatusBadgeProps {
  status: 'healthy' | 'warning' | 'critical' | 'on' | 'off';
  label: string;
}

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  const styles = {
    healthy: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700',
    warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700',
    critical: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700',
    on: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700',
    off: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm border ${styles[status]}`}>
      {label}
    </span>
  );
}
