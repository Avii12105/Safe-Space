import React from 'react';

interface EnvironmentCardProps {
  title: string;
  value: string | number;
  unit?: string;
  status: string;
  colorClass: string;
  icon: React.ReactNode;
}

const EnvironmentCard: React.FC<EnvironmentCardProps> = ({
  title,
  value,
  unit,
  status,
  colorClass,
  icon,
}) => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col justify-between h-full">
      <div className="flex justify-between items-start mb-2">
        <div className="p-2 rounded-xl">
          {React.isValidElement(icon)
            ? React.cloneElement(
                icon as React.ReactElement<{ className?: string }>,
                {
                  className: `w-5 h-5 ${colorClass}`,
                }
              )
            : icon}
        </div>
        <span
          className={`text-xs font-bold px-2 py-1 rounded-full ${colorClass}`}
        >
          {status}
        </span>
      </div>
      <div>
        <h3 className="text-slate-500 text-xs uppercase tracking-wider font-semibold">{title}</h3>
        <div className="flex items-baseline mt-1">
          <span className="text-2xl font-bold text-slate-800">{value}</span>
          {unit && <span className="text-sm text-slate-400 ml-1 font-medium">{unit}</span>}
        </div>
      </div>
    </div>
  );
};

export default EnvironmentCard;