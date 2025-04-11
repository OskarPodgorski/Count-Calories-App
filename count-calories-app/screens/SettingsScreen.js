import {useState} from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import * as MyStyles from "../styles/MyStyles"

export default function SettingsScreen() {
    return (
        <View style={{flex:1, justifyContent: "stretch", alignItems: "stretch", backgroundColor: MyStyles.ColorEerieBlack}}>
        <View style={{flex: 1, backgroundColor: MyStyles.ColorEerieBlack, justifyContent: "flex-start", alignItems: 'stretch', margin:4}}>
            
            <TouchableOpacity style={{backgroundColor: MyStyles.ColorNight,minHeight: 38,minWidth: 38,borderRadius: 8,alignItems: "flex-start",justifyContent: "center",padding: 12}}>
                      <Text style={{ color: MyStyles.ColorWhite, fontSize: 18 }}>Daily targets</Text>
                    </TouchableOpacity>

        </View>
        </View>
    );
}