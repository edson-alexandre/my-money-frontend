import React, { ReactNode } from 'react';
import { MenuContextProvider } from './menu/MenuContext';
import { UserContextProvider } from './user/UserContext';

const GlobalContext = ({ children }: { children: ReactNode }) => {
  return (
    <MenuContextProvider>
      <UserContextProvider>{children}</UserContextProvider>
    </MenuContextProvider>
  );
};

export default GlobalContext;
