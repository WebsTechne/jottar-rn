import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from "react";
import { Animated, View } from "react-native";
import { cn } from "@/lib/utils";

// ---------------- Overlay Component ----------------
type OverlayProps = {
  open: boolean;
  className?: string;
  children?: ReactNode;
};

function Overlay({ open, className, children }: OverlayProps) {
  const [mounted, setMounted] = useState(open);
  const opacity = useRef(new Animated.Value(open ? 1 : 0)).current;

  useEffect(() => {
    if (open) setMounted(true);

    Animated.timing(opacity, {
      toValue: open ? 1 : 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      if (!open) setMounted(false);
    });
  }, [open]);

  if (!mounted) return null;

  return (
    <Animated.View
      style={{ opacity }}
      pointerEvents={open ? "auto" : "none"}
      className={cn(
        "supports-backdrop-filter:backdrop-blur-[2px] fixed inset-0 isolate z-[1001] bg-background/70",
        className
      )}>
      {children}
    </Animated.View>
  );
}

// ---------------- Overlay Context ----------------
type OverlayContextType = {
  active: string | null;
  open: (owner: string) => void;
  close: () => void;
};

const OverlayContext = createContext<OverlayContextType | undefined>(undefined);

export function OverlayProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <OverlayContext.Provider value={{ active, open: setActive, close: () => setActive(null) }}>
      {children}

      {/* render overlay at root */}
      <Overlay open={active !== null}>{/* optional: dynamic content based on owner */}</Overlay>
    </OverlayContext.Provider>
  );
}

export function useOverlay() {
  const ctx = useContext(OverlayContext);
  if (!ctx) throw new Error("useOverlay must be used inside OverlayProvider");
  return ctx;
}
