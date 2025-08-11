// src/features/portfolio/components/MarkdownEditor.tsx
import MDEditor, { type RefMDEditor } from '@uiw/react-md-editor';
import { useRef, useCallback, useEffect } from 'react';
import { resizeImage } from '@/public/utils/imageResize';
import { uploadImageToCdn } from '@/features/images/api/uploadImageApi';

type Props = {
  value: string;
  onChange: (value: string) => void;
  onImageUpload?: (url: string) => void;
};

const MarkdownEditor = ({ value, onChange, onImageUpload }: Props) => {
  const editorRef = useRef<RefMDEditor | null>(null);

  // 최신 value를 항상 읽기 위한 ref
  const valueRef = useRef(value);
  useEffect(() => { valueRef.current = value; }, [value]);

  const getCurrentText = () =>
    editorRef.current?.textarea?.value ?? valueRef.current;

  const insertAtCursor = useCallback((text: string) => {
    const ta = editorRef.current?.textarea;
    const src = ta ? ta.value : valueRef.current;

    const start = ta ? (ta.selectionStart ?? src.length) : src.length;
    const end = ta ? (ta.selectionEnd ?? src.length) : src.length;
    const next = src.slice(0, start) + text + src.slice(end);
    onChange(next);

    requestAnimationFrame(() => {
      if (!ta) return;
      ta.focus();
      const pos = start + text.length;
      ta.setSelectionRange(pos, pos);
    });
  }, [onChange]);

// ✅ replaceOnce를 커서 복원까지 하도록 수정
const replaceOnce = useCallback((placeholder: string, actual: string) => {
    const src = getCurrentText();
    const idx = src.indexOf(placeholder);
    if (idx === -1) return;

    const next = src.slice(0, idx) + actual + src.slice(idx + placeholder.length);
    const caretPos = idx + actual.length; // ✅ 치환 후 커서가 있어야 할 위치(문자열 기준)

    onChange(next);

    // ✅ 리렌더 후 커서 복원 (더블 RAF로 안정화)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const ta = editorRef.current?.textarea;
        if (!ta) return;
        ta.focus();
        ta.setSelectionRange(caretPos, caretPos);
      });
    });
  }, [onChange]);

  const handleSingleFile = useCallback(async (file: File) => {
    // 고유 토큰(placeholder 식별용)
    const id = crypto.randomUUID();
    const marker = `<!--u:${id}-->`;

    // placeholder: 마커 + 업로딩 안내, "반드시 개행 포함"
    const placeholder = `${marker}\n![Uploading ${file.name}...]()\n`;
    insertAtCursor(placeholder);

    try {
      const resized = await resizeImage(file, {
        maxWidth: 1600, maxHeight: 1600, mimeType: 'image/webp', quality: 0.9,
      });

      const { url } = await uploadImageToCdn(resized);

      // ✅ 실제 치환 문자열에는 마커를 넣지 않는다 (이미지 한 줄만)
      // 앞뒤로 개행을 넣어 파싱 안정성 확보
      const markdown = `![${file.name}](${url})\n`;

      // placeholder 전체(마커+업로딩 문구)를 이미지 마크다운으로 교체
      replaceOnce(placeholder, markdown);

      onImageUpload?.(url);
    } catch (e) {
      replaceOnce(placeholder, `> 이미지 업로드 실패: ${(e as Error).message}\n`);
    }
  }, [insertAtCursor, replaceOnce, onImageUpload]);

  const handleFiles = useCallback(async (files: FileList | File | null) => {
    if (!files) return;
    if (files instanceof File) {
      await handleSingleFile(files);
      return;
    }
    if (files.length > 0) {
      await handleSingleFile(files[0]);
    }
  }, [handleSingleFile]);

  const onDrop: React.DragEventHandler<HTMLDivElement> = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const onPaste: React.ClipboardEventHandler<HTMLDivElement> = useCallback(async (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.kind === 'file') {
        e.preventDefault();
        e.stopPropagation();
        const file = item.getAsFile();
        if (file) await handleFiles(file);
        break;
      }
    }
  }, [handleFiles]);

  return (
    <div className="w-full" onDrop={onDrop} onDragOver={(e) => e.preventDefault()} onPaste={onPaste}>
      <MDEditor
        ref={editorRef}
        value={value}
        onChange={(val = '') => onChange(val)}
        height={500}
        preview="live"          // ✅ 미리보기 명시
      />
    </div>
  );
};

export default MarkdownEditor;