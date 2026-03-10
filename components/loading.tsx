import { QuillWrite01FreeIcons } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { View } from "react-native";

export default function Loading() {
  return (
    <View className="fixed left-1/2 top-1/2 h-screen w-screen -translate-x-1/2 -translate-y-1/2 flex-center">
      <HugeiconsIcon
        icon={QuillWrite01FreeIcons}
        size={60}
        color="currentColor"
        strokeWidth={1.8}
        className="animate-pulse"
      />
    </View>
  );
}
