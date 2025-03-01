import { createContext, useEffect, useState } from "react";
import axios from "axios";
import useCookie from "./hooks/useCookie";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  const userCookie = useCookie("token");

  console.log({ userCookie });

  useEffect(() => {
    if (!user) {
      axios
        .get("/profile", {
          headers: {
            Cookie: `token=${userCookie}`,
          },
        })
        .then(({ data }) => {
          // console.log({data});
          setUser(data);
          setReady(true);
        });
    }
  }, [userCookie]);
  return (
    <UserContext.Provider value={{ user, setUser, ready }}>
      {children}
    </UserContext.Provider>
  );
}
