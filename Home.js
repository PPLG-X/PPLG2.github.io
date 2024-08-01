function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    if (sidebar.style.left === '-250px') {
        sidebar.style.left = '0';
        mainContent.style.marginLeft = '250px';
    } else {
        sidebar.style.left = '-250px';
        mainContent.style.marginLeft = '0';
    }
}

function closePopup() {
    const popup = document.getElementById('popup');
    popup.style.visibility = 'hidden';
    popup.style.opacity = '0';
}

window.onload = function() {
    const popup = document.getElementById('popup');
    popup.style.visibility = 'visible';
    popup.style.opacity = '1';
    setTimeout(closePopup, 3000);
}
