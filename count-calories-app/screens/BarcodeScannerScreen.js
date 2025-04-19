import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useCallback, useContext } from 'react';
import { Button, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { scannedBarcodeContext } from '../scripts/Context';

import * as MyStyles from "../styles/MyStyles"

export default function BarcodeScannerScreen() { 
  const navigation = useNavigation();

  const {scannedBarcode, setScannedBarcode} = useContext(scannedBarcodeContext)

  const [cameraMounted, setCameraMounted] = useState(false);

  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState('back');
  const [barcode, setBarcode] = useState("No Barcode Detected");
  const [flashlight, setFlashlight] = useState(false);

  useFocusEffect(
    useCallback(() => {
        setCameraMounted(true);
      return () => {
        setCameraMounted(false);
      };
    }, [])
  );

  function handleScan(barcode) {
    setBarcode(barcode);

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
      <View style={{flex: 1, backgroundColor: MyStyles.ColorEerieBlack}}>
    
        {cameraMounted && (<CameraView style={{flex:1, flexDirection: "column-reverse", alignItems: "stretch"}} facing= {facing} enableTorch={flashlight} barcodeScannerSettings={{
          barcodeTypes: ["ean13"]
        }}
        onBarcodeScanned={(b) => handleScan(b.data)}
        >
          <View style={{ zIndex: 0,marginHorizontal: 16, marginBottom:40, alignItems: "center", borderRadius: 8, backgroundColor: MyStyles.ColorEerieBlack}}>
      
            <Text style={{
              color: MyStyles.ColorWhite, fontSize:26, paddingVertical: 12, alignSelf: "stretch", textAlign: "center"
            }}>{barcode}</Text>
  
          <View style={{flexDirection: "row"}}>
          
            <TouchableOpacity style={{backgroundColor: MyStyles.ColorDarkCyan,marginBottom:12, borderRadius: 8, marginRight:4}} onPress={toggleCameraFacing}>
          
              <Text style={{ color: MyStyles.ColorBlack, paddingHorizontal: 12, paddingVertical: 4, fontSize: 22}}>Flip Camera</Text>
          
            </TouchableOpacity>
          
            <TouchableOpacity style={{backgroundColor: MyStyles.ColorDarkCyan,marginBottom:12, borderRadius: 8, marginLeft: 4}} onPress={toggleFlashlight}>
          
              <Text style={{ color: MyStyles.ColorBlack, paddingHorizontal: 12, paddingVertical: 4, fontSize: 22}}>Flashlight</Text>
          
            </TouchableOpacity>
          
          </View>
          
          </View>
        </CameraView>)}
          
      </View>
  );
}

