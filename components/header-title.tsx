import { Text } from "./ui/text";

export function HeaderTitle({ title }: { title: string }) {
  return (
    <Text variant="h3" className="!font-extrabold">
      {title}w
    </Text>
  );
}
