import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import CameraScreen from "../screens/CameraScreen";
import CreateEditHistory from "../screens/CreateEditHistory";
import HomeScreen from "../screens/HomeScreen";
import RecommendationScreen from "../screens/RecommendationScreen";
import SoilScreen from "../screens/SoilScreen";
import ViewHistoryScreen from "../screens/ViewHistoryScreen";

const RecommendationStack = createNativeStackNavigator();
const HistoryStack = createNativeStackNavigator();

const MainTabScreen = (props) => {
  const MainTab = createNativeStackNavigator();

  return (
    <MainTab.Navigator screenOptions={{ headerShown: false }}>
      <MainTab.Screen name="Home" component={HomeScreen} />
      <MainTab.Screen
        name="Recommendation"
        component={RecommendationStackScreen}
      />
      <MainTab.Screen name="History" component={HistoryStackScreen} />
    </MainTab.Navigator>
  );
};

const RecommendationStackScreen = () => {
  return (
    <RecommendationStack.Navigator screenOptions={{ headerShown: false }}>
      <RecommendationStack.Screen name="Soil" component={SoilScreen} />
      <RecommendationStack.Screen name="Upload" component={CameraScreen} />
      <RecommendationStack.Screen
        name="ViewRecommendations"
        component={RecommendationScreen}
      />
    </RecommendationStack.Navigator>
  );
};

const HistoryStackScreen = () => {
  return (
    <HistoryStack.Navigator screenOptions={{ headerShown: false }}>
      <HistoryStack.Screen name="ViewHistory" component={ViewHistoryScreen} />
      <HistoryStack.Screen name="EditHistory" component={CreateEditHistory} />
    </HistoryStack.Navigator>
  );
};

export default MainTabScreen;
