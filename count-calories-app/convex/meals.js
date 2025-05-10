import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getGlobalMealQ = query({
    args: { barcode: v.string() },

    handler: async (ctx, args) => {

        const target = await ctx.db.query("globalMeals").withIndex("by_barcode", (q) => q.eq("barcode", args.barcode)).first();

        return target;
    },
});

// export const insertDailyTargetsQ = mutation({
//     args: {
//         userId: v.string(),
//         calories: v.number(),
//         proteins: v.number(),
//         fat: v.number(),
//         carbs: v.number(),
//     },
//     handler: async (ctx, args) => {
//         await ctx.db.insert("dailyTargets", args);
//     },
// });

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