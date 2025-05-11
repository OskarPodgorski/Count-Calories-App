import { useState, useContext, useEffect } from 'react';
import { Text, View, TouchableOpacity, Modal, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from '@react-navigation/native';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import * as MyStyles from "../styles/MyStyles"
import { mealDB, MealEntry } from '../scripts/MealDatabase'
import { dailyTargetsContext, scannedBarcodeContext, refreshDayContext } from '../scripts/Context';

import { useQuery, useMutation, useConvex } from "convex/react";
import { api } from "../convex/_generated/api";

import { useUser } from "@clerk/clerk-expo";

const Tab = createMaterialTopTabNavigator();

export default function AddMealScreen() {
  const { user } = useUser();
  const userId = user?.id;

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
        <Tab.Screen key={`Mo-${dayRefreshArray[0]}`} name="Mon" component={DayScreen} initialParams={{ dayName: "Monday", userId: userId }} />
        <Tab.Screen key={`Tu-${dayRefreshArray[1]}`} name="Tue" component={DayScreen} initialParams={{ dayName: "Tuesday", userId: userId }} />
        <Tab.Screen key={`We-${dayRefreshArray[2]}`} name="Wed" component={DayScreen} initialParams={{ dayName: "Wednesday", userId: userId }} />
        <Tab.Screen key={`Th-${dayRefreshArray[3]}`} name="Thu" component={DayScreen} initialParams={{ dayName: "Thursday", userId: userId }} />
        <Tab.Screen key={`Fr-${dayRefreshArray[4]}`} name="Fri" component={DayScreen} initialParams={{ dayName: "Friday", userId: userId }} />
        <Tab.Screen key={`Sa-${dayRefreshArray[5]}`} name="Sat" component={DayScreen} initialParams={{ dayName: "Saturday", userId: userId }} />
        <Tab.Screen key={`Su-${dayRefreshArray[6]}`} name="Sun" component={DayScreen} initialParams={{ dayName: "Sunday", userId: userId }} />
      </Tab.Navigator>
    </View>
  );
}

function DayScreen({ route }) {
  const { dayName, userId } = route.params;

  const [refreshFooter, setRefreshFooter] = useState(false);
  const Refresh = () => setRefreshFooter(c => !c);

  const date = new Date().toISOString().split("T")[0];
  const dayData = useQuery(api.meals.getUserMealsByDateQ, userId ? { userId, date } : "skip");

  console.log(dayData);

  return (
    <View style={{ flex: 1, justifyContent: "stretch", alignItems: "stretch", backgroundColor: MyStyles.ColorEerieBlack }}>

      {dayData === undefined ?
        (<View style={{ flex: 1, justifyContent: "center", alignContent: "center" }}>
          <ActivityIndicator size={100} color={MyStyles.ColorSilver} />
        </View>)
        :
        (<ScrollView contentContainerStyle={{ alignItems: "stretch", paddingHorizontal: 4, paddingBottom: 90, paddingTop: 56, gap: 6 }} showsVerticalScrollIndicator={false}>

          <MealSection dayInfo={{ dayName, mealType: "Breakfast", date }} mealQueryArray={dayData?.meals?.["Breakfast"] ?? []} onMealAdded={Refresh} userID={userId} />
          <MealSection dayInfo={{ dayName, mealType: "Lunch", date }} mealQueryArray={dayData?.meals?.["Lunch"] ?? []} onMealAdded={Refresh} userID={userId} />
          <MealSection dayInfo={{ dayName, mealType: "Dinner", date }} mealQueryArray={dayData?.meals?.["Dinner"] ?? []} onMealAdded={Refresh} userID={userId} />

        </ScrollView>)
      }

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

function MealSection({ userID, dayInfo, mealQueryArray, onMealAdded }) {
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

  const convex = useConvex();
  const updateGlobalMeal = useMutation(api.meals.updateGlobalMealQ);
  const insertUserMeal = useMutation(api.meals.upsertUserMealsByDateQ)

  useEffect(() => {
    if (!waitsForBarcode || !scannedBarcode) return;

    setWaitsForBarcode(false);
    setModalVisible(true);

    setBarcode(scannedBarcode);
    HandleScannedFromDatabase(scannedBarcode);

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
    const mealEntry = {
      name: mealName,
      calories: parseFloat(productCalories),
      proteins: parseFloat(productProteins),
      fat: parseFloat(productFat),
      carbs: parseFloat(productCarbs)
    };

    updateGlobalMeal({
      ...mealEntry,
      barcode: barcode
    });

    insertUserMeal({
      userId: userID,
      date: dayInfo.date,
      mealType: dayInfo.mealType,
      meal: {
        ...mealEntry,
        grams: parseFloat(mealGrams)
      }
    });

    clearFields();

    onMealAdded?.();
    setModalVisible(false);

    setDayRefresh(dayInfo.dayName);
  };

  const handleCancel = () => {
    clearFields();

    setWaitsForBarcode(false);
    setModalVisible(false);
  };

  function HandleScannedFromDatabase() {
    convex.query(api.meals.getGlobalMealQ, { barcode: scannedBarcode })
      .then(data => {
        if (data) {
          setMealName(data.name);
          setProductCalories(data.calories.toString());
          setProductProteins(data.proteins.toString());
          setProductFat(data.fat.toString());
          setProductCarbs(data.carbs.toString());
        }
      });

    return true;
  }

  return (
    <View style={{
      ...MyStyles.baseStyle.base,
      backgroundColor: MyStyles.ColorNight,
      padding: 10,
      elevation: 4,
      gap: 10,
      alignItems: "stretch"
    }}>

      <View style={{ padding: 2, gap: 2 }}>

        <Text style={{ color: MyStyles.ColorWhite, fontSize: 18, fontFamily: MyStyles.BaseFontMedium }}>{dayInfo.mealType}</Text>
        <Text style={{ color: MyStyles.ColorSilver, fontFamily: MyStyles.BaseFont }}>Calories:</Text>

      </View>

      {mealQueryArray.size > 0 && (
        <View style={{ gap: 5 }}>

          {mealQueryArray.map((item, index) => (

            <View key={item.id} style={{
              ...MyStyles.baseStyle.base, backgroundColor: MyStyles.ColorOnyx, flexDirection: "row", justifyContent: "space-between",
              alignItems: "center", elevation: 2
            }}>

              <Text style={{ ...MyStyles.baseStyle.text, fontFamily: MyStyles.BaseFont, color: MyStyles.ColorWhite, fontSize: 15 }}>
                {item.name}{item.name ? " - " : ""}{item.grams}{item.grams ? "g " : ""}({item.calories} kcal)
              </Text>

              <TouchableOpacity
                style={{
                  ...MyStyles.baseStyle.base,
                  backgroundColor: MyStyles.ColorNight,
                  alignItems: "center",
                  justifyContent: "center",
                  alignSelf: "stretch",
                  margin: 2,
                  padding: 4,
                  elevation: 1
                }}
                onPress={() => {
                  //mealDB.removeMeal(day, mealType, item.id);
                  onMealAdded?.();
                }}>


                <MaterialIcons name="delete-forever" size={30} color={MyStyles.ColorDarkCyan} />

              </TouchableOpacity>

            </View>

          ))}

        </View>
      )}


      <View style={{ flexDirection: "row-reverse", gap: 5 }}>

        <TouchableOpacity
          style={{
            ...MyStyles.baseStyle.base,
            backgroundColor: MyStyles.ColorDarkCyan,
            minHeight: 36,
            minWidth: 36,
            alignItems: "center",
            justifyContent: "center",
            elevation: 4
          }}
          onPress={() => setModalVisible(true)}>
          <Text style={{ color: MyStyles.ColorBlack, fontSize: 22 }}>+</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            ...MyStyles.baseStyle.base,
            backgroundColor: MyStyles.ColorDarkCyan,
            minHeight: 36,
            minWidth: 36,
            alignItems: "center",
            justifyContent: "center",
            elevation: 4
          }}
          onPress={() => {
            setModalVisible(false);
            setWaitsForBarcode(true);
            navigation.navigate("BarcodeScanner");
          }}>
          <Text style={{ color: MyStyles.ColorBlack, fontSize: 12 }}>|II|II|</Text>
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
            }}>Add to {dayInfo.mealType}</Text>

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