import { XIcon } from "lucide-react";
import {
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useState,
} from "react";

const DialogContext = createContext({
  open: false,
  onOpenChange: (_) => {},
});

const Dialog = ({ children, open: controlledOpen, onOpenChange }) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);

  const open = controlledOpen ?? uncontrolledOpen;

  function handleOpenChange(value) {
    if (onOpenChange) {
      onOpenChange(value);
    } else {
      setUncontrolledOpen(value);
    }
  }

  useEffect(() => {
    if(!open) return;
    function preventScroll(e) {
      e.preventDefault();
    }

    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });

    return () => {
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
    }
  }, [open])


  return (
    <DialogContext.Provider value={{ open, setOpen: handleOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
};

const DialogTrigger = ({ children, asChild = false }) => {
  const { setOpen } = useContext(DialogContext);

  const handleClick = (e) => {
    children?.props?.onClick?.(e);
    setOpen(true);
  };

  if (asChild && isValidElement(children)) {
    return cloneElement(children, { onClick: handleClick });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

const DialogContent = ({ children }) => {
  const { open, setOpen } = useContext(DialogContext);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0"
        onClick={() => setOpen(false)}
      />

      {/* Content */}
      <div className="relative z-[10000] max-w-lg w-full bg-[#1d1d1d] text-white p-2 pt-10 rounded-lg shadow-lg">
        <button
          className="absolute top-4 right-4 p-2"
          onClick={() => setOpen(false)}
        >
          <XIcon />
        </button>
        {children}
      </div>
    </div>
  );
};

export { Dialog, DialogContent, DialogTrigger };

