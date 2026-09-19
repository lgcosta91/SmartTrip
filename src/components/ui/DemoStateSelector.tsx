import React from 'react';
import { UIState } from '../../types';

export interface DemoStateSelectorProps {
  currentState: UIState;
  onStateChange: (state: UIState) => void;
  availableStates?: UIState[];
}

export const DemoStateSelector: React.FC<DemoStateSelectorProps> = ({
  currentState,
  onStateChange,
  availableStates = ['normal', 'empty', 'loading', 'error'],
}) => {
  const labels: Record<UIState, string> = {
    normal: 'Normal',
    empty: 'Vazio',
    loading: 'Loading',
    error: 'Erro',
  };

  return (
    <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 backdrop-blur-xs border border-slate-200 rounded-xl text-xs shadow-xs w-fit my-2">
      <span className="text-[10px] uppercase font-bold text-slate-400 px-2 tracking-wider">
        Estado:
      </span>
      {availableStates.map((state) => {
        const isActive = currentState === state;
        return (
          <button
            key={state}
            onClick={() => onStateChange(state)}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
              isActive
                ? 'bg-white text-[#0b3c5d] shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            {labels[state]}
          </button>
        );
      })}
    </div>
  );
};
