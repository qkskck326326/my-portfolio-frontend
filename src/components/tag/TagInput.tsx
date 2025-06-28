// src/components/tag/TagInput.tsx
import { useState, useRef } from 'react';

type TagInputProps = {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
};

const TagInput = ({ value, onChange, placeholder = '태그를 입력하세요' }: TagInputProps) => {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (!trimmed || value.includes(trimmed)) return;
    onChange([...value, trimmed]);
    setInput('');
  };

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(input);
    } else if (e.key === 'Backspace' && !input && value.length) {
      removeTag(value.length - 1);
    }
  };

  return (
    <div className="border rounded px-2 py-1 flex flex-wrap items-center gap-2 min-h-[44px]">
      {value.map((tag, index) => (
        <div
          key={index}
          className="flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm"
        >
          {tag}
          <button
            type="button"
            className="ml-1 text-blue-600 hover:text-red-500"
            onClick={() => removeTag(index)}
          >
            ×
          </button>
        </div>
      ))}

      <input
        ref={inputRef}
        type="text"
        className="flex-grow min-w-[100px] border-none focus:outline-none"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />
    </div>
  );
};

export default TagInput;
