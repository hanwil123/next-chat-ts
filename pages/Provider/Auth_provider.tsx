import { createContext, useEffect, useState } from "react";
import Cookies from "js-cookie"
import useStore from "../Penyimpanan";
import { useRouter } from "next/router";
export type UserInfo = {
    username : string;
    token : string;
    tokenuser : string;
}

export const AuthContext = createContext<{
    authenticated : boolean;
    setAuthenticated : (authenticated : boolean) => void;
    user : UserInfo 
    setUser : (user : UserInfo) => void;
}>({
    authenticated : false,
    setAuthenticated : () => {},
    user : {
        username : "",
        token : "",
        tokenuser : ""
    },
    setUser : () => {}
})
const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
    const route = useRouter();
    const token = useStore((state: any) => state.token);
    const tokenuser = useStore((state: any) => state.tokenuser);
    const username = useStore((state: any) => state.username);
    const [authenticated, setAuthenticated] = useState(false);
    const [user, setUser] = useState<UserInfo>({
      username: username,
      token: token,
      tokenuser: tokenuser,
    });
  
    useEffect(() => {
        const tokenuser = Cookies.get("jwt-user");
        if (tokenuser) {
          const user: UserInfo = JSON.parse(tokenuser);
          console.log("data user di auth provider : ", user)
          if (user) {
            setUser({
              username: user.username,
              token: user.token,
              tokenuser: user.tokenuser,
            });
          }
          setAuthenticated(true);
        }
      }, [setUser, setAuthenticated]);
      
  
    return (
      <AuthContext.Provider
        value={{
          authenticated: authenticated,
          setAuthenticated: setAuthenticated,
          user: user,
          setUser: setUser,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  };
  
  export default AuthContextProvider;
