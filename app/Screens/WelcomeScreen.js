import { useEffect } from "react";
import { ImageBackground, StyleSheet, Image, View, Text } from "react-native";
import * as SecureStore from "expo-secure-store";
import { UserContext } from "../Contexts/userContext";
import { useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { ActivityIndicator } from 'react-native'
import { Colors } from "react-native/Libraries/NewAppScreen";
import colors from "../config/colors";
import * as Notifications from 'expo-notifications';

function WelcomeScreen({ navigation }) {
  const { setUser, user, setToken, setData , setExpoToken} = useContext(UserContext);
  
  const navigate = useNavigation();
  useEffect(() => {
    async function checkToken() {
      try {
        const token = await SecureStore.getItemAsync("access_token");
        const getExpoTokenFromStorage = async () => {
          const expoToken = await SecureStore.getItemAsync('expo_token');
          if (expoToken) {
            setExpoToken(expoToken);
            console.log(expoToken);
          }
        }
        getExpoTokenFromStorage();
        if (token) {
          setToken(token);   
            
          fetch(`http://172.236.2.18:5000/users/protected/user`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })
            .then((response) => response.json())
            .then((data) => {
                         
            if (data['msg'] ==="Token has expired" ){
              navigation.navigate("SignIn")
              
            }
            else{
              setUser(data);
              setData(data.requests);  
              navigate.navigate("Home")
            }
             
            })

            .catch((error) => {
              console.error(error);
            });
        } else {
          navigation.navigate("SignIn");
        }
      } catch (error) {
        console.error(error);
        navigation.navigate("SignIn");
      }
    }
    checkToken();
  }, [navigation]);
  return (
    <ImageBackground style={styles.background } >
      <Image style={styles.logo} source={require("../assets/logo.png")} />
      <View >
        <ActivityIndicator size="large" color={colors.white} />
      </View>

    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    gap:0,
    

  },
  logo: {
    width: "70%",
    resizeMode: "contain",
  },
});

export default WelcomeScreen;
