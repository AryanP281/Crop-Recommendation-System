import { useNavigation } from "@react-navigation/native";
import React, { useContext, useState } from "react";
import { View, StyleSheet } from "react-native";
import {
  Subheading,
  Text,
  Card,
  Title,
  IconButton,
  ActivityIndicator,
} from "react-native-paper";
import { GlobalContext } from "../auth/GlobalProvider";

const Field = ({ detail, value = "<Value>", unit }) => {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Text style={{ fontWeight: "bold", fontSize: 18 }}>{detail} : </Text>
      <Text style={{ fontSize: 16 }}>
        {value} {unit || ""}
      </Text>
    </View>
  );
};

const HistoryCard = ({ index = 1, data, deleteRecord }) => {
  const navigation = useNavigation();
  const [deleting, setDeleting] = useState(false);
  const { crops } = useContext(GlobalContext);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <Card style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Title>{index}. </Title>
        <View style={{ margin: -5, flexDirection: "row" }}>
          <IconButton
            icon={"pencil"}
            onPress={() =>
              navigation.navigate("EditHistory", { editing: true, data })
            }
          />
          {deleting ? (
            <ActivityIndicator size={"small"} />
          ) : (
            <IconButton
              icon={"delete"}
              onPress={async () => {
                setDeleting(true);
                await deleteRecord();
                setDeleting(false);
              }}
            />
          )}
        </View>
      </View>
      <Field detail={"Crop"} value={crops[data.crop]} />
      <Field
        detail={"Sowing Date"}
        value={monthNames[data.sowing_month - 1] + ` ${data.year}`}
      />
      <Field
        detail={"Harvest Date"}
        value={monthNames[data.harvest_month - 1] + ` ${data.year}`}
      />
      <Field detail={"Expected Harvest"} value={data.expected} />
      <Field detail={"Actual Harvest"} value={data.actual} />
    </Card>
  );
};

export default HistoryCard;

const styles = StyleSheet.create({
  container: {
    width: "90%",
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal: 10,
    // borderWidth: 2,
    // borderRadius: 15,
    alignSelf: "center",
  },
});
