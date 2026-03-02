import capitalize from "./capitalize";

export default function getDisplayTitle(pathname: string) {
  // Extract the last segment of the path
  const segments = pathname.split("/");
  let lastSegment = segments[segments.length - 1] || "index";

  if (lastSegment === "" || lastSegment === "index") {
    return "Home";
  }

  // Capitalize first letter
  return capitalize(lastSegment);
}
