import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="dark" backgroundColor="#0E9594" />
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={{
              tabBarScrollEnabled: true,
              tabBarLabelStyle: { fontSize: 14 },
              tabBarItemStyle: { width: 75 },
              tabBarIndicatorStyle: { backgroundColor: '#ff6347' },
              tabBarStyle: { backgroundColor : "#0E9594"}
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
    </SafeAreaProvider>
  );
}

function CreateDayScreen(dayName) {
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:"#111111" }}>
      <Text style={{fontSize: 32, color: "#0E9594"}}>{dayName}</Text>
    </SafeAreaView>
  );
}