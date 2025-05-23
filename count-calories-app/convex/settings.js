import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getDailyTargetsQ = query({
    args: { userId: v.string() },

    handler: async (ctx, args) => {

        const target = await ctx.db.query("dailyTargets").withIndex("by_userId", (q) => q.eq("userId", args.userId)).first();

        return target;
    },
});

export const insertDailyTargetsQ = mutation({
    args: {
        userId: v.string(),
        calories: v.number(),
        proteins: v.number(),
        fat: v.number(),
        carbs: v.number(),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("dailyTargets", args);
    },
});

export const updateDailyTargetsQ = mutation({
    args: {
        userId: v.string(),
        calories: v.number(),
        proteins: v.number(),
        fat: v.number(),
        carbs: v.number(),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db.query("dailyTargets").withIndex("by_userId", (q) => q.eq("userId", args.userId)).first();

        if (existing) {
            await ctx.db.patch(existing._id, {
                calories: args.calories,
                proteins: args.proteins,
                fat: args.fat,
                carbs: args.carbs,
            });
        }
        else {
            await ctx.db.insert("dailyTargets", args);
        }
    },
});