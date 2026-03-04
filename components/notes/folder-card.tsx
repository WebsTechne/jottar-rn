import React, { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { Link } from "expo-router";
import { HugeiconsIcon } from "@hugeicons/react-native";
import type { FolderListItem } from "@/types/folders";
import { cn } from "@/lib/utils";
import { useOverlay } from "../overlay";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Skeleton } from "../ui/skeleton";
import { Text } from "../ui/text";

function FolderCard({ folder }: { folder: FolderListItem }) {
  const [localFolder, setLocalFolder] = useState<FolderListItem>(folder);
  const [inFlight, setInFlight] = useState(false);

  const { active, open, close } = useOverlay();
  const owner = `folder-context:${localFolder.id}` as const;
  const isOpen = active === owner;

  const [dialogOpen, setDialogOpen] = useState(false);
  const handleDialogOpenChange = (value: boolean) => {
    setDialogOpen(value);
  };

  return (
    <ContextMenu open={isOpen} onOpenChange={(v) => (v ? open(owner) : close())}>
      <ContextMenuTrigger asChild>
        <View
          className={cn(
            "relative flex h-[84px] w-full overflow-hidden rounded-2xl bg-muted p-3 !pb-2 transition-shadow duration-300 dark:!bg-card",
            isOpen && "z-1005 shadow-sm"
          )}>
          <View className="relative h-[100px] w-full flex-1">
            <View className="flex flex-row items-center justify-between gap-1">
              <Text variant="h3" className="line-clamp-1 font-semibold !text-base tracking-tight">
                {localFolder.name}
              </Text>
              <Text className="font shrink-0 rounded-lg bg-muted px-2 font-mono text-sm text-muted-foreground">
                {folder._count.notes}
              </Text>
            </View>
            <Text className="line-clamp-2 text-sm text-muted-foreground">
              {localFolder.description || "No description"}
            </Text>
          </View>

          {/* absolute clickable layer */}
          <Link href={`/folders/${localFolder.slug}`} className="absolute inset-0 z-10" />
        </View>
      </ContextMenuTrigger>
    </ContextMenu>
  );
}

function FolderCardSkeleton() {
  return (
    <View className="h-[84px] w-full overflow-hidden rounded-2xl flex-center">
      <Skeleton className="size-full !rounded-[inherit]" />
    </View>
  );
}

export { FolderCard, FolderCardSkeleton };
