import React, { useEffect, useState } from "react";
import { useSSR, useTranslation } from "react-i18next";
import { View, StyleSheet, FlatList, ToastAndroid } from "react-native";
import { FAB, useTheme } from "react-native-paper";
import Header from "../components/Header";
import HistoryCard from "../components/HistoryCard";
import { deleteHistoryRecord, getMyHistory } from "../utils/farmerAPI";

const ViewHistoryScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getMyHistory(setHistory);
    });

    return unsubscribe;
  }, [navigation]);

  // useEffect(() => {
  //   console.log(history);
  // }, [history]);

  const deleteRecord = async (id) => {
    if (await deleteHistoryRecord(id)) {
      setHistory((h) => h.filter((i) => i.id !== id));
      return ToastAndroid.show("Deleted Record", ToastAndroid.SHORT);
    }
    ToastAndroid.show("Failed to Delete Record", ToastAndroid.SHORT);
  };

  return (
    <View style={styles.container}>
      <Header title={t("ViewHistory")} />
      <FlatList
        data={history}
        keyExtractor={(x, i) => i.toString()}
        renderItem={({ item, index }) => (
          <HistoryCard
            data={item}
            index={index + 1}
            deleteRecord={() => deleteRecord(item.id)}
          />
        )}
      />
      <FAB
        icon="plus"
        style={{
          ...styles.fab,
          backgroundColor: colors.backgroundLight,
        }}
        onPress={() => navigation.navigate("EditHistory", { editing: false })}
      />
    </View>
  );
};

export default ViewHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
