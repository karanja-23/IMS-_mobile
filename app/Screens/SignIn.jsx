import {
  View,
  Text,
  StyleSheet,
  Platform,
  Dimensions,
  StatusBar,
  Image,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
} from "react-native";
import colors from "../config/colors";
import { useEffect, useState } from "react";
import { UserContext } from "../Contexts/userContext";
import { useContext } from "react";
import Loading from "../Components/Loading";
import { ActivityIndicator } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import * as Notifications from "expo-notifications";

function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const { user, setUser, setExpoToken, expoToken } = useContext(UserContext);
  const [passwordError, setPasswordError] = useState(false);
  const { Token, setToken, data, setData } = useContext(UserContext);
  const navigate = useNavigation();
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin(email, password) {
    setIsLoading(true);
    if (!email || !password) {
      Alert.alert(
        "Error !",
        "Please fill in all fields",
        [
          {
            text: "OK",
            onPress: () => {
              navigate.navigate("SignIn");
              setIsLoading(false);
            },
          },
        ],
        { cancelable: false }
      );
      return;
    }

    fetch("http://172.236.2.18:5000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setIsLoading(false);
          setEmailError(true);
        } else {
          if (data.access_token) {
            SecureStore.setItemAsync("access_token", data.access_token);
            setToken(data.access_token);
            const getExpoToken = async () => {
              const token = await Notifications.getExpoPushTokenAsync();
              if (token) {
                SecureStore.setItemAsync("expo_token", token.data);
                setExpoToken(token.data);
              }
            };
            getExpoToken();
            async function updateUser() {
              fetch(`http://172.236.2.18:5000/users/protected/user`, {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${data.access_token}`,
                  "Content-Type": "application/json",
                },
              })
                .then((response) => response.json())
                .then((data) => {
                  if (data) {
                    setUser(data);
                    setData(data.requests);
                  }
                });
            }

            Promise.all(updateUser())
              .then(() => {
                setTimeout(() => {
                  navigate.navigate("Home");
                }, 1000);
              })
              .catch((error) => {
                console.error(error);
              });
          } else {
            setIsLoading(false),
              Alert.alert(
                "Error !",
                "Invalid Credentials!",
                [
                  {
                    text: "OK",
                    onPress: () => {
                      navigate.navigate("SignIn");
                    },
                  },
                ],
                { cancelable: false }
              );
          }
        }
      });
  }
  useEffect(() => {
    if (emailError) {
      setIsLoading(false),
        Alert.alert(
          "Error !",
          "Invalid email or password!",
          [
            {
              text: "OK",
              onPress: () => {
                navigate.navigate("SignIn");
                setEmailError(false);
              },
            },
          ],
          { cancelable: false }
        );
    }
  }, [emailError]);

  useEffect(() => {
    if (passwordError) {
      setIsLoading(false),
        Alert.alert(
          "Error !",
          "Invalid password!",
          [
            {
              text: "OK",
              onPress: () => {
                navigate.navigate("SignIn");
                setPasswordError(false);
              },
            },
          ],
          { cancelable: false }
        );
    }
  }, [passwordError]);

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image style={styles.logo} source={require("../assets/logo.png")} />
        <Text style={styles.welcomeText}>Welcome to Moringa School IMS ! </Text>
      </View>
      <View style={styles.formContainer}>
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            marginTop: 20,
            gap: 20,
            backgroundColor: colors.white,
          }}
        >
          <Text
            style={{
              width: "100%",
              fontSize: 21,
              fontWeight: "bold",
              color: colors.blue,
              textAlign: "center",
              marginBottom: 10,
              opacity: 0.85,
            }}
          >
            Sign in to your account
          </Text>
          <View>
            <Text style={styles.label}>Email</Text>
            <TextInput
              placeholder="john doe@gmail.com"
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={styles.formField}
            ></TextInput>
          </View>
          <View>
            <Text style={styles.label}>Password</Text>
            <View style={styles.formField}>
              <TextInput
                placeholder="enter your password ..."
                value={password}
                onChangeText={(text) => setPassword(text)}
                style={{ flex: 1, paddingRight: 30 }}
                secureTextEntry={!showPassword}
              ></TextInput>
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: 0,
                  top: 0,
                  bottom: 0,
                  justifyContent: "center",
                  marginRight: 10,
                }}
              >
                <MaterialIcons
                  name={showPassword ? "visibility-off" : "visibility"}
                  size={16}
                  color={colors.grey}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={{ width: "70%", alignSelf: "center", marginTop: 40 }}>
          <Button
            style={styles.button}
            title={isLoading ? "loading ..." : "Sign In"}
            titleStyle={styles.buttonText}
            color={colors.orange}
            onPress={() => {
              setIsLoading(true);
              handleLogin(email, password);
            }}
          ></Button>
        </View>
      </View>
    </View>
  );
}
const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;
const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    flex: 1,
    flexDirection: "column",
    backgroundColor: colors.darkerShadeOfWhite,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
    paddingTop: Platform.OS === "ios" ? 40 : 20,
  },
  imageContainer: {
    flexDirection: "column",
    width: "100%",
    height: 160,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.darkerShadeOfWhite,
    gap: 10,
    paddingBottom: 20,
  },
  logo: {
    width: "70%",
    height: 100,
    resizeMode: "contain",
  },
  welcomeText: {
    width: "80%",
    fontSize: 18,
    fontWeight: "900",
    color: colors.blue,
    textAlign: "center",
    textShadowColor: colors.darkerShadeOfWhite,
    textShadowRadius: 4,
    textShadowOffset: { width: 0.5, height: 0.5 },
    opacity: 0.79,
  },
  formContainer: {
    width: "100%",
    height: height - 230,
    backgroundColor: colors.white,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 0,
    padding: 20,
    paddingTop: height * 0.033,
    opacity: 0.99,
    marginTop: height * 0.03,
  },
  formField: {
    width: width - 100,
    backgroundColor: `rgba(7, 1, 58, 0.2)`,
    height: 37,
    paddingLeft: 25,
    color: colors.black,
    marginBottom: 0,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors.darkerShadeOfWhite,
  },
  label: {
    marginBottom: 5,
    fontSize: 15,
    fontWeight: "bold",
    color: "#716B6B",
    marginLeft: 2,
  },
  button: {
    width: "70%",
    height: 40,
    backgroundColor: colors.orange,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    color: colors.white,
    fontWeight: 900,
  },
});
export default SignIn;
