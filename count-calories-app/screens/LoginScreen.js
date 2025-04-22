import { useState, useContext } from 'react';
import { Text, View, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import * as MyStyles from "../styles/MyStyles"

export default function LoginScreen(){

    const navigation = useNavigation();

    return(
        <View style={{flex:1, backgroundColor:MyStyles.ColorEerieBlack, justifyContent: "flex-end", alignItems: "center"}}>
            <TouchableOpacity style={{...MyStyles.baseStyle.base, backgroundColor: MyStyles.ColorDarkCyan, marginBottom: "33%"}}
            onPress={()=>{navigation.navigate("Main");}}>
                <Text style={{...MyStyles.baseStyle.text, fontSize:24}}>Enter</Text>
            </TouchableOpacity>
        </View>
    );
}