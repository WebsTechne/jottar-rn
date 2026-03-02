import { Platform, ToastAndroid, Alert } from "react-native";

const showToast = (message: string) => {
  if (Platform.OS === "android") {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    Alert.alert("", message); // iOS alert fallback
  }
};

export { showToast };
