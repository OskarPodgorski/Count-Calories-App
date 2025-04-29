import { useContext } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image } from 'react-native';

import { useUser } from '@clerk/clerk-expo';

import * as MyStyles from "../styles/MyStyles"


export default function AccountScreen() {

    const { user, isLoaded } = useUser();

    if (!isLoaded) {
        return null;
    }

    return (
        <View style={{ backgroundColor: MyStyles.ColorEerieBlack, flex: 1, alignItems: "center" }}>

            <View style={{ flex: 1, gap: 15 }}>

                <Image source={{ uri: user.imageUrl }} style={{ marginTop: 15, width: 200, height: 200, borderRadius: 200 / 2 }} />

                <Text style={{
                    ...MyStyles.baseStyle.base, ...MyStyles.baseStyle.text,
                    backgroundColor: MyStyles.ColorNight, color: MyStyles.ColorWhite,
                    fontFamily: MyStyles.BaseFont, fontSize: 30, textAlign: "center"
                }}>{user.username}</Text>

            </View>

            <View style={{ flex: 1, justifyContent: "center" }}>

                <View style={{ ...MyStyles.baseStyle.base, backgroundColor: MyStyles.ColorNight }}>

                    <Text style={{
                        ...MyStyles.baseStyle.text,
                        color: MyStyles.ColorWhite,
                        fontFamily: MyStyles.BaseFont, fontSize: 20, textAlign: "center"
                    }}>{user.fullName}</Text>

                    <Text style={{
                        ...MyStyles.baseStyle.text,
                        color: MyStyles.ColorWhite,
                        fontFamily: MyStyles.BaseFont, fontSize: 20, textAlign: "center"
                    }}>{user.primaryEmailAddress?.emailAddress}</Text>

                    <Text style={{
                        ...MyStyles.baseStyle.text,
                        color: MyStyles.ColorWhite,
                        fontFamily: MyStyles.BaseFont, fontSize: 20, textAlign: "center"
                    }}>{new Date(user.createdAt).toLocaleDateString()}</Text>

                </View>

            </View>

        </View>
    );
}
