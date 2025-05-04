import { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';

import { useUser, useAuth } from '@clerk/clerk-expo';

import { AlertModal } from '../components/MyComponents';

import * as MyStyles from "../styles/MyStyles"


export default function AccountScreen() {
    const { signOut } = useAuth();
    const { user, isLoaded } = useUser();

    const [signOutModal, setSignOutModal] = useState(false);

    const Logout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to log out?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Logout",
                    onPress: async () => {
                        try {
                            await signOut();

                        } catch (e) {
                            console.error("Logout failed:", e);
                        }
                    },
                    style: "destructive"
                }
            ],
            { cancelable: true }
        );
    };

    if (!isLoaded) {
        return null;
    }

    if (user.externalAccounts.length > 0) {
        const accountType = user.externalAccounts[0].provider.toUpperCase();

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

                <View style={{ gap: 15, marginTop: 10 }}>

                    <Image source={{ uri: user.imageUrl }} style={{ width: 200, height: 200, borderRadius: 200 / 2, elevation: 6 }} />

                    <Text style={{
                        ...MyStyles.baseStyle.base, ...MyStyles.baseStyle.text,
                        backgroundColor: MyStyles.ColorNight, color: MyStyles.ColorWhite,
                        fontSize: 30, textAlign: "center", elevation: 6
                    }}>{user.username}</Text>

                    <View style={{ flexDirection: "row", gap: 60, justifyContent: "center" }}>

                        <TouchableOpacity style={{
                            width: 60, height: 60, borderRadius: 30, backgroundColor: MyStyles.ColorNight, elevation: 4,
                            alignItems: "center", justifyContent: "center"
                        }}>
                            <AntDesign name="deleteuser" size={30} color={MyStyles.ColorWhite} />
                        </TouchableOpacity>

                        <TouchableOpacity style={{
                            width: 60, height: 60, borderRadius: 30, backgroundColor: MyStyles.ColorNight, elevation: 4,
                            alignItems: "center", justifyContent: "center"
                        }}
                            onPress={() => { setSignOutModal(c => !c) }}>
                            <AntDesign name="logout" size={30} color={MyStyles.ColorWhite} />
                        </TouchableOpacity>

                    </View>

                </View>

                <View style={{ flex: 1, justifyContent: "center" }}>

                    <View style={{ ...MyStyles.baseStyle.base, backgroundColor: MyStyles.ColorNight, gap: 5, padding: 5, elevation: 6 }}>

                        <InfoField description={"Email"} info={user.primaryEmailAddress?.emailAddress} />
                        <InfoField description={"Name"} info={user.fullName} />
                        <InfoField description={"Created"} info={new Date(user.createdAt).toLocaleDateString()} />

                        {accountType && (
                            <InfoField description={"Account Type"} info={accountType} />
                        )}

                    </View>

                </View>

                <AlertModal title={"Logout"} message={"Are you sure you want to log out?"} enabled={signOutModal}
                    buttonsDef={[{ text: "Cancel", action: () => { setSignOutModal(false) } }, { text: "Logout", action: () => { setSignOutModal(false) } }]} />

            </View>
        );
    }
}