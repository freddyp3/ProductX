import React, { createContext, useState, useContext } from 'react';

const GroupContext = createContext();

export function GroupProvider({ children }) {
  const [groups, setGroups] = useState([]);
  const [unlockedGroups, setUnlockedGroups] = useState([]);

  const addPhotoToGroup = async (groupId, mediaUri, isVideo = false, mediaId = Date.now().toString()) => {
    const mediaItem = {
      uri: mediaUri,
      isVideo,
      id: mediaId,
      comments: [],
      timestamp: new Date().toISOString(),
      isLocked: true
    };

    const isInCurrent = groups.some(g => g.id === groupId);
    
    if (isInCurrent) {
      setGroups(prevGroups => 
        prevGroups.map(group => {
          if (group.id === groupId) {
            return {
              ...group,
              media: [...(group.media || []), mediaItem],
              photoCount: (group.photoCount || 0) + 1
            };
          }
          return group;
        })
      );
    } else {
      setUnlockedGroups(prevGroups => 
        prevGroups.map(group => {
          if (group.id === groupId) {
            return {
              ...group,
              media: [...(group.media || []), mediaItem],
              photoCount: (group.photoCount || 0) + 1
            };
          }
          return group;
        })
      );
    }
  };

  const removePhotoFromGroup = (groupId, mediaId) => {
    const isInCurrent = groups.some(g => g.id === groupId);
    
    if (isInCurrent) {
      setGroups(prevGroups => 
        prevGroups.map(group => {
          if (group.id === groupId) {
            return {
              ...group,
              media: group.media.filter(item => item.id !== mediaId),
              photoCount: (group.photoCount || 1) - 1
            };
          }
          return group;
        })
      );
    } else {
      setUnlockedGroups(prevGroups => 
        prevGroups.map(group => {
          if (group.id === groupId) {
            return {
              ...group,
              media: group.media.filter(item => item.id !== mediaId),
              photoCount: (group.photoCount || 1) - 1
            };
          }
          return group;
        })
      );
    }
  };

  const addComment = (groupId, mediaId, commentText) => {
    const comment = {
      id: Date.now().toString(),
      text: commentText,
      timestamp: new Date().toISOString()
    };

    const isInCurrent = groups.some(g => g.id === groupId);
    
    if (isInCurrent) {
      setGroups(prevGroups => 
        prevGroups.map(group => {
          if (group.id === groupId) {
            return {
              ...group,
              media: group.media.map(item => {
                if (item.id === mediaId) {
                  return {
                    ...item,
                    comments: [...(item.comments || []), comment]
                  };
                }
                return item;
              })
            };
          }
          return group;
        })
      );
    } else {
      setUnlockedGroups(prevGroups => 
        prevGroups.map(group => {
          if (group.id === groupId) {
            return {
              ...group,
              media: group.media.map(item => {
                if (item.id === mediaId) {
                  return {
                    ...item,
                    comments: [...(item.comments || []), comment]
                  };
                }
                return item;
              })
            };
          }
          return group;
        })
      );
    }
  };

  const unlockGroup = (groupId) => {
    const groupToUnlock = groups.find(g => g.id === groupId);
    if (groupToUnlock) {
      const unlockedGroup = {
        ...groupToUnlock,
        isUnlocked: true,
        media: groupToUnlock.media.map(item => ({
          ...item,
          isLocked: false
        }))
      };
      setGroups(prevGroups => prevGroups.filter(g => g.id !== groupId));
      setUnlockedGroups(prevGroups => [...prevGroups, unlockedGroup]);
    }
  };

  const addGroup = (newGroup) => {
    console.log('Adding new group:', newGroup);
    setGroups(prevGroups => {
      const updatedGroups = [...prevGroups, newGroup];
      console.log('Updated groups:', updatedGroups);
      return updatedGroups;
    });
  };

  return (
    <GroupContext.Provider value={{
      groups,
      unlockedGroups,
      addGroup,
      addPhotoToGroup,
      removePhotoFromGroup,
      unlockGroup,
      addComment
    }}>
      {children}
    </GroupContext.Provider>
  );
}

export const useGroups = () => useContext(GroupContext); 