// Get DOM elements
const coinList = document.getElementById('coin-list');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const menuContainer = document.querySelector('.menu-container');
const contentContainer = document.querySelector('.content-container');
const watchlistForm = document.getElementById('watchlist-form');
const watchlistInput = document.getElementById('watchlist-input');
const watchlistButton = document.getElementById('watchlist-button');
const watchlistItems = document.getElementById('watchlist-items');

// Initialize currentIndex
let currentIndex = 0;


// Fetch data from the API
fetch("https://api.coincap.io/v2/assets")
    .then(response => response.json())
    .then(cryptoObject => {
        const cryptoArray = cryptoObject.data;

        cryptoArray.forEach(coin => {
            coin.imgSource = `https://cryptoicons.org/api/icon/${coin.symbol.toLowerCase()}/200`;
        });

        const firstCoin = cryptoArray[0];
        renderCoinDetails(
            firstCoin.name,
            firstCoin.symbol.toUpperCase(),
            firstCoin.priceUsd,
            firstCoin.imgSource
        );

        showCurrentCoins(cryptoArray);

        prevBtn.addEventListener('click', () => goToPreviousCoins(cryptoArray));
        nextBtn.addEventListener('click', () => goToNextCoins(cryptoArray));

        // watchlistForm.addEventListener('submit', (event) => {
        //     alert(`Cool data: ${event.target}`)
        // })
        handleWatchlistSubmission(cryptoArray);
    })
    .catch(error => {
        console.log('Error fetching data:', error);
    });

// handleWatchlistSubmission(cryptoArray);

// Function to create a coin menu item
function createCoinMenuItem(symbol, name, price, imgSource) {
    const listItem = document.createElement('li');
    listItem.className = 'coin-item';

    const nameSymbolElement = document.createElement('p');
    nameSymbolElement.className = 'coin-name-symbol';
    nameSymbolElement.textContent = `${name} (${symbol})`;

    const priceElement = document.createElement('p');
    priceElement.className = 'coin-price';
    priceElement.textContent = `$${price}`;

    listItem.appendChild(nameSymbolElement);
    listItem.appendChild(priceElement);

    listItem.addEventListener('click', () => {
        renderCoinDetails(name, symbol, price, imgSource);
    });

    return listItem;
}

// Function to render coin details
function renderCoinDetails(name, symbol, price, imgSource) {
    const coinDetailsContainer = document.createElement('div');
    coinDetailsContainer.className = 'coin-details';

    const nameElement = document.createElement('h2');
    nameElement.textContent = `${name} (${symbol})`;

    const priceElement = document.createElement('p');
    priceElement.className = 'coin-price';
    priceElement.textContent = `Real-Time Price: $${price}`;

    const imageElement = document.createElement('img');
    imageElement.src = imgSource;
    imageElement.alt = name;
    imageElement.width = 200;
    imageElement.height = 200;

    imageElement.addEventListener('error', () => {
        imageElement.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQP7jZUOGvusMIOFUpAGYcEe28KZqFzWIKkB-TIkdSs&s';
    });

    coinDetailsContainer.appendChild(imageElement);
    coinDetailsContainer.appendChild(nameElement);
    coinDetailsContainer.appendChild(priceElement);

    contentContainer.innerHTML = '';
    contentContainer.appendChild(coinDetailsContainer);
}

// Function to show the current set of coins
function showCurrentCoins(cryptoArray) {
    coinList.innerHTML = '';

    const visibleCoins = cryptoArray.slice(currentIndex, currentIndex + 5);

    for (let i = 0; i < visibleCoins.length; i++) {
        const { symbol, name, priceUsd, imgSource } = visibleCoins[i];
        const listItem = createCoinMenuItem(symbol, name, priceUsd, imgSource);
        coinList.appendChild(listItem);
    }

    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex + 5 >= cryptoArray.length;
}

// Function to go to the previous set of coins
function goToPreviousCoins(cryptoArray) {
    if (currentIndex > 0) {
        currentIndex -= 5;
        showCurrentCoins(cryptoArray);
    }
}

// Function to go to the next set of coins
function goToNextCoins(cryptoArray) {
    if (currentIndex + 5 < cryptoArray.length) {
        currentIndex += 5;
        showCurrentCoins(cryptoArray);
    }
}

function symbolExistsInWatchList(symbol) {
    const watchlistItems = document.getElementById('watchlist-items');
    const watchlistSymbols = Array.from(watchlistItems.getElementsByTagName('li')).map(item => item.textContent.trim().substr(0, 3).toUpperCase());
    console.log(watchlistSymbols)
    return watchlistSymbols.includes(symbol);
}


// Function to handle watchlist submission
function handleWatchlistSubmission(cryptoArray) {
    watchlistForm.addEventListener('submit', event => {
        event.preventDefault();
        const symbol = watchlistInput.value.trim().toUpperCase();

        if (symbolExistsInWatchList(symbol)) {
            // Symbol already exists in watchlist
            alert(`The symbol ${symbol} is already in the watchlist.`);
        } else {
            const coin = cryptoArray.find(item => item.symbol.toUpperCase() === symbol);
            if (coin) {
                const listItem = document.createElement('li');
                listItem.textContent = `${coin.symbol} - $${coin.priceUsd}`;
                watchlistItems.appendChild(listItem);
                watchlistInput.value = '';
            } else {
                // Symbol not found in cryptoArray
                alert(`The symbol ${symbol} does not exist.`);
            }
        }
    });
}
