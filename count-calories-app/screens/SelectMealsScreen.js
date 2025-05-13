import { useState, useContext, useEffect, useCallback } from 'react';
import { Text, View, TouchableOpacity, Modal, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from '@react-navigation/native';

import { startOfWeek, endOfWeek, eachDayOfInterval, format, getISODay } from "date-fns";

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as MyStyles from "../styles/MyStyles"

export default function SelectMealsScreen({ route }) {
  const { meals } = route?.params;
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, backgroundColor: MyStyles.ColorNight }}>

      <Text style={{
        position: "absolute", top: 0, left: 0, right: 0, zIndex: 1,
        paddingVertical: 12, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, textAlign: "center", fontFamily: MyStyles.BaseFont, fontSize: 28,
        color: MyStyles.ColorWhite, backgroundColor: MyStyles.ColorEerieBlack, elevation: 8
      }}>{`Barcode: ${meals.barcode}\nChoose a product:`}</Text>

      <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 99 + 5, paddingHorizontal: 5, paddingBottom: 10, alignItems: "stretch", gap: 5 }}>

        {meals && (
          <TouchableOpacity style={{ borderRadius: 16, backgroundColor: MyStyles.ColorOnyx, alignItems: "stretch", padding: 5, elevation: 4 }}>

            <Text style={{
              ...MyStyles.baseStyle.base, ...MyStyles.baseStyle.text,
              backgroundColor: MyStyles.ColorEerieBlack, color: MyStyles.ColorDarkCyan, fontSize: 22, marginHorizontal: 5, marginBottom: 5, alignSelf: "center",
              elevation: 2
            }}>
              {meals.name}
            </Text>

            <Text style={{ ...MyStyles.baseStyle.text, color: MyStyles.ColorWhite, fontSize: 18, alignSelf: "center" }}>{`Calories: ${meals.calories}`}</Text>

            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <Text style={{ ...MyStyles.baseStyle.text, color: MyStyles.ColorWhite, fontSize: 16 }}>{`Proteins: ${meals.proteins}`}</Text>
              <Text style={{ ...MyStyles.baseStyle.text, color: MyStyles.ColorWhite, fontSize: 16 }}>{`Fat: ${meals.fat}`}</Text>
              <Text style={{ ...MyStyles.baseStyle.text, color: MyStyles.ColorWhite, fontSize: 16 }}>{`Carbohydrates: ${meals.carbs}`}</Text>
            </View>

          </TouchableOpacity>
        )}

      </ScrollView>
    </View>
  );
}