import React, { memo } from "react";
import { View, StyleSheet, Text } from "react-native";
import { TextInput as Input, useTheme } from "react-native-paper";

const TextInput = ({ errorText, ...props }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Input
        selectionColor={colors.primary}
        underlineColor="transparent"
        mode="outlined"
        {...props}
      />
      {errorText ? (
        <Text style={{ ...styles.error, color: colors.error }}>
          {errorText}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 12,
  },
  error: {
    fontSize: 14,
    paddingHorizontal: 4,
    paddingTop: 4,
  },
});

export default memo(TextInput);
