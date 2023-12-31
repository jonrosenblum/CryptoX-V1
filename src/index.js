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
            coin.imgSource = `assets/images/${coin.symbol.toLowerCase()}.png`;
            render24HourChange(cryptoArray);
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

        handleWatchlistSubmission(cryptoArray);
    })
    .catch(error => {
        console.log('Error fetching data:', error);
    });


// Function to create a coin menu item
function createCoinMenuItem(symbol, name, price, imgSource) {
    const listItem = document.createElement('li');
    listItem.className = 'coin-item';

    const nameSymbolElement = document.createElement('p');
    nameSymbolElement.className = 'coin-name-symbol';
    nameSymbolElement.textContent = `${name} (${symbol})`;

    const priceElement = document.createElement('p');
    priceElement.className = 'coin-price';
    const roundedPrice = Number(price).toFixed(2);
    priceElement.textContent = `Real-Time Price: $${roundedPrice}`;

    const menuImageElement = document.createElement('img');
    menuImageElement.className = 'coin-image';
    menuImageElement.src = imgSource

    menuImageElement.addEventListener('error', () => {
        menuImageElement.src = "https://i.ibb.co/zRLmrMN/shitcoin.png"
    });

    listItem.appendChild(nameSymbolElement);
    listItem.appendChild(menuImageElement)
    // listItem.appendChild(priceElement);

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
    const roundedPrice = Number(price).toFixed(2);
    priceElement.textContent = `Real-Time Price: $${roundedPrice}`;

    const imageElement = document.createElement('img');
    imageElement.src = imgSource;
    imageElement.alt = name;
    imageElement.width = 200;
    imageElement.height = 200;

    imageElement.addEventListener('error', () => {
        imageElement.src = "https://i.ibb.co/zRLmrMN/shitcoin.png";
    });

    coinDetailsContainer.appendChild(nameElement);
    coinDetailsContainer.appendChild(imageElement);
    coinDetailsContainer.appendChild(priceElement);

    contentContainer.innerHTML = '';
    contentContainer.appendChild(coinDetailsContainer);
}

// Function to show the current set of coins
function showCurrentCoins(cryptoArray) {
    coinList.innerHTML = '';

    const visibleCoins = cryptoArray.slice(currentIndex, currentIndex + 10);

    for (let i = 0; i < visibleCoins.length; i++) {
        const { symbol, name, priceUsd, imgSource } = visibleCoins[i];
        const listItem = createCoinMenuItem(symbol, name, priceUsd, imgSource);
        coinList.appendChild(listItem);
    }

    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex + 10 >= cryptoArray.length;
}

function render24HourChange(cryptoArray) {
    const coinChangeContainerElement = document.getElementById('coin-change-container');
    coinChangeContainerElement.innerHTML = '';

    const visibleCoins = cryptoArray.slice(0, 10);

    visibleCoins.forEach(coin => {
        const coinChangeContainer = document.createElement('div');
        coinChangeContainer.className = 'coin-change';

        const coinNameSymbolElement = document.createElement('p');
        coinNameSymbolElement.textContent = `${coin.name} (${coin.symbol})`;

        const coinChangeElement = document.createElement('p');
        const roundedChange = Math.round(coin.changePercent24Hr * 10) / 10; // Round to the nearest tenth
        coinChangeElement.textContent = `Percent Change: ${roundedChange}%`;

        coinChangeContainer.appendChild(coinNameSymbolElement);
        coinChangeContainer.appendChild(coinChangeElement);

        // Set background color based on the change value
        if (coin.changePercent24Hr < 0) {
            coinChangeContainer.style.backgroundColor = 'lightcoral';
        } else if (coin.changePercent24Hr > 0) {
            coinChangeContainer.style.backgroundColor = 'lightgreen';
        }

        coinChangeContainerElement.appendChild(coinChangeContainer);


        coinChangeContainer.addEventListener("click", () => {
            //console.assert(coin.price != null, "coin.price was null in 24hr handler")
            renderCoinDetails(coin.name, coin.symbol, coin.priceUsd, coin.imgSource);
        });
    });
}



// Function to go to the previous set of coins
function goToPreviousCoins(cryptoArray) {
    if (currentIndex > 0) {
        currentIndex -= 10;
        showCurrentCoins(cryptoArray);
    }
}

// Function to go to the next set of coins
function goToNextCoins(cryptoArray) {
    if (currentIndex + 10 < cryptoArray.length) {
        currentIndex += 10;
        showCurrentCoins(cryptoArray);
    }
}

function symbolExistsInWatchList(symbol) {
    const watchlistItems = document.getElementById('watchlist-items');
    const watchlistSymbols = Array.from(watchlistItems.getElementsByTagName('li')).map(item => item.textContent.trim().substr(0, 3).toUpperCase());
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
                const roundedPrice = Number(coin.priceUsd).toFixed(2);

                const listContent = document.createElement('span');
                listContent.textContent = ` - $${roundedPrice}`;

                const imageElement = document.createElement('img');
                imageElement.src = coin.imgSource;
                imageElement.alt = coin.symbol;
                imageElement.className = 'coin-image';

                listItem.appendChild(imageElement);
                listItem.appendChild(listContent);

                const listItemContainer = document.createElement('div');
                listItemContainer.appendChild(listItem);
                watchlistItems.appendChild(listItemContainer);

                watchlistInput.value = '';
            } else {
                // Symbol not found in cryptoArray
                alert(`The symbol ${symbol} does not exist.`);
            }
        }
    });
}

