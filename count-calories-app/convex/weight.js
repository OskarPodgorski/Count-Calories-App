import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getUserWeightsByUserIdQ = query({
    args: {
        userId: v.string()
    },
    handler: async (ctx, args) => {
        const weights = await ctx.db.query("userWeights").withIndex("by_userId", (q) => q.eq("userId", args.userId)).collect();

        return await (async () => { return weights.sort((a, b) => a.date.localeCompare(b.date)); })();
    },
});

export const upsertUserWeightByDateQ = mutation({
    args: {
        userId: v.string(),
        date: v.string(),
        weight: v.number()
    },
    handler: async (ctx, args) => {
        if (!args.userId || !args.date || !args.weight || args.weight <= 0) {
            return;
        }

        const existing = await ctx.db.query("userWeights").withIndex("by_userId_date", (q) => q.eq("userId", args.userId).eq("date", args.date)).first();

        if (existing) {
            await ctx.db.patch(existing._id, { weight: args.weight });
        }
        else {
            await ctx.db.insert("userWeights", {
                userId: args.userId,
                date: args.date,
                weight: args.weight,
            });
        }
    },
});

export const deleteUserWeightByDateQ = mutation({
    args: {
        userId: v.string(),
        date: v.string()
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("userWeights")
            .withIndex("by_userId_date", q =>
                q.eq("userId", args.userId).eq("date", args.date)
            )
            .unique();

        if (!existing) {
            return;
        }

        await ctx.db.delete(existing._id);
    }
});