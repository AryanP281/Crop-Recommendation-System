import React from "react";
import { StyleSheet } from "react-native";
import { Button, useTheme } from "react-native-paper";

const SubmitButton = ({ label, loading, onClick, style, disabled }) => {
  const { colors } = useTheme();
  return (
    <Button
      mode="contained"
      onPress={onClick}
      disabled={disabled}
      loading={loading}
      color={colors.secondary}
      style={{
        ...styles.button,
        ...style,
      }}
    >
      {label}
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    width: "75%",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
});
export default SubmitButton;
