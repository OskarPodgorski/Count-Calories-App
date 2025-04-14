import { useState, useContext } from 'react';
import { Text, View, TouchableOpacity, Modal, TextInput } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import * as MyStyles from "../styles/MyStyles"
import { mealDB, MealEntry } from '../scripts/MealDatabase'
import { dailyTargetsContext } from '../scripts/Context';

const Tab = createMaterialTopTabNavigator();

export default function AddMealScreen() {
    return(
        <View style={{backgroundColor: MyStyles.ColorEerieBlack, flex: 1}}>
            <Tab.Navigator
              screenOptions={{            
                tabBarScrollEnabled: true,
                tabBarLabelStyle: { fontSize: 14 },
                tabBarItemStyle: { width: 70 },
                tabBarIndicatorStyle: { backgroundColor: MyStyles.ColorBlack , height: 3 },
                tabBarStyle: { backgroundColor : MyStyles.ColorDarkCyan, borderRadius: 8, overflow: 'hidden'}             
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
    const {calories: caloriesTotal,proteins: proteintsTotal,fat: fatTotal,carbs: carbsTotal} = mealDB.getDayTotals(day);
    const { dailyTargets } = useContext(dailyTargetsContext);
    const {calories: caloriesTarget, proteins: proteinsTarget, fat: fatTarget, carbs: carbsTarget} = dailyTargets;
    
    return(
        <View style={{ backgroundColor: MyStyles.ColorDarkCyan, height: 80, marginHorizontal: 8, flexDirection: 'row', borderTopLeftRadius: 8, borderTopRightRadius: 8}}>
          <View style={MyStyles.footerStyle.viewInside}>
            <Text>Calories</Text>
            <Text style={MyStyles.footerStyle.text}>{caloriesTotal} / {caloriesTarget}</Text>
          </View>
          <View style={MyStyles.footerStyle.viewInside}>
            <Text>Proteins</Text>
            <Text style={MyStyles.footerStyle.text}>{proteintsTotal} / {proteinsTarget}</Text>
          </View>
          <View style={MyStyles.footerStyle.viewInside}>
            <Text>Fat</Text>
            <Text style={MyStyles.footerStyle.text}>{fatTotal}/ {fatTarget}</Text>
          </View>
          <View style={MyStyles.footerStyle.viewInside}>
            <Text>Carbs</Text>
            <Text style={MyStyles.footerStyle.text}>{carbsTotal} / {carbsTarget}</Text>
          </View>
        </View>
    );
  }
  
  function DayScreen(dayName) {
    const [refreshFooter, setRefreshFooter] = useState(false);
  
    return (
      <View style ={{flex: 1, justifyContent: "stretch", alignItems: "stretch", backgroundColor: MyStyles.ColorEerieBlack}}>
  
        <View style={{ flex: 1, justifyContent: "flex-start", alignItems: "stretch", backgroundColor: MyStyles.ColorEerieBlack, margin: 4}}>
  
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
        backgroundColor: MyStyles.ColorNight,
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
              backgroundColor: MyStyles.ColorDarkCyan,
              minHeight: 38,
              minWidth: 38,
              borderRadius: 8,
              alignSelf: 'flex-end',
              alignItems: "center",
              justifyContent: "center"
            }}
            onPress={() => setModalVisible(true)}>
            <Text style={{ color: MyStyles.ColorBlack, fontSize: 22 }}>+</Text>
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
              backgroundColor: MyStyles.ColorDarkCyan,
              padding: 20,
              borderRadius: 8,
              width: '80%'
            }}>
  
               <View style={{
                  backgroundColor: MyStyles.ColorEerieBlack,
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
                  <Text style={{ color: MyStyles.ColorEerieBlack }}>Cancel</Text>
                </TouchableOpacity>
  
                <TouchableOpacity onPress={handleAdd}>
                  <Text style={{ color: MyStyles.ColorBlack, fontWeight: 'bold' }}>Add +</Text>
                </TouchableOpacity>
  
              </View>
  
            </View>
          </View>
        </Modal>
  
      </View>
    );
  }