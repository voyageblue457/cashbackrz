import FeeConfig from "../models/FeeConfig.js";

let isToggleEnabled = true;

/**
 * Initialize toggle state from database on startup
 */
export const initFeeToggle = async () => {
  try {
    let config = await FeeConfig.findOne({ key: "fee_toggle" });
    if (!config) {
      config = await FeeConfig.create({ key: "fee_toggle", enabled: true });
    }
    isToggleEnabled = config.enabled;
    console.log(`[FeeConfig] Fee addition toggle initialized: ${isToggleEnabled ? "ON" : "OFF"}`);
  } catch (err) {
    console.error("Failed to load FeeConfig from DB, defaulting to enabled:", err.message);
  }
};

/**
 * Set toggle state (ON = true, OFF = false)
 */
export const setFeeToggle = async (enabledState) => {
  isToggleEnabled = Boolean(enabledState);
  try {
    await FeeConfig.findOneAndUpdate(
      { key: "fee_toggle" },
      { enabled: isToggleEnabled },
      { upsert: true, new: true }
    );
    console.log(`[FeeConfig] Fee addition toggle updated: ${isToggleEnabled ? "ON" : "OFF"}`);
  } catch (err) {
    console.error("Failed to update FeeConfig in DB:", err.message);
  }
  return isToggleEnabled;
};

/**
 * Get current toggle status
 */
export const getFeeToggleState = () => {
  return isToggleEnabled;
};

/**
 * Price Range & Fee Configuration.
 * Replaced tiered fees with fixed surcharge:
 * - Payment <= 100: +0.75
 * - Payment > 100: +0.95
 */
export const FEE_TIERS = [
  { maxAmount: 100, fee: 0.75 },
  { maxAmount: Infinity, fee: 0.95 },
];

/**
 * Calculates the internal total amount (selected amount + surcharge if toggle ON)
 * - Payment <= 100: adds 0.75
 * - Payment > 100: adds 0.95
 * @param {number|string} amount Selected base amount
 * @returns {number} Internal total amount
 */
export const getInternalAmount = (amount) => {
  if (amount === undefined || amount === null || amount === '') return 0;
  const amt = parseFloat(String(amount).replace(/[^0-9.]/g, ''));
  if (isNaN(amt) || amt <= 0) return 0;

  // If toggle is OFF, return regular amount without fee
  if (!isToggleEnabled) {
    return Number(amt.toFixed(2));
  }

  const fee = amt <= 100 ? 0.75 : 0.95;
  return Number((amt + fee).toFixed(2));
};

/**
 * Helper to get just the fee amount for a given base amount
 * @param {number|string} amount
 * @returns {number} Fee amount
 */
export const getFeeForAmount = (amount) => {
  if (!isToggleEnabled) return 0;
  const amt = parseFloat(String(amount).replace(/[^0-9.]/g, ''));
  if (isNaN(amt) || amt <= 0) return 0;

  return amt <= 100 ? 0.75 : 0.95;
};
