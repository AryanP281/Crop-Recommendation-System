import React from "react";
import { View, StyleSheet, Image } from "react-native";
import {
  Card,
  Paragraph,
  Subheading,
  Text,
  useTheme,
} from "react-native-paper";

const Data = ({ title, value }) => {
  return (
    <View>
      <Paragraph style={{ fontWeight: "bold" }}>{title}:- </Paragraph>
      <Paragraph numberOfLines={4}>{value}</Paragraph>
    </View>
  );
};

const CropCard = ({ name, img, description, score }) => {
  const { colors } = useTheme();

  const Score = ({ title, value }) => {
    return (
      <View>
        <Text style={{ fontWeight: "bold" }}>{title}</Text>
        <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
          <Text style={{ fontSize: 16, color: colors.accent }}>{value}</Text>
          <Text
            style={{ fontSize: 12, color: colors.textAfter, marginLeft: 5 }}
          >
            /100
          </Text>
        </View>
      </View>
    );
  };
  // console.log(description);
  return (
    <Card style={styles.container}>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Image
          source={{ uri: img }}
          style={{
            height: "100%",
            width: "40%",
            borderRadius: 10,
            //borderTopLeftRadius: 10,
          }}
        />
        <View style={{ flex: 1, alignItems: "center", paddingVertical: 10 }}>
          <Subheading
            style={{
              fontWeight: "bold",
              width: "100%",
              textAlign: "center",
              color: colors.textAfter,
            }}
          >
            {name}
          </Subheading>
          <Data title={"Description"} value={description.replace("�", " ")} />
          {/* <Score title={"Score"} value={score} /> */}
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "96%",
    alignSelf: "center",
    borderRadius: 10,
    marginVertical: 5,
  },
});
export default CropCard;
