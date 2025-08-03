// src/features/user/components/UserTagList.tsx
import { usePortfolioStore } from '@/features/portfolio/store/portfolioStore';

interface Tag {
  name: string;
  amount: number;
}

interface Props {
  tags: Tag[] | null; // null 허용
}

const UserTagList = ({ tags }: Props) => {
  const { tags: selectedTags, setTags, triggerSearch } = usePortfolioStore();

  const toggleTag = (tag: string) => {
    const updatedTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    setTags(updatedTags);
    triggerSearch(); // 검색 다시 트리거
  };

  if (!tags || tags.length === 0) {
    return (
      <div className="text-gray-400 text-sm italic px-2 py-1">
        사용한 태그가 없습니다.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {tags.map((tag) => {
        const isSelected = selectedTags.includes(tag.name);
        return (
          <button
            key={tag.name}
            onClick={() => toggleTag(tag.name)}
            className={`px-3 py-1 rounded-full border text-sm transition-all ${
              isSelected
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
            }`}
          >
            #{tag.name} ({tag.amount})
          </button>
        );
      })}
    </div>
  );
};

export default UserTagList;