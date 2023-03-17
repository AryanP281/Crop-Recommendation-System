import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  ToastAndroid,
} from "react-native";
import { Text, TextInput, useTheme } from "react-native-paper";
import Header from "../components/Header";
import InputField from "../components/InputField";
import { GlobalContext } from "../auth/GlobalProvider";
import DropDownPicker from "react-native-dropdown-picker";
import SubmitButton from "../components/SubmitButton";
import { createEditHistory } from "../utils/farmerAPI";

const CreateEditHistory = ({ route, navigation }) => {
  const { colors } = useTheme();
  const { crops } = useContext(GlobalContext);
  const { t } = useTranslation();
  const { editing, data } = route.params;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sowing_month, setSowingMonth] = useState(
    editing ? data.sowing_month : ""
  );
  const [harvest_month, setHarvestMonth] = useState(
    editing ? data.harvest_month : ""
  );
  const [crop, setCrop] = useState(editing ? data.crop : "");
  const [actual, setActual] = useState(editing ? data.actual : "");
  const [expected, setExpected] = useState(editing ? data.expected : "");
  const [year, setYear] = useState(editing ? data.year : "");

  // useEffect(() => {
  //   console.log({
  //     sowing_month,
  //     harvest_month,
  //     year,
  //     crop,
  //     actual,
  //     expected,
  //   });
  // }, []);
  const onSubmit = async () => {
    setLoading(true);
    if (
      await createEditHistory(
        editing,
        {
          sowing_month,
          harvest_month,
          year,
          crop,
          actual,
          expected,
        },
        data?.id
      )
    ) {
      ToastAndroid.show(
        t(editing ? "EditSuccess" : "CreateSuccess"),
        ToastAndroid.SHORT
      );
      navigation.goBack();
    } else
      ToastAndroid.show(
        t(editing ? "EditFail" : "CreateFail"),
        ToastAndroid.SHORT
      );

    setLoading(false);
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <Header title={t(editing ? "EditHistory" : "CreateHistory")} />
      <ScrollView style={{ padding: 20 }}>
        <InputField
          label={t("SowingM")}
          placeholder={"MM"}
          value={`${sowing_month}"`}
          setText={setSowingMonth}
        />
        <InputField
          label={t("HarvestM")}
          placeholder={"MM"}
          value={harvest_month}
          setText={setHarvestMonth}
        />
        <InputField
          label={t("Year")}
          placeholder={"YYYY"}
          value={year}
          setText={setYear}
        />
        <InputField
          label={t("Actual")}
          placeholder={"in tonnes per hectare"}
          value={actual}
          setText={setActual}
        />
        <InputField
          label={t("Expected")}
          placeholder={"in tonnes per hectare"}
          value={expected}
          setText={setExpected}
        />
        <View
          style={{
            marginHorizontal: 10,
            marginBottom: 15,
          }}
        >
          <Text
            style={{
              color: colors.primary,
              fontWeight: "bold",
              marginBottom: 8,
            }}
          >
            {t("CropSelection")}
          </Text>
          <DropDownPicker
            open={open}
            searchable={true}
            style={{
              ...styles.input,
              borderColor: colors.disabled,
              color: colors.text,
            }}
            value={crop}
            items={Object.entries(crops).map((i) => {
              return { value: i[0], label: i[1] };
            })}
            setOpen={setOpen}
            setValue={setCrop}
          />
        </View>
        <SubmitButton
          label={t(editing ? "Save" : "Create")}
          onClick={onSubmit}
          loading={loading}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreateEditHistory;

const styles = StyleSheet.create({
  container: { flex: 1 },
  input: {
    height: 50,
    borderWidth: 2,
    marginLeft: 5,
    borderRadius: 5,
    paddingLeft: 10,
  },
});
