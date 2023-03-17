import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useContext } from "react";
import { GlobalContext } from "../auth/GlobalProvider";
import Loading from "../components/Loading";
import MainTabScreen from "./MainTabScreen";
import RootStackScreen from "./RootStackScreen";

const Navigator = () => {
  const { loading, setUser, user } = useContext(GlobalContext);
  const Stack = createNativeStackNavigator();

  return loading ? (
    <Loading />
  ) : !!user ? (
    <MainTabScreen />
  ) : (
    <RootStackScreen />
  );
  // (
  //   <Stack.Navigator
  //     screenOptions={{ headerShown: false }}
  //     initialRouteName="MainTab"
  //   >
  //     <Stack.Screen name="Root" component={RootStackScreen} />
  //     <Stack.Screen name="MainTab" component={MainTabScreen} />
  //   </Stack.Navigator>
  // );
};

export default Navigator;
