import { createContext, useContext, useState, useEffect } from "react";
import { router } from "expo-router";
import { login as loginApi, register as registerApi, getMe } from "../api/axios";
import { saveToken, removeToken, getToken } from "../asyncstorg/storage";
import { connectSocket, disconnectSocket } from "../api/socket";

// Create the context — null is the default before the Provider mounts
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // null means no one is logged in
  const [user, setUser] = useState(null);


  // show a spinner on the button
  const [loading, setLoading] = useState(false);


  //show a splash/loading screen before we know if user is logged in
  const [initialLoading, setInitialLoading] = useState(true);


  // Displayed as red text under the form
  const [error, setError] = useState(null);

                //Session restore on app boot
  // Runs once when the app starts.
  // If a token exists in AsyncStorage, fetch the user profile and reconnect
  // the socket — the user stays logged in without needing to log in again.
  useEffect(() => {
    async function loadStorageData() {
      try {
        const token = await getToken();
        

        if (token) {
          // GET /api/users/me returns { id, fullname, email, role, isOnline }
          const { data: userData } = await getMe();
          setUser(userData);

          // Reconnect the socket — the token is already in AsyncStorage
          await connectSocket();
        }
      } catch (err) {
        // Token is expired or invalid — clear everything and start fresh
        console.log("Failed to restore session:", err?.message);
        await removeToken();
        setUser(null);
      } finally {
        // Whether we found a session or not, the boot check is done
        setInitialLoading(false);
      }
    }

    loadStorageData();
  }, []);

                                 // Login
  const login = async (data) => {
    setLoading(true);
    setError(null);

    try {
      // POST /api/auth/login → returns { token, user }
      const { data: result } = await loginApi(data);

      // Save the JWT to AsyncStorage first — the socket auth callback
      // calls getToken(), so the token must exist before connectSocket()
      await saveToken(result.token);

      // Store the user in React state so all screens can access it
      setUser(result.user);

      // Now connect the socket — handshake will include the JWT
      await connectSocket();

      // Navigate to the main app screen
      router.replace("/(app)");
    } catch (err) {
      // Show the server error message (e.g. "Invalid Email or Password")
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

                                        //Register
  const register = async (data) => {
    setLoading(true);
    setError(null);

    try {
      // POST /api/auth/register — no token returned, just creates the account
      await registerApi(data);

      // Send the user to login after successful registration
      router.replace("/(auth)/login");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

                                 //Logout
  const logout = async () => {
    try {
      // Disconnect socket first — while the token still exists
      // so the server receives a clean disconnect event
      disconnectSocket();

      // Remove the JWT from AsyncStorage
      await removeToken();
    } catch (err) {
      console.log("Error during logout:", err);
    } finally {
      // Always clear the user and redirect, even if something failed above
      setUser(null);
      router.replace("/(auth)/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,          // The logged-in user object (or null)
        login,         // Call with { email, password }
        register,      // Call with { fullname, email, password, role }
        logout,        // Call with no arguments
        loading,       // True while login/register is running
        initialLoading, // True while app boot session check is running
        error,         // Last error message string (or null)
        setError,      // Let screens clear the error manually
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook — instead of writing useContext(AuthContext) in every component,
// you just write const { user, login, logout } = useAuth()
// Also throws a helpful error if used outside of AuthProvider
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}