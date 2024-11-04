import React, { createContext, useState, ReactNode } from "react";

interface User {
  role: string;
  id: number;
  username: string;
  email: string;
}

export interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const initialUserContext: UserContextType = {
  user: null,
  setUser: () => {},
};

export const UserContext = createContext<UserContextType>(initialUserContext);

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
