import { useState } from 'react';

type Props = {
  rules: Record<string, 'L' | 'R'>;
  onRulesChange: (rules: Record<string, 'L' | 'R'>) => void;
  assignedColor: string;
};

export default function Controls({ rules, onRulesChange, assignedColor }: Props) {
  const [localRules, setLocalRules] = useState<Record<string, 'L' | 'R'>>(rules);
  const [colorInput, setColorInput] = useState('');
  const [turnInput, setTurnInput] = useState<'L' | 'R'>('R');

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!colorInput.trim()) {
      alert('Color cannot be empty');
      return;
    }

    setLocalRules(prev => ({
      ...prev,
      [colorInput.trim()]: turnInput,
    }));

    setColorInput('');
  };

  const handleSendRules = (e: React.FormEvent) => {
    e.preventDefault();
    onRulesChange(localRules);
  };

  const handleRemoveRule = (color: string) => {
    const updated = { ...localRules };
    delete updated[color];
    setLocalRules(updated);
  };

  return (
    <form className="space-y-4" onSubmit={handleSendRules}>
      <h2 className="text-lg font-bold text-gray-100 mb-2">Define Ant Rules</h2>

      <div className="flex flex-col md:flex-row items-center gap-2">
        <select
          className="flex-1 px-3 py-2 rounded border border-gray-600 bg-gray-800 text-gray-100"
          value={colorInput}
          onChange={e => setColorInput(e.target.value)}
        >
          <option value="">Select color</option>
          <option value="white">⬜ white</option>
          <option value={assignedColor}>⬛ your color</option>
        </select>

        <select
          className="px-3 py-2 rounded border border-gray-600 bg-gray-800 text-gray-100"
          value={turnInput}
          onChange={e => setTurnInput(e.target.value as 'L' | 'R')}
        >
          <option value="R">R (Right)</option>
          <option value="L">L (Left)</option>
        </select>
        <button
          type="button"
          onClick={handleAddRule}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          Add Rule
        </button>
      </div>

      <div className="bg-gray-800 border border-gray-600 rounded p-3 mt-2 text-gray-100">
        <h3 className="font-semibold mb-1">Current Rules:</h3>
        {Object.keys(localRules).length === 0 && (
          <p className="text-gray-400 italic">No rules defined.</p>
        )}
        <ul className="space-y-1">
          {Object.entries(localRules).map(([color, turn]) => (
            <li key={color} className="flex justify-between items-center">
              <span>
                {color === assignedColor ? '⬛' : '⬜'}: {turn}
              </span>
              <button
                type="button"
                onClick={() => handleRemoveRule(color)}
                className="text-red-400 hover:text-red-300 text-sm"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition w-full"
      >
        Send Rules
      </button>
    </form>
  );
}
