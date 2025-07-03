// src/features/user/components/UserProfileContainer.tsx
import { useState } from 'react';
import UserProfileViewer from './UserProfileViewer';
import UserProfileEditor from './UserProfileEditor';
import { useUserProfile } from '../hooks/useUserProfile';

interface Props {
  slug: string;
}

const UserProfileContainer = ({ slug }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const { data, isLoading, error } = useUserProfile({ slug });

  return isEditing ? (
    <UserProfileEditor slug={slug} onCancel={() => setIsEditing(false)} onComplete={() => setIsEditing(false)} />
  ) : (
    <UserProfileViewer 
      slug={slug} 
      data={data}
      isLoading={isLoading}
      error={error}
    onEdit={() => setIsEditing(true)} />
  );
};

export default UserProfileContainer;
