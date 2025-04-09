import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const ColorDarkCyan = "#0E9594";
const ColorBlack = "#000000";
const ColorEerieBlack = "#222222";
const ColorNight = "#161616";

const footerStyle = StyleSheet.create({
  text: {
    fontWeight: "bold"
  },
  viewInside: {
    flex: 1,
     justifyContent: 'center',
      alignItems: 'center',
       flexDirection: "column" 
  }
});

const Tab = createMaterialTopTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" backgroundColor= {ColorDarkCyan} />
      <SafeAreaView style={{ flex: 1 , backgroundColor: ColorEerieBlack}}>

        <NavigationContainer>
          <Tab.Navigator
            screenOptions={{
              tabBarScrollEnabled: true,
              tabBarLabelStyle: { fontSize: 14 },
              tabBarItemStyle: { width: 70 },
              tabBarIndicatorStyle: { backgroundColor: ColorBlack , height: 3 },
              tabBarStyle: { backgroundColor : ColorDarkCyan, borderBottomLeftRadius: 8, borderBottomRightRadius: 8}             
            }}>
            <Tab.Screen name="Mon"  component={() => CreateDayScreen('Monday')} />
            <Tab.Screen name="Tue"  component={() => CreateDayScreen('Tuesday')} />
            <Tab.Screen name="Wed"  component={() => CreateDayScreen('Wednesday')} />
            <Tab.Screen name="Thu" component={() => CreateDayScreen('Thursday')} />
            <Tab.Screen name="Fri"  component={() => CreateDayScreen('Friday')} />
            <Tab.Screen name="Sat" component={() => CreateDayScreen('Saturday')} />
            <Tab.Screen name="Sun"  component={() => CreateDayScreen('Sunday')} />
          </Tab.Navigator>
        </NavigationContainer>

        <CreateFooter/>

      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function CreateFooter() {
  return(
      <View style={{ backgroundColor: ColorDarkCyan, height: 70, flexDirection: 'row', borderRadius: 8 }}>
        <View style={ footerStyle.viewInside}>
          <Text>Calories</Text>
          <Text style={footerStyle.text}>0</Text>
        </View>
        <View style={footerStyle.viewInside}>
          <Text>Proteins</Text>
          <Text style={footerStyle.text}>0</Text>
        </View>
        <View style={footerStyle.viewInside}>
          <Text>Fat</Text>
          <Text style={footerStyle.text}>0</Text>
        </View>
        <View style={footerStyle.viewInside}>
          <Text>Carbs</Text>
          <Text style={footerStyle.text}>0</Text>
        </View>
      </View>
  );
}

function CreateDayScreen(dayName) {
  return (
    <View style ={{flex: 1, justifyContent: "stretch", alignItems: "stretch", backgroundColor: ColorEerieBlack}}>
      <View style={{ flex: 1, justifyContent: "flex-start", alignItems: "stretch", backgroundColor: ColorEerieBlack, margin: 4 }}>
        <MealSection title={"Breakfast"}/>
        <MealSection title={"Lunch"}/>
        <MealSection title={"Dinner"}/>
      </View>
    </View>
  );
}

function MealSection({title}) {
  return (
    <View style={{
      backgroundColor: ColorNight,
      padding: 14,
      borderRadius: 8,
      marginTop: 4,
      marginBottom: 4,
    }}>
      <Text style={{ color: 'white', fontSize: 18, marginBottom: 4 }}>{title}</Text>
      <Text style={{ color: '#aaa' }}>Calories:</Text>
    </View>
  );
}