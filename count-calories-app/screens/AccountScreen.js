import { useContext } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image } from 'react-native';

import { useUser } from '@clerk/clerk-expo';

import * as MyStyles from "../styles/MyStyles"


export default function AccountScreen() {

    const { user, isLoaded } = useUser();

    if (!isLoaded) {
        return null;
    }

    function InfoField({ description, info }) {
        return (
            <View style={{ ...MyStyles.baseStyle.base, backgroundColor: MyStyles.ColorEerieBlack, padding: 5 }}>

                <Text style={{
                    ...MyStyles.baseStyle.text,
                    color: MyStyles.ColorWhite,
                    fontSize: 18, textAlign: "center"
                }}>{description}:</Text>

                <Text style={{
                    ...MyStyles.baseStyle.text,
                    color: MyStyles.ColorWhite,
                    fontSize: 18, textAlign: "center"
                }}>{info}</Text>

            </View>
        );
    }

    return (
        <View style={{ backgroundColor: MyStyles.ColorEerieBlack, flex: 1, alignItems: "center" }}>

            <View style={{ flex: 1, gap: 15 }}>

                <Image source={{ uri: user.imageUrl }} style={{ marginTop: 15, width: 200, height: 200, borderRadius: 200 / 2, elevation: 6 }} />

                <Text style={{
                    ...MyStyles.baseStyle.base, ...MyStyles.baseStyle.text,
                    backgroundColor: MyStyles.ColorNight, color: MyStyles.ColorWhite,
                    fontSize: 30, textAlign: "center", elevation: 6
                }}>{user.username}</Text>

            </View>

            <View style={{ flex: 1, justifyContent: "center" }}>

                <View style={{ ...MyStyles.baseStyle.base, backgroundColor: MyStyles.ColorNight, gap: 5, padding: 5, elevation: 6 }}>

                    <InfoField description={"Email"} info={user.primaryEmailAddress?.emailAddress} />
                    <InfoField description={"Name"} info={user.fullName} />
                    <InfoField description={"Account Created"} info={new Date(user.createdAt).toLocaleDateString()} />

                </View>

            </View>

        </View>
    );
}
