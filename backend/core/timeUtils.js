/**
 * Time Utilities for Win Energy Lead & Traffic Analytics
 * Categorizes arrival time into: Morning, Afternoon, Evening, or Night (IST)
 */

function getISTDate() {
    // Return Date object shifted to IST (UTC + 5 hours 30 mins)
    const now = new Date();
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    const istOffset = 5.5 * 60 * 60000;
    return new Date(utcTime + istOffset);
}

function getTimeOfDayCategory(date = getISTDate()) {
    const hour = date.getHours(); // 0 to 23

    if (hour >= 5 && hour < 12) {
        return 'Morning';
    } else if (hour >= 12 && hour < 17) {
        return 'Afternoon';
    } else if (hour >= 17 && hour < 21) {
        return 'Evening';
    } else {
        return 'Night';
    }
}

function getFormattedIST(date = getISTDate()) {
    const pad = (n) => String(n).padStart(2, '0');
    const YYYY = date.getFullYear();
    const MM = pad(date.getMonth() + 1);
    const DD = pad(date.getDate());
    const hh = pad(date.getHours());
    const mm = pad(date.getMinutes());
    const ss = pad(date.getSeconds());

    return `${YYYY}-${MM}-${DD} ${hh}:${mm}:${ss} IST`;
}

module.exports = {
    getISTDate,
    getTimeOfDayCategory,
    getFormattedIST
};
