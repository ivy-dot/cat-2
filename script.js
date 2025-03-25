 "use strict;"

fetchProducts("https://dummyjson.com/products");

async function fetchProducts(apiUrl, products = null) {
  try {
    const container = document.querySelector(".container");
    const loader = document.querySelector("#loading");

    if (!products) {
      sessionStorage.clear();
      loader.classList.add("display");

      const response = await fetch(apiUrl);
      const data = await response.json();
      products = data.products; 

      loader.classList.remove("display");
    }

    let currentPage = sessionStorage.getItem("currentPage") || 1;
    sessionStorage.setItem("currentPage", currentPage);

    container.innerHTML = ""; 

    products
      .slice((currentPage - 1) * 9, currentPage * 9)
      .forEach((product) => {
        const card = `
          <div class="card">
            <img class="product-image" src="${product.thumbnail}" alt="${product.title}">
            <div class="card-content">
              <p class="product-brand">${product.brand || "Unknown Brand"}</p>
              <h3 class="product-name">${product.title}</h3>
              <div class="product-description"><p>${product.description || "No description available."}</p></div>
              <div class="card-footer">
                <p class="product-price">$${product.price}</p>
                <a class="button" href="#" target="_blank">BUY</a>
              </div>
            </div>
          </div>
        `;

        container.insertAdjacentHTML("beforeend", card);

        document.querySelector(".card:last-child").addEventListener("click", function () {
          showModal(product);
        });
      });

    renderNavigation(products, apiUrl);
  } catch (error) {
    console.log("Reloading Page. Error occurred: " + error);
    location.reload();
  }
}

function renderNavigation(products, apiUrl) {
  let navigation = document.querySelector(".navigation");
  if (!navigation) {
    navigation = document.createElement("div");
    navigation.className = "navigation";
    document.body.append(navigation);
  }
  navigation.innerHTML = ""; 

  const previous = document.createElement("button");
  previous.classList.add("button", "previous");
  previous.innerHTML = "« Previous";
  previous.addEventListener("click", function () {
    previousPage(products, apiUrl);
  });

  const next = document.createElement("button");
  next.classList.add("button", "next");
  next.innerHTML = "Next »";
  next.addEventListener("click", function () {
    nextPage(products, apiUrl);
  });

  navigation.append(previous, next);
}

function nextPage(products, apiUrl) {
  const currentPage = Number(sessionStorage.getItem("currentPage"));
  const totalPages = Math.ceil(products.length / 9);

  if (currentPage < totalPages) {
    sessionStorage.setItem("currentPage", currentPage + 1);
    fetchProducts(apiUrl, products);
    topFunction();
  }
}

function previousPage(products, apiUrl) {
  const currentPage = Number(sessionStorage.getItem("currentPage"));

  if (currentPage > 1) {
    sessionStorage.setItem("currentPage", currentPage - 1);
    fetchProducts(apiUrl, products);
    topFunction();
  }
}

function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

function showModal(product) {
  const backdrop = document.querySelector(".backdrop");
  const modalElement = `
    <div class="modal">
      <button class="modal-close">X</button>
      <div class="modal-product-image">
        <img src="${product.thumbnail}" alt="${product.title}">
      </div>
      <div class="modal-product-info">
        <p class="product-brand">${product.brand || "Unknown Brand"}</p>
        <h1 class="product-name">${product.title}</h1>
        <p class="product-description">${product.description || "No description available."}</p>
        <div class="modal-footer">
          <h1 class="product-price">$${product.price}</h1>
          <a href="#" target="_blank" class="button">BUY</a>
        </div>
      </div>
    </div>`;

  backdrop.insertAdjacentHTML("afterend", modalElement);

  document.querySelector(".modal-close").addEventListener("click", closeModal);
  backdrop.addEventListener("click", closeModal);

  backdrop.classList.add("display");
  document.querySelector(".modal").classList.add("display");
}

function closeModal() {
  document.querySelector(".backdrop").classList.remove("display");
  document.querySelector(".modal").remove();
}

document.querySelector(".search-bar").addEventListener("input", async function (event) {
  const query = event.target.value.toLowerCase();
  
  try {
    const response = await fetch("https://dummyjson.com/products");
    const data = await response.json();
    
    const filteredProducts = data.products.filter(product =>
      product.title.toLowerCase().includes(query) ||
      (product.brand && product.brand.toLowerCase().includes(query)) ||
      (product.description && product.description.toLowerCase().includes(query))
    );

    fetchProducts("", filteredProducts); 
  } catch (error) {
    console.error("Error fetching products:", error);
  }
});
