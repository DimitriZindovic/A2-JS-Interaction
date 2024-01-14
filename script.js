document.addEventListener("DOMContentLoaded", () => {
  setLastSearchedPokemon();
  handleResearchButtonClick();
  displayCartItems();
  animateCardImage();
});

function setLastSearchedPokemon() {
  const lastSearchedPokemon = localStorage.getItem("lastSearchedPokemon");
  if (lastSearchedPokemon) {
    document.querySelector(".inputResearch").value = lastSearchedPokemon;
  }
}

function handleResearchButtonClick() {
  document.querySelector(".buttonResearch").addEventListener("click", () => {
    const userInput = document
      .querySelector(".inputResearch")
      .value.toLowerCase();
    localStorage.setItem("lastSearchedPokemon", userInput);
    fetchPokemon(userInput);
  });
}

function fetchPokemon(userInput) {
  fetch(`https://pokeapi.co/api/v2/pokemon/${userInput}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Aucun Pokémon nommé "${userInput}" trouvé.`);
      }
      return response.json();
    })
    .then((data) => {
      savePokemonData(data);
      window.location.href = "product.html";
    })
    .catch(displayError);
}

function savePokemonData(data) {
  localStorage.setItem("pokemonName", data.name);
  localStorage.setItem("pokemonImage", data.sprites.front_default);
  localStorage.setItem("pokemonStats", JSON.stringify(data.stats));
}

function displayError(error) {
  const searchBarContainer = document.querySelector("h2");
  const errorMessage = document.createElement("p");
  errorMessage.classList.add("error");
  errorMessage.textContent = error.message;
  searchBarContainer.insertAdjacentElement("afterend", errorMessage);
}

function displayCartItems() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartContainer = document.querySelector(".cart-container");

  cart.forEach((pokemon) => {
    const pokemonCard = document.createElement("div");
    pokemonCard.innerHTML = `
      <div class="list-pokemon">
        <img src="${pokemon.image}" alt="${pokemon.name}" />
        <div class="description-product">
          <h4>${pokemon.name}</h4>
          <p>Prix: ${pokemon.price}€</p>
        </div>
      </div>
      `;
    if (cartContainer) {
      cartContainer.appendChild(pokemonCard);
    }
  });

  displayTotalPrice(cart, cartContainer);
  handleAddToCartButtonClick();
}

function displayTotalPrice(cart, cartContainer) {
  const totalPrice = cart.reduce((total, pokemon) => total + pokemon.price, 0);
  const totalPriceElement = document.createElement("p");
  totalPriceElement.classList.add("total-price");
  totalPriceElement.textContent = `Prix total: ${totalPrice}€`;
  if (cartContainer) {
    cartContainer.appendChild(totalPriceElement);
  }
}

function handleAddToCartButtonClick() {
  const addToCartButton = document.querySelector(".button-add-cart");
  if (addToCartButton) {
    addToCartButton.addEventListener("mouseover", animateButton);
    addToCartButton.addEventListener("click", addToCart);
  }
}

function animateButton() {
  anime({
    targets: this,
    scale: [1, 1.1, 1],
    duration: 1000,
    easing: "easeInOutQuad",
    loop: true,
  });
}

function addToCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const pokemon = {
    name: capitalizeFirstLetter(localStorage.getItem("pokemonName")),
    image: localStorage.getItem("pokemonImage"),
    price: Math.floor(Math.random() * 2000),
  };

  cart.push(pokemon);
  localStorage.setItem("cart", JSON.stringify(cart));

  window.location.href = "cart.html";
}

function animateCardImage() {
  const cardImage = document.querySelector(".card-image");
  if (cardImage) {
    anime({
      targets: cardImage,
      rotate: "1turn",
      duration: 1000,
      easing: "easeInOutSine",
    });
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function fetchRandomPokemonSprite() {
  const randomPokemonId = Math.floor(Math.random() * 898) + 1;

  fetch(`https://pokeapi.co/api/v2/pokemon/${randomPokemonId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Aucun Pokémon avec l'ID "${randomPokemonId}" trouvé.`);
      }
      return response.json();
    })
    .then((data) => {
      const spriteElement = document.getElementById("random-pokemon-sprite");
      spriteElement.style.backgroundImage = `url(${data.sprites.front_default})`;

      anime({
        targets: spriteElement,
        rotate: "1turn",
        scale: [{ value: 1 }, { value: 1.4 }, { value: 1, delay: 250 }],
        loop: true,
        direction: "alternate",
        duration: 2000,
        easing: "easeInOutSine",
      });
    })
    .catch(displayError);
}

window.onload = fetchRandomPokemonSprite;
