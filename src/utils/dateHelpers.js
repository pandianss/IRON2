/**
 * IRON Date Utility
 * Single source of truth for "Day Boundary" logic.
 * 
 * Rules:
 * - Uses Local Calendar Date (YYYY-MM-DD).
 * - "Today" is defined by the user's local clock at the moment of access.
 * - Timezone changes are accepted as "travel" (user benefits/loses a few hours, fine).
 */

export const getLocalToday = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const getLocalYesterday = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const isSameDay = (dateStr1, dateStr2) => {
    return dateStr1 === dateStr2;
};
