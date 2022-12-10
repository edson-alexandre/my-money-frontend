import React, { createContext, ReactNode, useState } from "react";
import { useLocalStorage } from "../../hooks/providers/useLocalStorage";

type UserType = {
  name: string;
  email: string;
  token: string;
  logged: boolean;
};

type PropsUserContext = {
  state: UserType;
  setState: React.Dispatch<React.SetStateAction<UserType>>;
};

const DEFAULT_VALUE = {
  state: {
    name: "",
    email: "",
    token: "",
    logged: false,
  },
  setState: () => {},
};

const UserContext = createContext<PropsUserContext>(DEFAULT_VALUE);

const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const localStorage = useLocalStorage();
  const auth = localStorage.getItem("auth");
  const logged = localStorage.getItem("logged");
  const { name, email } = auth?.user || {};
  const { accessToken: token } = auth;

  const [state, setState] = useState({
    name,
    email,
    token,
    logged,
  });

  return (
    <UserContext.Provider
      value={{
        state,
        setState,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContextProvider };
export default UserContext;
