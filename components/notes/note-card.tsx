import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Pressable, Modal, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";

import {
  Archive03Icon,
  ArchiveOff03Icon,
  Copy01Icon,
  Delete02Icon,
  Folder02Icon,
  FolderAddIcon,
  InformationCircleIcon,
  PinIcon,
  PinOffIcon,
  ReloadIcon,
  Share01Icon,
  StarIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { type Note } from "@/types/notes";
import { type FolderDropdownItem } from "@/types/folders";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";
import { Card } from "../ui/card";

type Props = {
  note: Note;
  folders: FolderDropdownItem[];
  onPatch?: (updated: Partial<Note> & { id: string }) => void;
  view: "active" | "folder" | "favorites" | string;
};

const EXCLUDED_FOLDERS = new Set(["imported notes", "shared notes"]);

function NoteCard({ note, folders, onPatch, view }: Props) {
  return <View></View>;
}

function NoteCardSkeleton() {
  return (
    <View className="flex-center h-[100px] w-full overflow-hidden rounded-2xl">
      <Skeleton className="size-full !rounded-[inherit]" />
    </View>
  );
}

export { NoteCard, NoteCardSkeleton };
