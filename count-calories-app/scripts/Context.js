import { createContext, useState } from 'react';
import { dailyTargetSettings } from '../settings/Settings';

export const dailyTargetsContext = createContext();

export function DailyTargetsProvider({ children }) {
    const [dailyTargets, setDailyTargets] = useState(dailyTargetSettings);
  
    return (
      <dailyTargetsContext.Provider value={{ dailyTargets, setDailyTargets }}>
        {children}
      </dailyTargetsContext.Provider>
    );
  }

export const scannedBarcodeContext = createContext();

export function ScannedBarcodeProvider({ children }) {
    const [scannedBarcode, setScannedBarcode] = useState("");

    return (
      <scannedBarcodeContext.Provider value={{scannedBarcode, setScannedBarcode}}>
        {children}
      </scannedBarcodeContext.Provider>
    )
}