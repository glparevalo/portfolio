function showManilaTime() {
    const options = { 
        timeZone: 'Asia/Manila', 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
    };
    
    const timeString = new Date().toLocaleTimeString('en-US', options);
    document.getElementById('manilaTime').textContent = `${timeString} MNL`;
}

// Show immediately and update every minute
showManilaTime();
setInterval(showManilaTime, 60000);