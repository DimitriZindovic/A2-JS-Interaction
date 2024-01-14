document.addEventListener("DOMContentLoaded", () => {
  const lastSearchedPokemon = localStorage.getItem("lastSearchedPokemon");
  if (lastSearchedPokemon) {
    document.querySelector(".inputResearch").value = lastSearchedPokemon;
  }
  document.querySelector(".buttonResearch").addEventListener("click", () => {
    const userInput = document
      .querySelector(".inputResearch")
      .value.toLowerCase();
    localStorage.setItem("lastSearchedPokemon", userInput);
    fetch(`https://pokeapi.co/api/v2/pokemon/${userInput}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Aucun Pokémon nommé "${userInput}" trouvé.`);
        }
        return response.json();
      })
      .then((data) => {
        localStorage.setItem("pokemonName", data.name);
        localStorage.setItem("pokemonImage", data.sprites.front_default);
        localStorage.setItem("pokemonStats", JSON.stringify(data.stats));

        window.location.href = "product.html";
      })
      .catch((error) => {
        const searchBarContainer = document.querySelector("h2");
        const errorMessage = document.createElement("p");
        errorMessage.classList.add("error");
        errorMessage.textContent = error.message;
        searchBarContainer.insertAdjacentElement("afterend", errorMessage);
      });
  });
});

const pokemonName = localStorage.getItem("pokemonName");
const pokemonImage = localStorage.getItem("pokemonImage");
const pokemonStats = JSON.parse(localStorage.getItem("pokemonStats"));

const pokemonNameCapitalized =
  pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);

const pokemonPrice = Math.floor(Math.random() * 2000);

const cardPokemon = document.querySelector(".card-pokemon");
if (cardPokemon) {
  cardPokemon.innerHTML = `
      <img class="card-image" src="${pokemonImage}" alt="${pokemonNameCapitalized}" />
      <div class="description-pokemon">
        <h3>${pokemonNameCapitalized}</h3>
        <ul>
          ${pokemonStats
            .map((stat) => `<li>${stat.stat.name}: ${stat.base_stat}</li>`)
            .join("")}
        </ul>
        <p>Prix: ${pokemonPrice}€</p>
        <button class="button-add-cart">Ajouter au panier  →</button>
      </div>
    `;
}

document.addEventListener("DOMContentLoaded", () => {
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

  const totalPrice = cart.reduce((total, pokemon) => total + pokemon.price, 0);
  const totalPriceElement = document.createElement("p");
  totalPriceElement.classList.add("total-price");
  totalPriceElement.textContent = `Prix total: ${totalPrice}€`;
  if (cartContainer) {
    cartContainer.appendChild(totalPriceElement);
  }

  const addToCartButton = document.querySelector(".button-add-cart");
  if (addToCartButton) {
    addToCartButton.addEventListener("mouseover", () => {
      anime({
        targets: addToCartButton,
        scale: [1, 1.1, 1],
        duration: 1000,
        easing: "easeInOutQuad",
        loop: true,
      });
    });

    addToCartButton.addEventListener("click", () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const pokemon = {
        name: pokemonNameCapitalized,
        image: pokemonImage,
        price: pokemonPrice,
      };

      cart.push(pokemon);
      localStorage.setItem("cart", JSON.stringify(cart));

      window.location.href = "cart.html";
    });
  }
});

const cardImage = document.querySelector(".card-image");
if (cardImage) {
  anime({
    targets: cardImage,
    rotate: "1turn",
    duration: 1000,
    easing: "easeInOutSine",
  });
}

window.onload = () => {
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
};

function displayError(error) {
  const errorElement = document.getElementById("nonexistent-element");
  errorElement.insertAdjacentElement("beforeend", error);
}
