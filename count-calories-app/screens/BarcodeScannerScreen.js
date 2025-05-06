import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useCallback, useContext, useRef, useEffect } from 'react';
import { Button, Text, TouchableOpacity, View, Animated, Easing } from 'react-native';
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

  const laserAnim = useRef(new Animated.Value(0)).current;

  const laserBottomMargin = (3 + (4 * 2));
  const laserTranslateY = laserAnim.interpolate({
    inputRange: [0, 0.35, 0.65, 1],
    outputRange: [0, 28, 280 - 28 - laserBottomMargin, 280 - laserBottomMargin]
  });

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(laserAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(laserAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

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

      {cameraMounted && (<CameraView style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        facing={facing} enableTorch={flashlight}
        barcodeScannerSettings={{ barcodeTypes: ["ean13"] }}
        onBarcodeScanned={(b) => handleScan(b.data)}>

        <View style={{ width: 280, height: 280, borderWidth: 4, borderRadius: 32, borderColor: MyStyles.ColorEerieBlack, overflow: "hidden" }} >
          <Animated.View style={{
            position: "absolute", top: 0, left: 0, right: 0,
            height: 3,
            backgroundColor: MyStyles.ColorDarkCyan,
            transform: [{ translateY: laserTranslateY }]
          }} />
        </View>

        <View style={{
          ...MyStyles.baseStyle.base,
          position: "absolute", bottom: "5%", backgroundColor: MyStyles.ColorEerieBlack, elevation: 6
        }}>

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

