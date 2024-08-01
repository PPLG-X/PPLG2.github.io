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

function triggerFileInput() {
    document.getElementById('mediaInput').click();
}

document.getElementById('mediaInput').addEventListener('change', handleMediaUpload);

let currentMedia = null;
let mediaFiles = [];

async function handleMediaUpload(event) {
    const files = event.target.files;
    mediaFiles = Array.from(files);
    document.getElementById('descriptionContainer').style.display = 'block';
}

function showDescription(element) {
    currentMedia = element;
    const title = currentMedia.querySelector('.title');
    const description = currentMedia.querySelector('.description');
    const inputTitle = document.getElementById('title');
    const inputDescription = document.getElementById('description');
    inputTitle.value = title.textContent; // Set judul saat ini
    inputDescription.value = description.textContent; // Set deskripsi saat ini
}

document.getElementById('finishAddingButton').addEventListener('click', async function() {
    const inputTitle = document.getElementById('title').value;
    const inputDescription = document.getElementById('description').value;

    if (mediaFiles.length === 0 || !inputTitle || !inputDescription) {
        alert('Mohon lengkapi semua bidang dan pilih media.');
        return;
    }

    for (const file of mediaFiles) {
        const telegraphUrl = await uploadToTelegraph(file);

        if (telegraphUrl) {
            const galleryContainer = document.getElementById('galleryContainer');
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';

            const title = document.createElement('h3');
            title.className = 'title';
            title.textContent = inputTitle; // Judul yang diberikan
            galleryItem.appendChild(title);

            const description = document.createElement('p');
            description.className = 'description';
            description.textContent = inputDescription; // Deskripsi yang diberikan
            galleryItem.appendChild(description);

            if (file.type.startsWith('image/')) {
                const img = document.createElement('img');
                img.src = telegraphUrl;
                img.alt = file.name;
                galleryItem.appendChild(img);
            } else if (file.type.startsWith('video/')) {
                const video = document.createElement('video');
                video.src = telegraphUrl;
                video.controls = true;
                galleryItem.appendChild(video);
            }

            const downloadButton = document.createElement('button');
            downloadButton.className = 'download-button';
            downloadButton.textContent = 'Download';
            downloadButton.onclick = (e) => {
                e.stopPropagation(); // Cegah pemicu klik item galeri
                downloadMedia(telegraphUrl, file.name);
            };
            galleryItem.appendChild(downloadButton);

            galleryContainer.appendChild(galleryItem);
        }
    }

    mediaFiles = [];
    document.getElementById('descriptionContainer').style.display = 'none';
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('mediaInput').value = '';
});

async function uploadToTelegraph(file) {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('https://telegra.ph/upload', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        if (data && data[0] && data[0].src) {
            return `https://telegra.ph${data[0].src}`;
        }
    } catch (error) {
        console.error('Error uploading to Telegra.ph:', error);
    }
    return null;
}

function downloadMedia(url, filename) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function handlePopup(confirm) {
    if (confirm) {
        // Lanjutkan ke proses berikutnya
        alert('Media berhasil ditambahkan!');
    }
    document.getElementById('popupContainer').style.display = 'none';
}

document.getElementById('confirmButton').addEventListener('click', function() {
    handlePopup(true);
});

document.getElementById('cancelButton').addEventListener('click', function() {
    handlePopup(false);
});
