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

// Function to handle watchlist submission
function handleWatchlistSubmission(cryptoArray) {
    watchlistForm.addEventListener('submit', event => {
        event.preventDefault();
        const symbol = watchlistInput.value.trim().toUpperCase();
        const coin = cryptoArray.find(item => item.symbol.toUpperCase() === symbol);
        if (coin) {
            const listItem = document.createElement('li');
            listItem.textContent = `${coin.symbol} - $${coin.priceUsd}`;
            watchlistItems.appendChild(listItem);
            watchlistInput.value = '';
        }
    });
}

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

        handleWatchlistSubmission(cryptoArray);
    })
    .catch(error => {
        console.log('Error fetching data:', error);
    });

/*
DOM Elements:

The code initializes variables to store references to various DOM elements such as coinList, prevBtn, nextBtn, menuContainer, and contentContainer. These elements are selected using their respective CSS selectors.
Fetching Data:

The code uses the fetch function to make a GET request to the "https://api.coincap.io/v2/assets" API endpoint.
Two .then methods are chained to the fetch promise to handle the response asynchronously.
Processing the Response:

In the first .then method, the response is converted to JSON format using the response.json() method.
The resulting cryptoObject contains an array of coins in the cryptoObject.data property.
Creating Coin Menu Items:

The createCoinMenuItem function is defined to create a menu item for each coin. It takes three parameters: symbol, name, and price.
Inside the function, various DOM elements (listItem, symbolElement, nameElement, and priceElement) are created and assigned appropriate class names and content.
The elements are appended to the listItem, and a click event listener is added to render coin details when the menu item is clicked.
The listItem is returned as the result.
Rendering Coin Details:

The renderCoinDetails function is defined to render the details of a selected coin.
Inside the function, a container element (coinDetailsContainer) is created to hold the coin details.
Elements such as nameElement (h2), imageElement (img), and priceElement (p) are created and assigned appropriate attributes and content.
The elements are appended to the coinDetailsContainer, and then the content container is cleared and the coinDetailsContainer is appended to it.
Initial Rendering and Showing Current Coins:

After the fetch is complete, the first coin from the cryptoArray is selected.
The renderCoinDetails function is called with the first coin's name and priceUsd to display the initial coin details.
The showCurrentCoins function is defined to show the initial set of coins in the menu.
Inside the function, the coinList is cleared, and a subset of visible coins based on the currentIndex is obtained from the cryptoArray.
For each visible coin, a menu item is created using the createCoinMenuItem function and appended to the coinList.
The previous and next buttons are enabled or disabled based on the currentIndex.
Navigating Between Coin Sets:

The goToPreviousCoins function is defined to navigate to the previous set of coins.
If the currentIndex is greater than 0, it is decremented by 5, and the showCurrentCoins function is called.
The goToNextCoins function is defined to navigate to the next set of coins.
If the currentIndex + 5 is less than the total number of coins, the currentIndex is incremented by 5, and the showCurrentCoins function is called.
Event listeners are added to the previous and next buttons, triggering the respective navigation functions.
Error Handling:

If an error occurs during the fetch or data processing, it is caught in the .catch method, and an error message is logged to the console.
*/