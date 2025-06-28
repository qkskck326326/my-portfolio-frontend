// src/features/portfolio/components/MarkdownEditor.tsx
import MDEditor from '@uiw/react-md-editor';

type Props = {
  value: string;
  onChange: (value: string) => void;
};

const MarkdownEditor = ({ value, onChange }: Props) => {
  return (
    <div className="w-full">
      <MDEditor
        value={value}
        onChange={(val = '') => onChange(val)}
        height={500}
      />
    </div>
  );
};

export default MarkdownEditor;