import 'react-native-get-random-values';
import 'react-native-gesture-handler';

import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, TextInput } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { MealDatabase, mealDB, MealEntry } from './scripts/MealDatabase'
import SettingsScreen from './screens/SettingsScreen';

const ColorDarkCyan = "#0E9594";
const ColorBlack = "#000000";
const ColorEerieBlack = "#222222";
const ColorNight = "#161616";

const Tab = createMaterialTopTabNavigator();
const Drawer = createDrawerNavigator();

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

export default function App() {
  return (
    <SafeAreaProvider>

      <StatusBar style="light" backgroundColor= {ColorEerieBlack} />
      <SafeAreaView style={{ flex: 1 , backgroundColor: ColorEerieBlack}}>

        <NavigationContainer>

          <DrawerCreate/>

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
        backgroundColor: ColorEerieBlack,
        width: 200,
        borderBottomRightRadius:8,
        borderTopRightRadius:0
      },
      drawerLabelStyle: {
        color: "white",
        fontSize: 14,
      },
      headerStyle: {
        backgroundColor: ColorEerieBlack,
        height: 60
      },
      headerStatusBarHeight: 0,
      headerTitleAlign: "center",
      headerTintColor: "white",
      headerShadowVisible: false,
      headerTitleStyle: {
        textAlignVertical: "top",
        fontSize: 18
      },
  }}
  >
    <Drawer.Screen name="Home Screen" component={TabNavigator} />
    <Drawer.Screen name="Settings" component={SettingsScreen} />
  </Drawer.Navigator>
  );
}

function TabNavigator() {
  return(
      <View style={{backgroundColor: ColorEerieBlack, flex: 1}}>
          <Tab.Navigator
            screenOptions={{            
              tabBarScrollEnabled: true,
              tabBarLabelStyle: { fontSize: 14 },
              tabBarItemStyle: { width: 70 },
              tabBarIndicatorStyle: { backgroundColor: ColorBlack , height: 3 },
              tabBarStyle: { backgroundColor : ColorDarkCyan, borderRadius: 8, overflow: 'hidden'}             
            }}>
            <Tab.Screen name="Mon"  component={() => DayScreen('Monday')} />
            <Tab.Screen name="Tue"  component={() => DayScreen('Tuesday')} />
            <Tab.Screen name="Wed"  component={() => DayScreen('Wednesday')} />
            <Tab.Screen name="Thu" component={() => DayScreen('Thursday')} />
            <Tab.Screen name="Fri"  component={() => DayScreen('Friday')} />
            <Tab.Screen name="Sat" component={() => DayScreen('Saturday')} />
            <Tab.Screen name="Sun"  component={() => DayScreen('Sunday')} />
          </Tab.Navigator>
        </View>
  );
}

function CaloriesFooter({day}) {
  const {calories,proteins,fat,carbs} = mealDB.getDayTotals(day);

  return(
      <View style={{ backgroundColor: ColorDarkCyan, height: 80, flexDirection: 'row', borderTopLeftRadius: 8, borderTopRightRadius: 8}}>
        <View style={footerStyle.viewInside}>
          <Text>Calories</Text>
          <Text style={footerStyle.text}>{calories}</Text>
        </View>
        <View style={footerStyle.viewInside}>
          <Text>Proteins</Text>
          <Text style={footerStyle.text}>{proteins}</Text>
        </View>
        <View style={footerStyle.viewInside}>
          <Text>Fat</Text>
          <Text style={footerStyle.text}>{fat}</Text>
        </View>
        <View style={footerStyle.viewInside}>
          <Text>Carbs</Text>
          <Text style={footerStyle.text}>{carbs}</Text>
        </View>
      </View>
  );
}

function DayScreen(dayName) {
  const [refreshFooter, setRefreshFooter] = useState(false);

  return (
    <View style ={{flex: 1, justifyContent: "stretch", alignItems: "stretch", backgroundColor: ColorEerieBlack}}>

      <View style={{ flex: 1, justifyContent: "flex-start", alignItems: "stretch", backgroundColor: ColorEerieBlack, margin: 4}}>

        <MealSection day = {dayName} mealType={"Breakfast"} onMealAdded={()=> setRefreshFooter(prev => !prev)}/>
        <MealSection day = {dayName} mealType={"Lunch"} onMealAdded={()=> setRefreshFooter(prev => !prev)}/>
        <MealSection day = {dayName} mealType={"Dinner"} onMealAdded={()=> setRefreshFooter(prev => !prev)}/>

      </View>

      <CaloriesFooter key={refreshFooter} day={dayName}/> 

    </View>
  );
}

function MealSection({day, mealType, onMealAdded}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [mealName, setMealName] = useState('');
  const [mealGrams, setMealGrams] = useState('');
  const [productCalories, setProductCalories] = useState('');
  const [productProteins, setProductProteins] = useState('');
  const [productFat, setProductFat] = useState('');
  const [productCarbs, setProductCarbs] = useState('');
  
  const handleAdd = () => {
    mealDB.addMeal(day,mealType, new MealEntry(     
      mealName,
      mealGrams,
      productCalories,
      productProteins,
      productFat,
      productCarbs
    ));

    setModalVisible(false);

    setMealName("");
    setMealGrams("");
    setProductCalories("");
    setProductProteins("");
    setProductFat("");
    setProductCarbs("");

    onMealAdded?.();
  };

  return (
    <View style={{
      backgroundColor: ColorNight,
      padding: 12,
      borderRadius: 8,
      marginTop: 4,
      marginBottom: 4,
      flexDirection: "row",
      justifyContent: "space-between"
    }}>

    <View style={{ flex: 1 }}>

      <Text style={{ color: 'white', fontSize: 18, marginBottom: 4 }}>{mealType}</Text>
      <Text style={{ color: '#aaa' }}>Calories:</Text>
      
      {mealDB.getMeals(day, mealType).size > 0 && (
        <View style={{ marginTop: 12 }}>
        
          {[...mealDB.getMeals(day, mealType).values()].map((item, index) => (
            <View key={item.id} style={{ marginBottom: 4 }}>
              <Text style={{ color: 'white' }}>
                {item.name} - {item.grams}g ({item.getTotalCalories()} kcal)
              </Text>
            </View>
          ))}

        </View>
      )}

    </View>

      <View style={{alignItems: "flex-end", justifyContent: "flex-end"}}>
        <TouchableOpacity
          style={{
            backgroundColor: ColorDarkCyan,
            minHeight: 38,
            minWidth: 38,
            borderRadius: 8,
            alignSelf: 'flex-end',
            alignItems: "center",
            justifyContent: "center"
          }}
          onPress={() => setModalVisible(true)}>
          <Text style={{ color: {ColorBlack}, fontSize: 22 }}>+</Text>
        </TouchableOpacity>
      </View>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        >

        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.35)'
        }}>

          <View style={{
            backgroundColor: ColorDarkCyan,
            padding: 20,
            borderRadius: 8,
            width: '80%'
          }}>

             <View style={{
                backgroundColor: ColorEerieBlack,
                padding: 10,
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "center",
                alignSelf: "center"
              }}>
            
              <Text style={{ fontSize: 18, color: "white" }}>Add to {mealType}</Text>

              </View>

              <Text style={{ fontSize: 14, marginBottom: 5, marginTop: 15}}>Meal data:</Text>

            <TextInput
              placeholder="Name"
              value={mealName}
              onChangeText={setMealName}
              style={{ borderBottomWidth: 1, marginBottom: 5 }}
            />

            <TextInput
              placeholder="Grams"
              value={mealGrams}
              onChangeText={setMealGrams}
              keyboardType="numeric"
              style={{ borderBottomWidth: 1, marginBottom: 15 }}
            />

            <Text style={{ fontSize: 14, marginBottom: 5}}>Product data in 100 grams:</Text>

            <TextInput
              placeholder="Calories"
              value={productCalories}
              onChangeText={setProductCalories}
              keyboardType="numeric"
              style={{ borderBottomWidth: 1, marginBottom: 5 }}
            />
            <TextInput
              placeholder="Proteins"
              value={productProteins}
              onChangeText={setProductProteins}
              keyboardType="numeric"
              style={{ borderBottomWidth: 1, marginBottom: 5 }}
            />
            <TextInput
              placeholder="Fat"
              value={productFat}
              onChangeText={setProductFat}
              keyboardType="numeric"
              style={{ borderBottomWidth: 1, marginBottom: 5 }}
            />
            <TextInput
              placeholder="Carbs"
              value={productCarbs}
              onChangeText={setProductCarbs}
              keyboardType="numeric"
              style={{ borderBottomWidth: 1, marginBottom: 20 }}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={{ color: ColorEerieBlack }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleAdd}>
                <Text style={{ color: ColorBlack, fontWeight: 'bold' }}>Add +</Text>
              </TouchableOpacity>

            </View>

          </View>
        </View>
      </Modal>

    </View>
  );
}