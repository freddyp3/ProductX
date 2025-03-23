import React, { createContext, useState, useContext } from 'react';

const GroupContext = createContext();

export function GroupProvider({ children }) {
  const [groups, setGroups] = useState([]);
  const [unlockedGroups, setUnlockedGroups] = useState([]);

  const addGroup = (newGroup) => {
    setGroups([...groups, newGroup]);
  };

  const addPhotoToGroup = (groupId, mediaUri, isVideo = false) => {
    const mediaItem = {
      uri: mediaUri,
      isVideo: isVideo,
      id: Date.now().toString(),
      comments: [],
      timestamp: new Date().toISOString()
    };

    const isInCurrent = groups.some(g => g.id === groupId);
    
    if (isInCurrent) {
      setGroups(groups.map(group => {
        if (group.id === groupId) {
          return {
            ...group,
            media: [...(group.media || []), mediaItem],
            photoCount: (group.photoCount || 0) + 1
          };
        }
        return group;
      }));
    } else {
      setUnlockedGroups(unlockedGroups.map(group => {
        if (group.id === groupId) {
          return {
            ...group,
            media: [...(group.media || []), mediaItem],
            photoCount: (group.photoCount || 0) + 1
          };
        }
        return group;
      }));
    }
  };

  const addCommentToMedia = (groupId, mediaId, comment, parentCommentId = null) => {
    const updateMediaInGroup = (group) => {
      if (group.id !== groupId) return group;
      
      return {
        ...group,
        media: group.media.map(m => {
          if (m.id === mediaId) {
            if (parentCommentId) {
              // Add reply to existing comment
              return {
                ...m,
                comments: m.comments.map(c => {
                  if (c.id === parentCommentId) {
                    return {
                      ...c,
                      replies: [...(c.replies || []), {
                        id: Date.now().toString(),
                        ...comment,
                        timestamp: new Date().toISOString()
                      }]
                    };
                  }
                  return c;
                })
              };
            } else {
              // Add new top-level comment
              return {
                ...m,
                comments: [...(m.comments || []), {
                  id: Date.now().toString(),
                  ...comment,
                  timestamp: new Date().toISOString(),
                  replies: []
                }]
              };
            }
          }
          return m;
        })
      };
    };

    setGroups(groups.map(updateMediaInGroup));
    setUnlockedGroups(unlockedGroups.map(updateMediaInGroup));
  };

  const unlockGroup = (groupId) => {
    const groupToUnlock = groups.find(g => g.id === groupId);
    if (groupToUnlock) {
      const unlockedGroup = {
        ...groupToUnlock,
        isUnlocked: true
      };
      setGroups(groups.filter(g => g.id !== groupId));
      setUnlockedGroups([...unlockedGroups, unlockedGroup]);
    }
  };

  return (
    <GroupContext.Provider value={{ 
      groups, 
      unlockedGroups, 
      addGroup, 
      addPhotoToGroup, 
      addCommentToMedia,
      unlockGroup 
    }}>
      {children}
    </GroupContext.Provider>
  );
}

export function useGroups() {
  return useContext(GroupContext);
} 