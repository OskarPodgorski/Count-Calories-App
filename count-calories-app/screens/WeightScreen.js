import { useContext, useCallback } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Dimensions } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useFocusEffect } from '@react-navigation/native';

import { LineChart } from 'react-native-chart-kit';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as MyStyles from "../styles/MyStyles"

const Tab = createMaterialTopTabNavigator();

export default function WeightScreen() {
    return (
        <View style={{ backgroundColor: MyStyles.ColorNight, flex: 1 }}>

            <View style={{
                position: "absolute", top: 0, left: 0, right: 0, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, zIndex: 1,
                backgroundColor: MyStyles.ColorEerieBlack, overflow: "hidden", alignItems: "center"
            }}>
                <Text style={{ paddingBottom: 12, textAlign: "center", fontFamily: MyStyles.BaseFont, fontSize: 28, color: MyStyles.ColorWhite }}>Chart</Text>

                <CreateChart />

            </View>

            <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: 289 + 5, paddingHorizontal: 5, paddingBottom: 10, alignItems: "stretch", gap: 5 }}>

                <View style={{ ...MyStyles.baseStyle.base, backgroundColor: MyStyles.ColorOnyx, alignItems: "stretch", padding: 5, elevation: 4, flexDirection: "row" }}>

                    <View style={{ flex: 1, overflow: 'hidden', justifyContent: "center" }}>
                        <Text
                            style={{ ...MyStyles.baseStyle.text, color: MyStyles.ColorWhite, fontSize: 18 }}
                            numberOfLines={1}
                            ellipsizeMode="middle">
                            Date: Weight:
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={{
                            ...MyStyles.baseStyle.base,
                            backgroundColor: MyStyles.ColorEerieBlack,
                            alignItems: "center",
                            justifyContent: "center",
                            alignSelf: "flex-end",
                            padding: 4,
                            elevation: 1
                        }}>

                        <MaterialIcons name="delete-forever" size={30} color={MyStyles.ColorDarkCyan} />

                    </TouchableOpacity>

                </View>

            </ScrollView>

            <TouchableOpacity style={{
                position: "absolute", alignSelf: "center", bottom: 30, width: 70, height: 70, borderRadius: 70 / 2, zIndex: 1, elevation: 2,
                backgroundColor: MyStyles.ColorEerieBlack, overflow: "hidden", alignItems: "center", justifyContent: "center"
            }}>
                <Ionicons name="add-circle" size={40} color={MyStyles.ColorDarkCyan} />

            </TouchableOpacity>

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
                color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`
            },
        ],
        legend: ["Week Weight"]
    };

    const chartConfig = {
        backgroundColor: MyStyles.ColorEerieBlack,
        backgroundGradientFrom: MyStyles.ColorEerieBlack,
        backgroundGradientTo: MyStyles.ColorEerieBlack,
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