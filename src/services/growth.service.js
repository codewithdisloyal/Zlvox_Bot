const config = require('../utils/env');
const logger = require('../utils/logger');

/**
 * Checks if a user is a member of the required Telegram channel.
 * @param {Object} ctx - Telegraf context
 * @param {number} userId - Telegram User ID
 * @returns {Promise<boolean>} True if member/admin/creator, false otherwise
 */
async function isUserSubscribedToChannel(ctx, userId) {
  if (!config.CHANNEL_ID) {
    // Stub: If no channel is configured, bypass the check
    return true; 
  }

  try {
    const member = await ctx.telegram.getChatMember(config.CHANNEL_ID, userId);
    const validStatuses = ['member', 'administrator', 'creator'];
    return validStatuses.includes(member.status);
  } catch (error) {
    logger.error(`Error checking channel membership for user ${userId}:`, error.message);
    // If the API fails (e.g., bot is not an admin in the channel), we return false to enforce it.
    return false;
  }
}

/**
 * Handles referral logic (Scalable stub for future expansion)
 * @param {number} userId - The new user's ID
 * @param {string} referralCode - The payload passed in /start <payload>
 */
async function processReferral(userId, referralCode) {
  if (!referralCode) return;

  logger.info(`[Referral] User ${userId} joined via referral code: ${referralCode}`);
  
  // Future Database Expansion:
  // 1. Verify referralCode in DB (e.g., await db.users.findByReferral(referralCode))
  // 2. Add credits/points to the referrer
  // 3. Mark the new user as referred so they get a welcome bonus
}

module.exports = {
  isUserSubscribedToChannel,
  processReferral,
};
