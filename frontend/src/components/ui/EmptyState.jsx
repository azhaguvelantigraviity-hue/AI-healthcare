import React from 'react';
import { AlertCircle, FileText, Inbox } from 'lucide-react';

const icons = {
  alert: AlertCircle,
  file: FileText,
  inbox: Inbox,
};

const EmptyState = ({ icon = 'inbox', title, description, action }) => {
  const IconComponent = icons[icon] || Inbox;

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
        <IconComponent className="h-8 w-8 text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">{title}</h3>
      {description && <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-4">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
