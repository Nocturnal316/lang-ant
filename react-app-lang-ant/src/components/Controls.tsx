import { useState } from 'react';

type Props = {
  rules: Record<string, 'L' | 'R'>;
  onRulesChange: (rules: Record<string, 'L' | 'R'>) => void;
};

export default function Controls({ rules, onRulesChange }: Props) {
  const [text, setText] = useState(JSON.stringify(rules, null, 2));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsed = JSON.parse(text);
      onRulesChange(parsed);
    } catch {
      alert('Invalid JSON');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
      <h2>Define Ant Rules</h2>
      <p>Example: {"{\"white\":\"R\", \"#ff0000\":\"L\"}"}</p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        cols={40}
      />
      <br />
      <button type="submit">Set Rules</button>
    </form>
  );
}
