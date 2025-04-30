import { createContext, useState, useEffect } from 'react';
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
    <scannedBarcodeContext.Provider value={{ scannedBarcode, setScannedBarcode }}>
      {children}
    </scannedBarcodeContext.Provider>
  )
}

export const refreshDayContext = createContext();

export function RefreshDayProvider({ children }) {
  const [dayRefreshArray, setDayRefreshArray] = useState(new Array(7).fill(0));

  function setDayRefresh(dayName) {
    let index;

    switch (dayName) {
      case "Monday":
        index = 0;
        break;
      case "Tuesday":
        index = 1;
        break;
      case "Wednesday":
        index = 2;
        break;
      case "Thursday":
        index = 3;
        break;
      case "Friday":
        index = 4;
        break;
      case "Saturday":
        index = 5;
        break;
      case "Sunday":
        index = 6;
        break;
    }

    if (typeof index === "number" && index >= 0 && index < 7) {
      setDayRefreshArray(c => {
        const updated = [...c];
        updated[index] += 1;
        return updated;
      });
    }
  }

  return (
    <refreshDayContext.Provider value={{ dayRefreshArray, setDayRefresh }}>
      {children}
    </refreshDayContext.Provider>
  )
}