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

function startSwiping() {
  startContainer.style.display = 'none';  // Hide the start button
  catContainer.style.display = 'block';   // Show the cat container
  controls.style.display = 'block';       // Show the swipe buttons
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
    const imageElement = document.createElement('img');
    imageElement.src = catImages[currentIndex];
    imageElement.classList.add('cat-image');
    catContainer.innerHTML = '';
    catContainer.appendChild(imageElement);
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

document.querySelector('.like-button').addEventListener('click', swipeRight);
document.querySelector('.dislike-button').addEventListener('click', swipeLeft);
