export type ShareLinkType = "USERNAME" | "TOKEN";

type Note = {
  id: string;
  title: string | null;
  content: string;
  folderId: string | null;
  userId: string;
  isPinned: boolean;
  favorite: boolean;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
  allowCopy: boolean;
  copiedFromNoteId: string | null;
  copiedFromUserId: string | null;
  shareLinkType: ShareLinkType;
  shareable: boolean;
  trashedAt: string | null;
};

export { type Note };
