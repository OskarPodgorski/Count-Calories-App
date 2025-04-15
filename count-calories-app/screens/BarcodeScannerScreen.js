import { Camera } from 'expo-camera';
import { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';

export default function BarcodeScannerScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [cameraRef, setCameraRef] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    alert(`Kod zeskanowany: ${data}`);
  };

  if (hasPermission === null) return <Text>Prośba o dostęp do kamery...</Text>;
  if (hasPermission === false) return <Text>Brak dostępu do kamery</Text>;

  return (
    <View style={{ flex: 1 }}>
      <Camera
        ref={ref => setCameraRef(ref)}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={{ flex: 1 }}
        ratio="16:9"
        barCodeScannerSettings={{
          barCodeTypes: ['code128', 'ean13', 'ean8', 'upc_a', 'upc_e'],
        }}
      />

      {scanned && (
        <Button title="Zeskanuj ponownie" onPress={() => setScanned(false)} />
      )}
    </View>
  );
}