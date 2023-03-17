import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Text } from "react-native-paper";
import Header from "../components/Header";
import { width } from "../Constants";
import * as ImagePicker from "expo-image-picker";
import { Button } from "react-native-paper";
import SubmitButton from "../components/SubmitButton";
import InputField from "../components/InputField";
import { fetchRecommendations } from "../utils/farmerAPI";

const SoilScreen = ({ route, navigation }) => {
  const { t } = useTranslation();
  const { location } = route.params;
  const [loading, setLoading] = useState(false);
  const [pickedImagePath, setPickedImagePath] = useState("");
  const [N, setN] = useState("");
  const [P, setP] = useState("");
  const [K, setK] = useState("");
  const [Ph, setPh] = useState("");

  const ImageCard = ({ uri }) => {
    const deleteImg = () => {
      setPickedImagePath("");
    };

    return (
      <View
        style={{
          width: width / 1.5,
          height: width / 1.5,
        }}
      >
        <Image
          source={{ uri }}
          style={{
            borderRadius: 10,
            width: "100%",
            height: "100%",
          }}
        />
        <TouchableOpacity style={styles.crossContainer} onPress={deleteImg}>
          <Text style={{ color: "white" }}>X</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // This function is triggered when the "Select an image" button pressed
  const showImagePicker = async () => {
    // Ask the user for the permission to access the media library
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    // Explore the result
    console.log(result);

    if (!result.canceled) {
      setPickedImagePath(result.assets[0].uri);
      console.log(result.assets[0].uri);
    }
  };

  // This function is triggered when the "Open camera" button pressed
  const openCamera = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    // Explore the result
    console.log(result);

    if (!result.canceled) {
      setPickedImagePath(result.assets[0].uri);
      console.log(result.assets[0].uri);
    }
  };

  const getRecommendation = async () => {
    setLoading(true);
    try {
      let res = await fetchRecommendations(pickedImagePath, {
        N,
        P,
        K,
        Ph,
        lat: location.coords.latitude,
        lon: location.coords.longitude,
      });
      navigation.navigate("ViewRecommendations", { data: res });
    } catch (error) {
      alert(error.message);
    }
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Header title={t("DetailSoil")} />
      <View style={styles.photoContainer}>
        {!!pickedImagePath ? (
          <View>
            <ImageCard uri={pickedImagePath} />
            <SubmitButton
              label={t("Upload")}
              style={{ marginTop: 10 }}
              onClick={getRecommendation}
              loading={loading}
            />
          </View>
        ) : (
          <View style={{ flexDirection: "row" }}>
            <Button onPress={showImagePicker}>{t("PickFile")}</Button>
            <Button onPress={openCamera}>{t("ClickImage")}</Button>
          </View>
        )}
      </View>
      {!pickedImagePath && (
        <Text style={{ fontSize: 26, alignSelf: "center" }}>{t("Or")}</Text>
      )}
      {!pickedImagePath && (
        <View>
          <InputField
            label={t("Nitrogen")}
            text={N}
            setText={setN}
            props={{ keyboardType: "numeric" }}
          />
          <InputField
            label={t("Phosphorus")}
            text={P}
            setText={setP}
            props={{ keyboardType: "numeric" }}
          />
          <InputField
            label={t("Potassium")}
            text={K}
            setText={setK}
            props={{ keyboardType: "numeric" }}
          />
          <InputField
            label={t("PH")}
            text={Ph}
            setText={setPh}
            props={{ keyboardType: "numeric" }}
          />
          <SubmitButton
            label={t("UploadData")}
            style={{ marginTop: 10 }}
            onClick={getRecommendation}
            loading={loading}
          />
        </View>
      )}
    </ScrollView>
  );
};

export default SoilScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  photoContainer: {
    borderWidth: 3,
    borderColor: "#7D7D7D",
    borderRadius: 10,
    padding: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  crossContainer: {
    backgroundColor: "black",
    width: 20,
    height: 20,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 0,
  },
});
