let likedCats = [];
let dislikedCats = [];
let catImages = [];
const catContainer = document.querySelector('.cat-container');
const summaryContainer = document.querySelector('.summary-container');
const startButton = document.getElementById('start-button');
const startContainer = document.getElementById('start-container');
const controls = document.querySelector('.controls');
let currentIndex = 0;
let totalCats = 15; 
let startX = 0;
let isSwiping = false;
let catImageElement = null;

function startSwiping() {
    startContainer.style.display = 'none';
    catContainer.style.display = 'block';
    controls.style.display = 'flex';
    totalCats = Math.floor(Math.random() * (20 - 10 + 1)) + 10;

    // Fetch and display the first cat image immediately
    fetchCat();

    // Fetch remaining cats in the background
    fetchRemainingCats();
}

function fetchCat() {
    fetch('https://cataas.com/cat')
        .then(response => response.blob())
        .then(imageBlob => {
            const imageElement = URL.createObjectURL(imageBlob);
            catImages.push(imageElement);
            showCat();
        })
        .catch(error => console.error('Error fetching cat image:', error));
}

function fetchRemainingCats() {
    const fetchPromises = [];
    for (let i = 1; i < totalCats; i++) {
        fetchPromises.push(
            fetch('https://cataas.com/cat')
                .then((response) => response.blob())
                .then((imageBlob) => {
                    const imageElement = URL.createObjectURL(imageBlob);
                    catImages.push(imageElement);
                })
                .catch((error) => {
                    console.error('Error fetching cat image:', error);
                })
        );
    }
    Promise.all(fetchPromises).then(() => {
        console.log('All cat images fetched');
    });
}

function showCat() {
    if (currentIndex < catImages.length) {
        catContainer.innerHTML = '';
        const img = document.createElement('img');
        img.src = catImages[currentIndex];
        img.classList.add('cat-image');
        catContainer.appendChild(img);
        catImageElement = img;
    } else if (currentIndex >= 10) {
        showSummary();
    }
}

function swipeRight() {
    if (catImageElement && currentIndex < catImages.length) {
        likedCats.push(catImages[currentIndex]);
        console.log("Liked Cat Index: ", currentIndex);
        currentIndex++;
        showCat();
    }
}

function swipeLeft() {
    if (catImageElement && currentIndex < catImages.length) {
        dislikedCats.push(catImages[currentIndex]);
        console.log("Disliked Cat Index: ", currentIndex);
        currentIndex++;
        showCat();
    }
}

function showSummary() {
    summaryContainer.innerHTML = '';
    const likedCount = likedCats.length;
    summaryContainer.innerHTML = `
        <h3>You liked ${likedCount} cats!</h3>
        <div class="liked-cats">
          ${likedCats.map((catSrc) => `<img src="${catSrc}" alt="liked cat" />`).join('')}
        </div>
        <button onclick="startOver()">Start Over</button>
      `;
    summaryContainer.style.display = 'block';
}

function startOver() {
    likedCats = [];
    dislikedCats = [];
    currentIndex = 0;
    summaryContainer.style.display = 'none';
    showCat();
}

function startSwipe(e) {
    if (!catImageElement) return;
    isSwiping = true;
    startX = e.clientX || e.touches[0].clientX;
    catImageElement.style.transition = 'none';
}

function moveSwipe(e) {
    if (!isSwiping || !catImageElement) return;
    const currentX = e.clientX || e.touches[0].clientX;
    const diff = currentX - startX;

    catImageElement.style.transform = `translateX(${diff}px) rotate(${diff / 20}deg)`;
}

function endSwipe(e) {
    if (!isSwiping || !catImageElement) return;

    const finalPosition = parseFloat(catImageElement.style.transform.replace('translateX(', '').replace('px)', ''));

    if (finalPosition > 100) {
        swipeRight();
    } else if (finalPosition < -100) {
        swipeLeft();
    } else {
        catImageElement.style.transition = 'transform 0.3s ease';
        catImageElement.style.transform = 'translateX(0)';
    }

    isSwiping = false;
}

catContainer.addEventListener('mousedown', startSwipe);
catContainer.addEventListener('mousemove', moveSwipe);
catContainer.addEventListener('mouseup', endSwipe);

catContainer.addEventListener('touchstart', startSwipe);
catContainer.addEventListener('touchmove', moveSwipe);
catContainer.addEventListener('touchend', endSwipe);

document.querySelector('.like-button').addEventListener('click', swipeRight);
document.querySelector('.dislike-button').addEventListener('click', swipeLeft);
