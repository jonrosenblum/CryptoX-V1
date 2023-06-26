fetch("https://api.coincap.io/v2/assets")
    .then(response => response.json())
    .then(CryptoDataObject => {
        console.log(CryptoDataObject)
    })