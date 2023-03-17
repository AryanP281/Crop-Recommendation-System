import React, { createContext, useState } from "react";
import StorageManager from "../storage/StorageManager";
import API, { ENDPOINTS } from "../api/apiService";
import { API_TOKEN } from "../storage/StorageKeys";

export const GlobalContext = createContext();

const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [crops, setCrops] = useState({
    0: "apple",
    1: "banana",
    2: "blackgram",
    3: "chickpea",
    4: "coconut",
    5: "coffee",
    6: "cotton",
    7: "grapes",
    8: "jute",
    9: "kidneybeans",
    10: "lentil",
    11: "maize",
    12: "mango",
    13: "mothbeans",
    14: "mungbean",
    15: "muskmelon",
    16: "orange",
    17: "papaya",
    18: "pigeonpeas",
    19: "pomegranate",
    20: "rice",
    21: "watermelon",
  });

  return (
    <GlobalContext.Provider
      value={{
        user,
        setUser,
        loading,
        setLoading,
        crops,
        setCrops,

        login: async (email, password) => {
          setLoading(true);
          console.log(password);
          try {
            let res = await API.post(ENDPOINTS.LOGIN, { email, password });
            console.log(res);
            if (res.success) {
              delete res.success;
              delete res.message;
              await StorageManager.put(API_TOKEN, res.token);
              setUser(res);
            }
          } catch (error) {
            console.log("Error in logging In");
          }
          setLoading(false);
        },
        signUp: async (body) => {
          setLoading(true);
          try {
            let res = await API.post(ENDPOINTS.REGISTER, body);
            if (res.success) {
              delete res.success;
              delete res.message;
              await StorageManager.put(API_TOKEN, res.token);
              setUser(res);
            }
          } catch (error) {
            console.log("Error in registering");
          }
          setLoading(false);
        },
        signOut: async () => {
          setLoading(true);
          try {
            await API.get(ENDPOINTS.LOGOUT, true);
            setUser(null);
            await StorageManager.clearStore();
          } catch (error) {
            console.log("Error in signing out");
          }
          setLoading(false);
        },
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
