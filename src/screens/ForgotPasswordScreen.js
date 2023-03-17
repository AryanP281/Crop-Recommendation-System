import React, { memo, useState } from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";
import { emailValidator } from "../utils/validators";
import Background from "../components/Background";
import Header from "../components/Header";
import TextInput from "../components/TextInput";
import { useTheme } from "react-native-paper";
import { useTranslation } from "react-i18next";
import SubmitButton from "../components/SubmitButton";

const ForgotPasswordScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [email, setEmail] = useState({ value: "", error: "" });

  const _onSendPressed = () => {
    const emailError = emailValidator(
      email.value,
      t("EmailEmpty"),
      t("EmailInValid")
    );

    if (emailError) {
      setEmail({ ...email, error: emailError });
      return;
    }

    navigation.navigate("Login");
  };

  return (
    <Background>
      <Header>{t("RstrPass")}</Header>

      <TextInput
        label={t("Email")}
        returnKeyType="done"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: "" })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />

      <SubmitButton label={t("Reset Password")} onClick={_onSendPressed} />

      <TouchableOpacity
        style={styles.back}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={{ color: colors.secondary, width: "100%" }}>
          ← {t("ToLogin")}
        </Text>
      </TouchableOpacity>
    </Background>
  );
};

const styles = StyleSheet.create({
  back: {
    width: "100%",
    marginTop: 12,
  },
  button: {
    marginTop: 12,
  },
});

export default memo(ForgotPasswordScreen);
