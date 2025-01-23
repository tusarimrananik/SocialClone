function generateCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();

    hours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format

    const formattedMinutes = minutes.toString().padStart(2, '0');

    return `${hours}:${formattedMinutes}`;
}

module.exports = { generateCurrentTime };
