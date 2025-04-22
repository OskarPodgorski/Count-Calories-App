import { useState, useContext } from 'react';
import { Text, View, TouchableOpacity, TextInput, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import * as MyStyles from "../styles/MyStyles"

export default function LoginScreen(){

    const navigation = useNavigation();

    return(
        <View style={{flex:1, backgroundColor:MyStyles.ColorEerieBlack, alignItems: "stretch", gap:15}}>

            <View style={{flex:1.5,  justifyContent:"center", alignItems: "center", gap:15}}>

                <Image source={require("../assets/logo.png")} style={{...MyStyles.baseStyle.base, width:130, height:130, backgroundColor:MyStyles.ColorNight}}/>

                <Text style={{...MyStyles.baseStyle.base, ...MyStyles.baseStyle.text, fontSize:26, color: MyStyles.ColorSilver, backgroundColor: MyStyles.ColorNight}}>Count Calories App</Text>

            </View>

            <View style={{flex:1, justifyContent: "center", alignItems: "center", gap:15}}>

                <TouchableOpacity style={{...MyStyles.baseStyle.base, backgroundColor: MyStyles.ColorWhite, flexDirection:"row", alignItems:"flex-end"}}
                onPress={()=>{navigation.navigate("Main");}}>
                    <Text style={{...MyStyles.baseStyle.text, fontSize:24, paddingRight:5}}>Login with</Text>
                    <Image source={require("../assets/googleLogo.png")} style={{height:37, width:88, marginRight:6}} resizeMode="contain" />
                </TouchableOpacity>

                <TouchableOpacity style={{...MyStyles.baseStyle.base, backgroundColor: MyStyles.ColorWhite}}
                onPress={()=>{navigation.navigate("Main");}}>
                    <Text style={{...MyStyles.baseStyle.text, fontSize:24}}>Enter</Text>
                </TouchableOpacity>

            </View>

        </View>
    );
}