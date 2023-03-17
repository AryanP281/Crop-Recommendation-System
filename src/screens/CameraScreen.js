import React, { useEffect, useRef, useState } from "react";
import { Camera, CameraType } from "expo-camera";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CameraPreview from "../components/CameraPreview";
import { useTheme } from "react-native-paper";
import Loading from "../components/Loading";

const CameraScreen = ({ navigation, route }) => {
  const { location } = route.params;
  const [startCamera, setStartCamera] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraType, setCameraType] = useState(CameraType.back);
  const [flashMode, setFlashMode] = useState("off");
  const [clicking, setClicking] = useState(false);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const _camera = useRef(null);
  const { colors } = useTheme();

  const __startCamera = async () => {
    const { status } = await requestPermission();
    console.log(status);
    if (status === "granted") {
      setStartCamera(true);
    } else {
      Alert.alert("Access denied");
    }
  };
  const __takePicture = async () => {
    setClicking(true);
    const photo = await _camera.current.takePictureAsync();
    // console.log(photo);
    setPreviewVisible(true);
    //setStartCamera(false)
    setCapturedImage(photo);
    setClicking(false);
  };
  const __savePhoto = () => {
    navigation.navigate("Soil", { Img: capturedImage });
  };
  const __retakePicture = () => {
    setCapturedImage(null);
    setPreviewVisible(false);
    __startCamera();
  };
  const __handleFlashMode = () => {
    if (flashMode === "on") {
      setFlashMode("off");
    } else if (flashMode === "off") {
      setFlashMode("on");
    } else {
      setFlashMode("auto");
    }
  };
  const __switchCamera = () => {
    if (cameraType === "back") {
      setCameraType("front");
    } else {
      setCameraType("back");
    }
  };

  useEffect(() => {
    __startCamera();
    console.log("Geolocation:- ", location);
  }, []);

  return !startCamera ? null : (
    <View style={styles.container}>
      {previewVisible && capturedImage ? (
        <CameraPreview
          photo={capturedImage}
          savePhoto={__savePhoto}
          retakePicture={__retakePicture}
        />
      ) : (
        <View style={{ flex: 1 }}>
          <Camera
            ref={_camera}
            type={cameraType}
            flashMode={flashMode}
            style={{ flex: 0.8 }}
          >
            <View style={styles.cameraView}>
              <View style={styles.optionsView}>
                <TouchableOpacity
                  onPress={__handleFlashMode}
                  style={{
                    ...styles.flashBtn,
                    backgroundColor: flashMode === "off" ? "#000" : "#fff",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                    }}
                  >
                    ⚡️
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={__switchCamera}
                  style={styles.switchBtn}
                >
                  <Text
                    style={{
                      fontSize: 20,
                    }}
                  >
                    {cameraType === "front" ? "🤳" : "📷"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Camera>
          <View style={styles.bottomBar}>
            {clicking ? (
              <Loading />
            ) : (
              <TouchableOpacity
                onPress={__takePicture}
                style={styles.captureBtn}
              />
            )}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  optionsView: {
    position: "absolute",
    left: "5%",
    top: "10%",
    justifyContent: "space-between",
  },
  cameraView: {
    flex: 1,
    width: "100%",
    backgroundColor: "transparent",
    flexDirection: "row",
  },
  captureBtn: {
    width: 70,
    height: 70,
    borderRadius: 50,
    backgroundColor: "#fff",
    alignSelf: "center",
  },
  bottomBar: {
    flex: 0.2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
    width: "100%",
  },
  switchBtn: {
    marginTop: 20,
    borderRadius: 100,
    height: 25,
    width: 25,
  },
  flashBtn: { borderRadius: 100, height: 25, width: 25 },
});

export default CameraScreen;
