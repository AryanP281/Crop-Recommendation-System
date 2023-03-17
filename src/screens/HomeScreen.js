import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { View, StyleSheet } from "react-native";
import SubmitButton from "../components/SubmitButton";
import * as Location from "expo-location";

const HomeScreen = ({ navigation }) => {
  const { t } = useTranslation();

  const captureDetails = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert(t("PermissionRequest"));
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    // console.log(location.coords);
    navigation.navigate("Recommendation", {
      screen: "Soil",
      params: { location },
    });
  };

  return (
    <View style={styles.container}>
      <View>
        <SubmitButton
          label={t("PictureButtonLabel")}
          onClick={captureDetails}
        />
        <View style={{ height: 30 }} />
        <SubmitButton
          label={t("HistoryButtonLabel")}
          onClick={() =>
            navigation.navigate("History", { screen: "ViewHistory" })
          }
        />
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
});
