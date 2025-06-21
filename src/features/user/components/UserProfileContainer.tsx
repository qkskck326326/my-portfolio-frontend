import { useState } from 'react';
import UserProfileViewer from './UserProfileViewer';
import UserProfileEditor from './UserProfileEditor';

const UserProfileContainer = () => {
  const [isEditing, setIsEditing] = useState(false);

  return isEditing ? (
    <UserProfileEditor onCancel={() => setIsEditing(false)} onComplete={() => setIsEditing(false)} />
  ) : (
    <UserProfileViewer onEdit={() => setIsEditing(true)} />
  );
};

export default UserProfileContainer;
