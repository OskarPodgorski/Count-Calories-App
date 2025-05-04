import { Modal, View, Text, TouchableOpacity } from "react-native";

import * as MyStyles from "../styles/MyStyles";

export function AlertModal({ title, message, buttonsDef, enabled }) {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={enabled}>

            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.5)'
            }}>

                <View style={{
                    ...MyStyles.baseStyle.base,
                    backgroundColor: MyStyles.ColorEerieBlack, padding: 5
                }}>

                    <Text style={{ ...MyStyles.baseStyle.text, color: MyStyles.ColorWhite, fontSize: 20, textAlign: "center" }} >{title}</Text>
                    <Text style={{ ...MyStyles.baseStyle.text, color: MyStyles.ColorWhite, fontSize: 16, textAlign: "center" }}>{message}</Text>

                    {buttonsDef && (<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>

                        <TouchableOpacity style={{ ...MyStyles.baseStyle.base, backgroundColor: MyStyles.ColorNight }}
                            onPress={buttonsDef[0].action}>
                            <Text style={{ ...MyStyles.baseStyle.text, color: MyStyles.ColorWhite, fontSize: 18 }}>{buttonsDef[0].text}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ ...MyStyles.baseStyle.base, backgroundColor: MyStyles.ColorNight }}
                            onPress={buttonsDef[1].action}>
                            <Text style={{ ...MyStyles.baseStyle.text, color: MyStyles.ColorWhite, fontSize: 18 }}>{buttonsDef[1].text}</Text>
                        </TouchableOpacity>

                    </View>)}

                </View>

            </View>

        </Modal>
    );
}