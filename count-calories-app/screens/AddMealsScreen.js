import { useState, useContext, useEffect } from 'react';
import { Text, View, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from '@react-navigation/native';

import * as MyStyles from "../styles/MyStyles"
import { mealDB, MealEntry } from '../scripts/MealDatabase'
import { dailyTargetsContext, scannedBarcodeContext, refreshDayContext } from '../scripts/Context';


const Tab = createMaterialTopTabNavigator();

export default function AddMealScreen() {
  const { dayRefreshArray } = useContext(refreshDayContext);

  return (
    <View style={{ backgroundColor: MyStyles.ColorEerieBlack, flex: 1 }}>
      <Tab.Navigator
        screenOptions={{
          tabBarScrollEnabled: true,
          tabBarLabelStyle: { fontSize: 14, fontFamily: MyStyles.BaseFont },
          tabBarItemStyle: { width: 70, height: 50 },
          tabBarIndicatorStyle: { backgroundColor: MyStyles.ColorBlack, height: 3 },
          tabBarStyle: {
            backgroundColor: MyStyles.ColorDarkCyan, borderRadius: 8, overflow: 'hidden',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            elevation: 10
          }
        }}>
        <Tab.Screen key={`Mo-${dayRefreshArray[0]}`} name="Mon" component={DayScreen} initialParams={{ dayName: "Monday" }} />
        <Tab.Screen key={`Tu-${dayRefreshArray[1]}`} name="Tue" component={DayScreen} initialParams={{ dayName: "Tuesday" }} />
        <Tab.Screen key={`We-${dayRefreshArray[2]}`} name="Wed" component={DayScreen} initialParams={{ dayName: "Wednesday" }} />
        <Tab.Screen key={`Th-${dayRefreshArray[3]}`} name="Thu" component={DayScreen} initialParams={{ dayName: "Thursday" }} />
        <Tab.Screen key={`Fr-${dayRefreshArray[4]}`} name="Fri" component={DayScreen} initialParams={{ dayName: "Friday" }} />
        <Tab.Screen key={`Sa-${dayRefreshArray[5]}`} name="Sat" component={DayScreen} initialParams={{ dayName: "Saturday" }} />
        <Tab.Screen key={`Su-${dayRefreshArray[6]}`} name="Sun" component={DayScreen} initialParams={{ dayName: "Sunday" }} />
      </Tab.Navigator>
    </View>
  );
}

function DayScreen({ route }) {
  const { dayName } = route.params;

  const [refreshFooter, setRefreshFooter] = useState(false);
  const Refresh = () => setRefreshFooter(c => !c);

  return (
    <View style={{ flex: 1, justifyContent: "stretch", alignItems: "stretch", backgroundColor: MyStyles.ColorEerieBlack }}>

      <ScrollView contentContainerStyle={{ alignItems: "stretch", paddingHorizontal: 4, paddingBottom: 90, paddingTop: 56, gap: 6 }} showsVerticalScrollIndicator={false}>

        <MealSection day={dayName} mealType={"Breakfast"} onMealAdded={Refresh} />
        <MealSection day={dayName} mealType={"Lunch"} onMealAdded={Refresh} />
        <MealSection day={dayName} mealType={"Dinner"} onMealAdded={Refresh} />

      </ScrollView>

      <CaloriesFooter key={refreshFooter} day={dayName} />

    </View>
  );
}

function CaloriesFooter({ day }) {
  const { calories: caloriesTotal, proteins: proteintsTotal, fat: fatTotal, carbs: carbsTotal } = mealDB.getDayTotals(day);
  const { dailyTargets } = useContext(dailyTargetsContext);
  const { calories: caloriesTarget, proteins: proteinsTarget, fat: fatTarget, carbs: carbsTarget } = dailyTargets;

  function ProgressBar({ actual, target }) {
    if (typeof (actual) != "number" || typeof (target) != "number") {
      actual = 0;
      target = 1;
    }

    const result = Math.min(Math.max((actual / target), 0), 1) * 100;

    return (
      <View style={{ ...MyStyles.baseStyle.base, backgroundColor: MyStyles.ColorNight, alignSelf: "stretch", height: 10, marginBottom: 5, overflow: "hidden" }}>
        <View style={{ borderRadius: 4, backgroundColor: MyStyles.ColorSilver, flex: 1, width: `${result}%` }} />
      </View>
    );
  }

  return (
    <View style={{
      backgroundColor: MyStyles.ColorDarkCyan, position: "absolute", bottom: 0, left: 0, right: 0, height: 82, marginHorizontal: 8,
      flexDirection: 'row', borderTopLeftRadius: 8, borderTopRightRadius: 8,
      shadowColor: MyStyles.ColorBlack,
      elevation: 10
    }}>
      <View style={MyStyles.footerStyle.viewInside}>

        <ProgressBar actual={caloriesTotal} target={caloriesTarget} />
        <Text style={{ fontFamily: MyStyles.BaseFont }}>Calories</Text>
        <Text style={{ fontFamily: MyStyles.BaseFontMedium }}>{caloriesTotal} / {caloriesTarget}</Text>

      </View>
      <View style={MyStyles.footerStyle.viewInside}>

        <ProgressBar actual={proteintsTotal} target={proteinsTarget} />
        <Text style={{ fontFamily: MyStyles.BaseFont }}>Proteins</Text>
        <Text style={{ fontFamily: MyStyles.BaseFontMedium }}>{proteintsTotal} / {proteinsTarget}</Text>

      </View>
      <View style={MyStyles.footerStyle.viewInside}>

        <ProgressBar actual={fatTotal} target={fatTarget} />
        <Text style={{ fontFamily: MyStyles.BaseFont }}>Fat</Text>
        <Text style={{ fontFamily: MyStyles.BaseFontMedium }}>{fatTotal}/ {fatTarget}</Text>

      </View>
      <View style={MyStyles.footerStyle.viewInside}>

        <ProgressBar actual={carbsTotal} target={carbsTarget} />
        <Text style={{ fontFamily: MyStyles.BaseFont }}>Carbs</Text>
        <Text style={{ fontFamily: MyStyles.BaseFontMedium }}>{carbsTotal} / {carbsTarget}</Text>

      </View>
    </View>
  );
}

function MealSection({ day, mealType, onMealAdded }) {
  const navigation = useNavigation();

  const { setDayRefresh } = useContext(refreshDayContext);

  const [modalVisible, setModalVisible] = useState(false);

  const { scannedBarcode, setScannedBarcode } = useContext(scannedBarcodeContext);
  const [barcode, setBarcode] = useState("");
  const [waitsForBarcode, setWaitsForBarcode] = useState(false);

  const [mealName, setMealName] = useState('');
  const [mealGrams, setMealGrams] = useState('');
  const [productCalories, setProductCalories] = useState('');
  const [productProteins, setProductProteins] = useState('');
  const [productFat, setProductFat] = useState('');
  const [productCarbs, setProductCarbs] = useState('');

  useEffect(() => {
    if (!waitsForBarcode || !scannedBarcode) return;

    setWaitsForBarcode(false);
    setModalVisible(true);

    HandleScannedFromDatabase(scannedBarcode);

    setBarcode(scannedBarcode);
    setScannedBarcode("");
  }, [scannedBarcode]);

  const clearFields = () => {
    setBarcode("");

    setMealName("");
    setMealGrams("");

    setProductCalories("");
    setProductProteins("");
    setProductFat("");
    setProductCarbs("");
  }

  const handleAdd = () => {
    mealDB.addMeal(day, mealType, new MealEntry(
      mealName,
      mealGrams,
      productCalories,
      productProteins,
      productFat,
      productCarbs,
      barcode
    ));

    clearFields();

    onMealAdded?.();
    setModalVisible(false);

    setDayRefresh(day);
  };

  const handleCancel = () => {
    clearFields();

    setWaitsForBarcode(false);
    setModalVisible(false);
  };

  function HandleScannedFromDatabase(barcode) {
    const mealEntry = mealDB.getMealByBarcode(barcode)

    if (!mealEntry) {
      return false;
    }

    setMealName(mealEntry.name);
    setProductCalories(mealEntry.calories);
    setProductProteins(mealEntry.proteins);
    setProductFat(mealEntry.fat);
    setProductCarbs(mealEntry.carbs);

    return true;
  }

  return (
    <View style={{
      ...MyStyles.baseStyle.base,
      backgroundColor: MyStyles.ColorNight,
      padding: 10,
      flexDirection: "row",
      justifyContent: "space-between",
      elevation: 4
    }}>

      <View style={{ flex: 1 }}>

        <Text style={{ color: MyStyles.ColorWhite, fontSize: 18, marginBottom: 2, fontFamily: MyStyles.BaseFontMedium }}>{mealType}</Text>
        <Text style={{ color: MyStyles.ColorSilver, marginBottom: 6, fontFamily: MyStyles.BaseFont }}>Calories:</Text>

        {mealDB.getMeals(day, mealType).size > 0 && (
          <View style={{ gap: 5 }}>

            {[...mealDB.getMeals(day, mealType).values()].map((item, index) => (

              <View key={item.id} style={{
                ...MyStyles.baseStyle.base, backgroundColor: MyStyles.ColorOnyx, flexDirection: "row", justifyContent: "space-between",
                alignItems: "center", elevation: 2
              }}>

                <Text style={{ ...MyStyles.baseStyle.text, fontFamily: MyStyles.BaseFont, color: MyStyles.ColorWhite, fontSize: 15 }}>
                  {item.name}{item.name ? " - " : ""}{item.grams}{item.grams ? "g " : ""}({item.getTotalCalories()} kcal)
                </Text>

                <TouchableOpacity
                  style={{
                    ...MyStyles.baseStyle.base,
                    backgroundColor: MyStyles.ColorBlack,
                    alignItems: "center",
                    justifyContent: "center",
                    alignSelf: "stretch",
                    margin: 4,
                    elevation: 2
                  }}
                  onPress={() => {
                    mealDB.removeMeal(day, mealType, item.id);
                    onMealAdded?.();
                  }}>


                  <Text style={{ ...MyStyles.baseStyle.text, color: MyStyles.ColorWhite, fontSize: 14 }}>Remove</Text>

                </TouchableOpacity>

              </View>

            ))}

          </View>
        )}

      </View>

      <View style={{ alignItems: "flex-end", justifyContent: "flex-end" }}>

        <TouchableOpacity
          style={{
            ...MyStyles.baseStyle.base,
            backgroundColor: MyStyles.ColorDarkCyan,
            minHeight: 36,
            minWidth: 36,
            alignSelf: 'flex-end',
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 10,
            marginBottom: 4,
            elevation: 4
          }}
          onPress={() => {
            setModalVisible(false);
            setWaitsForBarcode(true);
            navigation.navigate("BarcodeScanner");
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
            marginLeft: 10,
            elevation: 4
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
          backgroundColor: 'rgba(0, 0, 0, 0.6)'
        }}>

          <View style={{
            ...MyStyles.baseStyle.base,
            backgroundColor: MyStyles.ColorEerieBlack,
            padding: 10,
            width: '80%'
          }}>

            <Text style={{
              ...MyStyles.baseStyle.base, alignSelf: "center",
              backgroundColor: MyStyles.ColorDarkCyan, fontSize: 18, color: MyStyles.ColorBlack,
              paddingVertical: 6, paddingHorizontal: 12
            }}>Add to {mealType}</Text>

            <View style={{ ...MyStyles.baseStyle.base, backgroundColor: MyStyles.ColorOnyx, padding: 10, marginBottom: 5, marginTop: 10 }}>

              <Text style={{ fontSize: 14, alignSelf: "center", color: MyStyles.ColorWhite }}>Barcode:</Text>

              <View style={{ flexDirection: "row", justifyContent: "stretch", alignSelf: "stretch" }}>

                <TextInput
                  placeholder="Barcode"
                  value={barcode}
                  onChangeText={setBarcode}
                  placeholderTextColor={MyStyles.ColorSilver}
                  style={{ borderBottomWidth: 1, marginRight: 10, flex: 1, color: MyStyles.ColorWhite, borderColor: MyStyles.ColorWhite }}
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
                    setWaitsForBarcode(true);
                    navigation.navigate("BarcodeScanner");
                  }}>
                  <Text style={{ color: MyStyles.ColorBlack, fontSize: 12 }}>|II|II|</Text>
                </TouchableOpacity>

              </View>

            </View>

            <View style={{ ...MyStyles.baseStyle.base, backgroundColor: MyStyles.ColorOnyx, padding: 10, marginBottom: 5 }}>

              <Text style={{ fontSize: 14, alignSelf: "center", color: MyStyles.ColorWhite }}>Meal data:</Text>

              <TextInput
                placeholder="Name"
                value={mealName}
                onChangeText={setMealName}
                placeholderTextColor={MyStyles.ColorSilver}
                style={{ borderBottomWidth: 1, marginBottom: 5, color: MyStyles.ColorWhite, borderColor: MyStyles.ColorWhite }}
              />

              <TextInput
                placeholder="Grams"
                value={mealGrams}
                onChangeText={setMealGrams}
                keyboardType="numeric"
                placeholderTextColor={MyStyles.ColorSilver}
                style={{ borderBottomWidth: 1, color: MyStyles.ColorWhite, borderColor: MyStyles.ColorWhite }}
              />

            </View>

            <View style={{ ...MyStyles.baseStyle.base, backgroundColor: MyStyles.ColorOnyx, padding: 10, marginBottom: 10 }}>

              <Text style={{ fontSize: 14, color: MyStyles.ColorWhite, alignSelf: "center" }}>Product data in 100 grams:</Text>

              <TextInput
                placeholder="Calories"
                value={productCalories}
                onChangeText={setProductCalories}
                keyboardType="numeric"
                placeholderTextColor={MyStyles.ColorSilver}
                style={{ borderBottomWidth: 1, marginBottom: 5, color: MyStyles.ColorWhite, borderColor: MyStyles.ColorWhite }}
              />
              <TextInput
                placeholder="Proteins"
                value={productProteins}
                onChangeText={setProductProteins}
                keyboardType="numeric"
                placeholderTextColor={MyStyles.ColorSilver}
                style={{ borderBottomWidth: 1, marginBottom: 5, color: MyStyles.ColorWhite, borderColor: MyStyles.ColorWhite }}
              />
              <TextInput
                placeholder="Fat"
                value={productFat}
                onChangeText={setProductFat}
                keyboardType="numeric"
                placeholderTextColor={MyStyles.ColorSilver}
                style={{ borderBottomWidth: 1, marginBottom: 5, color: MyStyles.ColorWhite, borderColor: MyStyles.ColorWhite }}
              />
              <TextInput
                placeholder="Carbs"
                value={productCarbs}
                onChangeText={setProductCarbs}
                keyboardType="numeric"
                placeholderTextColor={MyStyles.ColorSilver}
                style={{ borderBottomWidth: 1, color: MyStyles.ColorWhite, borderColor: MyStyles.ColorWhite }}
              />

            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

              <TouchableOpacity style={{ ...MyStyles.baseStyle.base, backgroundColor: MyStyles.ColorDarkCyan }} onPress={handleCancel}>
                <Text style={{ ...MyStyles.baseStyle.text, color: MyStyles.ColorBlack, fontSize: 16 }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={{ ...MyStyles.baseStyle.base, backgroundColor: MyStyles.ColorDarkCyan }} onPress={handleAdd}>
                <Text style={{ ...MyStyles.baseStyle.text, color: MyStyles.ColorBlack, fontWeight: 'bold', fontSize: 16 }}>Add +</Text>
              </TouchableOpacity>

            </View>

          </View>
        </View>
      </Modal>

    </View>
  );
}