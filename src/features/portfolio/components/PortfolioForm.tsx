// src/features/portfolio/components/PortfolioForm.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MarkdownEditor from './MarkdownEditor';
import TagInput from '@/components/tag/TagInput';
import { createPortfolioApi } from '@/features/portfolio/api/portfolioApi';

const PortfolioForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [thumbnail, setThumbnail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
  
      if (!title.trim() || !content.trim()) {
        setError('제목과 내용을 모두 입력해주세요.');
        return;
      }
  
      try {
        const portfolioId = await createPortfolioApi({
          title,
          content,
          thumbnail: thumbnail || undefined, // 썸네일 없으면 undefined 처리
          tags,
        });
  
        navigate(`/portfolio/${portfolioId}`);
      } catch (err) {
        console.error(err);
        setError('등록 중 문제가 발생했습니다.');
      }
    };

  // ✅ 에디터에서 이미지 업로드 성공 시 썸네일 갱신
  const handleImageUpload = (url: string) => {
    setThumbnail(url);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
  <div>
    <label className="block mb-1 font-medium">제목</label>
    <input
      type="text"
      className="w-full border rounded px-3 py-2"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      required
    />
  </div>

  <div>
    <label className="block mb-1 font-medium">태그</label>
    <TagInput value={tags} onChange={setTags} />
  </div>

  <div>
    <label className="block mb-1 font-medium">내용</label>
    <MarkdownEditor 
      value={content} 
      onChange={setContent} 
      onImageUpload={handleImageUpload}/>
  </div>

  {error && <div className="text-red-500 text-sm">{error}</div>}

  <div className="text-right">
    <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded">
      등록하기
    </button>
  </div>
</form>

  );
};

export default PortfolioForm;
