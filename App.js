import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { onValue, set, push, child} from 'firebase/database';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, TabBarIOS, ScrollView, KeyboardAvoidingView, Keyboard, Pressable} from 'react-native';
import { initializeApp } from "firebase/app";
import { getDatabase} from 'firebase/database';
import { ref } from "firebase/database"; 
import { get } from "firebase/database"; 
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts } from 'expo-font';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { LogBox } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';




LogBox.ignoreAllLogs();




// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDa2Cra7Hq9ExskiH-YmRuiMFdHScljzQI",
  authDomain: "isisproject-5c75a.firebaseapp.com",
  projectId: "isisproject-5c75a",
  storageBucket: "isisproject-5c75a.appspot.com",
  messagingSenderId: "192901724922",
  appId: "1:192901724922:web:36638527479fa3489a2743",
  measurementId: "G-1XDJG9Q80W",
  databaseURL: "https://isisproject-5c75a-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

function SignUpFormBody(props){
  const [email, setEmail] = useState('Place'); 
  const [name, setName] = useState('Place'); 
  const [password, setPassword] = useState('Place'); 
  const [nameTest, setNameTest] = useState('Place'); 
  const db = getDatabase(); 
  const navigation = useNavigation(); 

  const HandleSubmit = () => {
    const db = getDatabase();
    const auth = getAuth(); 
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user; 
        setNameTest('Success');
        set(ref(db,'users/' + user.uid), {
          Name: name, 
          Password: password,
          Email:email
        })
        
        navigation.navigate('HomeScreenStack', {userID:user.uid}); 
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      })
  }
  return(
    
    <View>
      <Text style={{textAlign:'center', fontFamily:'AvenirNextCondensed-DemiBold', fontSize:20}}>Sign Up</Text>
      <View style={{padding: 20}}><TextInput placeholder="Enter your email" onChangeText={(value) => setEmail(value)}></TextInput></View>
      <View style={{padding: 20}}><TextInput placeholder="Enter your name" onChangeText={(value) => setName(value)}></TextInput></View>
      <View style={{padding: 20}}><TextInput placeholder="Enter your password" onChangeText={(value) => setPassword(value)}></TextInput></View>
      <View style={{width:'auto', padding: 15, marginLeft:'auto', marginRight:'auto'}}><Button onPress={HandleSubmit} color='#EF4374' title='SIGN UP'></Button></View>
    </View>
    
  );
}

function SignInForm(){
  const [email, setEmail] = useState('Place'); 
  const [password, setPassword] = useState('Place'); 
  const [nameTest, setNameTest] = useState('Place'); 
  const db = getDatabase(); 
  const navigation = useNavigation(); 

  const HandleSubmit = () => {
    const auth = getAuth(); 
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential)=>{
        const user = userCredential.user;
        setNameTest('Success');
        setNameTest(user.email); 
        navigation.navigate('HomeScreenStack', {userID:user.uid}); 
      })
      .catch((error)=>{
        alert("error");
        setNameTest('Error');
      })
  }
  return(  
    <View>
      <Text style={{textAlign:'center', fontFamily:'AvenirNextCondensed-DemiBold', fontSize:20}}>Log In</Text>
      <View style={{padding: 20}}><TextInput placeholder="Enter your email" onChangeText={(value) => setEmail(value)}></TextInput></View>
      <View style={{padding: 20}}><TextInput placeholder="Enter your password" onChangeText={(value) => setPassword(value)}></TextInput></View>
      <View style={{width:'auto', padding: 15, marginLeft:'auto', marginRight:'auto'}}><Button onPress={HandleSubmit} color='#EF4374' title='LOGIN'></Button></View>
    </View>
  )
}

function MainScreen({ navigation }){

  return(
    <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.container}>
      <Text style={{fontSize:40, color:'#ffffff', marginTop:20, fontFamily: 'Avenir-Heavy', padding:10}}>BRAINPOWER</Text>
        <View style={styles.bodyContainer}>
          <View style={styles.item}>
            <SignUpFormBody style={styles.item}></SignUpFormBody>
          </View>
          <View style={styles.item}>
            <SignInForm style={styles.item}></SignInForm>
          </View>
        </View>
      <StatusBar style="auto"/>
    </KeyboardAwareScrollView>
  ); 
}

function HomeScreen({navigation, route}){
  const [posts, setPosts]= useState([]); 
  const db = getDatabase(); 
  const keysList = [];
  useEffect(()=>{
    const dbref = ref(db, 'posts/');
    onValue(dbref, (snapshot) => {
      snapshot.forEach((childSnapshot) =>{
        keysList.push([childSnapshot.val().title, childSnapshot.val().author, childSnapshot.val().body]);
      })
      setPosts(keysList);
    })
  },[]);

  return(
    <ScrollView style={{flex:1, backgroundColor:'white', paddingTop:70}}>
      <PostDisplayElement array={posts}></PostDisplayElement>
    </ScrollView>
  );
}

function PostDisplayElement(props){
  const postArray = props.array; 
  const list1 =[]
  for(let i = 0; i < postArray.length; i++){
    list1.push(<PostDisplayElementHelper title={postArray[i][0]} author ={postArray[i][1]} body={postArray[i][2]} key={postArray[i][0]}></PostDisplayElementHelper>)
  }
  return(
    <View>{list1}</View>
  )
}

function PostDisplayElementHelper(props){
  const title=props.title;
  const author=props.author; 
  const body=props.body;
  return(
    <View style={{
      backgroundColor:'#hsla(339, 100%, 90%,0.5)',
      flexDirection: 'column',
      justifyContent: 'space-evenly',
      padding: 20,
      marginLeft:20,
      marginRight:20,
      marginTop:15,
      marginBottom:15,
      borderRadius:3,
      textAlign:'center'
      }}>
        {title &&
          <Text style={{fontFamily:'AvenirNext-Bold', marginBottom:5}}>{title}</Text>
        }
        {author &&
          <Text style={{fontFamily:'Avenir-Oblique', marginBottom:15}}>User {author}</Text>
        }
        {body &&
          <Text>{body}</Text>
        }
    </View>
  )
}

function ProfileScreen({route, navigation}){
  const userID = route.params.userID; 
  const keys = [];
  const vals = []; 
  const db = getDatabase();
  const [keyArray, setKeyArray] = useState('place'); 
  const [valArray, setValArray] = useState('place'); 
  const auth = getAuth(); 
  useEffect(() => {
    const dbref = ref(db, 'users/'+ userID);
    onValue(dbref, (snapshot) =>{
      snapshot.forEach((childSnapshot) =>{
        keys.push(childSnapshot.key);
        vals.push(childSnapshot.val());
         
      })
      setKeyArray(keys);
      setValArray(vals);   
    })
  }, []);
  return(
    <View style={styles.container3}>
      <Text style={{color:'#hsl(212, 22%, 61%)', fontFamily:'AvenirNextCondensed-DemiBold', fontSize:30, textAlign:'center'}}>Your profile</Text>
      <ProfileTableView arr1={keyArray} arr2={valArray}></ProfileTableView>
      <Button title='Log Out' onPress={()=> navigation.navigate('MainScreen')}></Button>
    </View>

  )
}

function ProfileTableView(props){
  const arr1 = props.arr1;
  const arr2=props.arr2; 
  const list1 = [];
  const list2=[]; 
  for(let i=0; i< arr1.length; i++){
    list1.push(<Text key={arr1[i]} style={{fontFamily:'AvenirNextCondensed-DemiBold', fontSize:20, textTransform:'uppercase', marginBottom:15 }}>{arr1[i]}</Text>);
    list2.push(<Text key={arr2[i]} style={{fontFamily:'Avenir-Light', fontSize:20, marginBottom:15}}>{arr2[i]}</Text>);
  }
  return(
    <>
      <View style={styles.item2}>
         <View style={{margin: 20}}>{list1}</View>
         <View>{list2}</View>
      </View>
      <Button title='Edit profile'></Button>
    </>
  )
}

//needs current user user ID 
function CreatePostScreen({route, navigation}){
  const userID = route.params.userID; 
  const [postTitle, setPostTitle] = useState('Place'); 
  const [postBody, setPostBody] = useState('Place'); 
  const db = getDatabase(); 
  const auth = getAuth; 
  const HandleSubmit = () => {
    const dbref =  ref(db, 'posts/'); 
    const newPost = push(dbref); 
    set(newPost, {
      title: postTitle,
      body: postBody,
      author: userID
    });
    alert('Posted successfully'); 
    navigation.push('HomeScreenStack', {userID: userID});
  }
  return(
  <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.container3}>
    <Text style={{textAlign:'center', fontFamily:'AvenirNextCondensed-DemiBold', color:'#hsl(96, 30%, 69%)', fontSize:25, margin:40}}>Create a post</Text>
    <View style={{padding: 25}}><TextInput placeholder="Post Title"  onChangeText={(value) => setPostTitle(value)} style={{fontSize: 20, fontFamily:'Avenir-Light'}}></TextInput></View>
    <View style={{paddingLeft: 25, paddingBottom: 100, paddingTop:20}}><TextInput multiline placeholder="Post Body" numberOfLines={4}  onChangeText={(value) => setPostBody(value)} style={{fontSize: 20, fontFamily:'Avenir-Light'}}></TextInput></View>
    <View style={{width:'80%', padding: 10, marginLeft:'auto', marginRight:'auto'}}><Button onPress={HandleSubmit} color='#hsl(150, 66%, 38%)' title='Submit Post'></Button></View>
  </KeyboardAwareScrollView>
  )
}


const Tab = createBottomTabNavigator();
function HomeScreenStack({route, navigation}){
  const userID = route.params.userID;
  return(
    <Tab.Navigator screenOptions={{
      headerShown: false
    }}>
      <Tab.Screen name="Home" component={HomeScreen} options={{
        tabBarIcon: () => (<MaterialCommunityIcons name="home" size={26} color='#hsl(339, 100%, 90%)'/>)
      }}></Tab.Screen>
      <Tab.Screen name="Post" component={CreatePostScreen} initialParams={{userID: userID}} options={{
        tabBarIcon: () => (<MaterialCommunityIcons name="note" size={26} color='#hsl(96, 30%, 69%)'/>)
      }}></Tab.Screen>
      <Tab.Screen name="Profile" component={ProfileScreen} initialParams={{userID:userID}} options={{
        tabBarIcon: () => (<MaterialCommunityIcons name="account" size={26} color='#hsl(212, 22%, 61%)'/>)
      }}></Tab.Screen>
    </Tab.Navigator> 
  
  )
}

const Stack= createStackNavigator(); 
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
    headerShown: false
  }}>
        <Stack.Screen name="MainScreen" component={MainScreen}/>
        <Stack.Screen name= "HomeScreenStack" component={HomeScreenStack}/>
      </Stack.Navigator>
    </NavigationContainer> 
   
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#hsl(343, 84%, 58%)',
    alignItems: 'center',
    justifyContent: 'center',
    color:'rbga(255,255,255,0.9)',
  },
  container2: {
    flex: 1,
    backgroundColor: '#hsl(212, 22%, 61%)',
    alignItems: 'center',
    justifyContent: 'center',
    color:'rbga(255,255,255,0.9)'
  },
  container3: {
    flex: 1,
    flexDirection:'column', 
    backgroundColor: 'white',
    justifyContent: 'center',
    color:'rbga(255,255,255,0.9)'
  },
  container4: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    height:'100%',
    width:"100%"
    
  },
  bodyContainer:{
    flexWrap: 'wrap', 
    flexDirection:'column',
    alignItems:'stretch',
    width:'auto',
    height:'auto'
  },
  item:{
    margin:20,
    backgroundColor: 'rgba(255,255,255, 0.7)',
    color:'#f11262',
    borderRadius: 3,
    overflow:'hidden',
    fontFamily:'Avenir-Light',
    textAlign:'left',
    paddingVertical: 15,
    width:300,

  },
  item2:{
    display:'flex', 
    flexWrap:'wrap', 
    margin:20,
    flexDirection: 'row',
    backgroundColor: '#hsla(212, 22%, 61%,.4)',
    alignItems: 'center',
    justifyContent:'center', 
    borderRadius: 3,
    overflow:'hidden',
    paddingVertical: 15,
  
  }

});
