// src/features/portfolio/components/PortfolioForm.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MarkdownEditor from './MarkdownEditor';
import TagInput from '@/components/tag/TagInput';
import { createPortfolioApi, updatePortfolioApi } from '@/features/portfolio/api/portfolioApi';
import type { PortfolioDetail } from '@/features/portfolio/types/portfolio.types';

interface PortfolioFormProps {
  portfolio?: PortfolioDetail; // 수정 시 전달되는 기존 포트폴리오 정보
}

const PortfolioForm = ({ portfolio }: PortfolioFormProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [thumbnail, setThumbnail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (portfolio) {
      setTitle(portfolio.title);
      setContent(portfolio.content);
      setTags(portfolio.tags ?? []);
      setThumbnail(portfolio.thumbnail ?? '');
    }
  }, [portfolio]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !content.trim()) {
      setError('제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      if (portfolio) {
        // 수정 모드
        await updatePortfolioApi(portfolio.id, {
          portfolioId: portfolio.id,
          title,
          content,
          thumbnail: thumbnail || undefined,
          tags,
        });
        alert('포트폴리오가 수정되었습니다.');
        navigate(`/portfolio/${portfolio.id}`);
      } else {
        // 신규 작성 모드
        const portfolioId = await createPortfolioApi({
          title,
          content,
          thumbnail: thumbnail || undefined,
          tags,
        });
        navigate(`/portfolio/${portfolioId}`);
      }
    } catch (err) {
      console.error(err);
      setError(portfolio ? '수정 중 문제가 발생했습니다.' : '등록 중 문제가 발생했습니다.');
    }
  };

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
        <MarkdownEditor value={content} onChange={setContent} onImageUpload={handleImageUpload} />
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <div className="text-right">
        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded">
          {portfolio ? '수정하기' : '등록하기'}
        </button>
      </div>
    </form>
  );
};

export default PortfolioForm;
