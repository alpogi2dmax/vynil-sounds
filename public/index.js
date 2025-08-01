// ===== Menu Toggle =====
const toggle = document.querySelector('.menu-toggle')
const menu = document.querySelector('.header-menu')

toggle.addEventListener('click', () => {
  menu.classList.toggle('open')
})

// ===== Login/Logout Display =====
const loginLink = document.getElementById('login-link')

function updateLoginDisplay() {
  const token = localStorage.getItem('token')
  if (!token) {
    // Not logged in
    loginLink.textContent = 'Login'
    loginLink.href = 'login.html'
    // Remove logout button if exists
    const logoutBtn = document.getElementById('logout-btn')
    if (logoutBtn) logoutBtn.remove()
  } else {
    // Logged in
    const payload = JSON.parse(atob(token.split('.')[1]))
    const email = payload.email || 'User'

    loginLink.textContent = email
    loginLink.href = '#'

    let logoutBtn = document.getElementById('logout-btn')
    if (!logoutBtn) {
      logoutBtn = document.createElement('button')
      logoutBtn.id = 'logout-btn'
      logoutBtn.textContent = 'Logout'
      logoutBtn.classList.add('logout-link')
      logoutBtn.style.marginLeft = '10px'
      loginLink.insertAdjacentElement('afterend', logoutBtn)

      logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token')
        updateLoginDisplay()
        window.location.href = 'index.html'
      })
    }
  }
}

updateLoginDisplay()

// ===== Product Fetching =====

async function getProducts(filters = {}) {
  const queryParams = new URLSearchParams(filters)
  const res = await fetch(`/api/products?${queryParams}`)
  return await res.json()
}

// ===== Product Rendering =====

function renderProducts(products) {
  const albumsContainer = document.getElementById('products-container')
  const cards = products.map((album) => {
    return `
      <div class="product-card">
        <img src="./images/${album.image}" alt="${album.title}">
        <h2>${album.title}</h2>
        <h3>${album.artist}</h3>
        <p>$${album.price}</p>
        <button class="add-btn">Add to Cart</button>
        <p class="genre-label">${album.genre}</p>
      </div>
    `
  }).join('')

  albumsContainer.innerHTML = cards
}

// ===== Initial Load =====

/**
 * Fetches and displays all products on initial page load.
 */
async function init() {
  populateGenreSelect()
  const products = await getProducts()
  renderProducts(products)
}

init()

// ===== Genre Dropdown =====

/**
 * Populates the genre dropdown with available genres from the API.
 */
async function populateGenreSelect() {
  const res = await fetch('/api/products/genres')
  const genres = await res.json()
  const select = document.getElementById('genre-select')

  genres.forEach(genre => {
    const option = document.createElement('option')
    option.value = genre
    option.textContent = genre
    select.appendChild(option)
  })
}

// ===== Filter Handling =====

/**
 * Fetches and renders products based on the current search input.
 */
async function applySearchFilter() {
  const search = document.getElementById('search-input').value.trim()
  const filters = {}
  if (search) filters.search = search

  const products = await getProducts(filters)
  renderProducts(products)
}

// ===== Event Listeners =====

document.getElementById('search-input').addEventListener('input', (e) => {
  e.preventDefault()
  applySearchFilter()
})

// prevent 'enter' from submitting
document.getElementById('search-input').addEventListener('submit', (e) => {
  e.preventDefault()
})

document.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault()
  applySearchFilter() // your function to run the search
})

document.getElementById('genre-select').addEventListener('change', async (e) => {
  const genre = e.target.value
  const products = await getProducts(genre ? { genre } : {})
  renderProducts(products)
})
