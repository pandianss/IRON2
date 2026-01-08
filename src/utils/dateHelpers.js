/**
 * IRON Date Utility
 * Single source of truth for "Day Boundary" logic.
 * 
 * Rules:
 * - Timezone changes are accepted as "travel" (user benefits/loses a few hours, fine).
 */

// FUTURE: Load this from user settings for Home-Anchoring
const getUserTimezone = () => {
    try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (e) {
        return 'UTC';
    }
};

export const getLocalToday = () => {
    // Canonical Fitness Day: Uses User's Timezone
    return new Intl.DateTimeFormat('en-CA', { // YYYY-MM-DD format
        timeZone: getUserTimezone(),
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(new Date());
};

export const getLocalYesterday = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return new Intl.DateTimeFormat('en-CA', {
        timeZone: getUserTimezone(),
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(d);
};

export const isSameDay = (dateStr1, dateStr2) => {
    return dateStr1 === dateStr2;
};

export const addDays = (dateStr, days) => {
    const result = new Date(dateStr);
    result.setDate(result.getDate() + days);

    // Format back to YYYY-MM-DD
    const year = result.getFullYear();
    const month = String(result.getMonth() + 1).padStart(2, '0');
    const day = String(result.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const subtractDays = (dateStr, days) => {
    const result = new Date(dateStr);
    result.setDate(result.getDate() - days);

    // Format back to YYYY-MM-DD
    const year = result.getFullYear();
    const month = String(result.getMonth() + 1).padStart(2, '0');
    const day = String(result.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const getDaysArray = (start, end) => {
    const arr = [];
    let dt = addDays(start, 1); // Start from day AFTER last checkin
    while (dt <= end) { // Go up to (and including) end (yesterday)
        arr.push(dt);
        dt = addDays(dt, 1);
    }
    return arr;
};
