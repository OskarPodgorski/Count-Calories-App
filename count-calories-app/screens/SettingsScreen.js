import { useContext } from 'react';
import { View, Text, TouchableOpacity, TextInput, _Text, Linking } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import * as MyStyles from "../styles/MyStyles"
import { dailyTargetSettings } from '../settings/Settings';
import { dailyTargetsContext } from '../scripts/Context';

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
    const { dailyTargets, setDailyTargets } = useContext(dailyTargetsContext);

      return (
          <View style={{flex:1, justifyContent: "center", alignItems: "center", backgroundColor: MyStyles.ColorEerieBlack}}>

              <View style={{ backgroundColor: MyStyles.ColorNight, borderRadius: 8, alignItems: "stretch", padding: 16}}>

                <View style={{backgroundColor: MyStyles.ColorDarkCyan, alignItems: "center", paddingVertical:4, paddingHorizontal:10, borderRadius: 8}}>
                    <Text style={{ color: MyStyles.ColorBlack, fontSize: 20 }}>Calories</Text>
                </View>

                    <TextInput style={{color: MyStyles.ColorWhite, alignSelf: "center", fontSize:20}} keyboardType='numeric'
                    onEndEditing={(e) => { setDailyTargets(prev => ({ ...prev, calories: parseInt(e.nativeEvent.text) || 0 }));
                    }}>
                        {dailyTargetSettings.calories}
                    </TextInput>

                    <View style={{backgroundColor: MyStyles.ColorDarkCyan, alignItems: "center", paddingVertical:4, paddingHorizontal:10, borderRadius: 8}}>
                    <Text style={{ color: MyStyles.ColorBlack, fontSize: 20 }}>Proteins</Text>
                </View>

                    <TextInput style={{color: MyStyles.ColorWhite, alignSelf: "center", fontSize:20}} keyboardType='numeric'
                    onEndEditing={(e) => { setDailyTargets(prev => ({ ...prev, proteins: parseInt(e.nativeEvent.text) || 0 }));
                    }}>
                        {dailyTargetSettings.proteins}
                    </TextInput>


                    <View style={{backgroundColor: MyStyles.ColorDarkCyan, alignItems: "center", paddingVertical:4, paddingHorizontal:10, borderRadius: 8}}>
                    <Text style={{ color: MyStyles.ColorBlack, fontSize: 20 }}>Fat</Text>
                </View>

                    <TextInput style={{color: MyStyles.ColorWhite, alignSelf: "center", fontSize:20}} keyboardType='numeric'
                        onEndEditing={(e) => { setDailyTargets(prev => ({ ...prev, fat: parseInt(e.nativeEvent.text) || 0 }));
                    }}>
                        {dailyTargetSettings.fat}
                    </TextInput>
                

                    <View style={{backgroundColor: MyStyles.ColorDarkCyan, alignItems: "center", paddingVertical:4, paddingHorizontal:10, borderRadius: 8}}>
                    <Text style={{ color: MyStyles.ColorBlack, fontSize: 20 }}>Carbohydrates</Text>
                </View>

                    <TextInput style={{color: MyStyles.ColorWhite, alignSelf: "center", fontSize:20}} keyboardType='numeric'
                    onEndEditing={(e) => { setDailyTargets(prev => ({ ...prev, carbs: parseInt(e.nativeEvent.text) || 0 }));
                    }}>
                        {dailyTargetSettings.carbs}
                    </TextInput>
  
              </View>

            </View>
      );
  }

  function AboutApp() {
    return (
        <View style={{flex:1, justifyContent: 'center', alignItems: "center", backgroundColor: MyStyles.ColorEerieBlack}}>
            
            <Text style={{color: MyStyles.ColorDarkCyan, fontSize: 32, textAlign: "center", marginBottom: 20}}>{"Created by:\nOskar Podgórski"}</Text>

            <TouchableOpacity style={{backgroundColor: MyStyles.ColorDarkCyan, borderRadius: 8, paddingHorizontal: 16, paddingVertical:4}}
            onPress={() => {Linking.openURL("https://github.com/OskarPodgorski")}}>
                <Text style={{color: MyStyles.ColorBlack, fontSize: 32, textAlign: "center"}}>Go to my GitHub</Text>
            </TouchableOpacity>

        </View>
    );
}