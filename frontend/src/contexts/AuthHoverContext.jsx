import { useState } from "react";
import { AuthHoverContext } from "./AuthHoverContextObject";

export const AuthHoverProvider = ({ children }) => {
  const [isHoveringButton, setIsHoveringButton] = useState(false);

  return (
    <AuthHoverContext.Provider value={{ isHoveringButton, setIsHoveringButton }}>
      {children}
    </AuthHoverContext.Provider>
  );
};
