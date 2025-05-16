import { useState, useContext, useEffect, useCallback, use } from 'react';
import { Text, View, TouchableOpacity, Modal, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from '@react-navigation/native';

import { startOfWeek, endOfWeek, eachDayOfInterval, format, getISODay } from "date-fns";

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as MyStyles from "../styles/MyStyles";

import { mealDB, MealEntry } from '../scripts/MealHelper'
import { AlertModal, InfoModal } from '../components/MyComponents';
import { dailyTargetsContext, scannedBarcodeContext, refreshDayContext } from '../scripts/Context';

import { useMutation, useConvex } from "convex/react";
import { api } from "../convex/_generated/api";

import { useUser } from "@clerk/clerk-expo";

const Tab = createMaterialTopTabNavigator();

export default function AddMealScreen() {
  const { user } = useUser();
  const userId = user?.id;

  const { dayRefreshArray } = useContext(refreshDayContext);

  function getWeekDates(date, fullTimestamp = false) {
    const weekDates = eachDayOfInterval({
      start: startOfWeek(date, { weekStartsOn: 1 }),
      end: endOfWeek(date, { weekStartsOn: 1 })
    });

    if (fullTimestamp) {
      return weekDates
    }
    else {
      return weekDates.map(d => format(d, "yyyy-MM-dd"));
    }
  }

  const today = new Date();
  const weekDates = getWeekDates(today);
  const dayIndex = getISODay(today) - 1;

  const tabNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
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
        }}
        initialRouteName={tabNames[dayIndex]}>

        <Tab.Screen key={`Mo-${dayRefreshArray[0]}`} name={tabNames[0]} component={DayScreen} initialParams={{ date: weekDates[0], dayName: "Monday", userId: userId }} />
        <Tab.Screen key={`Tu-${dayRefreshArray[1]}`} name={tabNames[1]} component={DayScreen} initialParams={{ date: weekDates[1], dayName: "Tuesday", userId: userId }} />
        <Tab.Screen key={`We-${dayRefreshArray[2]}`} name={tabNames[2]} component={DayScreen} initialParams={{ date: weekDates[2], dayName: "Wednesday", userId: userId }} />
        <Tab.Screen key={`Th-${dayRefreshArray[3]}`} name={tabNames[3]} component={DayScreen} initialParams={{ date: weekDates[3], dayName: "Thursday", userId: userId }} />
        <Tab.Screen key={`Fr-${dayRefreshArray[4]}`} name={tabNames[4]} component={DayScreen} initialParams={{ date: weekDates[4], dayName: "Friday", userId: userId }} />
        <Tab.Screen key={`Sa-${dayRefreshArray[5]}`} name={tabNames[5]} component={DayScreen} initialParams={{ date: weekDates[5], dayName: "Saturday", userId: userId }} />
        <Tab.Screen key={`Su-${dayRefreshArray[6]}`} name={tabNames[6]} component={DayScreen} initialParams={{ date: weekDates[6], dayName: "Sunday", userId: userId }} />

      </Tab.Navigator>
    </View>
  );
}

function DayScreen({ route }) {
  const { dayName, userId, date } = route.params;

  const [footerInfoArray, setFooterInfoArray] = useState([[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]);

  const convex = useConvex();
  const [dayData, setDayData] = useState(undefined);

  useEffect(() => {
    const fetchData = async () => {
      const result = await convex.query(api.meals.getUserMealsByDateQ, {
        userId,
        date,
      });
      console.log(result);

      setDayData(result);
    };

    if (userId) fetchData();

  }, [userId]);


  return (
    <View style={{ flex: 1, justifyContent: "stretch", alignItems: "stretch", backgroundColor: MyStyles.ColorEerieBlack }}>

      {dayData === undefined ?
        (<View style={{ flex: 1, justifyContent: "center", alignContent: "center" }}>
          <ActivityIndicator size={100} color={MyStyles.ColorSilver} />
        </View>)
        :
        (<ScrollView contentContainerStyle={{ alignItems: "stretch", paddingHorizontal: 4, paddingBottom: 90, paddingTop: 56, gap: 6 }} showsVerticalScrollIndicator={false}>

          <MealSection dayInfo={{ dayName, mealType: "Breakfast", mealIndex: 0, date }} mealQueryArray={dayData?.meals?.["Breakfast"] ?? []} onMealAdded={setFooterInfoArray} userID={userId} />
          <MealSection dayInfo={{ dayName, mealType: "Lunch", mealIndex: 1, date }} mealQueryArray={dayData?.meals?.["Lunch"] ?? []} onMealAdded={setFooterInfoArray} userID={userId} />
          <MealSection dayInfo={{ dayName, mealType: "Dinner", mealIndex: 2, date }} mealQueryArray={dayData?.meals?.["Dinner"] ?? []} onMealAdded={setFooterInfoArray} userID={userId} />

        </ScrollView>)
      }

      <CaloriesFooter day={dayName} footerInfoArray={footerInfoArray} />

    </View>
  );
}

function MealSection({ userID, dayInfo, mealQueryArray, onMealAdded }) {
  const navigation = useNavigation();
  const { setDayRefresh } = useContext(refreshDayContext);

  const convex = useConvex();
  const updateGlobalMeal = useMutation(api.meals.updateGlobalMealQ);
  const insertUserMeal = useMutation(api.meals.upsertUserMealsByDateQ);
  const deleteUserMeal = useMutation(api.meals.deleteUserMealByNanoIdQ);

  const [modalVisible, setModalVisible] = useState(false);
  const [sendToUsModalVisible, setSendToUsModalVisible] = useState(false);
  const [notFilledErrorVisible, setNotFilledErrorVisible] = useState(false);
  const [thanksInfoVisible, setThanksInfoVisible] = useState(false);

  const { scannedBarcode, setScannedBarcode } = useContext(scannedBarcodeContext);
  const [barcode, setBarcode] = useState("");
  const [waitsForBarcode, setWaitsForBarcode] = useState(false);

  const [mealName, setMealName] = useState('');
  const [mealGrams, setMealGrams] = useState('');
  const [productCalories, setProductCalories] = useState('');
  const [productProteins, setProductProteins] = useState('');
  const [productFat, setProductFat] = useState('');
  const [productCarbs, setProductCarbs] = useState('');

  const [mealsArray, setMealsArray] = useState(mealQueryArray);

  const checkIfAllFieldsFilled = () => {
    if (mealName !== "" &&
      mealGrams !== "" &&
      productCalories !== "" &&
      productProteins !== "" &&
      productFat !== "" &&
      productCarbs !== "") {
      if (barcode !== "") {
        return 2;
      }
      else {
        return 1;
      }
    }
    else {
      return 0;
    }
  }

  const getMacrosTotalArray = useCallback(() => {
    return mealsArray.reduce((total, meal) => {
      total[0] += meal.calories;
      total[1] += meal.proteins;
      total[2] += meal.fat;
      total[3] += meal.carbs;
      return total;
    }, [0, 0, 0, 0]);
  }, [mealsArray]);

  useEffect(() => {
    if (!waitsForBarcode || !scannedBarcode) return;

    setWaitsForBarcode(false);
    setScannedBarcode("");

    (async () => {
      if (!await handleScannedFromDatabase()) {
        setModalVisible(true);
        setBarcode(scannedBarcode);
      }
    })();

  }, [scannedBarcode]);

  useEffect(() => {
    onMealAdded?.(c => {
      c[dayInfo.mealIndex] = getMacrosTotalArray();
      return [...c];
    });
  }, [mealsArray]);

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
    const mealEntry = new MealEntry(
      mealName,
      mealGrams === "" ? 0 : parseFloat(mealGrams),
      productCalories === "" ? 0 : parseFloat(productCalories),
      productProteins === "" ? 0 : parseFloat(productProteins),
      productFat === "" ? 0 : parseFloat(productFat),
      productCarbs === "" ? 0 : parseFloat(productCarbs)
    );

    insertUserMeal({
      userId: userID,
      date: dayInfo.date,
      mealType: dayInfo.mealType,
      meal: { ...mealEntry }
    });

    setMealsArray(c => [...c, mealEntry]);
    clearFields();
    setModalVisible(false);
    setDayRefresh(dayInfo.dayName);
  };

  const handleCancel = () => {
    clearFields();

    setWaitsForBarcode(false);
    setModalVisible(false);
  };

  const handleSendToDB = () => {
    if (checkIfAllFieldsFilled() < 2) {
      setNotFilledErrorVisible(true);
      return;
    }

    updateGlobalMeal({
      barcode: barcode,
      name: mealName,
      calories: productCalories === "" ? 0 : parseFloat(productCalories),
      proteins: productProteins === "" ? 0 : parseFloat(productProteins),
      fat: productFat === "" ? 0 : parseFloat(productFat),
      carbs: productCarbs === "" ? 0 : parseFloat(productCarbs)
    });

    setThanksInfoVisible(true);
  }

  const handleDelete = useCallback(async (nanoId) => {
    const mealsArrayBackup = [...mealsArray];

    setMealsArray(c => c.filter(item => item.nanoId !== nanoId));

    try {
      if (!await deleteUserMeal({
        userId: userID,
        date: dayInfo.date,
        mealType: dayInfo.mealType,
        nanoId
      })) {
        setMealsArray(mealsArrayBackup);
      }
    }
    catch {
      setMealsArray(mealsArrayBackup);
    }
  }, [mealsArray, userID]);

  const handleScannedFromDatabase = useCallback(async () => {
    const data = await convex.query(api.meals.getGlobalMealsByBarcodeQ, { barcode: scannedBarcode });

    console.log(data.length);

    if (data && data.length > 0) {
      navigation.navigate("SelectMeals", {
        barcode: scannedBarcode,
        meals: data
      });

      return true;
    }

    return false;
  }, [scannedBarcode]);

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

      {mealsArray.length > 0 && (
        <View style={{ gap: 5 }}>

          {mealsArray.map((item, index) => (

            <View key={index} style={{
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
                onPress={() => { handleDelete(item.nanoId); }}>


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

              <TouchableOpacity style={{ ...MyStyles.baseStyle.base, backgroundColor: MyStyles.ColorSilver }} onPress={() => { setSendToUsModalVisible(true); }}>
                <Text style={{ ...MyStyles.baseStyle.text, color: MyStyles.ColorBlack, fontFamily: MyStyles.BaseFontMedium, fontSize: 16 }}>Send To Us</Text>
              </TouchableOpacity>

              <TouchableOpacity style={{ ...MyStyles.baseStyle.base, backgroundColor: MyStyles.ColorDarkCyan }} onPress={handleAdd}>
                <Text style={{ ...MyStyles.baseStyle.text, color: MyStyles.ColorBlack, fontFamily: MyStyles.BaseFontMedium, fontSize: 16 }}>Add +</Text>
              </TouchableOpacity>

            </View>

          </View>
        </View>
      </Modal>

      <AlertModal
        modalParams={{ visible: sendToUsModalVisible, onRequestClose: () => { setSendToUsModalVisible(false); } }}
        title="Send To Database"
        message="Do you want to send this meal to our global database?"
        buttonsDef={[{ text: "Cancel", action: () => { setSendToUsModalVisible(false); } }, { text: "Send", action: () => { setSendToUsModalVisible(false); handleSendToDB(); } }]} />

      <InfoModal
        modalParams={{ visible: notFilledErrorVisible, onRequestClose: () => { setNotFilledErrorVisible(false); } }}
        title="Info"
        message="Not all fields are filled!" />

      <InfoModal
        modalParams={{ visible: thanksInfoVisible, onRequestClose: () => { setThanksInfoVisible(false); } }}
        title="Info"
        message="Thanks for improving this App" />

    </View>
  );
}

function CaloriesFooter({ footerInfoArray }) {
  const { dailyTargets } = useContext(dailyTargetsContext);
  const { calories: caloriesTarget, proteins: proteinsTarget, fat: fatTarget, carbs: carbsTarget } = dailyTargets;

  const totals = footerInfoArray.reduce(
    (acc, item) => {
      acc.calories += item[0];
      acc.proteins += item[1];
      acc.fat += item[2];
      acc.carbs += item[3];
      return acc;
    },
    { calories: 0, proteins: 0, fat: 0, carbs: 0 }
  );

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

        <ProgressBar actual={totals.calories} target={caloriesTarget} />
        <Text style={{ fontFamily: MyStyles.BaseFont }}>Calories</Text>
        <Text style={{ fontFamily: MyStyles.BaseFontMedium }}>{totals.calories} / {caloriesTarget}</Text>

      </View>
      <View style={MyStyles.footerStyle.viewInside}>

        <ProgressBar actual={totals.proteins} target={proteinsTarget} />
        <Text style={{ fontFamily: MyStyles.BaseFont }}>Proteins</Text>
        <Text style={{ fontFamily: MyStyles.BaseFontMedium }}>{totals.proteins} / {proteinsTarget}</Text>

      </View>
      <View style={MyStyles.footerStyle.viewInside}>

        <ProgressBar actual={totals.fat} target={fatTarget} />
        <Text style={{ fontFamily: MyStyles.BaseFont }}>Fat</Text>
        <Text style={{ fontFamily: MyStyles.BaseFontMedium }}>{totals.fat}/ {fatTarget}</Text>

      </View>
      <View style={MyStyles.footerStyle.viewInside}>

        <ProgressBar actual={totals.carbs} target={carbsTarget} />
        <Text style={{ fontFamily: MyStyles.BaseFont }}>Carbs</Text>
        <Text style={{ fontFamily: MyStyles.BaseFontMedium }}>{totals.carbs} / {carbsTarget}</Text>

      </View>
    </View>
  );
}