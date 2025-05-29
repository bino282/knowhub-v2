import React from 'react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: 'primary' | 'accent' | 'highlight';
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color }) => {
  // Color mappings for each theme
  const colorMap = {
    primary: {
      bg: 'bg-primary-50 dark:bg-primary-900/20',
      text: 'text-primary-600 dark:text-primary-400',
      iconBg: 'bg-primary-100 dark:bg-primary-800/50',
    },
    accent: {
      bg: 'bg-accent-50 dark:bg-accent-900/20',
      text: 'text-accent-600 dark:text-accent-400',
      iconBg: 'bg-accent-100 dark:bg-accent-800/50',
    },
    highlight: {
      bg: 'bg-highlight-50 dark:bg-highlight-900/20',
      text: 'text-highlight-600 dark:text-highlight-400',
      iconBg: 'bg-highlight-100 dark:bg-highlight-800/50',
    },
  };

  const { bg, text, iconBg } = colorMap[color];

  return (
    <div className={`card overflow-hidden`}>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
            <motion.p 
              className="mt-2 text-3xl font-bold"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {value}
            </motion.p>
          </div>
          <div className={`p-3 rounded-full ${iconBg}`}>
            <div className={`${text}`}>
              {icon}
            </div>
          </div>
        </div>
        <div className={`absolute bottom-0 left-0 right-0 h-1 ${bg}`}></div>
      </div>
    </div>
  );
};

export default StatsCard;