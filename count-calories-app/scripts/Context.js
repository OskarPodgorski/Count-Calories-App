import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { useUser } from "@clerk/clerk-expo";

import { createContext, useState, useEffect, useRef, useCallback } from 'react';

export const dailyTargetsContext = createContext();

export function DailyTargetsProvider({ children }) {
  const { user } = useUser();
  const userId = user?.id;

  const data = useQuery(api.settings.getDailyTargetsQ, userId ? { userId } : "skip");
  const updateDailyTargets = useMutation(api.settings.updateDailyTargetsQ);

  const [dailyTargets, setDailyTargets] = useState({
    calories: 2000,
    proteins: 100,
    fat: 70,
    carbs: 250
  });

  const updateDailyTargetsQuery = useCallback(() => {
    if (!userId) return;

    updateDailyTargets({
      userId: userId,
      calories: dailyTargets.calories,
      proteins: dailyTargets.proteins,
      fat: dailyTargets.fat,
      carbs: dailyTargets.carbs
    });

    console.log("DailyTargetsMutation");
  }, [dailyTargets]);

  useEffect(() => {
    if (!data || !userId) return;

    setDailyTargets({
      calories: data.calories,
      proteins: data.proteins,
      fat: data.fat,
      carbs: data.carbs
    });

    console.log("DailyTargetsSet");
  }, [data, userId]);

  return (
    <dailyTargetsContext.Provider value={{ dailyTargets, setDailyTargets, updateDailyTargetsQuery }}>
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

export const selectedMealContext = createContext();

export function SelectedMealProvider({ children }) {
  const [selectedMeal, setSelectedMeal] = useState({});

  return (
    <selectedMealContext.Provider value={{ selectedMeal, setSelectedMeal }}>
      {children}
    </selectedMealContext.Provider>
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