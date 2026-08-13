import { createContext, useContext, useState } from "react";
import { router } from "expo-router";
import {
  login as loginApi,
  register as registerApi
} from "../api/axios";
import { saveToken, removeToken } from "../asyncstorg/storage";


// Create a React Context for authentication
const AuthContext = createContext(null);


// AuthProvider is the component that provides authentication
export function AuthProvider({ children }) {

  // Store the currently logged-in user
  // Initially there is no user, so it is null
  const [user, setUser] = useState(null);

  // Store whether a login/register request is currently running
  const [loading, setLoading] = useState(false);

  // Store an authentication error message.
  const [error, setError] = useState(null);


  // log the user
  const login = async (data) => {

    // Tell the UI that the login request has started
    setLoading(true);

    // Clear any previous error message
    setError(null);

    try {

      // Send the login information to the backend
      const { data: result } = await loginApi(data);


      // Save the JWT token returned by the backend to local storage
      await saveToken(result.token);


      // Save the logged-in user's information in React state
      setUser(result.user);


      // After successful login, navigate to the main
      router.replace("/(app)");

    } catch (err) {
      setError(err.response?.data?.error || "Login failed");

    } finally {

      // Whether login succeeds or fails, stop the loading state.
      setLoading(false);
    }
  };


                //register 
  const register = async (data) => {

    //registration has started
    setLoading(true);

    // Clear any previous error.
    setError(null);

    try {

      // Send the registration data to the backend
      await registerApi(data);

      // send the user to the login screen
      router.replace("/(auth)/login");

    } catch (err) {
      setError(
        err.response?.data?.error || "Registration failed"
      );

    } finally {

      
      setLoading(false);
    }
  };


  //logout.
  const logout = async () => {

    // Delete the JWT token from local storage
    await removeToken();

    // Remove the user from React state
    setUser(null);

    // Send the user back to the login screen
    router.replace("/(auth)/login");
  };


  // Provide authentication data and functions
  // to all components inside AuthProvider
  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


// Custom hook used by components to access AuthContext.
//
// Instead of writing:
// useContext(AuthContext)
//
// You can simply write:
// const { user, login, logout } = useAuth();
export function useAuth() {
  return useContext(AuthContext);
}