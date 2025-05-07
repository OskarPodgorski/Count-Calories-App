import 'react-native-get-random-values';
import 'react-native-gesture-handler';

import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';

import { ConvexProvider, ConvexReactClient, useQuery } from "convex/react";
import { api } from "./convex/_generated/api";

import { useFonts } from 'expo-font';
import { Fredoka_300Light, Fredoka_400Regular, Fredoka_500Medium } from '@expo-google-fonts/fredoka';

import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen';
import BarcodeScannerScreen from "./screens/BarcodeScannerScreen";

import AddMealScreen from './screens/AddMealsScreen';
import SettingsScreen from './screens/SettingsScreen';
import AccountScreen from './screens/AccountScreen';

import * as MyStyles from "./styles/MyStyles";
import { DailyTargetsProvider, RefreshDayProvider, ScannedBarcodeProvider } from './scripts/Context';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL, {
  unsavedChangesWarning: false,
});

export default function App() {
  const [fontsLoaded] = useFonts({
    Fredoka_300Light,
    Fredoka_400Regular,
    Fredoka_500Medium
  });

  if (!fontsLoaded) {
    return (
      null
    );
  }

  return (
    <ConvexProvider
      client={convex}>
      <ClerkProvider
        tokenCache={tokenCache}>

        <SafeAreaProvider>
          <StatusBar style="light" backgroundColor={MyStyles.ColorEerieBlack} />
          <SafeAreaView style={{ flex: 1, backgroundColor: MyStyles.ColorEerieBlack }}>

            <NavigationContainer>

              <Root />

            </NavigationContainer>

          </SafeAreaView>
        </SafeAreaProvider>

      </ClerkProvider>
    </ConvexProvider>
  );
}

function Root() {
  const { isLoaded, isSignedIn } = useAuth();
  const pong = useQuery(api.ping.ping);

  if (isLoaded && isSignedIn && pong) {
    return (
      <DailyTargetsProvider>
        <RefreshDayProvider>
          <ScannedBarcodeProvider>
            <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: MyStyles.ColorEerieBlack } }}>
              <Stack.Screen name="Main" component={DrawerCreate} />
              <Stack.Screen name="BarcodeScanner" component={BarcodeScannerScreen} />
            </Stack.Navigator>
          </ScannedBarcodeProvider>
        </RefreshDayProvider>
      </DailyTargetsProvider>
    );
  }
  else {
    return (<LoginScreen />);
  }
}

function DrawerCreate() {
  return (

    <Drawer.Navigator
      screenOptions={{
        drawerStyle: {
          backgroundColor: MyStyles.ColorEerieBlack,
          width: 160,
          borderRightWidth: 1,
          borderRightColor: MyStyles.ColorDarkCyan,
          borderTopWidth: 1,
          borderTopColor: MyStyles.ColorDarkCyan,
          borderBottomColor: MyStyles.ColorDarkCyan,
          borderTopRightRadius: 8,
          borderBottomEndRadius: 8
        },
        drawerContentContainerStyle: {
          gap: 5
        },
        drawerLabelStyle: {
          color: MyStyles.ColorWhite,
          fontSize: 16,
          fontFamily: MyStyles.BaseFont,
          margin: 0
        },
        drawerItemStyle: {
          borderRadius: 8,
          marginVertical: 0,
          paddingVertical: 0
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
          fontSize: 18,
          fontFamily: MyStyles.BaseFont
        },
        drawerType: "slide",
        overlayColor: 'transparent',
        sceneContainerStyle: {
          backgroundColor: MyStyles.ColorEerieBlack
        },
      }}
    >
      <Drawer.Screen name="Add Meal" component={AddMealScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="Account" component={AccountScreen} />
    </Drawer.Navigator>

  );
}

