import { View } from "react-native";
import { Text } from "../ui/text";
import { cn } from "@/lib/utils";

function Section({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <View
      className={cn(
        "flex w-full flex-row flex-wrap gap-3 border border-transparent border-b-border p-4",
        className
      )}>
      {children}
    </View>
  );
}

function SectionTitle({ className, children }: { className?: string; children: React.ReactNode }) {
  return <Text className={cn("!font-extrabold text-2xl", className)}>{children}</Text>;
}

function SectionBody({
  variant = "grid",
  className,
  children,
}: {
  variant?: "scratch" | "grid" | "flex";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <View
      className={cn(
        variant === "scratch"
          ? "flex w-full gap-3"
          : variant === "grid"
            ? "grid w-full grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            : "flex flex-row gap-2 overflow-y-clip overflow-x-scroll md:gap-3",
        className
      )}>
      {children}
    </View>
  );
}

function SelectFooter({ className, children }: { className?: string; children: React.ReactNode }) {
  return <View className={cn("flex items-center justify-end text-sm", className)}>{children}</View>;
}

export { Section, SectionTitle, SectionBody, SelectFooter };
