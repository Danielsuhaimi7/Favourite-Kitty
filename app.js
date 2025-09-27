let likedCats = [];
let dislikedCats = [];
let catImages = [];
const catContainer = document.querySelector('.cat-container');
const summaryContainer = document.querySelector('.summary-container');
const startButton = document.getElementById('start-button');
const startContainer = document.getElementById('start-container');
const controls = document.querySelector('.controls');
let currentIndex = 0;
const totalCats = 15;
let startX = 0;
let isSwiping = false;
let catImageElement = null;

function startSwiping() {
  startContainer.style.display = 'none'; 
  catContainer.style.display = 'block';
  controls.style.display = 'block';
  fetchCats();
}

function fetchCats() {
  const fetchPromises = [];
  for (let i = 0; i < totalCats; i++) {
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
    showCat();
  });
}

function showCat() {
  if (currentIndex < catImages.length) {
    catImageElement = document.createElement('img');
    catImageElement.src = catImages[currentIndex];
    catImageElement.classList.add('cat-image');
    catContainer.innerHTML = '';
    catContainer.appendChild(catImageElement);
  } else {
    showSummary();
  }
}

function swipeRight() {
  if (currentIndex < catImages.length) {
    likedCats.push(catImages[currentIndex]);
    currentIndex++;
    showCat();
  }
}

function swipeLeft() {
  if (currentIndex < catImages.length) {
    dislikedCats.push(catImages[currentIndex]);
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
  `;
  summaryContainer.style.textAlign = 'center';
  summaryContainer.style.display = 'block';
  summaryContainer.style.marginTop = '20px';
  summaryContainer.style.padding = '20px';
}

function startSwipe(e) {
  isSwiping = true;
  startX = e.clientX || e.touches[0].clientX;
  catImageElement.style.transition = 'none';
}

function moveSwipe(e) {
  if (!isSwiping) return;

  const currentX = e.clientX || e.touches[0].clientX;
  const diff = currentX - startX;

  catImageElement.style.transform = `translateX(${diff}px)`;
}

function endSwipe(e) {
  if (!isSwiping) return;

  const endX = e.clientX || e.changedTouches[0].clientX;
  const diff = endX - startX;

  if (diff > 10) {
    swipeRight();
  } else if (diff < -10) {
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
