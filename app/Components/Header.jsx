import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Dimensions,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import colors from "../config/colors";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../Contexts/userContext";
import { useNavigation } from "@react-navigation/native";
import { height } from "@fortawesome/free-brands-svg-icons/fa42Group";

function Header() {
  const navigation = useNavigation();
  const { user } = useContext(UserContext);
  const [username, setUsername] = useState(user?.username);
  useEffect(() => {
    setUsername(user?.username);
  }, [user]);
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableWithoutFeedback onPress={() => navigation.navigate("Home")}>
          <View style={styles.imageContainer}>
            <Image
              style={{ width: "100%", height: "100%", resizeMode: "contain" }}
              source={require("../assets/darkLogo.png")}
            />
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate("Profile")}
        >
          <View style={styles.user}>
            <Icon name="account-circle" size={33} color={colors.white} />
            <Text
              style={{ color: colors.white, fontSize: 12, fontWeight: "500" }}
            >
              {" "}
              Hi {username?.split(" ")[0]}.
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
}
const deviceHeight = Dimensions.get("window").height;
const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.blue,
    height: Platform.OS === "ios" ? deviceHeight * 0.15 : deviceHeight * 0.12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  imageContainer: {
    width: 150,
  },
  user: {
    flexDirection: "column",
    alignItems: "center",
    gap: 0,
  },
});
export default Header;
