import { useContext, useCallback } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Dimensions } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useFocusEffect } from '@react-navigation/native';

import { LineChart } from 'react-native-chart-kit';

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

                <CreateChart />

            </View>

            <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: 99 + 5, paddingHorizontal: 5, paddingBottom: 10, alignItems: "stretch", gap: 5 }}>

            </ScrollView>

        </View>
    );
}

function CreateChart() {
    const screenWidth = Dimensions.get("window").width;

    const data = {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
            {
                data: [115, 113, 112, 112, 111, 110, 108],
                strokeWidth: 3,
                color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // kolor linii
            },
        ],
        legend: ["Week Weight"], // optional
    };

    const chartConfig = {
        backgroundColor: MyStyles.ColorEerieBlack,
        backgroundGradientFrom: MyStyles.ColorEerieBlack, // ← to MUSI być ustawione
        backgroundGradientTo: MyStyles.ColorEerieBlack,   // ← i to też
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        decimalPlaces: 0
    };

    return (
        <LineChart
            data={data}
            width={screenWidth - 20}
            height={200}
            chartConfig={chartConfig}
            bezier={true}
            style={{
                marginBottom: 10
            }} />
    );
}