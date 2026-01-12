/**
 * User Management
 *
 * Handles user creation, session linking, and user data management.
 * Integrates with Clerk for authentication.
 */

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create or get user by Clerk ID
export const getOrCreateUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
  },
  handler: async (ctx, { clerkId, email, name }) => {
    // Check if user already exists by email
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (existingUser) {
      // Update last login
      await ctx.db.patch(existingUser._id, {
        lastLoginAt: Date.now(),
        name, // Update name in case it changed
      });
      return existingUser._id;
    }

    // Create new user
    const userId = await ctx.db.insert("users", {
      email,
      name,
      createdAt: Date.now(),
      lastLoginAt: Date.now(),
    });

    return userId;
  },
});

// Link anonymous session to authenticated user
export const linkSessionToUser = mutation({
  args: {
    sessionId: v.string(),
    userId: v.id("users"),
  },
  handler: async (ctx, { sessionId, userId }) => {
    // Find all estate plans with this session ID
    const sessionPlans = await ctx.db
      .query("estatePlans")
      .withIndex("by_session", (q) => q.eq("sessionId", sessionId))
      .collect();

    // Link each plan to the user
    for (const plan of sessionPlans) {
      // Check if user already has a plan (avoid duplicates)
      const existingUserPlan = await ctx.db
        .query("estatePlans")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .first();

      if (existingUserPlan && plan._id !== existingUserPlan._id) {
        // User already has a plan - merge data or skip
        // For now, we'll keep the session plan if it has more data
        const sessionIntake = await ctx.db
          .query("intakeData")
          .withIndex("by_estate_plan", (q) => q.eq("estatePlanId", plan._id))
          .collect();

        const existingIntake = await ctx.db
          .query("intakeData")
          .withIndex("by_estate_plan", (q) => q.eq("estatePlanId", existingUserPlan._id))
          .collect();

        if (sessionIntake.length > existingIntake.length) {
          // Session plan has more data, update it to belong to user
          await ctx.db.patch(plan._id, {
            userId,
            updatedAt: Date.now(),
          });
          // Delete the old user plan (it had less data)
          await ctx.db.delete(existingUserPlan._id);
        }
        // Otherwise keep existing user plan, don't link session plan
      } else {
        // No existing user plan, just link this one
        await ctx.db.patch(plan._id, {
          userId,
          updatedAt: Date.now(),
        });
      }
    }

    return { linked: sessionPlans.length };
  },
});

// Get user by Clerk ID (via email)
export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();
  },
});

// Get all estate plans for a user
export const getUserEstatePlans = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("estatePlans")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

// Get current user's estate plan (most recent)
export const getCurrentUserPlan = query({
  args: { userId: v.optional(v.id("users")), sessionId: v.optional(v.string()) },
  handler: async (ctx, { userId, sessionId }) => {
    // First try to get user's plan
    if (userId) {
      const userPlan = await ctx.db
        .query("estatePlans")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .order("desc")
        .first();

      if (userPlan) return userPlan;
    }

    // Fall back to session plan
    if (sessionId) {
      return await ctx.db
        .query("estatePlans")
        .withIndex("by_session", (q) => q.eq("sessionId", sessionId))
        .first();
    }

    return null;
  },
});
