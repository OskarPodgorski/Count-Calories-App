import { useState, useContext, useEffect, useCallback } from 'react';
import { Text, View, TouchableOpacity, Modal, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { selectedMealContext } from '../scripts/Context';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as MyStyles from "../styles/MyStyles"

export default function SelectMealsScreen({ route }) {
  const { meals, barcode } = route?.params;
  const navigation = useNavigation();

  const { setSelectedMeal } = useContext(selectedMealContext);

  function HandleSelect(meal) {
    setSelectedMeal(meal);
    navigation.popTo("Main");
  }

  return (
    <View style={{ flex: 1, backgroundColor: MyStyles.ColorNight }}>

      <Text style={{
        position: "absolute", top: 0, left: 0, right: 0, zIndex: 1,
        paddingVertical: 12, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, textAlign: "center", fontFamily: MyStyles.BaseFont, fontSize: 28,
        color: MyStyles.ColorWhite, backgroundColor: MyStyles.ColorEerieBlack, elevation: 8
      }}>{`Barcode: ${barcode}\nChoose a product:`}</Text>

      <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 99 + 5, paddingHorizontal: 5, paddingBottom: 10, alignItems: "stretch", gap: 5 }}>

        {meals && meals.length > 0 && (
          meals.map((item, index) => (

            <TouchableOpacity key={index} style={{ borderRadius: 16, backgroundColor: MyStyles.ColorOnyx, alignItems: "stretch", padding: 5, elevation: 4 }}
              onPress={() => { HandleSelect(item); }}>

              <Text style={{
                ...MyStyles.baseStyle.base, ...MyStyles.baseStyle.text,
                backgroundColor: MyStyles.ColorEerieBlack, color: MyStyles.ColorDarkCyan, fontSize: 22, marginHorizontal: 5, marginBottom: 5, alignSelf: "center",
                elevation: 2
              }}>
                {item.name}
              </Text>

              <Text style={{ ...MyStyles.baseStyle.text, color: MyStyles.ColorWhite, fontSize: 18, alignSelf: "center" }}>{`Calories: ${item.calories}`}</Text>

              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <Text style={{ ...MyStyles.baseStyle.text, color: MyStyles.ColorWhite, fontSize: 16 }}>{`Proteins: ${item.proteins}`}</Text>
                <Text style={{ ...MyStyles.baseStyle.text, color: MyStyles.ColorWhite, fontSize: 16 }}>{`Fat: ${item.fat}`}</Text>
                <Text style={{ ...MyStyles.baseStyle.text, color: MyStyles.ColorWhite, fontSize: 16 }}>{`Carbohydrates: ${item.carbs}`}</Text>
              </View>

            </TouchableOpacity>
          ))
        )}

      </ScrollView>
    </View>
  );
}