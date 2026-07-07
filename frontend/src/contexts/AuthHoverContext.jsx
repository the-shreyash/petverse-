import { createContext, useContext, useState } from "react";

const AuthHoverContext = createContext();

export const AuthHoverProvider = ({ children }) => {
  const [isHoveringButton, setIsHoveringButton] = useState(false);

  return (
    <AuthHoverContext.Provider value={{ isHoveringButton, setIsHoveringButton }}>
      {children}
    </AuthHoverContext.Provider>
  );
};

export const useAuthHover = () => {
  const context = useContext(AuthHoverContext);
  if (!context) {
    return { isHoveringButton: false, setIsHoveringButton: () => {} };
  }
  return context;
};
