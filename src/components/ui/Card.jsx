import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import PropTypes from 'prop-types';

export const Card = ({ children, className }) => {
  return (
    <div className={twMerge(clsx("bg-slate-800 rounded-xl shadow-lg border border-slate-700/50 overflow-hidden", className))}>
      {children}
    </div>
  );
};
Card.propTypes = { children: PropTypes.node.isRequired, className: PropTypes.string };

export const CardHeader = ({ title, icon: Icon, className }) => (
  <div className={twMerge(clsx("px-4 py-2.5 border-b border-slate-700/50 flex items-center gap-2", className))}>
    {Icon && <Icon className="w-4 h-4 text-blue-400" />}
    <h3 className="font-semibold text-sm text-slate-100">{title}</h3>
  </div>
);
CardHeader.propTypes = { title: PropTypes.node.isRequired, icon: PropTypes.elementType, className: PropTypes.string };

export const CardContent = ({ children, className }) => (
  <div className={twMerge(clsx("p-4", className))}>
    {children}
  </div>
);
CardContent.propTypes = { children: PropTypes.node.isRequired, className: PropTypes.string };
