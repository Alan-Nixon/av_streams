import React, { createContext, useContext, useEffect, useState } from 'react';
import { ContentProps, Data, UserContextValue } from './Functions/interfaces';
import { getUser } from './Functions/commonFunctions';
import Cookies from 'js-cookie';


const UserContext = createContext<UserContextValue>({
  user: null,
  setUserData: () => { },
  showHideSideBar: false,
  setShowHideSideBar: () => { },
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: ContentProps) => {

  const [user, setUser] = useState<Data | null>(null);
  const [showHideSideBar, setShowHideSideBar] = useState(true)
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser(Cookies.get('userToken') || "");
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, []);

  const setUserData = async () => {
    try {
      setUser(await getUser(Cookies.get('userToken')));
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const userContextValue: UserContextValue = {
    user,setUserData,
    showHideSideBar,setShowHideSideBar,
  };

  return (
    <UserContext.Provider value={userContextValue}>
      {children}
    </UserContext.Provider>
  );
};
