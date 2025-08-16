// src/features/user/components/UserTagList.tsx
import { usePortfolioStore } from '@/features/portfolio/store/portfolioStore';

interface Tag {
  name: string;
  amount: number;
}

interface Props {
  tags: Tag[] | null;
}

const UserTagList = ({ tags }: Props) => {
  const { tags: selectedTags, setTags, triggerSearch } = usePortfolioStore();

  const toggleTag = (tag: string) => {
    const updated = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    setTags(updated);
    triggerSearch();
  };

  // === return (UI 통일) ===
  if (!tags || tags.length === 0) {
    return (
      <div className="rounded-lg border border-dashed px-3 py-4 text-center text-sm text-gray-400">
        사용한 태그가 없습니다.
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map(({ name, amount }) => {
        const selected = selectedTags.includes(name);
        return (
          <button
            key={name}
            onClick={() => toggleTag(name)}
            aria-pressed={selected}
            className={[
              'px-3 py-1 text-sm rounded-full border transition',
              selected
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
            ].join(' ')}
            title={`#${name}`}
          >
            #{name} <span className="opacity-80">({amount})</span>
          </button>
        );
      })}
    </div>
  );
};

export default UserTagList;
