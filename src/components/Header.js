import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";
import { IconButton, Text } from "react-native-paper";

const Header = ({ title, style, noArrow }) => {
  const navigation = useNavigation();

  return (
    <View style={{ flexDirection: "row", alignItems: "center", ...style }}>
      {!noArrow && (
        <IconButton
          icon={"chevron-left"}
          size={30}
          onPress={navigation.goBack}
        />
      )}
      <Text style={{ fontWeight: "bold", fontSize: 20, margin: 10 }}>
        {title}
      </Text>
    </View>
  );
};

export default Header;
