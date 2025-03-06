import { View, Text, StyleSheet,Platform,StatusBar, TextInput, Button, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from "../config/colors";
import { UserContext } from "../Contexts/userContext";
import { useContext, useEffect, useState, useRef } from "react";
import { text } from "@fortawesome/fontawesome-svg-core";
import { Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
function Profile({navigation}){
    const userRef = useRef(null);
    const {Token,setToken,setData, setExpoToken} = useContext(UserContext)
   const {setUser,user} = useContext(UserContext)
   const [name, setName] = useState(user?.name)
   const [email, setEmail] = useState(user?.email)
   const [contact, setContact] = useState(user?.phone_number)
   const [password, setPassword] = useState(user?.password)
   const [profileName, setProfileName] = useState(user?.name)
   async function handleEdit(){
    
    const userData = {
        name: name,
        email: email,
        phone_number: contact,
        password: password
      };
           
     await fetch(`http://172.236.2.18:5000/users/${user.id}`,{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Token}`

        },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())    
    .then(data => {
        
        setUser(data)
        if (data.email) {
            Alert.alert(
                "Success !",
                "Profile updated successfully",
                [
                  {
                    text: "OK",
                    onPress: () => {
                        navigation.navigate("Profile")
                    },
                  },
                ],
                { cancelable: false }
              );
        }
        else{
            Alert.alert(
                "Error !",
                "Something went wrong\nPlease contact administaror",
                [
                  {
                    text: "OK",
                    onPress: () => {
                        navigation.navigate("Profile")
                    },
                  },
                ],
                { cancelable: false }
              );
        }
            
        
        
    })
   }
   useEffect(() => {    
    setProfileName(user?.name)
   },[user])
    return(
        <View style={styles.container}>
            <Icon onPress={()=>{navigation.goBack()}} style={styles.back} name="arrow-back" size={27} color={colors.white} />
            <View style={styles.profile}>           
              <Text style={{color: colors.white, fontSize: 20, fontWeight: '900', marginBottom: 10}} >My Profile</Text>
              <Icon name="account-circle" size={70} color={colors.white} />
              <Text style={{color: colors.white, fontSize: 14, fontWeight: '500'}} >{profileName}</Text>
            </View>
            <View style={{marginHorizontal: 15, marginTop: 20}}>
                <Text style={styles.label} >Name</Text>
                <TextInput
                onChange={(event) => setName(event.nativeEvent.text)}
                value={user ? name : ''}
                style={styles.input}
                placeholder="Name"
                
                >
                    
                </TextInput>
                <Text style={styles.label} >Email</Text>
                <TextInput
                
                value={user? email : ''}
                style={styles.input}
                placeholder="Email"

                >

                </TextInput>
                <Text style={styles.label} >Contact</Text>
                <TextInput
                onChange={(event) => setContact(event.nativeEvent.text)}
                value={user? contact : ''}
                style={styles.input}
                placeholder="Phone Number"
                >

                </TextInput>
                <Text style={styles.label} >Passsword</Text>
                <TextInput
                onChange={(event) => setPassword(event.nativeEvent.text)}
                value={user? password : ''}
                style={[styles.input, {marginBottom: 60}]}
                placeholder="password"
                >
                    
                </TextInput>  
                           
                <View style={{gap: 20}}>
                <Button 
                onPress={() =>handleEdit()}
                title="Edit details"
                titleStyle={{fontweight: Platform.OS === 'ios' ? 'normal' : 'normal'}}
                color={colors.blue}
                
                >
                   
                </Button>
                <TouchableOpacity 
                  style={{
                    flexDirection: "row",
                    width:"50%",
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 2,
                    alignSelf: 'center'
                  }}
                  onPress={() => {
                    async function logout() {                      
                      await SecureStore.deleteItemAsync('access_token');
                                            
                      setUser(null);
                      setToken(null);
                      setData(null);
                      setExpoToken(null);
                      
                      navigation.navigate('SignIn')
                    }
                    logout()
                    
                  }}
                >                  
                  <Icon name="logout" size={25} color={colors.orange} />
                  <Text style={{color:colors.orange, fontWeight: 700, fontSize: 16}}>Logout</Text>
                </TouchableOpacity>                
                </View>
            </View>
        </View>
    
    )
}
const styles = StyleSheet.create({
    container:{
        marginTop: Platform.OS === 'android' ? StatusBar.currentHeight :0,
        height: '100%',
        
    },
    profile:{
        paddingTop: Platform.OS === 'ios' ? 50 : 30,
        paddingBottom: Platform.OS === 'ios' ? 20 : 0,
        height: Platform.OS === 'ios' ? "25%": "23%",
        marginBottom: Platform.OS === 'ios' ? 20 : 20,
        backgroundColor: colors.blue,
        alignItems: 'center',
        justifyContent: 'center',   
    },
    back: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 55 : 20,
        left: 20,
        zIndex: 1
    },
    input:{
        borderBottomWidth: 1,
        marginBottom: Platform.OS === 'ios' ? 35 : 15,
        paddingBottom: Platform.OS === 'ios' ? 10 : 3,
        borderBottomColor: colors.grey
    },
    label:{
        color: colors.blue,
        fontSize: 16,
        fontWeight: '600',
        marginBottom: Platform.OS === 'ios' ? 10 : 0,
       
    }
})
export default Profile