import React, { memo, useContext, useState } from "react";
import { TouchableOpacity, StyleSheet, View, Image } from "react-native";
import Header from "../components/Header";
import TextInput from "../components/TextInput";
import { Text, useTheme } from "react-native-paper";
import { emailValidator, emptyValidator } from "../utils/validators";
import SubmitButton from "../components/SubmitButton";
import { useTranslation } from "react-i18next";
import { GlobalContext } from "../auth/GlobalProvider.js";

const LoginScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { login, loading } = useContext(GlobalContext);
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });

  const _onLoginPressed = () => {
    const emailError = emailValidator(
      email.value,
      t("EmailEmpty"),
      t("EmailInValid")
    );
    const passwordError = emptyValidator(password.value, t("PasswordEmpty"));

    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }

    login(email.value, password.value);
  };

  return (
    <View style={styles.container}>
      <Header
        title={t("Welcome")}
        noArrow={true}
        // style={{ position: "absolute", top: 10 }}
      />
      <Image
        source={require("../assets/logo.jpg")}
        style={{
          alignSelf: "center",
          height: "25%",
          width: "90%",
          marginTop: 30,
        }}
      />
      <View style={{ marginTop: "10%", alignItems: "center" }}>
        <TextInput
          label={t("Email")}
          returnKeyType="next"
          value={email.value}
          onChangeText={(text) => setEmail({ value: text, error: "" })}
          error={!!email.error}
          errorText={email.error}
          autoCapitalize="none"
          autoCompleteType="email"
          textContentType="emailAddress"
          keyboardType="email-address"
        />

        <TextInput
          label={t("Password")}
          returnKeyType="done"
          value={password.value}
          onChangeText={(text) => setPassword({ value: text, error: "" })}
          error={!!password.error}
          errorText={password.error}
          secureTextEntry
        />

        {/* <View style={styles.forgotPassword}>
        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <Text style={{ color: colors.secondary }}>
            {t("ForgotPassword")}?
          </Text>
        </TouchableOpacity>
      </View> */}

        <SubmitButton
          label={t("Login")}
          onClick={_onLoginPressed}
          loading={loading}
        />

        <View style={styles.row}>
          <Text style={{ color: colors.secondary, marginRight: 10 }}>
            {t("AccountQuestion")}?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text style={{ fontWeight: "bold", color: colors.primary }}>
              {t("SignUp")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  forgotPassword: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
});

export default memo(LoginScreen);
