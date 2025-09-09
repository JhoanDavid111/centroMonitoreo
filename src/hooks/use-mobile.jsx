//  DOCS
import { useEffect, useState} from "react"

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

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    }
  }, [])

  return {
    isMobile,
  };
}