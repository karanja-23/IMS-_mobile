import {
    View,
    Text,
    StyleSheet,
    Platform,
    StatusBar,
    Dimensions,
    TextInput,
    Button,
    Alert
  } from "react-native";
  import Header from "../Components/Header";
  import * as Notifications from "expo-notifications";
  import colors from "../config/colors";
  import { UserContext } from "../Contexts/userContext";
  import { useEffect, useState,useContext, useCallback } from "react";
  import { useNavigation } from "@react-navigation/native";
  import Loading from "../Components/Loading";
  import Icon from 'react-native-vector-icons/MaterialIcons';
  
  function AssetInformation({route}) {
    const {user,setData,Token} = useContext(UserContext)
    const navigate = useNavigation()    
    const [suceess, setSuccess] = useState(false)
    const [assetData, setAssetData] = useState(false)
    const [fetchedData, setFetchedData] = useState(false)
    const [loading,setLaoding] = useState(false)
    const [itemLoading, setItemLoading] = useState(false)
    const [showNotFound, setShowNotFound] = useState(false)
    const [showAlert, setShowAlert] = useState(false);
    useEffect(() => {
      
      setLaoding(true)
      fetch(`https://mobileimsbackend.onrender.com/assets/filter/${route.params.data}`,{
        method: 'GET'
      })
      .then(response => response.json())
      .then(data => {
        
        if (!data['name']) {
          setLaoding(false)
          setShowNotFound(true)
        }else{
          if (data.status === 'assigned' || data.status === 'borrowed') {
            setShowAlert(true)
          }
          else{
            setLaoding(false)
            setAssetData(data)
            setFetchedData(true)
          }
        }
        
      })
    },[])
    useEffect(() => {
      if (showNotFound) {
        Alert.alert(
          "Not found!",
          "This asset is not in our database\nPlease contact the administrator",
          [
            {
              text: "OK",
              onPress: () => {
                setAssetData(false)
                navigate.navigate("Scan")
                                
              },
            },
          ],
          { cancelable: false }
        );
        setShowAlert(false);
      }
    }, [showNotFound]); 

    useEffect(() => {
      if (showAlert) {
        Alert.alert(
          "Asset is not available!",
          "This asset has been assigned or borrowed\nPlease contact the administrator",
          [
            {
              text: "OK",
              onPress: () => {
                setAssetData(false)
                navigate.navigate("Scan")
                                
              },
            },
          ],
          { cancelable: false }
        );
        setShowAlert(false);
      }
    }, [showAlert]);
    
    const handleBorrow = useCallback(()=>{
      
      setItemLoading(true)

      if (assetData) {
        const new_request = {
          asset_id: assetData.id,
          user_id: user.id
                 
        }
        
        fetch(`https://mobileimsbackend.onrender.com/requests`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(new_request)
        })
        .then(response => {
        
          return response.json()
        })
        
        .then(data => {
          
          if (data.message === "Request created successfully"){
            fetch(`https://mobileimsbackend.onrender.com/protected/user`, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${Token}`,
                "Content-Type": "application/json",
              },
            })
            .then((response) => response.json())
            .then(data => {
              
              setData(data.requests)
            })
            
            .then(() => {
              setItemLoading(false)
              setSuccess(true)
              setTimeout(() => {
                setSuccess(false)
                navigate.navigate("Home")
                sendNotification()
              }, 400);
              async function sendNotification(){
                await Notifications.scheduleNotificationAsync({
                  content: {
                    title: "Moringa IMS",
                    body: `A request to borrow ${assetData.name} been sent to the admin for approval`,
                  },
                  trigger: null,
                  sound: true,
                  vibrate: true,
                })           
              }
            })
          }  
        })
      }
      else {
        Alert.alert(
          "Error",
          "Asset is not available!",
          [
            {
              text: "OK",
              onPress: () => {
                setAssetData(false)
                navigate.goBack('Scan')
              },
            },
          ],
          { cancelable: false }
        );
      }


    },[assetData])

    return (
      <View style={styles.container}>
        {suceess ? <View style={styles.success}>
          <Icon name="check" size={50} color={colors.white} style={{alignSelf: 'center'}} />
        </View> : null}
        
         { loading ? <View style={styles.alert}>
            <Loading />

          </View> : null}
        
      <Header />
       <View style={styles.new}>
        <Text
          style={{
            color: colors.blue,
            fontSize: 20,
            fontWeight: "900",
            marginLeft: 20,
            marginTop: 20,
          }}
        >
          Asset Information
        </Text>
        <View style={{flexDirection: "row", justifyContent: "space-evenly", marginTop: 20, opacity: loading ? 0.4 : 1}}>
          <View>
            <Text style={styles.titles}>Serial Number</Text>
            <TextInput
             value={fetchedData ? assetData?.serial_number: ''}
              placeholder="Asset Name"
              style={styles.input}
            ></TextInput>
          </View>
          <View>
            <Text style={[styles.titles,{opacity: loading ? 0.4 : 1}]}>Asset Name</Text>
            <TextInput
              value={fetchedData ? assetData?.name : ''}
              placeholder="Asset Name"
              style={styles.input}
            ></TextInput>
          </View>
        </View>
        <View style={{marginTop: 20, opacity: loading ? 0.4 : 1}}>
           <Text style={{fontSize:13, marginBottom: 5 ,fontWeight:19,fontWeight: "900", color: colors.grey,marginLeft: "10%"}}>Asset description</Text>
           <TextInput 
           value={fetchedData ? assetData?.description : ''}            
           multiline={true}
           numberOfLines={6}
           style={{width:"80%", backgroundColor: "lightgrey" ,textAlignVertical: "top" ,alignSelf: "center",height: 130}}>

           </TextInput>
        </View>
        
        <View style={{flexDirection: "row", justifyContent: "space-evenly", marginTop: 20, opacity: loading ? 0.4 : 1}}>
          <View>
            <Text style={styles.titles}>Condition</Text>
            <TextInput
              value={fetchedData ? assetData?.condition : ''}
              placeholder="Asset Name"
              style={styles.input}
            ></TextInput>
          </View>
          <View>
            <Text style={styles.titles}>Category</Text>
            <TextInput
            value={fetchedData ? assetData?.category['name'] : ''}
              placeholder="Asset Name"
              style={styles.input}
            ></TextInput>
          </View>
        </View>  

        <View style={{flexDirection: "row", justifyContent: "space-evenly", marginTop: 20, marginBottom: 30, opacity: loading ? 0.4 : 1}}>
          <View>
            <Text style={styles.titles}>Location</Text>
            <TextInput
              value={fetchedData ? assetData?.space['name'] : ''}
              placeholder="Asset Space"
              style={styles.input}
            ></TextInput>
          </View>
          <View>
            <Text style={styles.titles}>Assigned to:</Text>
            <TextInput
            value={fetchedData ? assetData?.assign?? "Not assigned" : ''}
              placeholder="Asset Name"
              style={styles.input}
            ></TextInput>
          </View>
        </View> 
        <View style={{width: "80%", alignSelf: "center",backgroundColor:colors.blue}} >
        <Button
          title= {itemLoading ? "Loading..." : "Borrow item"}
          color={colors.orange}        
          disabled={loading}    
          onPress={handleBorrow}   
        >
        </Button>         
        </View>            
      </View>
    </View>
    )
  }
  const width = Dimensions.get("window");
  const height = Dimensions.get("window");
  const styles = StyleSheet.create({
    container: {
      marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    new: {
      marginTop: 80,
      width: "100%",
      height: height.height - 80,
      backgroundColor: colors.white,
      borderWidth: 5,
      borderColor: "white",
      zIndex: -1,
    },
    input: {
      backgroundColor: "lightgrey",
      paddingLeft: 10,
      width: 150,
      height: 33,
      fontSize: 11,
    },
    titles: {
      color: colors.grey,
      fontSize: 13,
      fontWeight: "900",
      marginBottom: 5,
    },
    alert :{
      position: "absolute",
      top: height.height*0.47,
      left: width.width*0.43,
      width: width*0.5,
      height: 3/4 *(width*0.5),
      alignSelf: "center",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 10,
      zIndex: 3,
      
      
    },
    success:{
      position: "absolute",
      top: height.height*0.47,
      left: width.width*0.43,
      width: width*0.5,
      height: 3/4 *(width*0.5),
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.orange,
      padding: 10,
      opacity: 0.9,
      borderRadius: "50%",
      zIndex: 3,
    }
  });
  export default AssetInformation;
  