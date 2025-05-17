import { useContext, useCallback } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useFocusEffect } from '@react-navigation/native';

import * as MyStyles from "../styles/MyStyles"

const Tab = createMaterialTopTabNavigator();

export default function WeightScreen() {
    return (
        <View style={{ backgroundColor: MyStyles.ColorNight, flex: 1 }}>

            <View style={{
                position: "absolute", top: 0, left: 0, right: 0, borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
                backgroundColor: MyStyles.ColorEerieBlack, elevation: 8, overflow: "hidden", alignItems: "center"
            }}>
                <Text style={{ paddingVertical: 12, textAlign: "center", fontFamily: MyStyles.BaseFont, fontSize: 28, color: MyStyles.ColorWhite }}>Chart</Text>

                <View style={{ backgroundColor: MyStyles.ColorDarkCyan, elevation: 8, width: 100, height: 100 }}>

                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: 99 + 5, paddingHorizontal: 5, paddingBottom: 10, alignItems: "stretch", gap: 5 }}>

            </ScrollView>

        </View>
    );
}

function CreateChart() {
    return (
        <View style={{ flex: 1, backgroundColor: MyStyles.ColorEerieBlack }}>
            <Text style={{ color: MyStyles.ColorWhite }}>Chart</Text>
        </View>
    );
}