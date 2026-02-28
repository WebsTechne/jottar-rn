type FolderOverview = {
  id: string;
  name: string;
  slug: string;
  updatedAt: Date;
  _count: {
    notes: number;
  };
};

type FolderDropdownItem = { id: string; name: string };

type FolderListItem = {
  select: {
    id: string;
    name: string;
    slug: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    _count: {
      notes: number;
    };
  };
};

type FolderWithNotes = {
  select: {
    id: string;
    name: string;
    slug: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    _count: {
      notes: number;
    };
    notes: {
      select: {
        id: string;
        title: string;
        content: string;
        folderId: string;
        userId: string;
        isPinned: boolean;
        favorite: boolean;
        archived: boolean;
        createdAt: string;
        updatedAt: string;
        trashedAt: string;
        allowCopy: boolean;
        copiedFromNoteId: string;
        copiedFromUserId: string;
        shareLinkType: string;
        shareable: boolean;
        noteTags: string[];
      };
    };
  };
};

export { type FolderOverview, FolderDropdownItem, FolderListItem, FolderWithNotes };
