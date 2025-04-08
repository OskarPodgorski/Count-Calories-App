import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const ColorDarkCyan = "#0E9594";
const ColorBlack = "#000000";
const ColorEerieBlack = "#222222";

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

        <CreateFooter/>

      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function CreateFooter() {
  return(
      <View style={{ backgroundColor: ColorDarkCyan, height: 70, flexDirection: 'row' }}>
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
    <View style={{ flex: 1, justifyContent: "flex-end", alignItems: "flex-start", backgroundColor: ColorEerieBlack }}>
      <MealSection title={"Breakfast"}/>
    </View>
  );
}

function MealSection({title}) {
  return (
    <View style={{
      backgroundColor: '#333',
      padding: 12,
      borderRadius: 8,
      marginBottom: 12,
    }}>
      <Text style={{ color: 'white', fontSize: 18, marginBottom: 4 }}>{title}</Text>
      <Text style={{ color: '#aaa' }}>Tu będą dodane produkty</Text>
    </View>
  );
}