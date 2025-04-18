import 'react-native-get-random-values';
import 'react-native-gesture-handler';

import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SettingsScreen from './screens/SettingsScreen';
import AddMealScreen from './screens/AddMealsScreen';
import BarcodeScannerScreen from "./screens/BarcodeScannerScreen";
import * as MyStyles from "./styles/MyStyles";
import { DailyTargetsProvider } from './scripts/Context';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <SafeAreaProvider>

      <StatusBar style="light" backgroundColor= {MyStyles.ColorEerieBlack} />
      <SafeAreaView style={{ flex: 1 , backgroundColor: MyStyles.ColorEerieBlack}}>

        <DailyTargetsProvider>
          <NavigationContainer>
    
            <StackNavigatorCreate/>
    
          </NavigationContainer>
        </DailyTargetsProvider>

      </SafeAreaView>

    </SafeAreaProvider>
  );
}

function StackNavigatorCreate() {
  return(
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={DrawerCreate} />
      <Stack.Screen name="BarcodeScanner" component={BarcodeScannerScreen} />
    </Stack.Navigator>
);
}

function DrawerCreate() {
  return(
        <Drawer.Navigator
          screenOptions={{
            drawerStyle: {
              backgroundColor: MyStyles.ColorEerieBlack,
              width: 190,
              borderBottomRightRadius:8,
              borderTopRightRadius:0
            },
            drawerLabelStyle: {
              color: MyStyles.ColorWhite,
              fontSize: 16
            },
            drawerItemStyle: {
              borderRadius: 8
            },
            drawerActiveBackgroundColor: MyStyles.ColorDarkCyan,
            drawerInactiveBackgroundColor: MyStyles.ColorNight,
            headerStyle: {
              backgroundColor: MyStyles.ColorEerieBlack,
              height: 60
            },
            headerStatusBarHeight: 0,
            headerTitleAlign: "center",
            headerTintColor: MyStyles.ColorWhite,
            headerShadowVisible: false,
            headerTitleStyle: {
              textAlignVertical: "top",
              fontSize: 18
            },
        }}
        >
          <Drawer.Screen name="Add Meal" component={AddMealScreen} />
          <Drawer.Screen name="Settings" component={SettingsScreen} />
        </Drawer.Navigator>
  );
}

