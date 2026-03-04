import { View } from "react-native";
import { Text } from "../ui/text";
import { cn } from "@/lib/utils";
import { ScrollView } from "react-native";
import { useBreakpoint } from "@/lib/hooks/use-breakpoint";
import { Children } from "react";

function Section({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <View
      className={cn(
        "flex w-full flex-wrap gap-3 border border-transparent border-b-border p-4",
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
  variant?: "scratch" | "grid" | "flex" | "scroll";
  className?: string;
  children: React.ReactNode;
}) {
  const { xs, md } = useBreakpoint();

  return variant === "scroll" ? (
    <ScrollView
      horizontal
      className={cn(
        "flex w-full flex-row gap-2 overflow-y-hidden overflow-x-scroll md:gap-3",
        className
      )}>
      {children}
    </ScrollView>
  ) : (
    // : variant === "flex" ? (
    //   <View className="">
    //     {Children.map(children, (child) => (
    //       <View
    //         style={{
    //           width: md
    //             ? "31%" // ~3 columns
    //             : xs
    //               ? "50%" // ~2 columns
    //               : "100%",
    //         }}>
    //         {child}
    //       </View>
    //     ))}
    //   </View>
    // )
    <View
      className={cn(
        variant === "scratch"
          ? "flex w-full gap-3"
          : variant === "grid"
            ? "grid w-full grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            : "grid w-full grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-4",
        xs && "!grid-cols-2",
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
