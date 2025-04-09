import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, TextInput } from 'react-native';
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
              tabBarStyle: { backgroundColor : ColorDarkCyan, borderBottomLeftRadius: 8, borderBottomRightRadius: 8, overflow: 'hidden'}             
            }}>
            <Tab.Screen name="Mon"  component={() => DayScreen('Monday')} />
            <Tab.Screen name="Tue"  component={() => DayScreen('Tuesday')} />
            <Tab.Screen name="Wed"  component={() => DayScreen('Wednesday')} />
            <Tab.Screen name="Thu" component={() => DayScreen('Thursday')} />
            <Tab.Screen name="Fri"  component={() => DayScreen('Friday')} />
            <Tab.Screen name="Sat" component={() => DayScreen('Saturday')} />
            <Tab.Screen name="Sun"  component={() => DayScreen('Sunday')} />
          </Tab.Navigator>
        </NavigationContainer>

        <CaloriesFooter/>

      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function CaloriesFooter() {
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

function DayScreen(dayName) {
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

  const [modalVisible, setModalVisible] = useState(false);
  const [productName, setProductName] = useState('');
  const [productCalories, setProductCalories] = useState('');

  const handleAdd = () => {
    console.log(`Dodano: ${productName} (${productCalories} kcal) do ${title}`);
    // tutaj dodasz logikę do stanu / wysyłania do listy
    setModalVisible(false);
    setProductName('');
    setProductCalories('');
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

      <View>
        <Text style={{ color: 'white', fontSize: 18, marginBottom: 4 }}>{title}</Text>
        <Text style={{ color: '#aaa' }}>Calories:</Text>
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
            borderRadius: 10,
            width: '80%'
          }}>
            <Text style={{ fontSize: 18, marginBottom: 10 }}>Add to {title}</Text>

            <TextInput
              placeholder="Name"
              value={productName}
              onChangeText={setProductName}
              style={{ borderBottomWidth: 1, marginBottom: 15 }}
            />

            <Text style={{ fontSize: 14, marginBottom: 5}}>In 100 grams:</Text>

            <TextInput
              placeholder="Calories"
              value={productCalories}
              onChangeText={setProductCalories}
              keyboardType="numeric"
              style={{ borderBottomWidth: 1, marginBottom: 5 }}
            />
            <TextInput
              placeholder="Proteins"
              value={productCalories}
              onChangeText={setProductCalories}
              keyboardType="numeric"
              style={{ borderBottomWidth: 1, marginBottom: 5 }}
            />
            <TextInput
              placeholder="Fat"
              value={productCalories}
              onChangeText={setProductCalories}
              keyboardType="numeric"
              style={{ borderBottomWidth: 1, marginBottom: 5 }}
            />
            <TextInput
              placeholder="Carbs"
              value={productCalories}
              onChangeText={setProductCalories}
              keyboardType="numeric"
              style={{ borderBottomWidth: 1, marginBottom: 25 }}
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