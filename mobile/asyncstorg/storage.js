import AsyncStorage from "@react-native-async-storage/async-storage";

//a constant for the key used to store the authentication token
const TOKEN_KEY = "chatbit_token";

// Save the authentication token to AsyncStorage
export async function saveToken(token) {
  // Store the token using "chatbit_token" as the key
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

// Get the authentication token from AsyncStorage
export async function getToken() {
  // Retrieve and return the token stored under "chatbit_token"
  return await AsyncStorage.getItem(TOKEN_KEY);
}

// Remove the authentication token from AsyncStorage
export async function removeToken() {
  // Delete the token from local storage
  await AsyncStorage.removeItem(TOKEN_KEY);
}