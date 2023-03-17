import AsyncStorage from "@react-native-async-storage/async-storage";

export default class StorageManager {
  static put = async (storageKey, value) => {
    try {
      await AsyncStorage.setItem(storageKey, JSON.stringify(value));
    } catch (e) {
      console.log(e);
    }
  };

  static get = async (storageKey) => {
    try {
      const value = await AsyncStorage.getItem(storageKey);
      if (value !== null) {
        return JSON.parse(value);
      }
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  static clearStore = async () => {
    await AsyncStorage.clear();
  };
}
