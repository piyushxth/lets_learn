"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="md:fixed top-[0.96rem] z-50">
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 md:h-8 md:w-8 bg-red/90 hover:bg-red rounded-lg border"
        onClick={toggleTheme}
      >
        X<span className="sr-only">Toggle theme</span>
      </Button>
    </div>
  );
}
