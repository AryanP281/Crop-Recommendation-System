import React, { memo, useContext, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Background from "../components/Background.js";
import Header from "../components/Header";
import TextInput from "../components/TextInput";
import {
  emailValidator,
  emptyValidator,
  phoneValidator,
} from "../utils/validators";
import { useTheme } from "react-native-paper";
import { useTranslation } from "react-i18next";
import SubmitButton from "../components/SubmitButton.js";
import { GlobalContext } from "../auth/GlobalProvider.js";

const SignupScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { signUp, loading } = useContext(GlobalContext);
  //['id', 'first_name', 'last_name', 'email','username','contact_no','password']
  const [name, setName] = useState({ value: "", error: "" });
  const [email, setEmail] = useState({ value: "", error: "" });
  const [username, setUserName] = useState({ value: "", error: "" });
  const [contact_no, setContactNo] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });

  const _onSignUpPressed = () => {
    const nameError = emptyValidator(name.value, t("NameEmpty"));
    const emailError = emailValidator(
      email.value,
      t("EmailEmpty"),
      t("EmailInValid")
    );
    const passwordError = emptyValidator(password.value, t("PasswordEmpty"));
    const usernameError = emptyValidator(username.value, t("UserNameEmpty"));
    const phoneError = phoneValidator(
      contact_no.value,
      t("PhoneEmpty"),
      t("PhoneInValid")
    );

    if (
      emailError ||
      passwordError ||
      nameError ||
      usernameError ||
      phoneError
    ) {
      setName({ ...name, error: nameError });
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      setUserName({ ...username, error: usernameError });
      setContactNo({ ...contact_no, error: phoneError });
      return;
    }

    signUp({
      name_f: name.value,
      email: email.value,
      username: username.value,
      contact_no: contact_no.value,
      password: password.value,
    });
  };

  return (
    <Background>
      <Header
        title={t("CreateAccount")}
        style={{ position: "absolute", top: 10, left: -30 }}
      />

      <TextInput
        label={t("Name")}
        returnKeyType="next"
        value={name.value}
        onChangeText={(text) => setName({ value: text, error: "" })}
        error={!!name.error}
        errorText={name.error}
      />

      <TextInput
        label={t("UserName")}
        returnKeyType="next"
        value={username.value}
        onChangeText={(text) => setUserName({ value: text, error: "" })}
        error={!!username.error}
        errorText={username.error}
      />

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
        label={t("Phone")}
        returnKeyType="next"
        value={contact_no.value}
        onChangeText={(text) => setContactNo({ value: text, error: "" })}
        error={!!contact_no.error}
        errorText={contact_no.error}
        textContentType="telephoneNumber"
        keyboardType="number-pad"
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

      <SubmitButton
        label={t("SignUp")}
        onClick={_onSignUpPressed}
        loading={loading}
      />

      <View style={styles.row}>
        <Text
          style={{
            color: colors.secondary,
            marginRight: 10,
          }}
        >
          {t("HaveAccount")}?
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text
            style={{
              fontWeight: "bold",
              color: colors.primary,
              width: 50,
            }}
          >
            {t("Login")}
          </Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  button: {
    marginTop: 24,
  },
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
});

export default memo(SignupScreen);
