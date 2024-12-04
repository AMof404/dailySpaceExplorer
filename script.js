const NASA_API_KEY = '${{secrets.NASA_KEY}}';
const NASA_APOD_URL = 'https://api.nasa.gov/planetary/apod';
let galleryItemCount = 18;

async function fetchApod() {
    const date = document.getElementById('date').value;
    let url = `${NASA_APOD_URL}?api_key=${NASA_API_KEY}`;
    if (date) {
        url += `&date=${date}`;
    }
    const response = await fetch(url);
    const data = await response.json();
    displayApod(data);
}

function displayApod(data) {
    const imageContainer = document.querySelector('.image-container');
    const mediaElement = document.createElement(data.media_type === 'video' ? 'iframe' : 'img');
    mediaElement.src = data.url;
    mediaElement.alt = data.title;
    mediaElement.className = 'image';
    
    imageContainer.innerHTML = '';
    imageContainer.appendChild(mediaElement);

    document.getElementById('apod-description').innerText = data.explanation;
}

async function loadGallery() {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';
    for (let i = 0; i < galleryItemCount; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const formattedDate = date.toISOString().split('T')[0];
        const response = await fetch(`${NASA_APOD_URL}?api_key=${NASA_API_KEY}&date=${formattedDate}`);
        const data = await response.json();

        if (data.media_type !== 'image') {
            // Skip videos
            continue;
        }

        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';

        const img = document.createElement('img');
        img.src = data.url;
        img.alt = data.title;

        img.addEventListener('click', () => {
            openImageInNewTab(data.url);
        });

        galleryItem.appendChild(img);
        gallery.appendChild(galleryItem);
    }
}



document.addEventListener('DOMContentLoaded', loadGallery);

function openImageInNewTab(imageUrl) {
    window.open(imageUrl, '_blank');
}

