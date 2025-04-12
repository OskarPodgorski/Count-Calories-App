import {useState} from 'react';
import { View, Text, TouchableOpacity, TextInput, _Text } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { dailyTargetSettings } from '../settings/Settings';

import * as MyStyles from "../styles/MyStyles"

const Tab = createMaterialTopTabNavigator();

export default function SettingsScreen() {
    return(
        <View style={{backgroundColor: MyStyles.ColorEerieBlack, flex: 1}}>
          <Tab.Navigator
            screenOptions={{            
                tabBarScrollEnabled: true,
                tabBarLabelStyle: { fontSize: 14 },
                tabBarItemStyle: { width: 120, justifyContent: "space-evenly" },
                tabBarIndicatorStyle: { backgroundColor: MyStyles.ColorBlack , height: 3 },
                tabBarStyle: { backgroundColor : MyStyles.ColorDarkCyan, borderRadius: 8, overflow: 'hidden'}             
            }}>
            <Tab.Screen name="Daily targets"  component={DailyTargets} />
            <Tab.Screen name="About app"  component={AboutApp} />
          </Tab.Navigator>
        </View>
  );
}
  function DailyTargets() {
      return (
          <View style={{flex:1, justifyContent: "center", alignItems: "center", backgroundColor: MyStyles.ColorEerieBlack}}>

              <View style={{ backgroundColor: MyStyles.ColorNight, borderRadius: 8, alignItems: "stretch", padding: 16}}>

                <View style={{backgroundColor: MyStyles.ColorDarkCyan, alignItems: "center", paddingVertical:4, paddingHorizontal:10, borderRadius: 8}}>
                    <Text style={{ color: MyStyles.ColorBlack, fontSize: 20 }}>Calories</Text>
                </View>

                    <TextInput style={{color: MyStyles.ColorWhite, alignSelf: "center", fontSize:20}} keyboardType='numeric'
                    onEndEditing={(e) => {dailyTargetSettings.carbs = parseInt(e.nativeEvent.text) || 0}}>
                        {dailyTargetSettings.calories}
                    </TextInput>

                    <View style={{backgroundColor: MyStyles.ColorDarkCyan, alignItems: "center", paddingVertical:4, paddingHorizontal:10, borderRadius: 8}}>
                    <Text style={{ color: MyStyles.ColorBlack, fontSize: 20 }}>Proteins</Text>
                </View>

                    <TextInput style={{color: MyStyles.ColorWhite, alignSelf: "center", fontSize:20}} keyboardType='numeric'
                    onEndEditing={(e) => {dailyTargetSettings.proteins = parseInt(e.nativeEvent.text) || 0}}>
                        {dailyTargetSettings.proteins}
                    </TextInput>


                    <View style={{backgroundColor: MyStyles.ColorDarkCyan, alignItems: "center", paddingVertical:4, paddingHorizontal:10, borderRadius: 8}}>
                    <Text style={{ color: MyStyles.ColorBlack, fontSize: 20 }}>Fat</Text>
                </View>

                    <TextInput style={{color: MyStyles.ColorWhite, alignSelf: "center", fontSize:20}} keyboardType='numeric'
                        onEndEditing={(e) => {dailyTargetSettings.fat = parseInt(e.nativeEvent.text) || 0}}>
                        {dailyTargetSettings.fat}
                    </TextInput>
                

                    <View style={{backgroundColor: MyStyles.ColorDarkCyan, alignItems: "center", paddingVertical:4, paddingHorizontal:10, borderRadius: 8}}>
                    <Text style={{ color: MyStyles.ColorBlack, fontSize: 20 }}>Carbohydrates</Text>
                </View>

                    <TextInput style={{color: MyStyles.ColorWhite, alignSelf: "center", fontSize:20}} keyboardType='numeric'
                    onEndEditing={(e) => {dailyTargetSettings.carbs = parseInt(e.nativeEvent.text) || 0}}>
                        {dailyTargetSettings.carbs}
                    </TextInput>
  
              </View>

          </View>
      );
  }

  function AboutApp() {
    return (
        <View style={{flex:1, justifyContent: "stretch", alignItems: "stretch", backgroundColor: MyStyles.ColorEerieBlack}}>
            <View style={{flex: 1, backgroundColor: MyStyles.ColorEerieBlack, justifyContent: "flex-start", alignItems: 'stretch', margin:4}}>

                <TouchableOpacity style={{backgroundColor: MyStyles.ColorNight,minHeight: 42,borderRadius: 8,alignItems: "flex-start",justifyContent: "center",padding: 12,marginBottom:4}}>
                    <Text style={{ color: MyStyles.ColorWhite, fontSize: 18 }}>Daily targets</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{backgroundColor: MyStyles.ColorNight,minHeight: 42,borderRadius: 8,alignItems: "flex-start",justifyContent: "center",padding: 12}}>
                    <Text style={{ color: MyStyles.ColorWhite, fontSize: 18 }}>About app</Text>
                </TouchableOpacity>

            </View>
        </View>
    );
}