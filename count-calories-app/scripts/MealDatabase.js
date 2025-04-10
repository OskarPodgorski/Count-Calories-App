export class MealEntry {
    constructor(name, grams, caloriesPer100g, proteins, fat, carbs) {
      this.name = name;
      this.grams = grams;
      this.calories = caloriesPer100g;
      this.proteins = proteins;
      this.fat = fat;
      this.carbs = carbs;
    }
  
    getTotalCalories() {
      return Math.round((this.calories * this.grams) / 100);
    }
  }

  class MealDatabase {
    data = {
      Monday: { Breakfast: [], Lunch: [], Dinner: [] },
      Tuesday: { Breakfast: [], Lunch: [], Dinner: [] },
    };
  
    addMeal(day, mealType, mealEntry) {
      this.data[day][mealType].push(mealEntry);
    }
  
    getMeals(day, mealType) {
      return this.data[day][mealType];
    }
  
    getDayTotals(day) {
      const totals = { calories: 0, proteins: 0, fat: 0, carbs: 0 };
  
      for (const mealType of ['Breakfast', 'Lunch', 'Dinner']) {
        for (const meal of this.data[day][mealType]) {
          totals.calories += (meal.calories * meal.grams) / 100;
          totals.proteins += (meal.proteins * meal.grams) / 100;
          totals.fat     += (meal.fat * meal.grams) / 100;
          totals.carbs   += (meal.carbs * meal.grams) / 100;
        }
      }
  
      return totals;
    }
  }
  
  export const mealDB = new MealDatabase();