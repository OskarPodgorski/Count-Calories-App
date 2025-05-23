import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getGlobalMealsByBarcodeQ = query({
    args: {
        barcode: v.string()
    },
    handler: async (ctx, args) => {
        return await ctx.db.query("globalMeals").withIndex("by_barcode", (q) => q.eq("barcode", args.barcode)).collect();
    },
});

export const getGlobalMealsByNameQ = query({
    args: {
        name: v.string()
    },
    handler: async (ctx, args) => {
        return await ctx.db.query("globalMeals").withIndex("by_name", (q) => q.eq("name", args.name)).collect();
    },
});

export const updateGlobalMealQ = mutation({
    args: {
        barcode: v.string(),
        name: v.string(),
        calories: v.number(),
        proteins: v.number(),
        fat: v.number(),
        carbs: v.number(),
    },
    handler: async (ctx, args) => {
        if (!args.barcode || args.barcode === "") {
            return;
        }

        const existing = await ctx.db.query("globalMeals").withIndex("by_barcode", (q) => q.eq("barcode", args.barcode)).first();

        if (existing) {
            await ctx.db.patch(existing._id, {
                name: args.name,
                calories: args.calories,
                proteins: args.proteins,
                fat: args.fat,
                carbs: args.carbs,
            });
        }
        else {
            await ctx.db.insert("globalMeals", args);
        }
    },
});



export const getUserMealsByDateQ = query({
    args: { userId: v.string(), date: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("userMeals")
            .withIndex("by_user_date", q => q.eq("userId", args.userId).eq("date", args.date))
            .unique();
    }
});

export const upsertUserMealsByDateQ = mutation({
    args: {
        userId: v.string(),
        date: v.string(),
        mealType: v.string(),
        meal: v.object({
            nanoId: v.string(),
            name: v.string(),
            grams: v.number(),
            calories: v.number(),
            proteins: v.number(),
            fat: v.number(),
            carbs: v.number(),
            barcode: v.optional(v.string())
        })
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("userMeals")
            .withIndex("by_user_date", q =>
                q.eq("userId", args.userId).eq("date", args.date)
            )
            .unique();

        if (existing) {
            const updatedMeals = {
                ...existing.meals,
                [args.mealType]: [
                    ...(existing.meals?.[args.mealType] || []),
                    args.meal
                ]
            };

            await ctx.db.patch(existing._id, { meals: updatedMeals });
        } else {
            await ctx.db.insert("userMeals", {
                userId: args.userId,
                date: args.date,
                meals: {
                    [args.mealType]: [args.meal]
                }
            });
        }
    }
});

export const deleteUserMealByNanoIdQ = mutation({
    args: {
        userId: v.string(),
        date: v.string(),
        mealType: v.string(),
        nanoId: v.string()
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("userMeals")
            .withIndex("by_user_date", q =>
                q.eq("userId", args.userId).eq("date", args.date)
            )
            .unique();

        if (existing && existing.meals) {
            if (!existing.meals[args.mealType] || existing.meals[args.mealType].length === 0) {
                return false;
            }

            if (!existing.meals[args.mealType].find(meal => meal.nanoId === args.nanoId)) {
                return false;
            }

            const updatedMeals = {
                ...existing.meals,
                [args.mealType]: existing.meals[args.mealType].filter(meal => meal.nanoId !== args.nanoId)
            };

            if (Object.values(updatedMeals).every(arr => arr.length === 0)) {
                await ctx.db.delete(existing._id);
            }
            else {
                await ctx.db.patch(existing._id, { meals: updatedMeals });
            }

            return true;
        }
        else {
            return false;
        }
    }
});