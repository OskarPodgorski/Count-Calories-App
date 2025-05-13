import { nanoid } from "nanoid";

export class MealEntry {
  constructor(name, grams, calories, proteins, fat, carbs, barcode = undefined) {
    this.nanoId = nanoid();
    this.name = name;
    this.grams = grams;
    this.calories = calories;
    this.proteins = proteins;
    this.fat = fat;
    this.carbs = carbs;
    this.barcode = barcode;
  }

  getTotalCalories() {
    return Math.round((this.calories * this.grams) / 100);
  }
}

class MealDatabase {
  data = {
    Monday: { Breakfast: new Map(), Lunch: new Map(), Dinner: new Map() },
    Tuesday: { Breakfast: new Map(), Lunch: new Map(), Dinner: new Map() },
    Wednesday: { Breakfast: new Map(), Lunch: new Map(), Dinner: new Map() },
    Thursday: { Breakfast: new Map(), Lunch: new Map(), Dinner: new Map() },
    Friday: { Breakfast: new Map(), Lunch: new Map(), Dinner: new Map() },
    Saturday: { Breakfast: new Map(), Lunch: new Map(), Dinner: new Map() },
    Sunday: { Breakfast: new Map(), Lunch: new Map(), Dinner: new Map() },
  };

  barcodeMealMap = new Map();

  getMealByBarcode(barcode) {
    if (!barcode) {
      return null;
    }
    return this.barcodeMealMap.get(barcode);
  }

  addMealToBarcodeMap(barcode, mealEntry) {
    if (!barcode || !mealEntry) {
      return;
    }
    this.barcodeMealMap.set(mealEntry.barcode, mealEntry);
  }

  removeMeal(barcode) {
    if (!barcode) {
      return false;
    }
    return this.barcodeMealMap.delete(barcode);
  }

  addMeal(day, mealType, mealEntry) {
    this.data[day][mealType].set(mealEntry.id, mealEntry);
  }

  getMeals(day, mealType) {
    return this.data[day][mealType];
  }

  removeMeal(day, mealType, id) {
    this.data[day][mealType].delete(id);
  }

  getDayTotals(day) {
    const totals = { calories: 0, proteins: 0, fat: 0, carbs: 0 };

    for (const mealType of ['Breakfast', 'Lunch', 'Dinner']) {
      for (const meal of Array.from(this.data[day][mealType].values())) {
        totals.calories += Math.round((meal.calories * meal.grams) / 100);
        totals.proteins += Math.round((meal.proteins * meal.grams) / 100);
        totals.fat += Math.round((meal.fat * meal.grams) / 100);
        totals.carbs += Math.round((meal.carbs * meal.grams) / 100);
      }
    }

    return totals;
  }
}

export const mealDB = new MealDatabase();