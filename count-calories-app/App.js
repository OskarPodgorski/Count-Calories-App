import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

function CreateDayScreen(dayName) {
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{dayName}</Text>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={{
              tabBarScrollEnabled: true,
              tabBarLabelStyle: { fontSize: 12 },
              tabBarItemStyle: { width: 100 },
              tabBarIndicatorStyle: { backgroundColor: '#ff6347' },
            }}
          >
            <Tab.Screen name="Pon" component={() => CreateDayScreen('Monday')} />
            <Tab.Screen name="Wt"  component={() => CreateDayScreen('Tuesday')} />
            <Tab.Screen name="Śr"  component={() => CreateDayScreen('Wednesday')} />
            <Tab.Screen name="Czw" component={() => CreateDayScreen('Thursday')} />
            <Tab.Screen name="Pt"  component={() => CreateDayScreen('Friday')} />
            <Tab.Screen name="Sob" component={() => CreateDayScreen('Saturday')} />
            <Tab.Screen name="Nd"  component={() => CreateDayScreen('Sunday')} />
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}


