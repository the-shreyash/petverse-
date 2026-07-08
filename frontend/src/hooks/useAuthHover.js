import { useContext } from "react";
import { AuthHoverContext } from "@/contexts/AuthHoverContextObject";

export const useAuthHover = () => {
  const context = useContext(AuthHoverContext);

  if (!context) {
    return { isHoveringButton: false, setIsHoveringButton: () => {} };
  }

  return context;
};
