import {useState} from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

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