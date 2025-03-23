import React, { createContext, useState, useContext } from "react";

const GroupContext = createContext();

export function GroupProvider({ children }) {
  const [groups, setGroups] = useState([]);

  const addGroup = (newGroup) => {
    // Initialize media counts
    const initializedGroup = {
      ...newGroup,
      photoCount: newGroup.photoCount || 0,
      videoCount: 0,
      mediaItems: newGroup.photos
        ? newGroup.photos.map((uri) => ({
            uri,
            type: "photo",
          }))
        : [],
    };
    setGroups([...groups, initializedGroup]);
  };

  const addPhotoToGroup = (groupId, mediaUri, mediaType = "photo") => {
    setGroups(
      groups.map((group) => {
        if (group.id === groupId) {
          // Determine if it's a photo or video based on file extension
          const isVideo =
            mediaType === "video" ||
            mediaUri.toLowerCase().endsWith(".mp4") ||
            mediaUri.toLowerCase().endsWith(".mov") ||
            mediaUri.toLowerCase().endsWith(".avi");

          return {
            ...group,
            mediaItems: [
              ...(group.mediaItems || []),
              {
                uri: mediaUri,
                type: isVideo ? "video" : "photo",
              },
            ],
            photoCount: isVideo
              ? group.photoCount || 0
              : (group.photoCount || 0) + 1,
            videoCount: isVideo
              ? (group.videoCount || 0) + 1
              : group.videoCount || 0,
          };
        }
        return group;
      }),
    );
  };

  return (
    <GroupContext.Provider
      value={{
        groups,
        addGroup,
        addPhotoToGroup,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
}

export function useGroups() {
  return useContext(GroupContext);
}
