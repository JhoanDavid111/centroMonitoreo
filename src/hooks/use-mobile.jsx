//  DOCS
import { useEffect, useState } from "react";

const MOBILE_WIDTH = 768;

export const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (!window) {
      throw new Error("No window object")
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_WIDTH);
    }

    handleResize();

    const mtl = window.matchMedia(`(max-width: ${MOBILE_WIDTH - 1}px)`);
    mtl.addEventListener("change", handleResize);

    return () => {
      mtl.removeEventListener("change", handleResize);
    }
  }, [])

  return {
    isMobile,
  };
}
