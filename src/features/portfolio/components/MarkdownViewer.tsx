// src/components/MarkdownViewer.tsx
import MDEditor from '@uiw/react-md-editor';

const MarkdownViewer = ({ content }: { content: string }) => {
  return (
    <div className="w-full">
      <MDEditor.Markdown
        source={content}
        style={{ backgroundColor: 'transparent' }}
      />
    </div>
  );
};

export default MarkdownViewer;