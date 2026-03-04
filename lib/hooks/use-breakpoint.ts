import { useWindowDimensions } from "react-native";

const useBreakpoint = () => {
  const { width } = useWindowDimensions();
  return {
    xs: width >= 359,
    sm: width >= 640,
    md: width >= 768,
    lg: width >= 1024,
  };
};

export { useBreakpoint };
