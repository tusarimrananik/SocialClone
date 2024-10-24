function getCurrentTime() {
    const date = new Date();
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert 24-hour time to 12-hour time
    hours = hours % 12;
    hours = hours ? hours : 12; // if hour is 0, set it to 12
    const minutesStr = minutes < 10 ? '0' + minutes : minutes; // add leading zero if needed

    const currentTime = `${hours}:${minutesStr} ${ampm}`;
    return currentTime;
}

function displayCurrentTime() {
    const timeDisplay = document.getElementById("timeDisplay");
    timeDisplay.textContent = getCurrentTime();
}

// Update time immediately and then every minute
displayCurrentTime();
setInterval(displayCurrentTime, 60000); // update every 60 seconds