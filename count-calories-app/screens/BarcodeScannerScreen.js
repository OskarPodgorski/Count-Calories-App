import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useCallback, useContext } from 'react';
import { Button, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { scannedBarcodeContext } from '../scripts/Context';

import * as MyStyles from "../styles/MyStyles"

export default function BarcodeScannerScreen() {
  const navigation = useNavigation();

  const [permission, requestPermission] = useCameraPermissions();
  const [cameraMounted, setCameraMounted] = useState(false);
  const [facing, setFacing] = useState('back');
  const [flashlight, setFlashlight] = useState(false);

  const { scannedBarcode, setScannedBarcode } = useContext(scannedBarcodeContext);

  useFocusEffect(
    useCallback(() => {
      setCameraMounted(true);
      return () => {
        setCameraMounted(false);
      };
    }, [])
  );

  function handleScan(barcode) {
    setScannedBarcode(barcode);
    navigation.navigate("Main");
  }

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View>
        <Text>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const toggleCameraFacing = () => { setFacing(c => (c === 'back' ? 'front' : 'back')); };
  const toggleFlashlight = () => { setFlashlight(c => !c); };

  return (
    <View style={{ flex: 1, backgroundColor: MyStyles.ColorEerieBlack }}>

      {cameraMounted && (<CameraView style={{ flex: 1, flexDirection: "column-reverse", alignItems: "center" }}
        facing={facing} enableTorch={flashlight}
        barcodeScannerSettings={{ barcodeTypes: ["ean13"] }}
        onBarcodeScanned={(b) => handleScan(b.data)}
      >

        <View style={{ ...MyStyles.baseStyle.base, zIndex: 0, marginBottom: "10%", alignItems: "center", backgroundColor: MyStyles.ColorEerieBlack, elevation: 6 }}>

          <View style={{ flexDirection: "row", gap: 10, padding: 10 }}>

            <TouchableOpacity style={{ ...MyStyles.baseStyle.base, backgroundColor: MyStyles.ColorDarkCyan, alignItems: "center", paddingTop: 6, elevation: 2 }} onPress={toggleCameraFacing}>

              <MaterialCommunityIcons name="camera-flip" size={28} color={MyStyles.ColorBlack} />
              <Text style={{ ...MyStyles.baseStyle.text, color: MyStyles.ColorBlack, fontSize: 18 }}>Flip Camera</Text>

            </TouchableOpacity>

            <TouchableOpacity style={{ ...MyStyles.baseStyle.base, backgroundColor: MyStyles.ColorDarkCyan, alignItems: "center", paddingTop: 6, elevation: 2 }} onPress={toggleFlashlight}>

              {flashlight ? (<Ionicons name="flash" size={28} color={MyStyles.ColorBlack} />) : (<Ionicons name="flash-off" size={28} color={MyStyles.ColorBlack} />)}
              <Text style={{ ...MyStyles.baseStyle.text, color: MyStyles.ColorBlack, fontSize: 18 }}>Flashlight</Text>

            </TouchableOpacity>

          </View>

        </View>

      </CameraView>)}

    </View>
  );
}

