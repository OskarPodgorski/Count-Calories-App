import { useState, useContext } from 'react';
import { Text, View, TouchableOpacity, Modal, TextInput } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from '@react-navigation/native';

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

    function ProgressBar({actual,target}) {
      if(typeof(actual) != "number" || typeof(target) != "number"){
        actual = 0;
        target = 1;
      }

      const result = Math.min(Math.max((actual/target), 0), 1) * 100;
      
      return(
        <View style={{...MyStyles.baseStyle.base, backgroundColor: MyStyles.ColorNight, alignSelf: "stretch", height: 10, marginBottom: 5, overflow: "hidden"}}>
          <View style={{ borderRadius:4,backgroundColor: MyStyles.ColorSilver, flex: 1, width: `${result}%`}} />
        </View>
      );
    }
    
    return(
        <View style={{ backgroundColor: MyStyles.ColorDarkCyan, height: 82, marginHorizontal: 8, flexDirection: 'row', borderTopLeftRadius: 8, borderTopRightRadius: 8}}>
          <View style={MyStyles.footerStyle.viewInside}>

            <ProgressBar actual={caloriesTotal} target={caloriesTarget}/>
            <Text>Calories</Text>
            <Text style={MyStyles.footerStyle.text}>{caloriesTotal} / {caloriesTarget}</Text>

          </View>
          <View style={MyStyles.footerStyle.viewInside}>

          <ProgressBar actual={proteintsTotal} target={proteinsTarget}/>
            <Text>Proteins</Text>
            <Text style={MyStyles.footerStyle.text}>{proteintsTotal} / {proteinsTarget}</Text>

          </View>
          <View style={MyStyles.footerStyle.viewInside}>

          <ProgressBar actual={fatTotal} target={fatTarget}/>
            <Text>Fat</Text>
            <Text style={MyStyles.footerStyle.text}>{fatTotal}/ {fatTarget}</Text>

          </View>
          <View style={MyStyles.footerStyle.viewInside}>

          <ProgressBar actual={carbsTotal} target={carbsTarget}/>
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
    const [refresh, refreshUI] = useState(false);
    const Refresh = () => refreshUI(current => !current);

    const navigation = useNavigation();

    const [modalVisible, setModalVisible] = useState(false);

    const [barcode, setBarcode] = useState("");

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
        productCarbs,
        barcode
      ));
  
      Refresh();
      setModalVisible(false);
  
      setBarcode("");
      setMealName("");
      setMealGrams("");
      setProductCalories("");
      setProductProteins("");
      setProductFat("");
      setProductCarbs("");
  
      onMealAdded?.();
    };

    const handleScannedFromDatabase = () => {
      setMealName("");
      setMealGrams("");
      setProductCalories("");
      setProductProteins("");
      setProductFat("");
      setProductCarbs("");
      
      const mealEntry = mealDB.getMealByBarcode(barcode)

      if(!mealEntry){
        return;
      }

      setMealName(mealEntry.name);
      setProductCalories(mealEntry.calories);
      setProductProteins(mealEntry.proteins);
      setProductFat(mealEntry.fat);
      setProductCarbs(mealEntry.carbs);
    }
  
    return (
      <View style={{
        ...MyStyles.baseStyle.base,
        backgroundColor: MyStyles.ColorNight,
        padding: 10,
        marginTop: 4,
        marginBottom: 4,
        flexDirection: "row",
        justifyContent: "space-between"
      }}>
  
      <View style={{ flex: 1 }}>
  
        <Text style={{ color: 'white', fontSize: 18, marginBottom: 4 }}>{mealType}</Text>
        <Text style={{ color: '#aaa' }}>Calories:</Text>
        
        {mealDB.getMeals(day, mealType).size > 0 && (
          <View style={{marginTop:4}}>
          
            {[...mealDB.getMeals(day, mealType).values()].map((item, index) => (

              <View key={item.id} style={{
                ...MyStyles.baseStyle.base, marginTop: 6, backgroundColor: MyStyles.ColorOnyx, flexDirection: "row", justifyContent: "space-between",
                alignItems: "center"
                }}>

                <Text style={{...MyStyles.baseStyle.text, color: MyStyles.ColorWhite, fontSize:15 }}>
                  {item.name}{item.name ? " - " : ""}{item.grams}{item.grams ? "g " : ""}({item.getTotalCalories()} kcal)
                </Text>

                <TouchableOpacity
                style={{
                  ...MyStyles.baseStyle.base,
                  backgroundColor: MyStyles.ColorBlack,
                  alignItems: "center",
                  justifyContent: "center",
                  alignSelf: "stretch",
                  margin: 4
                }}
                onPress={()=>{
                  mealDB.removeMeal(day,mealType,item.id);
                  onMealAdded?.();
                  }}>

            <Text style={{...MyStyles.baseStyle.text, color: MyStyles.ColorWhite, fontSize: 14 }}>Remove</Text>

          </TouchableOpacity>

              </View>

            ))}
  
          </View>
        )}
  
      </View>
  
        <View style={{alignItems: "flex-end", justifyContent: "flex-end"}}>

          <TouchableOpacity
            style={{
              ...MyStyles.baseStyle.base,
              backgroundColor: MyStyles.ColorDarkCyan,
              minHeight: 36,
              minWidth: 36,
              alignSelf: 'flex-end',
              alignItems: "center",
              justifyContent: "center",
              marginLeft:10,
              marginBottom:4
            }}
            onPress={() => {
              setModalVisible(false);
              navigation.navigate("BarcodeScanner",
                {
                  setAddMealModalVisible: setModalVisible,
                  setBarcodeTextInput: setBarcode,
                  invokeMealDataFromDatabase: handleScannedFromDatabase
                }
              )
            }}>
            <Text style={{ color: MyStyles.ColorBlack, fontSize: 12 }}>|II|II|</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              ...MyStyles.baseStyle.base,
              backgroundColor: MyStyles.ColorDarkCyan,
              minHeight: 36,
              minWidth: 36,
              alignSelf: 'flex-end',
              alignItems: "center",
              justifyContent: "center",
              marginLeft:10
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
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          }}>
  
            <View style={{
              ...MyStyles.baseStyle.base,
              backgroundColor: MyStyles.ColorEerieBlack,
              padding: 10,
              width: '80%'
            }}>
              
                <Text style={{...MyStyles.baseStyle.base, alignSelf: "center", 
                  backgroundColor: MyStyles.ColorDarkCyan, fontSize: 18, color: MyStyles.ColorBlack,
                  paddingVertical: 6, paddingHorizontal:12 }}>Add to {mealType}</Text>

              <View style={{...MyStyles.baseStyle.base, backgroundColor: MyStyles.ColorOnyx, padding: 10, marginBottom:5 , marginTop:10 }}> 

                <Text style={{ fontSize: 14, alignSelf: "center", color: MyStyles.ColorWhite}}>Barcode:</Text>
    
                <View style={{ flexDirection: "row" , justifyContent: "stretch", alignSelf: "stretch"}}>

                   <TextInput
                   placeholder="Barcode"
                   value={barcode}
                   onChangeText={setBarcode}
                   placeholderTextColor= {MyStyles.ColorSilver}
                   style={{ borderBottomWidth: 1, marginRight:10, flex:1 , color: MyStyles.ColorWhite, borderColor: MyStyles.ColorWhite}}
                    />

                  <TouchableOpacity
                    style={{
                      ...MyStyles.baseStyle.base,
                      backgroundColor: MyStyles.ColorDarkCyan,
                      minHeight: 36,
                      minWidth: 36,
                      alignSelf: "flex-end",
                      alignItems: "center",
                      justifyContent: "center",                   
                    }}
                    onPress={() => {
                      setModalVisible(false);
                      navigation.navigate("BarcodeScanner",
                        {
                          setAddMealModalVisible: setModalVisible,
                          setBarcodeTextInput: setBarcode
                        }
                      )
                    }}>
                    <Text style={{ color: MyStyles.ColorBlack, fontSize: 12 }}>|II|II|</Text>
                  </TouchableOpacity>

                </View>

              </View>

              <View style={{...MyStyles.baseStyle.base, backgroundColor: MyStyles.ColorOnyx, padding: 10, marginBottom:5}}> 

                <Text style={{ fontSize: 14, alignSelf: "center", color: MyStyles.ColorWhite}}>Meal data:</Text>
  
              <TextInput
                placeholder="Name"
                value={mealName}
                onChangeText={setMealName}
                placeholderTextColor= {MyStyles.ColorSilver}
                style={{ borderBottomWidth: 1, marginBottom: 5 , color: MyStyles.ColorWhite, borderColor: MyStyles.ColorWhite}}
              />
  
              <TextInput
                placeholder="Grams"
                value={mealGrams}
                onChangeText={setMealGrams}
                keyboardType="numeric"
                placeholderTextColor= {MyStyles.ColorSilver}
                style={{ borderBottomWidth: 1, color: MyStyles.ColorWhite, borderColor: MyStyles.ColorWhite }}
              />  

              </View>

              <View style={{...MyStyles.baseStyle.base, backgroundColor: MyStyles.ColorOnyx, padding: 10, marginBottom:10}}>
  
                <Text style={{ fontSize: 14, color: MyStyles.ColorWhite, alignSelf: "center" }}>Product data in 100 grams:</Text>
                    
                <TextInput
                  placeholder="Calories"
                  value={productCalories}
                  onChangeText={setProductCalories}
                  keyboardType="numeric"
                  placeholderTextColor= {MyStyles.ColorSilver}
                  style={{ borderBottomWidth: 1, marginBottom: 5 , color: MyStyles.ColorWhite, borderColor: MyStyles.ColorWhite}}
                  />
                <TextInput
                  placeholder="Proteins"
                  value={productProteins}
                  onChangeText={setProductProteins}
                  keyboardType="numeric"
                  placeholderTextColor= {MyStyles.ColorSilver}
                  style={{ borderBottomWidth: 1, marginBottom: 5, color: MyStyles.ColorWhite, borderColor: MyStyles.ColorWhite }}
                  />
                <TextInput
                  placeholder="Fat"
                  value={productFat}
                  onChangeText={setProductFat}
                  keyboardType="numeric"
                  placeholderTextColor= {MyStyles.ColorSilver}
                  style={{ borderBottomWidth: 1, marginBottom: 5 , color: MyStyles.ColorWhite, borderColor: MyStyles.ColorWhite}}
                  />
                <TextInput
                  placeholder="Carbs"
                  value={productCarbs}
                  onChangeText={setProductCarbs}
                  keyboardType="numeric"
                  placeholderTextColor= {MyStyles.ColorSilver}
                  style={{ borderBottomWidth: 1, color: MyStyles.ColorWhite, borderColor: MyStyles.ColorWhite }}
                  />
  
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
  
                <TouchableOpacity style={{...MyStyles.baseStyle.base, backgroundColor: MyStyles.ColorDarkCyan}} onPress={() => setModalVisible(false)}>
                  <Text style={{...MyStyles.baseStyle.text, color: MyStyles.ColorBlack , fontSize: 16 }}>Cancel</Text>
                </TouchableOpacity>
  
                <TouchableOpacity style={{...MyStyles.baseStyle.base, backgroundColor: MyStyles.ColorDarkCyan}} onPress={handleAdd}>
                  <Text style={{ ...MyStyles.baseStyle.text, color: MyStyles.ColorBlack, fontWeight: 'bold', fontSize: 16 }}>Add +</Text>
                </TouchableOpacity>
  
              </View>
  
            </View>
          </View>
        </Modal>
  
      </View>
    );
  }