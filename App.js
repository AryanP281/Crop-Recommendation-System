import "intl-pluralrules";
import i18n from "./src/languages/i18n";

import React from "react";
import { LogBox, StatusBar } from "react-native";
import GlobalProvider from "./src/auth/GlobalProvider";
import {
  Provider as PaperProvider,
  DefaultTheme,
  configureFonts,
} from "react-native-paper";
import Navigator from "./src/controllers/Navigator";
import { NavigationContainer } from "@react-navigation/native";

// const fontConfig = {
//   default: {
//     regular: {
//       fontFamily: 'Poppins-Regular',
//       fontWeight: 'normal',
//     },
//     medium: {
//       fontFamily: 'Poppins-Medium',
//       fontWeight: 'normal',
//     },
//     light: {
//       fontFamily: 'Poppins-Light',
//       fontWeight: 'normal',
//     },
//     thin: {
//       fontFamily: 'Poppins-Thin',
//       fontWeight: 'normal',
//     },
//   },
// };

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#007500",
    secondary: "#00D100",
    accent: "#00FF00",
    disabled: "#C9D0DB",
    error: "#E41B17",
    error_light: "rgba(255, 179, 192, 0.27)",
    accent_light: "rgba(127, 218, 192, 0.27)",
    backgroundLight: "#8AFF8A",
    text: "#292D32",
    textBefore: "#F4F4F4",
    textAfter: "#738298",
    border: "#636363",
  },
  //fonts: configureFonts(fontConfig),
};

LogBox.ignoreAllLogs();

const App = () => {
  return (
    <GlobalProvider>
      <StatusBar backgroundColor={theme.colors.primary} />
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Navigator />
        </NavigationContainer>
      </PaperProvider>
    </GlobalProvider>
  );
};

export default App;
