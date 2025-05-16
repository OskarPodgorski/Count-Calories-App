import { Modal, View, Text, TouchableOpacity } from "react-native";

import * as MyStyles from "../styles/MyStyles";

export function AlertModal({ modalParams, title, message, buttonsDef }) {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={modalParams.visible}
            onRequestClose={modalParams.onRequestClose}>

            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.6)'
            }}>

                <View style={{
                    ...MyStyles.baseStyle.base,
                    backgroundColor: MyStyles.ColorEerieBlack, padding: 10, elevation: 6
                }}>

                    <Text style={{ ...MyStyles.baseStyle.text, color: MyStyles.ColorWhite, fontSize: 20, textAlign: "center", paddingTop: 0 }} >{title}</Text>
                    <Text style={{ ...MyStyles.baseStyle.text, color: MyStyles.ColorWhite, fontSize: 16, textAlign: "center" }}>{message}</Text>

                    {buttonsDef && (

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>

                            {[...buttonsDef].map((item, index) => (

                                <TouchableOpacity key={index} style={{ ...MyStyles.baseStyle.base, backgroundColor: MyStyles.ColorNight, elevation: 2 }}
                                    onPress={item.action}>
                                    <Text style={{ ...MyStyles.baseStyle.text, color: MyStyles.ColorWhite, fontSize: 20 }}>{item.text}</Text>
                                </TouchableOpacity>

                            ))}

                        </View>
                    )}

                </View>

            </View>

        </Modal>
    );
}

export function InfoModal({ modalParams, title, message }) {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={modalParams.visible}
            onRequestClose={modalParams.onRequestClose}>

            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.6)'
            }}>

                <View style={{
                    ...MyStyles.baseStyle.base,
                    backgroundColor: MyStyles.ColorEerieBlack, padding: 10, elevation: 6, alignItems: "center"
                }}>

                    <Text style={{ ...MyStyles.baseStyle.text, color: MyStyles.ColorWhite, fontSize: 20, textAlign: "center", paddingTop: 0 }} >{title}</Text>
                    <Text style={{ ...MyStyles.baseStyle.text, color: MyStyles.ColorWhite, fontSize: 16, textAlign: "center" }}>{message}</Text>

                    <TouchableOpacity style={{ ...MyStyles.baseStyle.base, backgroundColor: MyStyles.ColorNight, elevation: 2, marginTop: 15 }}
                        onPress={modalParams.onRequestClose}>
                        <Text style={{ ...MyStyles.baseStyle.text, color: MyStyles.ColorWhite, fontSize: 22 }}>OK</Text>
                    </TouchableOpacity>

                </View>

            </View>

        </Modal>
    );
}