import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const ColorDarkCyan = "#0E9594";
const ColorBlack = "#000000";
const ColorEerieBlack = "#222222";

const Tab = createMaterialTopTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>

      <SafeAreaView style={{ flex: 1 , backgroundColor: ColorEerieBlack}}>
      <StatusBar style="dark" backgroundColor= {ColorDarkCyan} />
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={{
              tabBarScrollEnabled: true,
              tabBarLabelStyle: { fontSize: 14 },
              tabBarItemStyle: { width: 70 },
              tabBarIndicatorStyle: { backgroundColor: ColorBlack , height: 3 },
              tabBarStyle: { backgroundColor : ColorDarkCyan}
            }}
            >
            <Tab.Screen name="Mon" component={() => CreateDayScreen('Monday')} />
            <Tab.Screen name="Tue"  component={() => CreateDayScreen('Tuesday')} />
            <Tab.Screen name="Wed"  component={() => CreateDayScreen('Wednesday')} />
            <Tab.Screen name="Thu" component={() => CreateDayScreen('Thursday')} />
            <Tab.Screen name="Fri"  component={() => CreateDayScreen('Friday')} />
            <Tab.Screen name="Sat" component={() => CreateDayScreen('Saturday')} />
            <Tab.Screen name="Sun"  component={() => CreateDayScreen('Sunday')} />
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaView>
      
      <SafeAreaView style={{ backgroundColor: ColorDarkCyan, height: 70 }}>
        <Text>FOOTER</Text>
      </SafeAreaView>
      
    </SafeAreaProvider>
  );
}

function CreateDayScreen(dayName) {
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: ColorEerieBlack }}>
      <Text style={{fontSize: 32, color: ColorDarkCyan}}>{dayName}</Text>
    </SafeAreaView>
  );
}