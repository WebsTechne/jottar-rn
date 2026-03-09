type TagListItem = {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  noteTags: {
    noteId: string;
    tagId: string;
  };
};

export type { TagListItem };
