import { useCallback, useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Dimensions, ActivityIndicator, Modal } from 'react-native';

import { useMutation, useConvex } from "convex/react";
import { api } from "../convex/_generated/api";
import { useUser } from "@clerk/clerk-expo";

import { LineChart } from 'react-native-chart-kit';
import { Calendar } from 'react-native-calendars';
import { format } from "date-fns";

import { GetWeekDates } from '../scripts/DateHelper';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as MyStyles from "../styles/MyStyles"

export default function WeightScreen() {
    const { user } = useUser();
    const userId = user?.id;

    const convex = useConvex();
    const upsertUserWeight = useMutation(api.weight.upsertUserWeightByDateQ);
    const deleteUserWeight = useMutation(api.weight.deleteUserWeightByDateQ);

    const [weightsArray, setWeightsArray] = useState(undefined);

    const today = useRef(format(new Date(), "yyyy-MM-dd"));
    const weekDates = useRef(GetWeekDates(new Date(), false));

    const [addModalFields, setAddModalFields] = useState({ weight: "", date: today.current });
    const [addModalVisible, setAddModalVisible] = useState(false);

    const chartWeightsArray = useMemo(() => {
        if (!weightsArray) {
            return [];
        }
        return PrepareDataForChart(weightsArray);
    }, [weightsArray]);

    function PrepareDataForChart(weightsArray) {
        return weekDates.current.map((d) => {
            const entry = weightsArray.find(i => i.date === d);
            return entry ? entry.weight : null;
        });
    }

    useEffect(() => {
        if (userId) {
            (async () => {
                setWeightsArray(await convex.query(api.weight.getUserWeightsByUserIdQ, { userId }));
                console.log("weight Q uE");
            }
            )();
        }
    }, [userId]);

    const handleCancel = () => {
        setAddModalVisible(false);
        setAddModalFields(c => { return { ...c, weight: "" } });
    }

    const handleAdd = useCallback(async () => {
        if (!userId || !addModalFields.weight || !addModalFields.date) {
            return;
        }

        setAddModalVisible(false);

        setWeightsArray(c => [...c.filter(i => i.date !== addModalFields.date), addModalFields].sort((a, b) => a.date.localeCompare(b.date)))

        await upsertUserWeight({
            userId: userId,
            date: addModalFields.date,
            weight: parseFloat(addModalFields.weight)
        });

        setAddModalFields(c => { return { ...c, weight: "" } });
    }, [userId, addModalFields]);

    const handleDelete = useCallback((date) => {
        setWeightsArray(c => c.filter(i => i.date !== date));

        deleteUserWeight({
            userId: userId,
            date: date
        });
    }, [userId]);

    return (
        <View style={{ backgroundColor: MyStyles.ColorNight, flex: 1 }}>

            <View style={{
                position: "absolute", top: 0, left: 0, right: 0, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, zIndex: 1,
                backgroundColor: MyStyles.ColorEerieBlack, overflow: "hidden", alignItems: "center"
            }}>

                <Chart weekWeightsArray={chartWeightsArray} />

            </View>

            <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: 240 + 5, paddingHorizontal: 5, paddingBottom: 95 + 10, alignItems: "stretch", flexDirection: "column-reverse", gap: 5 }}>

                {weightsArray === undefined ?
                    (<ActivityIndicator size={100} color={MyStyles.ColorSilver} />)
                    :
                    (weightsArray.map((item, index) => (
                        <View key={index} style={{ ...MyStyles.baseStyle.base, backgroundColor: MyStyles.ColorOnyx, alignItems: "stretch", padding: 5, elevation: 4, flexDirection: "row" }}>

                            <View style={{ flex: 1, overflow: 'hidden', justifyContent: "center" }}>
                                <Text
                                    style={{ ...MyStyles.baseStyle.text, color: MyStyles.ColorWhite, fontSize: 18 }}
                                    numberOfLines={1}
                                    ellipsizeMode="middle">{item.date}  /  {item.weight}</Text>

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
                                }}
                                onPress={() => handleDelete(item.date)}>

                                <MaterialIcons name="delete-forever" size={30} color={MyStyles.ColorDarkCyan} />

                            </TouchableOpacity>

                        </View>)
                    ))}

            </ScrollView>

            <TouchableOpacity style={{
                position: "absolute", alignSelf: "center", bottom: 25, width: 70, height: 70, borderRadius: 70 / 2, zIndex: 1, elevation: 2,
                backgroundColor: MyStyles.ColorEerieBlack, overflow: "hidden", alignItems: "center", justifyContent: "center"
            }} onPress={() => { setAddModalVisible(true) }}>
                <Ionicons name="add-circle" size={40} color={MyStyles.ColorDarkCyan} />

            </TouchableOpacity>

            <Modal
                animationType="fade"
                transparent={true}
                visible={addModalVisible}
                onRequestClose={() => setAddModalVisible(false)}>

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
                            paddingVertical: 5, paddingHorizontal: 10, fontFamily: MyStyles.BaseFont, marginBottom: 10
                        }}>Add Weight</Text>

                        <Calendar
                            style={{ ...MyStyles.baseStyle.base }}
                            onDayPress={(d) => {
                                setAddModalFields({ ...addModalFields, date: d.dateString });
                            }}
                            markedDates={{
                                [addModalFields.date]: {
                                    selected: true,
                                    marked: true,
                                    selectedColor: MyStyles.ColorDarkCyan,
                                },
                            }}
                        />

                        <View style={{ ...MyStyles.baseStyle.base, backgroundColor: MyStyles.ColorOnyx, padding: 10, marginVertical: 10 }}>

                            <Text style={{ fontFamily: MyStyles.BaseFont, fontSize: 14, alignSelf: "center", color: MyStyles.ColorWhite }}>Weight:</Text>

                            <TextInput
                                placeholder="Weight"
                                value={addModalFields.weight}
                                onChangeText={(t) => setAddModalFields({ ...addModalFields, weight: t })}
                                placeholderTextColor={MyStyles.ColorSilver}
                                style={{ borderBottomWidth: 1, color: MyStyles.ColorWhite, borderColor: MyStyles.ColorWhite }}
                                keyboardType="numeric"
                            />

                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                            <TouchableOpacity style={{ ...MyStyles.baseStyle.base, backgroundColor: MyStyles.ColorDarkCyan }} onPress={handleCancel}>
                                <Text style={{ ...MyStyles.baseStyle.text, color: MyStyles.ColorBlack, fontSize: 16 }}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{ ...MyStyles.baseStyle.base, backgroundColor: MyStyles.ColorDarkCyan }} onPress={handleAdd}>
                                <Text style={{ ...MyStyles.baseStyle.text, color: MyStyles.ColorBlack, fontFamily: MyStyles.BaseFontMedium, fontSize: 16 }}>Add +</Text>
                            </TouchableOpacity>

                        </View>

                    </View>
                </View>
            </Modal>

        </View>
    );
}

function Chart({ weekWeightsArray }) {

    function InterpolateNullsLerp(array) {
        const result = [...array];

        if (!result.some(val => typeof val === 'number')) {
            return [0];
        }

        let firstIndex = result.findIndex(val => typeof val === 'number');
        if (firstIndex > 0) {
            for (let i = 0; i < firstIndex; i++) {
                result[i] = result[firstIndex];
            }
        }

        let lastIndex = -1;
        for (let i = result.length - 1; i >= 0; i--) {
            if (typeof result[i] === 'number') {
                lastIndex = i;
                break;
            }
        }
        if (lastIndex !== -1 && lastIndex < result.length - 1) {
            for (let i = lastIndex + 1; i < result.length; i++) {
                result[i] = result[lastIndex];
            }
        }

        for (let i = 0; i < result.length; i++) {
            if (typeof result[i] !== 'number') {
                let left = i - 1;
                while (left >= 0 && typeof result[left] !== 'number') left--;

                let right = i + 1;
                while (right < result.length && typeof result[right] !== 'number') right++;

                if (left >= 0 && right < result.length) {
                    const a = result[left];
                    const b = result[right];
                    const t = (i - left) / (right - left);
                    result[i] = a + (b - a) * t;
                }
            }
        }

        return result;
    }

    const screenWidth = Dimensions.get("window").width;

    const data = {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
            {
                data: weekWeightsArray.length > 0 ? InterpolateNullsLerp(weekWeightsArray) : [0],
                strokeWidth: 3,
                color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`
            },
        ],
        legend: ["Weight this week"]
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