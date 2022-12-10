import React, { createContext, ReactNode, useState } from 'react';

type MenuType = {
  isVisible: boolean;
};

type PropsMenuContext = {
  state: MenuType;
  setState: React.Dispatch<React.SetStateAction<MenuType>>;
};

const DEFAULT_VALUE = {
  state: {
    isVisible: true,
  },
  setState: () => {},
};

const MenuContext = createContext<PropsMenuContext>(DEFAULT_VALUE);

const MenuContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState(DEFAULT_VALUE.state);

  return (
    <MenuContext.Provider
      value={{
        state,
        setState,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export { MenuContextProvider };
export default MenuContext;
