import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Text, useTheme } from "react-native-paper";

const InputField = ({
  style,
  text,
  setText,
  label,
  placeholder = "",
  props = {},
  children,
}) => {
  const { colors } = useTheme();
  //console.log(text);
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row" }}>
        <Text
          style={{ color: colors.primary, fontWeight: "bold", marginBottom: 8 }}
        >
          {label}
        </Text>
        {children}
      </View>
      <TextInput
        value={text}
        {...props}
        onChangeText={setText}
        style={{
          ...styles.input,
          ...style,
          borderColor: colors.disabled,
          color: colors.text,
        }}
        placeholder={placeholder}
        placeholderTextColor={colors.disabled}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    marginBottom: 15,
  },
  input: {
    height: 50,
    borderWidth: 2,
    marginLeft: 5,
    borderRadius: 5,
    paddingLeft: 10,
  },
});

export default InputField;
