import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({

    dailyTargets: defineTable({
        userId: v.string(),
        calories: v.number(),
        proteins: v.number(),
        fat: v.number(),
        carbs: v.number()
    }).index("by_userId", ["userId"]),

    globalMeals: defineTable({
        barcode: v.string(),
        name: v.string(),
        calories: v.number(),
        proteins: v.number(),
        fat: v.number(),
        carbs: v.number()
    }).index("by_barcode", ["barcode"])
        .index("by_name", ["name"]),

    userMeals: defineTable({
        userId: v.string(),
        date: v.string(),
        meals: v.record(
            v.string(),
            v.array(
                v.object({
                    nanoId: v.string(),
                    name: v.string(),
                    grams: v.number(),
                    calories: v.number(),
                    proteins: v.number(),
                    fat: v.number(),
                    carbs: v.number(),
                    barcode: v.optional(v.string())
                })
            )
        )
    }).index("by_user_date", ["userId", "date"]),

    userWeights: defineTable({
        userId: v.string(),
        date: v.string(),
        weight: v.number()
    }).index("by_userId", ["userId"])
        .index("by_userId_date", ["userId", "date"])
});