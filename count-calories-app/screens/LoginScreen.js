import React from 'react';
import { useState, useContext } from 'react';
import { Text, View, TouchableOpacity, TextInput, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { useSSO } from '@clerk/clerk-expo';

import * as MyStyles from "../styles/MyStyles"

export default function LoginScreen(){

  const navigation = useNavigation();
  
  const { startSSOFlow } = useSSO();

    const handleGoogleSignIn = async () => {
      try {
        const { createdSessionId, setActive } = await startSSOFlow({
          strategy: 'oauth_google',
          redirectUrl: Linking.createURL('oauth-native-callback'),
        });
    
        console.log(createdSessionId);

        if (createdSessionId) {
          await setActive({ session: createdSessionId });
          navigation.navigate("Main");
        }
      } catch (err) {
        console.error('Błąd logowania przez Google:', err);
      }
    };

    const handleGitHubSignIn = async () => {
      try {
        const { createdSessionId, setActive } = await startSSOFlow({
          strategy: 'oauth_google',
          redirectUrl: Linking.createURL('oauth-native-callback'),
        });
    
        console.log(createdSessionId);

        if (createdSessionId) {
          await setActive({ session: createdSessionId });
          navigation.navigate("Main");
        }
      } catch (err) {
        console.error('Błąd logowania przez Google:', err);
      }
    };

    return(
      <View style={{flex:1, backgroundColor:MyStyles.ColorEerieBlack, alignItems: "stretch", gap:15}}>

            <View style={{flex:1.5,  justifyContent:"center", alignItems: "center", gap:15}}>

                <Image source={require("../assets/logo.png")} style={{...MyStyles.baseStyle.base, width:130, height:130, backgroundColor:MyStyles.ColorNight}}/>

                <Text style={{...MyStyles.baseStyle.base, ...MyStyles.baseStyle.text, fontSize:26, color: MyStyles.ColorSilver, backgroundColor: MyStyles.ColorNight}}>Count Calories App</Text>

            </View>

            <View style={{flex:1, justifyContent: "center", alignItems: "center"}}>

            <View style={{justifyContent: "center", alignItems: "stretch", gap:15}}>

                <TouchableOpacity style={{...MyStyles.baseStyle.base, backgroundColor: MyStyles.ColorWhite, flexDirection:"row",justifyContent:"center", alignItems:"flex-end"}}
                onPress={handleGoogleSignIn}>
                    <Text style={{...MyStyles.baseStyle.text, fontSize:24, paddingRight:5}}>Login with</Text>
                    <Image source={require("../assets/googleLogo.png")} style={{height:37, width:88, marginRight:6}} resizeMode="contain" />
                </TouchableOpacity>

                <TouchableOpacity style={{...MyStyles.baseStyle.base, backgroundColor: MyStyles.ColorWhite, flexDirection:"row", alignItems:"center"}}
                onPress={handleGitHubSignIn}>
                    <Text style={{...MyStyles.baseStyle.text, fontSize:24, paddingRight:4}}>Login with</Text>
                    <Image source={require("../assets/githubLogo.png")} style={{height:43, width:106, marginRight:5 }} resizeMode="contain" />
                </TouchableOpacity>

            </View>

            </View>

        </View>
    );
}