import 'react-native-get-random-values';
import 'react-native-gesture-handler';

import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { createDrawerNavigator } from '@react-navigation/drawer';

import SettingsScreen from './screens/SettingsScreen';
import AddMealScreen from './screens/AddMealsScreen';
import * as MyStyles from "./styles/MyStyles"
import { DailyTargetsProvider } from './scripts/Context';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <SafeAreaProvider>

      <StatusBar style="light" backgroundColor= {MyStyles.ColorEerieBlack} />
      <SafeAreaView style={{ flex: 1 , backgroundColor: MyStyles.ColorEerieBlack}}>

        <NavigationContainer>

          <DailyTargetsProvider>
            <DrawerCreate/>
          </DailyTargetsProvider>

        </NavigationContainer>

      </SafeAreaView>

    </SafeAreaProvider>
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
    <Drawer.Screen name="Add Meal Screen" component={AddMealScreen} />
    <Drawer.Screen name="Settings" component={SettingsScreen} />
  </Drawer.Navigator>
  );
}

