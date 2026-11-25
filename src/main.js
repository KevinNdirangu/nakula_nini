import './style.css'

// ==================================================
// 1. LOCAL STORAGE
// ==================================================

const STORAGE_KEY = 'kwa-mathe-data-v1'

function loadData() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}
  } catch {
    return {}
  }
}

const stored = loadData()

const ingredients = new Set(
  stored.ingredients || ['Potatoes', 'Tomatoes', 'Onions', 'Eggs']
)

const customIngredients = Array.isArray(stored.customIngredients)
  ? stored.customIngredients
  : []

const customRecipes = Array.isArray(stored.customRecipes)
  ? stored.customRecipes
  : []

// Meal plans are stored separately for each calendar date.
// Migrate the previous single-day plan into today's date on first load.
const todayDateKey = todayKey()
const mealPlans = stored.mealPlans && typeof stored.mealPlans === 'object'
  ? stored.mealPlans
  : { [todayDateKey]: { Breakfast: null, Lunch: null, Supper: null, ...(stored.mealPlan || {}) } }

let selectedDateKey = todayDateKey
let openPlanChooserCategory = null

const cookingHistory = Array.isArray(stored.cookingHistory)
  ? stored.cookingHistory
  : []

const savedMeals = new Set(stored.savedMeals || [])
const householdProfile = { adults: 1, children: 0, dailyBudget: 0, ...(stored.householdProfile || {}) }
const mealServings = stored.mealServings && typeof stored.mealServings === 'object' ? stored.mealServings : {}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    ingredients: [...ingredients],
    customIngredients,
    customRecipes,
    mealPlans,
    cookingHistory,
    savedMeals: [...savedMeals],
    householdProfile,
    mealServings
  }))
}

// ==================================================
// 2. INGREDIENT CATALOGUE
// ==================================================

const ingredientCatalogue = [
  { name: 'Potatoes', aliases: ['viazi', 'potato'] },
  { name: 'Tomatoes', aliases: ['tomato', 'nyanya'] },
  { name: 'Onions', aliases: ['onion', 'kitunguu'] },
  { name: 'Eggs', aliases: ['egg', 'mayai', 'yai'] },
  { name: 'Carrots', aliases: ['carrot'] },
  { name: 'Rice', aliases: ['mchele'] },
  { name: 'Beans', aliases: ['bean', 'maharagwe'] },
  { name: 'Maize flour', aliases: ['unga wa ugali'] },
  { name: 'Milk', aliases: ['maziwa'] },
  { name: 'Water', aliases: ['maji'] },
  { name: 'Cabbage', aliases: ['kabichi'] },
  { name: 'Sukuma wiki', aliases: ['sukumawiki', 'collard greens'] },
  { name: 'Spinach', aliases: [] },
  { name: 'Kunde', aliases: ['cowpea leaves'] },
  { name: 'Terere', aliases: ['amaranth leaves'] },
  { name: 'Managu', aliases: ['african nightshade'] },
  { name: 'Dhania', aliases: ['dania', 'coriander', 'cilantro'] },
  { name: 'Garlic', aliases: ['kitunguu saumu'] },
  { name: 'Ginger', aliases: ['tangawizi'] },
  { name: 'Green pepper', aliases: ['hoho', 'capsicum'] },
  { name: 'Avocado', aliases: ['parachichi'] },
  { name: 'Sweet potatoes', aliases: ['viazi vitamu'] },
  { name: 'Arrowroot', aliases: ['nduma'] },
  { name: 'Cassava', aliases: ['muhogo'] },
  { name: 'Bananas', aliases: ['ndizi', 'banana'] },
  { name: 'Chicken', aliases: ['kuku'] },
  { name: 'Beef', aliases: ['nyama ya ngombe'] },
  { name: 'Fish', aliases: ['samaki'] },
  { name: 'Omena', aliases: [] },
  { name: 'Dagaa', aliases: [] },
  { name: 'Groundnuts', aliases: ['njugu', 'peanuts'] },
  { name: 'Green grams', aliases: ['ndengu', 'mung beans'] },
  { name: 'Njahi', aliases: ['hyacinth beans', 'lablab beans'] },
  { name: 'Maize', aliases: ['mahindi'] },
  { name: 'Peas', aliases: ['green peas'] },
  { name: 'Wheat flour', aliases: ['unga wa ngano'] },
  { name: 'Cooking oil', aliases: ['mafuta'] },
  { name: 'Salt', aliases: ['chumvi'] },
  { name: 'Sugar', aliases: ['sukari'] },
  { name: 'Tea leaves', aliases: ['chai'] },
  { name: 'Bread', aliases: [] },
  { name: 'Margarine', aliases: [] }
]

customIngredients.forEach(name => {
  if (!ingredientCatalogue.some(item =>
    item.name.toLowerCase() === name.toLowerCase()
  )) {
    ingredientCatalogue.push({ name, aliases: [] })
  }
})

// ==================================================
// 3. STARTER RECIPE COLLECTION
// ==================================================

const starterRecipes = [
  {
    id: 'boiled-eggs',
    name: 'Boiled eggs and tea',
    category: 'Breakfast',
    description: 'A simple breakfast to start the day.',
    emoji: '🥚',
    time: 15,
    ingredients: ['Eggs', 'Tea leaves', 'Sugar', 'Milk'],
    instructions: [
      'Put the eggs in a saucepan and cover with water.',
      'Boil until they reach your preferred firmness.',
      'Prepare tea separately.',
      'Serve while warm.'
    ]
  },
  {
    id: 'sweet-potatoes',
    name: 'Viazi vitamu na chai',
    category: 'Breakfast',
    description: 'Sweet potatoes served with a warm cup of tea.',
    emoji: '🍠',
    time: 30,
    ingredients: ['Sweet potatoes', 'Tea leaves', 'Milk', 'Sugar'],
    instructions: [
      'Wash and peel the sweet potatoes.',
      'Cut into manageable pieces.',
      'Boil in water until soft.',
      'Prepare tea and serve together.'
    ]
  },
  {
    id: 'mandazi',
    name: 'Mandazi',
    category: 'Breakfast',
    description: 'Soft homemade mandazi for a relaxed morning.',
    emoji: '🥯',
    time: 45,
    ingredients: ['Wheat flour', 'Sugar', 'Milk', 'Cooking oil'],
    instructions: [
      'Mix flour and sugar in a bowl.',
      'Add milk gradually and knead into a soft dough.',
      'Rest the dough for about 15 minutes.',
      'Roll and cut into suitable shapes.',
      'Fry in moderately hot oil until golden.'
    ]
  },
  {
    id: 'githeri',
    name: 'Githeri',
    category: 'Lunch',
    description: 'A Kenyan favourite made with maize and beans.',
    emoji: '🍲',
    time: 60,
    ingredients: ['Maize', 'Beans', 'Onions', 'Tomatoes', 'Cooking oil', 'Salt'],
    instructions: [
      'Boil maize and beans until tender.',
      'Chop onions and tomatoes.',
      'Fry the onions in a little cooking oil.',
      'Add tomatoes and cook until soft.',
      'Add the boiled maize and beans.',
      'Season and simmer until the flavours combine.'
    ]
  },
  {
    id: 'rice-beans',
    name: 'Rice na beans',
    category: 'Lunch',
    description: 'A filling combination of rice and beans.',
    emoji: '🍚',
    time: 45,
    ingredients: ['Rice', 'Beans', 'Onions', 'Tomatoes', 'Cooking oil', 'Salt'],
    instructions: [
      'Boil beans until tender.',
      'Prepare rice separately.',
      'Fry onions and add chopped tomatoes.',
      'Add the cooked beans and season.',
      'Simmer the bean stew and serve with rice.'
    ]
  },
  {
    id: 'ugali-sukuma',
    name: 'Ugali na sukuma wiki',
    category: 'Supper',
    description: 'A familiar Kenyan supper.',
    emoji: '🥬',
    time: 35,
    ingredients: ['Maize flour', 'Sukuma wiki', 'Onions', 'Tomatoes', 'Cooking oil', 'Salt'],
    instructions: [
      'Wash and chop the sukuma wiki.',
      'Fry onions, add tomatoes and cook until soft.',
      'Add sukuma wiki and cook to your preference.',
      'Bring water to a boil in another saucepan.',
      'Gradually add maize flour while stirring.',
      'Cook the ugali until firm and serve.'
    ]
  },
  {
    id: 'viazi-mayai',
    name: 'Viazi vya mchuzi na mayai',
    category: 'Supper',
    description: 'Potatoes and eggs in a rich tomato-onion sauce.',
    emoji: '🍲',
    time: 30,
    ingredients: ['Potatoes', 'Eggs', 'Tomatoes', 'Onions', 'Cooking oil', 'Salt'],
    instructions: [
      'Peel and cut the potatoes into pieces.',
      'Boil the potatoes until almost tender.',
      'Fry onions and tomatoes in a little oil.',
      'Add the potatoes and a little water.',
      'Add boiled eggs and simmer until the sauce thickens.',
      'Season and serve.'
    ]
  },
  {
    id: 'cabbage-rice',
    name: 'Rice na cabbage',
    category: 'Supper',
    description: 'Rice served with lightly cooked cabbage.',
    emoji: '🥘',
    time: 30,
    ingredients: ['Rice', 'Cabbage', 'Onions', 'Tomatoes', 'Cooking oil', 'Salt'],
    instructions: [
      'Wash and cook the rice.',
      'Slice the cabbage, onions and tomatoes.',
      'Fry onions and tomatoes.',
      'Add cabbage and cook until tender.',
      'Season and serve with rice.'
    ]
  }
]

// Custom recipes are stored separately so starter recipes are never overwritten.
let recipes = [...starterRecipes, ...customRecipes]

// ==================================================
// 4. APPLICATION STRUCTURE
// ==================================================

const app = document.querySelector('#app')

app.innerHTML = `
  <div class="app-shell">
    <header class="topbar">
      <a class="brand" href="#" data-go="Home" aria-label="Kwa Mathe home">
        <span class="brand-mark">K</span>
        <span>kwa mathe<span class="brand-dot">.</span></span>
      </a>
      <button class="profile-button" type="button" data-go="Settings" aria-label="Open settings">
        <svg viewBox="0 0 64 64" role="img" aria-label="Illustrated Mathe">
          <path d="M10 58c1-13 9-20 22-20s21 7 22 20" fill="#C66A43"/>
          <path d="M14 25C12 9 23 3 33 5c13 1 19 12 16 24l-5 13H19z" fill="#244B38"/>
          <path d="M19 25c0-10 6-15 14-15s14 6 14 16v9c0 10-7 16-15 16S19 45 19 35z" fill="#B97952"/>
          <path d="M15 24c-3-13 7-21 18-21 12 0 20 8 17 21-6-2-10-7-12-12-5 7-13 11-23 12" fill="#E4B96A"/>
          <path d="M25 32h2m11 0h2" stroke="#3B2922" stroke-width="3" stroke-linecap="round"/>
          <path d="M28 41c3 3 7 3 10 0" fill="none" stroke="#713E32" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    </header>

    <main id="main-content">
      <section class="page active" id="page-home">
        <section class="welcome-section">
          <p class="eyebrow">KARIBU JIKONI 👋</p>
          <h1>Sasa, leo<br>tunapika <span>nini?</span></h1>
          <p class="welcome-copy">
            Usijali kuhusu chakula. Mathe ako hapa!
            Let's plan something delicious.
          </p>
        </section>

        <section class="mathe-note">
          <div class="mathe-avatar">
            <svg viewBox="0 0 64 64" role="img" aria-label="Mathe illustration">
              <path d="M9 61c2-14 10-21 23-21s21 7 23 21" fill="#C66A43"/>
              <path d="M13 27C11 10 23 4 33 5c13 1 19 12 16 25l-5 12H18z" fill="#244B38"/>
              <path d="M19 26c0-10 6-15 14-15s14 6 14 16v9c0 9-7 15-15 15S19 45 19 36z" fill="#B97952"/>
              <path d="M15 24C12 11 23 3 33 3c12 0 20 8 17 21-6-2-10-7-12-12-5 7-13 11-23 12" fill="#E4B96A"/>
              <path d="M25 32h2m11 0h2" stroke="#3B2922" stroke-width="3" stroke-linecap="round"/>
              <path d="M28 41c3 3 7 3 10 0" fill="none" stroke="#713E32" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="mathe-message">
            <span class="mathe-label">MATHE SAYS</span>
            <p>“Mtoto wangu, kwanza tuangalie kwa kitchen kuna nini.”</p>
          </div>
          <span class="sparkle">✳</span>
        </section>

        <section class="suggestion-section">
          <div class="section-heading">
            <div><p class="eyebrow">LET'S GET COOKING</p><h2>What's in your kitchen?</h2></div>
            <span class="magic-icon">✦</span>
          </div>
          <p class="section-description">Check what you have and let Mathe help you decide what to make.</p>
          <button class="primary-button" type="button" data-go="My Kitchen">Open My Kitchen <span>→</span></button>
          <div class="home-shortcuts">
            <button class="shortcut-card" type="button" data-go="Planner"><span>📅</span><strong>Plan meals</strong><small>Organise your week</small></button>
            <button class="shortcut-card" type="button" data-go="Recipes"><span>🍲</span><strong>Explore recipes</strong><small>Find something delicious</small></button>
          </div>
        </section>

        <section class="daily-tip">
          <span class="tip-icon">💡</span>
          <div>
            <strong>Mathe's kitchen wisdom</strong>
            <p>Good food doesn't need expensive ingredients. It needs a little creativity.</p>
          </div>
        </section>
      </section>

      <section class="page" id="page-kitchen" hidden>
        <section class="page-heading">
          <p class="eyebrow">YOUR KITCHEN</p>
          <h1>My Kitchen</h1>
          <p class="welcome-copy">
            Let's see what we have at home. Select the ingredients available to you.
          </p>
        </section>

        <section class="kitchen-section">
          <div class="section-heading">
            <div><p class="eyebrow">YOUR INGREDIENTS</p><h2>What's in the kitchen?</h2></div>
            <span class="ingredient-count" id="ingredient-count">0 ingredients</span>
          </div>
          <p class="section-description">This is your current kitchen inventory. It stays here until you remove something.</p>
          <div class="kitchen-inventory" id="kitchen-inventory"></div>
          <button class="small-primary-button add-kitchen-ingredients" type="button" id="open-ingredient-picker">+ Add ingredients</button>

          <div class="ingredient-picker" id="ingredient-picker" hidden>
            <div class="picker-heading">
              <div><strong>Add to your kitchen</strong><p>Search the catalogue or add your own ingredient.</p></div>
              <button class="picker-close" type="button" id="close-ingredient-picker" aria-label="Close ingredient picker">×</button>
            </div>
            <form class="add-ingredient-form" id="ingredient-form">
              <input id="ingredient-input" type="text" placeholder="Search or add an ingredient..." aria-label="Search or add an ingredient" maxlength="35" autocomplete="off">
              <button type="submit" aria-label="Add ingredient">+</button>
            </form>
            <p class="suggestion-hint" id="search-hint">Browse the catalogue or search by name.</p>
            <div class="ingredient-list" id="ingredient-list"></div>
          </div>
        </section>

        <section class="kitchen-discovery">
          <div class="section-heading"><div><p class="eyebrow">MATHE'S IDEAS</p><h2>Meals you could make</h2></div></div>
          <p class="section-description">Suggestions are based on the ingredients you currently have.</p>
          <div id="kitchen-suggestions" class="kitchen-meal-list"></div>
          <button class="secondary-button" type="button" data-go="Recipes">Explore all recipes →</button>
        </section>

        <section class="kitchen-discovery">
          <div class="section-heading"><div><p class="eyebrow">MADE BEFORE</p><h2>Cook it again</h2></div></div>
          <p class="section-description">Pick a meal from your cooking history and make it again.</p>
          <div id="kitchen-history" class="kitchen-meal-list"></div>
          <button class="secondary-button" type="button" data-go="Recipes">Create a new meal →</button>
        </section>
      </section>

      <section class="page" id="page-recipes" hidden>
        <section class="page-heading">
          <p class="eyebrow">FROM MATHE'S RECIPE BOOK</p>
          <h1>Recipes</h1>
          <p class="welcome-copy">
            Discover meals, learn how to prepare them and make something wonderful.
          </p>
        </section>

        <section class="custom-meal-section">
          <div class="section-heading">
            <div>
              <p class="eyebrow">YOUR OWN KITCHEN IDEAS</p>
              <h2>Add a meal</h2>
            </div>
          </div>
          <p class="section-description">
            Save a quick meal with just its name and ingredients, or add full cooking instructions.
          </p>

          <form id="custom-meal-form" class="custom-meal-form">
            <input type="hidden" id="custom-meal-id">

            <label for="custom-meal-name">Meal name</label>
            <input id="custom-meal-name" type="text" maxlength="65"
              placeholder="e.g. Strong tea and bread" required>

            <label for="custom-meal-category">Meal time</label>
            <select id="custom-meal-category" required>
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Supper">Supper</option>
            </select>

            <label for="custom-meal-ingredients">Ingredients</label>
            <textarea id="custom-meal-ingredients" rows="3"
              placeholder="e.g. Tea leaves, water, sugar, bread" required></textarea>
            <small>Separate ingredients with commas. You can use ingredients already in My Kitchen or add new ones.</small>

            <details class="full-recipe-options">
              <summary>Add preparation instructions (optional)</summary>
              <div class="full-recipe-fields">
                <label for="custom-meal-description">Short description (optional)</label>
                <input id="custom-meal-description" type="text" maxlength="140"
                  placeholder="A little description of this meal">

                <label for="custom-meal-time">Approximate preparation time in minutes (optional)</label>
                <input id="custom-meal-time" type="number" min="1" max="600"
                  placeholder="e.g. 25">

                <label for="custom-meal-cost">Approximate total meal cost (KSh, optional)</label>
                <input id="custom-meal-cost" type="number" min="0" max="1000000" step="1" placeholder="Enter your own estimate">
                <label for="custom-meal-calories">Calories per serving (optional)</label>
                <input id="custom-meal-calories" type="number" min="0" max="10000" step="1" placeholder="kcal">
                <label for="custom-meal-protein">Protein per serving in grams (optional)</label>
                <input id="custom-meal-protein" type="number" min="0" max="1000" step="0.1" placeholder="e.g. 18">

                <label for="custom-meal-instructions">Preparation instructions</label>
                <textarea id="custom-meal-instructions" rows="5"
                  placeholder="Write each step on a new line."></textarea>
              </div>
            </details>

            <div class="custom-meal-actions">
              <button class="small-primary-button" type="submit" id="custom-meal-submit">
                Save meal
              </button>
              <button class="secondary-button" type="button" id="cancel-meal-edit" hidden>
                Cancel edit
              </button>
            </div>
          </form>
        </section>

        <section class="recipe-library-section">
          <div class="section-heading recipe-heading">
            <div>
              <p class="eyebrow">MATHE'S COLLECTION</p>
              <h2>Explore meals</h2>
            </div>
            <span class="ingredient-count" id="recipe-count">0 meals</span>
          </div>
          <label class="recipe-search-label" for="recipe-search">Find something to cook</label>
          <input id="recipe-search" class="recipe-search" type="search"
            placeholder="Search meals or ingredients..." autocomplete="off">
          <div class="recipe-filters" role="group" aria-label="Filter recipes by meal time">
            <button type="button" class="recipe-filter active" data-recipe-filter="All" aria-pressed="true">All</button>
            <button type="button" class="recipe-filter" data-recipe-filter="Breakfast" aria-pressed="false">Breakfast</button>
            <button type="button" class="recipe-filter" data-recipe-filter="Lunch" aria-pressed="false">Lunch</button>
            <button type="button" class="recipe-filter" data-recipe-filter="Supper" aria-pressed="false">Supper</button>
            <button type="button" class="recipe-filter" data-recipe-filter="My meals" aria-pressed="false">My meals</button>
          </div>
          <p class="recipe-results-note" id="recipe-results-note" aria-live="polite"></p>
          <div id="recipe-list" class="recipe-list"></div>
        </section>
      </section>

      <section class="page" id="page-planner" hidden>
        <section class="page-heading">
          <p class="eyebrow">YOUR MEAL PLAN</p>
          <h1>Planner</h1>
          <p class="welcome-copy">Plan what you'd like to eat. Meals are only added to your cooking history when you mark them as cooked.</p>
        </section>
        <section class="suggestion-section">
          <div class="day-tracker">
            <div class="calendar-toolbar">
              <div class="calendar-month-title"><span class="eyebrow">MEAL CALENDAR</span><strong id="week-label">November 2026</strong></div>
              <div class="calendar-navigation">
                <button type="button" id="previous-week" class="week-arrow" aria-label="Previous month">‹</button>
                <button type="button" id="next-week" class="week-arrow" aria-label="Next month">›</button>
                <button type="button" id="go-today" class="today-button">Today</button>
              </div>
            </div>
            <div class="month-calendar" aria-label="Choose a day">
              <div class="calendar-weekdays" aria-hidden="true">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
              <div id="week-days" class="week-days"></div>
            </div>
            <div class="calendar-legend"><span><i class="planned-dot"></i> Planned</span><span><i class="cooked-dot"></i> Cooked</span></div>
            <div class="selected-day-heading">
              <div><span class="eyebrow">SELECTED DAY</span><h3 id="selected-day-label">Today</h3></div>
              <span id="day-progress" class="day-progress">0 of 3 cooked</span>
            </div>
          </div>
          <div id="daily-meals" class="daily-meals"></div>
        </section>
      </section>

      <section class="page" id="page-settings" hidden>
        <section class="page-heading">
          <p class="eyebrow">YOUR HOME PROFILE</p>
          <h1>Settings</h1>
          <p class="welcome-copy">Tell Mathe who you're cooking for and your usual food budget.</p>
        </section>
        <section class="planning-tools">
          <div class="section-heading"><div><p class="eyebrow">HOUSEHOLD</p><h2>Who are we cooking for?</h2></div></div>
          <p class="section-description">These details help Mathe suggest suitable serving sizes and meal costs.</p>
          <form id="household-form" class="household-form">
            <label>Adults<input id="household-adults" type="number" min="1" max="30" value="1" required></label>
            <label>Children<input id="household-children" type="number" min="0" max="30" value="0" required></label>
            <label>Daily budget (KSh)<input id="daily-budget" type="number" min="0" max="1000000" step="10" placeholder="Optional"></label>
            <button class="small-primary-button" type="submit">Save settings</button>
          </form>
          <p class="planning-hint" id="household-summary"></p>
        </section>
      </section>

      <section class="page" id="page-saved" hidden>
        <section class="page-heading">
          <p class="eyebrow">YOUR FOOD MEMORIES</p>
          <h1>Saved & History</h1>
          <p class="welcome-copy">
            Your favourite meals and the dishes you've already prepared.
          </p>
        </section>

        <section class="history-section">
          <div class="section-heading">
            <div>
              <p class="eyebrow">YOUR FAVOURITES</p>
              <h2>Saved meals</h2>
            </div>
          </div>
          <div id="saved-list"></div>
        </section>

        <section class="history-section">
          <div class="section-heading">
            <div>
              <p class="eyebrow">YOUR COOKING JOURNEY</p>
              <h2>Cooking history</h2>
            </div>
          </div>
          <div id="history-list"></div>
        </section>
      </section>
    </main>

    <nav class="bottom-nav" aria-label="Main navigation">
      <button class="nav-item active" type="button" data-page="Home"><span>⌂</span><small>Home</small></button>
      <button class="nav-item" type="button" data-page="My Kitchen"><span>♧</span><small>Kitchen</small></button>
      <button class="nav-item" type="button" data-page="Planner"><span>▦</span><small>Planner</small></button>
      <button class="nav-item" type="button" data-page="Recipes"><span>▤</span><small>Recipes</small></button>
      <button class="nav-item" type="button" data-page="Saved"><span>♡</span><small>Saved</small></button>
    </nav>

    <div hidden aria-hidden="true"><div id="shopping-list"></div><button id="refresh-shopping" type="button"></button></div>

    <div class="toast" id="toast" role="status" aria-live="polite"></div>

    <div class="modal-backdrop" id="recipe-modal" hidden>
      <section class="recipe-modal" role="dialog" aria-modal="true"
        aria-labelledby="modal-title">
        <button type="button" class="modal-close" id="modal-close"
          aria-label="Close recipe">×</button>
        <div id="modal-content"></div>
      </section>
    </div>
  </div>
`

// ==================================================
// 5. ELEMENT REFERENCES
// ==================================================

const $ = selector => document.querySelector(selector)

const ingredientList = $('#ingredient-list')
const ingredientCount = $('#ingredient-count')
const ingredientInput = $('#ingredient-input')
const ingredientForm = $('#ingredient-form')
const selectedSummary = $('#selected-summary')
const searchHint = $('#search-hint')
const dailyMeals = $('#daily-meals')
const recipeList = $('#recipe-list')
const savedList = $('#saved-list')
const historyList = $('#history-list')
const toast = $('#toast')
const modal = $('#recipe-modal')
const modalContent = $('#modal-content')
const customMealForm = $('#custom-meal-form')
let activeRecipeCategory = 'All'
let recipeSearchTerm = ''

// ==================================================
// 6. HELPERS
// ==================================================

function showToast(message) {
  toast.textContent = message
  toast.classList.add('visible')
  clearTimeout(showToast.timer)
  showToast.timer = setTimeout(() => toast.classList.remove('visible'), 2500)
}

function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  })[character])
}

function findRecipe(id) {
  return recipes.find(recipe => recipe.id === id)
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

function todayKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function recordDateKey(record) {
  return record.dateKey || todayKey(new Date(record.cookedAt))
}

function wasCookedOn(id, category, dateKey) {
  return cookingHistory.some(record =>
    record.id === id && record.category === category && recordDateKey(record) === dateKey
  )
}

function wasCookedToday(id, category) {
  return wasCookedOn(id, category, todayKey())
}

function getPlansForDate(dateKey) {
  if (!mealPlans[dateKey]) {
    mealPlans[dateKey] = { Breakfast: null, Lunch: null, Supper: null }
  }
  return mealPlans[dateKey]
}

function dateFromKey(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function addDays(date, amount) {
  const result = new Date(date)
  result.setDate(result.getDate() + amount)
  return result
}

function startOfWeek(date) {
  const result = new Date(date)
  result.setHours(0, 0, 0, 0)
  result.setDate(result.getDate() - ((result.getDay() + 6) % 7))
  return result
}

function normaliseIngredientName(value) {
  return value.trim().replace(/\s+/g, ' ')
}

function addIngredientToCatalogue(name) {
  const cleanName = normaliseIngredientName(name)
  if (!cleanName) return

  const existing = findExactIngredient(cleanName)
  if (existing) return existing.name

  ingredientCatalogue.push({ name: cleanName, aliases: [] })

  if (!customIngredients.some(item => item.toLowerCase() === cleanName.toLowerCase())) {
    customIngredients.push(cleanName)
  }

  return cleanName
}

// ==================================================
// 7. SPELLING AND INGREDIENT SEARCH
// ==================================================

function levenshteinDistance(first, second) {
  const a = first.toLowerCase()
  const b = second.toLowerCase()
  const matrix = Array.from(
    { length: a.length + 1 },
    () => Array(b.length + 1).fill(0)
  )

  for (let i = 0; i <= a.length; i++) matrix[i][0] = i
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      )
    }
  }

  return matrix[a.length][b.length]
}

function findExactIngredient(value) {
  const search = value.toLowerCase().trim()
  return ingredientCatalogue.find(item =>
    [item.name, ...item.aliases].some(name => name.toLowerCase() === search)
  )
}

function findSimilarIngredient(value) {
  const search = value.toLowerCase().trim()
  let bestMatch = null
  let bestDistance = Infinity

  ingredientCatalogue.forEach(item => {
    ;[item.name, ...item.aliases].forEach(name => {
      const distance = levenshteinDistance(search, name)
      if (distance < bestDistance) {
        bestDistance = distance
        bestMatch = item
      }
    })
  })

  const allowedDistance = search.length <= 4 ? 1 : 2
  return bestDistance <= allowedDistance ? bestMatch : null
}

// ==================================================
// 8. MY KITCHEN
// ==================================================

function renderIngredients() {
  const inventory = $('#kitchen-inventory')
  const picker = $('#ingredient-picker')
  inventory.replaceChildren()
  ingredientList.replaceChildren()

  const selectedItems = [...ingredients]
  ingredientCount.textContent = `${selectedItems.length} ingredient${selectedItems.length === 1 ? '' : 's'}`

  if (!selectedItems.length) {
    inventory.innerHTML = '<p class="empty-state">Your kitchen is empty for now. Add the ingredients you have at home and Mathe will suggest meals.</p>'
  } else {
    selectedItems.forEach(name => {
      const chip = document.createElement('div')
      chip.className = 'inventory-chip'
      chip.innerHTML = `<span>${escapeHTML(name)}</span><button type="button" aria-label="Remove ${escapeHTML(name)}" data-remove-ingredient="${escapeHTML(name)}">×</button>`
      inventory.appendChild(chip)
    })
  }

  const search = ingredientInput.value.trim().toLowerCase()
  const visible = ingredientCatalogue.filter(item =>
    [item.name, ...item.aliases].some(name => name.toLowerCase().includes(search))
  )
  visible.forEach(item => {
    const selected = ingredients.has(item.name)
    const button = document.createElement('button')
    button.type = 'button'
    button.className = selected ? 'ingredient-chip selected' : 'ingredient-chip'
    button.textContent = selected ? `✓ ${item.name} · Added` : `+ ${item.name}`
    button.setAttribute('aria-pressed', String(selected))
    button.addEventListener('click', () => {
      if (ingredients.has(item.name)) ingredients.delete(item.name)
      else ingredients.add(item.name)
      saveData()
      renderIngredients()
      renderKitchenDiscovery()
      renderDailyMeals()
      renderRecipes()
      showToast(ingredients.has(item.name) ? `${item.name} added.` : `${item.name} removed.`)
    })
    ingredientList.appendChild(button)
  })

  if (!visible.length) {
    const message = document.createElement('p')
    message.className = 'suggestion-hint'
    message.textContent = 'No matching ingredients found. You can add it above.'
    ingredientList.appendChild(message)
  }

  renderKitchenDiscovery()
}

function renderKitchenDiscovery() {
  const suggestions = $('#kitchen-suggestions')
  const pastMeals = $('#kitchen-history')
  if (!suggestions || !pastMeals) return

  const ranked = recipes
    .map(recipe => ({ recipe, match: getMealMatch(recipe) }))
    .sort((a, b) => b.match.score - a.match.score || b.match.matched.length - a.match.matched.length)
    .slice(0, 4)

  suggestions.replaceChildren()
  if (!ranked.length) {
    suggestions.innerHTML = '<p class="empty-state">Add meals in Recipes and Mathe will suggest what to cook.</p>'
  } else {
    ranked.forEach(({ recipe, match }) => {
      const item = document.createElement('article')
      item.className = 'kitchen-meal-card'
      item.innerHTML = `
        <span class="kitchen-meal-emoji">${escapeHTML(recipe.emoji || '🍽️')}</span>
        <div class="kitchen-meal-info"><strong>${escapeHTML(recipe.name)}</strong><small>${match.matched.length} of ${(recipe.ingredients || []).length} ingredients available</small></div>
        <button class="text-button" type="button" data-kitchen-view="${escapeHTML(recipe.id)}">View</button>`
      suggestions.appendChild(item)
    })
  }

  pastMeals.replaceChildren()
  const recent = cookingHistory.slice(0, 5)
  if (!recent.length) {
    pastMeals.innerHTML = '<p class="empty-state">Your cooked meals will appear here. Once you have cooked something, you can quickly choose it again.</p>'
  } else {
    recent.forEach(record => {
      const item = document.createElement('article')
      item.className = 'kitchen-meal-card'
      item.innerHTML = `
        <span class="kitchen-meal-emoji">🍲</span>
        <div class="kitchen-meal-info"><strong>${escapeHTML(record.name)}</strong><small>Last cooked: ${formatDate(dateFromKey(recordDateKey(record)))}</small></div>
        <button class="text-button" type="button" data-cook-again="${escapeHTML(record.id)}">View & cook</button>`
      pastMeals.appendChild(item)
    })
  }
}

$('#kitchen-inventory').addEventListener('click', event => {
  const button = event.target.closest('[data-remove-ingredient]')
  if (!button) return
  const name = button.dataset.removeIngredient
  ingredients.delete(name)
  saveData()
  renderIngredients()
  renderDailyMeals()
  renderRecipes()
  showToast(`${name} removed from your kitchen.`)
})

$('#open-ingredient-picker').addEventListener('click', () => {
  $('#ingredient-picker').hidden = false
  ingredientInput.focus()
})
$('#close-ingredient-picker').addEventListener('click', () => {
  $('#ingredient-picker').hidden = true
  ingredientInput.value = ''
  searchHint.textContent = 'Browse the catalogue or search by name.'
  renderIngredients()
})

$('#kitchen-suggestions').addEventListener('click', event => {
  const button = event.target.closest('[data-kitchen-view]')
  if (button) openRecipe(button.dataset.kitchenView)
})
$('#kitchen-history').addEventListener('click', event => {
  const button = event.target.closest('[data-cook-again]')
  if (!button) return
  const recipe = findRecipe(button.dataset.cookAgain)
  if (!recipe) {
    showToast('This meal is no longer in your recipe collection.')
    return
  }
  openRecipe(recipe.id)
})

ingredientInput.addEventListener('input', () => {
  renderIngredients()
  searchHint.textContent = ingredientInput.value.trim()
    ? 'Matching ingredients are shown below.'
    : 'Browse the catalogue or search by name.'
})

ingredientForm.addEventListener('submit', event => {
  event.preventDefault()
  const value = normaliseIngredientName(ingredientInput.value)
  if (!value) return
  const exact = findExactIngredient(value)
  if (exact) {
    if (ingredients.has(exact.name)) {
      showToast(`${exact.name} is already in your kitchen.`)
    } else {
      ingredients.add(exact.name)
      showToast(`${exact.name} added to your kitchen.`)
    }
  } else {
    const similar = findSimilarIngredient(value)
    if (similar && window.confirm(`Did you mean "${similar.name}" instead of "${value}"?`)) {
      ingredients.add(similar.name)
      showToast(`${similar.name} added to your kitchen.`)
    } else if (!similar) {
      const newName = addIngredientToCatalogue(value)
      if (newName) {
        ingredients.add(newName)
        showToast(`${newName} added to your kitchen.`)
      }
    } else {
      return
    }
  }
  ingredientInput.value = ''
  saveData()
  renderIngredients()
  renderDailyMeals()
  renderRecipes()
})

// ==================================================
// 9. MEAL MATCHING
// ==================================================

function getMealMatch(recipe) {
  const available = [...ingredients].map(item => item.toLowerCase())
  const required = (recipe.ingredients || []).map(item => item.toLowerCase())
  const matched = required.filter(item => available.includes(item))
  const missing = required.filter(item => !available.includes(item))

  return {
    matched,
    missing,
    score: required.length ? matched.length / required.length : 0
  }
}

function getBestMeal(category) {
  const candidates = recipes.filter(recipe => recipe.category === category)
  if (!candidates.length) return null

  const perMealBudget = Number(householdProfile.dailyBudget || 0) / 3
  return candidates
    .map(recipe => ({ recipe, match: getMealMatch(recipe) }))
    .sort((a, b) => {
      if (b.match.score !== a.match.score) return b.match.score - a.match.score
      if (perMealBudget > 0 && a.recipe.estimatedCost != null && b.recipe.estimatedCost != null) {
        const aFits = Number(a.recipe.estimatedCost) <= perMealBudget
        const bFits = Number(b.recipe.estimatedCost) <= perMealBudget
        if (aFits !== bFits) return aFits ? -1 : 1
        if (Number(a.recipe.estimatedCost) !== Number(b.recipe.estimatedCost)) {
          return Number(a.recipe.estimatedCost) - Number(b.recipe.estimatedCost)
        }
      }
      return (a.recipe.time || 9999) - (b.recipe.time || 9999)
    })[0].recipe
}

// ==================================================
// 10. DAILY MEAL PLAN
// ==================================================

function renderDateTracker() {
  const selectedDate = dateFromKey(selectedDateKey)
  const monthStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
  const gridStart = startOfWeek(monthStart)
  const monthLabel = selectedDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
  $('#week-label').textContent = monthLabel
  $('#selected-day-label').textContent = selectedDateKey === todayKey()
    ? `Today · ${formatDate(selectedDate)}`
    : selectedDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })

  const weekDays = $('#week-days')
  weekDays.replaceChildren()
  for (let offset = 0; offset < 42; offset++) {
    const date = addDays(gridStart, offset)
    const key = todayKey(date)
    const inMonth = date.getMonth() === selectedDate.getMonth()
    const plans = mealPlans[key] || {}
    const plannedCount = ['Breakfast', 'Lunch', 'Supper'].filter(category => plans[category]).length
    const cookedCount = ['Breakfast', 'Lunch', 'Supper'].filter(category =>
      cookingHistory.some(record => record.category === category && recordDateKey(record) === key)
    ).length
    const button = document.createElement('button')
    button.type = 'button'
    button.className = `week-day${key === selectedDateKey ? ' selected' : ''}${key === todayKey() ? ' is-today' : ''}${inMonth ? '' : ' outside-month'}`
    button.dataset.date = key
    button.setAttribute('aria-pressed', String(key === selectedDateKey))
    button.setAttribute('aria-label', date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) + (plannedCount ? `, ${plannedCount} planned meals` : '') + (cookedCount ? `, ${cookedCount} cooked meals` : ''))
    button.innerHTML = `
      <span class="calendar-date-number">${date.getDate()}</span>
      <span class="day-dots">${plannedCount ? '<i class="planned-dot"></i>' : ''}${cookedCount ? '<i class="cooked-dot"></i>' : ''}</span>
    `
    weekDays.appendChild(button)
  }

  const cooked = ['Breakfast', 'Lunch', 'Supper'].filter(category =>
    cookingHistory.some(record => record.category === category && recordDateKey(record) === selectedDateKey)
  ).length
  $('#day-progress').textContent = `${cooked} of 3 cooked`
  renderShoppingList()
}

$('#week-days').addEventListener('click', event => {
  const button = event.target.closest('[data-date]')
  if (!button) return
  selectedDateKey = button.dataset.date
  renderDateTracker()
  renderDailyMeals()
})

$('#previous-week').addEventListener('click', () => {
  const selected = dateFromKey(selectedDateKey)
  selectedDateKey = todayKey(new Date(selected.getFullYear(), selected.getMonth() - 1, Math.min(selected.getDate(), new Date(selected.getFullYear(), selected.getMonth(), 0).getDate())))
  renderDateTracker()
  renderDailyMeals()
})

$('#next-week').addEventListener('click', () => {
  const selected = dateFromKey(selectedDateKey)
  const lastDay = new Date(selected.getFullYear(), selected.getMonth() + 2, 0).getDate()
  selectedDateKey = todayKey(new Date(selected.getFullYear(), selected.getMonth() + 1, Math.min(selected.getDate(), lastDay)))
  renderDateTracker()
  renderDailyMeals()
})

$('#go-today').addEventListener('click', () => {
  selectedDateKey = todayKey()
  renderDateTracker()
  renderDailyMeals()
})

function renderDailyMeals() {
  dailyMeals.innerHTML = ''
  const categories = ['Breakfast', 'Lunch', 'Supper']
  const plans = getPlansForDate(selectedDateKey)
  const isFutureDate = selectedDateKey > todayKey()

  categories.forEach(category => {
    const plannedId = plans[category]
    const plannedRecipe = plannedId ? findRecipe(plannedId) : null
    const recipe = plannedRecipe || getBestMeal(category)
    const isPlanned = Boolean(plannedRecipe)
    const isCooked = recipe ? wasCookedOn(recipe.id, category, selectedDateKey) : false

    const card = document.createElement('article')
    card.className = 'daily-meal-card'

    if (!recipe) {
      card.innerHTML = `<div class="daily-meal-icon">🍽️</div><div class="daily-meal-content"><span class="meal-tag">${category.toUpperCase()}</span><h3>Nothing suggested yet</h3><p>Add meals in Recipes to build your plan.</p><div class="meal-actions"><button type="button" class="secondary-button" data-go="Recipes">Browse meals</button></div></div>`
      dailyMeals.appendChild(card)
      return
    }

    const match = getMealMatch(recipe)
    const missingText = match.missing.length
      ? `Still need: ${match.missing.join(', ')}`
      : 'You have all the listed ingredients!'
    const statusText = isCooked ? 'Cooked' : isPlanned ? 'Planned' : 'Suggested by Mathe'

    card.innerHTML = `
      <div class="daily-meal-icon">${escapeHTML(recipe.emoji || '🍽️')}</div>
      <div class="daily-meal-content">
        <span class="meal-tag">${category.toUpperCase()}</span>
        <h3>${escapeHTML(recipe.name)}</h3>
        <p>${escapeHTML(recipe.description || 'A meal from your kitchen.')}</p>
        <div class="meal-meta">
          ${recipe.time ? `<span>◷ ${Number(recipe.time)} min</span>` : ''}
          <span>${Math.round(match.score * 100)}% ingredient match</span>
          <span class="meal-status ${isCooked ? 'is-cooked' : ''}">${statusText}</span>
        </div>
        ${isPlanned ? `<label class="servings-control">Servings <input type="number" min="1" max="50" value="${getMealServings(selectedDateKey, category)}" data-servings="${category}" aria-label="Servings for ${category}"></label>` : ''}
        ${recipe.estimatedCost != null ? `<p class="meal-match-note">Approximate meal cost: KSh ${Number(recipe.estimatedCost).toLocaleString('en-KE')}${Number(householdProfile.dailyBudget) > 0 ? (Number(recipe.estimatedCost) <= Number(householdProfile.dailyBudget) / 3 ? ' · Within one-third of your daily budget target' : ' · Above one-third of your daily budget target') : ''}</p>` : ''}
        <p class="meal-match-note">${escapeHTML(isPlanned ? 'This meal is in your plan.' : missingText)}</p>
        ${openPlanChooserCategory === category ? `
          <label class="plan-meal-picker">Choose a ${category.toLowerCase()} meal
            <select data-plan-choice="${category}">
              ${recipes.filter(item => item.category === category).map(item => `<option value="${escapeHTML(item.id)}" ${item.id === recipe.id ? 'selected' : ''}>${escapeHTML(item.name)}</option>`).join('')}
            </select>
          </label>
        ` : ''}
        <div class="meal-actions">
          <button type="button" class="secondary-button" data-action="view" data-id="${escapeHTML(recipe.id)}">View meal</button>
          <button type="button" class="secondary-button" data-action="choose" data-category="${category}">${openPlanChooserCategory === category ? 'Close choices' : (isPlanned ? 'Change meal' : 'Choose meal')}</button>
          ${isPlanned ? `<button type="button" class="text-button danger-text" data-action="clear-plan" data-category="${category}">Remove plan</button>` : ''}
          <button type="button" class="small-primary-button" data-action="cooked" data-category="${category}" data-id="${escapeHTML(recipe.id)}" ${isFutureDate ? 'disabled title="You cannot mark a future meal as cooked."' : ''}>${isCooked ? 'Undo cooked' : 'Cooked ✓'}</button>
        </div>
      </div>
    `
    dailyMeals.appendChild(card)
  })
}

function getMealServings(dateKey, category) {
  const key = `${dateKey}:${category}`
  const saved = Number(mealServings[key])
  if (Number.isInteger(saved) && saved > 0) return saved
  return Math.max(1, Number(householdProfile.adults || 1) + Number(householdProfile.children || 0))
}

dailyMeals.addEventListener('change', event => {
  const choice = event.target.closest('[data-plan-choice]')
  if (choice) {
    const category = choice.dataset.planChoice
    const recipe = findRecipe(choice.value)
    if (!recipe || recipe.category !== category) return
    getPlansForDate(selectedDateKey)[category] = recipe.id
    const servingsKey = `${selectedDateKey}:${category}`
    if (!mealServings[servingsKey]) mealServings[servingsKey] = Math.max(1, Number(householdProfile.adults || 1) + Number(householdProfile.children || 0))
    openPlanChooserCategory = null
    saveData()
    renderDateTracker()
    renderDailyMeals()
    showToast(`${recipe.name} planned for ${category.toLowerCase()}.`)
    return
  }

  const input = event.target.closest('[data-servings]')
  if (!input) return
  const value = Number(input.value)
  if (!Number.isInteger(value) || value < 1 || value > 50) {
    input.value = getMealServings(selectedDateKey, input.dataset.servings)
    showToast('Servings must be between 1 and 50.')
    return
  }
  mealServings[`${selectedDateKey}:${input.dataset.servings}`] = value
  saveData()
  renderShoppingList()
  renderHouseholdSummary()
  showToast(`Serving target updated to ${value}.`)
})

dailyMeals.addEventListener('click', event => {
  const button = event.target.closest('button')
  if (!button) return

  const { action, id, category } = button.dataset
  if (action === 'view') openRecipe(id)

  if (action === 'choose') {
    openPlanChooserCategory = openPlanChooserCategory === category ? null : category
    renderDailyMeals()
  }

  if (action === 'clear-plan') {
    getPlansForDate(selectedDateKey)[category] = null
    delete mealServings[`${selectedDateKey}:${category}`]
    openPlanChooserCategory = null
    saveData()
    renderDateTracker()
    renderDailyMeals()
    showToast(`${category} plan removed.`)
  }

  if (action === 'cooked') recordMeal(id, category, selectedDateKey)
})

// ==================================================
// 11. COOKING HISTORY
// ==================================================

function recordMeal(id, category, dateKey = todayKey()) {
  const recipe = findRecipe(id)
  if (!recipe) return

  const existingIndex = cookingHistory.findIndex(record =>
    record.id === id &&
    record.category === category &&
    recordDateKey(record) === dateKey
  )

  if (existingIndex !== -1) {
    cookingHistory.splice(existingIndex, 1)
    showToast(`Cooking record for ${recipe.name} undone.`)
  } else {
    cookingHistory.unshift({
      id: recipe.id,
      name: recipe.name,
      category,
      dateKey,
      cookedAt: new Date().toISOString()
    })
    cookingHistory.splice(100)
    showToast(`${recipe.name} added to your cooking history!`)
  }

  // Cooking history and the meal plan are deliberately independent.
  // Recording or undoing a cooked meal does not change mealPlan.
  saveData()
  renderDateTracker()
  renderDailyMeals()
  renderRecipes()
  renderHistory()

  if (!modal.hidden) openRecipe(id)
}

// ==================================================
// 12. CUSTOM MEALS
// ==================================================

function resetCustomMealForm() {
  customMealForm.reset()
  $('#custom-meal-id').value = ''
  $('#custom-meal-submit').textContent = 'Save meal'
  $('#cancel-meal-edit').hidden = true
  $('.full-recipe-options').open = false
}

function renderRecipes() {
  recipeList.innerHTML = ''
  const query = recipeSearchTerm.trim().toLowerCase()
  const filteredRecipes = recipes.filter(recipe => {
    const categoryMatch = activeRecipeCategory === 'All'
      || (activeRecipeCategory === 'My meals' ? Boolean(recipe.isCustom) : recipe.category === activeRecipeCategory)
    const searchableText = [recipe.name, recipe.description, recipe.category, ...(recipe.ingredients || [])]
      .join(' ').toLowerCase()
    return categoryMatch && (!query || searchableText.includes(query))
  })

  $('#recipe-count').textContent = `${filteredRecipes.length} ${filteredRecipes.length === 1 ? 'meal' : 'meals'}`
  $('#recipe-results-note').textContent = query || activeRecipeCategory !== 'All'
    ? `Showing ${filteredRecipes.length} of ${recipes.length} meals`
    : `${recipes.length} meals in Mathe's collection`

  document.querySelectorAll('[data-recipe-filter]').forEach(button => {
    const selected = button.dataset.recipeFilter === activeRecipeCategory
    button.classList.toggle('active', selected)
    button.setAttribute('aria-pressed', String(selected))
  })

  if (!filteredRecipes.length) {
    recipeList.innerHTML = `<div class="empty-state recipe-empty-state">
      <strong>No meals found.</strong><br>
      Try another search or choose a different meal-time filter.
      <button type="button" class="text-button" data-clear-recipe-filters>Clear filters</button>
    </div>`
    return
  }

  filteredRecipes.forEach(recipe => {
    const card = document.createElement('article')
    card.className = 'recipe-list-card'

    const match = getMealMatch(recipe)
    const isCustom = Boolean(recipe.isCustom)
    const ingredientTotal = (recipe.ingredients || []).length
    const availability = ingredientTotal && match.matched.length === ingredientTotal
      ? 'You have everything'
      : `${match.matched.length} of ${ingredientTotal} ingredients available`

    card.innerHTML = `
      <div class="recipe-emoji">${escapeHTML(recipe.emoji || '🍽️')}</div>
      <div class="recipe-list-content">
        <span class="meal-tag">${escapeHTML(recipe.category.toUpperCase())}${isCustom ? ' · YOUR MEAL' : ''}</span>
        <h3>${escapeHTML(recipe.name)}</h3>
        <p>${escapeHTML(recipe.description || 'A meal from your kitchen.')}</p>
        <small>
          ${recipe.time ? `${Number(recipe.time)} min · ` : ''}
          ${availability}
          ${recipe.estimatedCost != null ? ` · Approx. KSh ${Number(recipe.estimatedCost).toLocaleString('en-KE')}` : ''}
          ${!(recipe.instructions || []).length ? ' · Quick meal' : ''}
        </small>
        <button class="text-button" type="button" data-action="view"
          data-id="${escapeHTML(recipe.id)}">View meal →</button>
        ${isCustom ? `
          <div class="custom-recipe-controls">
            <button class="text-button" type="button"
              data-edit-custom="${escapeHTML(recipe.id)}">Edit</button>
            <button class="text-button danger-text" type="button"
              data-delete-custom="${escapeHTML(recipe.id)}">Delete</button>
          </div>
        ` : ''}
      </div>
    `

    recipeList.appendChild(card)
  })
}

$('#recipe-search').addEventListener('input', event => {
  recipeSearchTerm = event.target.value
  renderRecipes()
})

document.querySelector('.recipe-filters').addEventListener('click', event => {
  const button = event.target.closest('[data-recipe-filter]')
  if (!button) return
  activeRecipeCategory = button.dataset.recipeFilter
  renderRecipes()
})

recipeList.addEventListener('click', event => {
  if (event.target.closest('[data-clear-recipe-filters]')) {
    activeRecipeCategory = 'All'
    recipeSearchTerm = ''
    $('#recipe-search').value = ''
    renderRecipes()
  }
})

customMealForm.addEventListener('submit', event => {
  event.preventDefault()

  const id = $('#custom-meal-id').value
  const name = $('#custom-meal-name').value.trim()
  const category = $('#custom-meal-category').value
  const rawIngredients = $('#custom-meal-ingredients').value
  const descriptionInput = $('#custom-meal-description').value.trim()
  const timeInput = $('#custom-meal-time').value.trim()
  const instructionsInput = $('#custom-meal-instructions').value.trim()
  const costInput = $('#custom-meal-cost').value.trim()
  const caloriesInput = $('#custom-meal-calories').value.trim()
  const proteinInput = $('#custom-meal-protein').value.trim()

  const mealIngredients = [...new Set(
    rawIngredients.split(',').map(normaliseIngredientName).filter(Boolean)
  )]

  if (!name || !mealIngredients.length) {
    showToast('Please enter a meal name and at least one ingredient.')
    return
  }

  const instructions = instructionsInput
    .split('\n')
    .map(step => step.trim())
    .filter(Boolean)

  const meal = {
    id: id || `custom-${Date.now()}`,
    name,
    category,
    description: descriptionInput || (instructions.length
      ? 'A homemade meal with your own preparation instructions.'
      : 'A simple meal you have added to your kitchen collection.'),
    emoji: '🍽️',
    ingredients: mealIngredients,
    instructions,
    isCustom: true
  }

  if (costInput) {
    const cost = Number(costInput)
    if (!Number.isFinite(cost) || cost < 0 || cost > 1000000) { showToast('Enter a valid approximate cost.'); return }
    meal.estimatedCost = cost
  }
  if (caloriesInput) {
    const calories = Number(caloriesInput)
    if (!Number.isFinite(calories) || calories < 0 || calories > 10000) { showToast('Enter valid calories per serving.'); return }
    meal.caloriesPerServing = calories
  }
  if (proteinInput) {
    const protein = Number(proteinInput)
    if (!Number.isFinite(protein) || protein < 0 || protein > 1000) { showToast('Enter valid protein per serving.'); return }
    meal.proteinPerServing = protein
  }

  if (timeInput) {
    const time = Number(timeInput)
    if (!Number.isInteger(time) || time < 1 || time > 600) {
      showToast('Preparation time must be between 1 and 600 minutes.')
      return
    }
    meal.time = time
  }

  // Add any new ingredient names to the reusable catalogue.
  mealIngredients.forEach(item => {
    const existing = findExactIngredient(item)
    if (!existing) addIngredientToCatalogue(item)
  })

  if (id) {
    const index = customRecipes.findIndex(recipe => recipe.id === id)
    if (index === -1) {
      showToast('That custom meal could not be found.')
      return
    }
    customRecipes[index] = meal
    showToast(`${name} updated.`)
  } else {
    customRecipes.push(meal)
    showToast(`${name} saved to your recipes.`)
  }

  recipes = [...starterRecipes, ...customRecipes]
  saveData()
  resetCustomMealForm()
  renderRecipes()
  renderDailyMeals()
})

recipeList.addEventListener('click', event => {
  const viewButton = event.target.closest('[data-action="view"]')
  const editButton = event.target.closest('[data-edit-custom]')
  const deleteButton = event.target.closest('[data-delete-custom]')

  if (viewButton) openRecipe(viewButton.dataset.id)
  if (editButton) editCustomMeal(editButton.dataset.editCustom)
  if (deleteButton) deleteCustomMeal(deleteButton.dataset.deleteCustom)
})

function editCustomMeal(id) {
  const meal = customRecipes.find(recipe => recipe.id === id)
  if (!meal) return

  $('#custom-meal-id').value = meal.id
  $('#custom-meal-name').value = meal.name
  $('#custom-meal-category').value = meal.category
  $('#custom-meal-ingredients').value = meal.ingredients.join(', ')
  $('#custom-meal-description').value = meal.description || ''
  $('#custom-meal-time').value = meal.time || ''
  $('#custom-meal-cost').value = meal.estimatedCost ?? ''
  $('#custom-meal-calories').value = meal.caloriesPerServing ?? ''
  $('#custom-meal-protein').value = meal.proteinPerServing ?? ''
  $('#custom-meal-instructions').value = (meal.instructions || []).join('\n')
  $('.full-recipe-options').open = Boolean(
    meal.description || meal.time || (meal.instructions || []).length
  )
  $('#custom-meal-submit').textContent = 'Update meal'
  $('#cancel-meal-edit').hidden = false
  customMealForm.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function deleteCustomMeal(id) {
  const meal = customRecipes.find(recipe => recipe.id === id)
  if (!meal) return

  if (!window.confirm(`Delete "${meal.name}" from your recipes? This will not erase any cooking-history entries.`)) {
    return
  }

  const index = customRecipes.findIndex(recipe => recipe.id === id)
  customRecipes.splice(index, 1)
  recipes = [...starterRecipes, ...customRecipes]

  Object.values(mealPlans).forEach(dayPlan => {
    Object.keys(dayPlan).forEach(category => {
      if (dayPlan[category] === id) dayPlan[category] = null
    })
  })

  savedMeals.delete(id)
  saveData()
  renderRecipes()
  renderDateTracker()
  renderDailyMeals()
  renderHistory()
  showToast(`${meal.name} deleted.`)
}

$('#cancel-meal-edit').addEventListener('click', resetCustomMealForm)

// ==================================================
// 13. RECIPE DETAILS
// ==================================================

function openRecipe(id) {
  const recipe = findRecipe(id)
  if (!recipe) return

  const match = getMealMatch(recipe)
  const isSaved = savedMeals.has(id)
  const isCooked = wasCookedToday(id, recipe.category)
  const hasInstructions = (recipe.instructions || []).length > 0

  modalContent.innerHTML = `
    <span class="meal-tag">${escapeHTML(recipe.category.toUpperCase())}</span>
    <div class="modal-recipe-emoji">${escapeHTML(recipe.emoji || '🍽️')}</div>
    <h2 id="modal-title">${escapeHTML(recipe.name)}</h2>
    <p>${escapeHTML(recipe.description || 'A meal from your kitchen.')}</p>
    ${recipe.time ? `<p class="recipe-time">◷ Approximately ${Number(recipe.time)} minutes</p>` : ''}
    ${Number.isFinite(Number(recipe.estimatedCost)) ? `<p class="recipe-time">Approximate total meal cost: KSh ${Number(recipe.estimatedCost).toLocaleString('en-KE')}</p>` : ''}
    ${(recipe.caloriesPerServing != null || recipe.proteinPerServing != null) ? `<p class="recipe-time">Nutrition estimate per serving: ${recipe.caloriesPerServing != null ? `${Number(recipe.caloriesPerServing)} kcal` : 'Calories not entered'}${recipe.proteinPerServing != null ? ` · ${Number(recipe.proteinPerServing)} g protein` : ''}</p>` : ''}
    <h3>Ingredients</h3>
    <ul class="recipe-ingredients">
      ${(recipe.ingredients || []).map(item => `
        <li class="${ingredients.has(item) ? 'ingredient-available' : ''}">
          ${ingredients.has(item) ? '✓' : '○'} ${escapeHTML(item)}
        </li>
      `).join('')}
    </ul>
    ${hasInstructions ? `
      <h3>How to prepare</h3>
      <ol class="recipe-steps">
        ${recipe.instructions.map(step => `<li>${escapeHTML(step)}</li>`).join('')}
      </ol>
    ` : `
      <p class="quick-meal-note">This is a quick meal entry. No preparation instructions have been added.</p>
    `}
    <p class="meal-match-note">
      ${match.matched.length} of ${(recipe.ingredients || []).length} listed ingredients are currently in your kitchen.
    </p>
    <div class="modal-actions">
      <button type="button" class="secondary-button" id="save-recipe">
        ${isSaved ? 'Remove from saved' : '♡ Save meal'}
      </button>
      <button type="button" class="small-primary-button" id="mark-cooked">
        ${isCooked ? 'Undo cooked' : "I've cooked this ✓"}
      </button>
    </div>
  `

  modal.hidden = false

  $('#save-recipe').addEventListener('click', () => {
    if (savedMeals.has(id)) {
      savedMeals.delete(id)
      showToast('Removed from saved meals.')
    } else {
      savedMeals.add(id)
      showToast('Meal saved!')
    }

    saveData()
    renderHistory()
    openRecipe(id)
  })

  $('#mark-cooked').addEventListener('click', () => {
    recordMeal(id, recipe.category)
  })
}

$('#modal-close').addEventListener('click', () => {
  modal.hidden = true
})

modal.addEventListener('click', event => {
  if (event.target === modal) modal.hidden = true
})

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !modal.hidden) modal.hidden = true
})

// ==================================================
// 14. SAVED MEALS AND HISTORY
// ==================================================

function renderHistory() {
  savedList.innerHTML = ''
  historyList.innerHTML = ''

  const favourites = recipes.filter(recipe => savedMeals.has(recipe.id))

  if (!favourites.length) {
    savedList.innerHTML = '<p class="empty-state">You have not saved any meals yet. Open a meal and tap Save.</p>'
  } else {
    favourites.forEach(recipe => {
      const item = document.createElement('div')
      item.className = 'history-card'
      item.innerHTML = `
        <span>${escapeHTML(recipe.emoji || '🍽️')}</span>
        <div>
          <strong>${escapeHTML(recipe.name)}</strong>
          <small>${escapeHTML(recipe.category)}</small>
        </div>
        <button class="text-button" data-view="${escapeHTML(recipe.id)}">View</button>
      `
      savedList.appendChild(item)
    })
  }

  if (!cookingHistory.length) {
    historyList.innerHTML = '<p class="empty-state">Your cooking story starts here. When you prepare a meal, mark it as cooked and Mathe will remember.</p>'
  } else {
    cookingHistory.forEach(record => {
      const item = document.createElement('div')
      item.className = 'history-card'
      item.innerHTML = `
        <span>🍽️</span>
        <div>
          <strong>${escapeHTML(record.name)}</strong>
          <small>${escapeHTML(record.category)} · ${formatDate(dateFromKey(recordDateKey(record)))}</small>
        </div>
      `
      historyList.appendChild(item)
    })
  }


  renderKitchenDiscovery()
}

savedList.addEventListener('click', event => {
  const button = event.target.closest('[data-view]')
  if (button) openRecipe(button.dataset.view)
})

// ==================================================
// 15. NAVIGATION
// ==================================================

const pageMap = {
  Home: '#page-home',
  'My Kitchen': '#page-kitchen',
  Planner: '#page-planner',
  Settings: '#page-settings',
  Recipes: '#page-recipes',
  Saved: '#page-saved'
}

function navigateTo(page) {
  const target = pageMap[page]
  if (!target) return

  document.querySelectorAll('.page').forEach(section => {
    const active = `#${section.id}` === target
    section.hidden = !active
    section.classList.toggle('active', active)
  })

  document.querySelectorAll('.nav-item').forEach(button => {
    const active = button.dataset.page === page
    button.classList.toggle('active', active)
    if (active) button.setAttribute('aria-current', 'page')
    else button.removeAttribute('aria-current')
  })

  if (page === 'My Kitchen') renderIngredients()
  if (page === 'Planner') { renderDateTracker(); renderDailyMeals() }
  if (page === 'Settings') renderHouseholdSummary()
  if (page === 'Recipes') renderRecipes()
  if (page === 'Saved') renderHistory()

  window.scrollTo({ top: 0, behavior: 'smooth' })
}

document.querySelectorAll('.nav-item').forEach(button => {
  button.addEventListener('click', () => navigateTo(button.dataset.page))
})

document.querySelectorAll('[data-go]').forEach(button => {
  button.addEventListener('click', event => {
    event.preventDefault()
    navigateTo(button.dataset.go)
  })
})

// ==================================================
// 16. HOUSEHOLD, BUDGET AND WEEKLY SHOPPING LIST
// ==================================================

function renderHouseholdSummary() {
  const people = Number(householdProfile.adults || 0) + Number(householdProfile.children || 0)
  const budget = Number(householdProfile.dailyBudget || 0)
  $('#household-summary').textContent = `${people} people in your household${budget > 0 ? ` · Daily food budget: KSh ${budget.toLocaleString('en-KE')}` : ' · No daily budget set'}. Meal servings default to your household size, but you can change each planned meal.`
  $('#household-adults').value = householdProfile.adults
  $('#household-children').value = householdProfile.children
  $('#daily-budget').value = budget || ''
}

$('#household-form').addEventListener('submit', event => {
  event.preventDefault()
  const adults = Number($('#household-adults').value)
  const children = Number($('#household-children').value)
  const dailyBudget = Number($('#daily-budget').value || 0)
  if (!Number.isInteger(adults) || adults < 1 || adults > 30 || !Number.isInteger(children) || children < 0 || children > 30 || !Number.isFinite(dailyBudget) || dailyBudget < 0 || dailyBudget > 1000000) {
    showToast('Check the household size and budget values.')
    return
  }
  householdProfile.adults = adults
  householdProfile.children = children
  householdProfile.dailyBudget = dailyBudget
  saveData()
  renderHouseholdSummary()
  renderDailyMeals()
  renderShoppingList()
  showToast('Household settings saved.')
})


function renderShoppingList() {
  const list = $('#shopping-list')
  const selectedDate = dateFromKey(selectedDateKey)
  const monday = startOfWeek(selectedDate)
  const aggregate = new Map()
  let plannedMeals = 0
  let estimatedTotal = 0
  let pricedMeals = 0

  for (let offset = 0; offset < 7; offset++) {
    const dateKey = todayKey(addDays(monday, offset))
    const plans = mealPlans[dateKey] || {}

    for (const category of ['Breakfast', 'Lunch', 'Supper']) {
      const id = plans[category]
      if (!id) continue

      const recipe = findRecipe(id)
      if (!recipe) continue

      plannedMeals++

      if (Number.isFinite(Number(recipe.estimatedCost))) {
        estimatedTotal += Number(recipe.estimatedCost)
        pricedMeals++
      }

      for (const name of recipe.ingredients || []) {
        const canonical = findExactIngredient(name)?.name || name
        if (ingredients.has(canonical)) continue

        const key = canonical.toLowerCase()

        if (!aggregate.has(key)) {
          aggregate.set(key, { name: canonical, meals: [] })
        }

        const entry = aggregate.get(key)
        const label = `${dateFromKey(dateKey).toLocaleDateString('en-GB', { weekday: 'short' })} ${category}`

        if (!entry.meals.includes(label)) {
          entry.meals.push(label)
        }
      }
    }
  }

  const missing = [...aggregate.values()].sort(
    (a, b) => a.name.localeCompare(b.name)
  )

  const budget = Number(householdProfile.dailyBudget || 0)

  const budgetLine = budget > 0 && pricedMeals > 0
    ? `<p class="shopping-budget ${pricedMeals === plannedMeals && estimatedTotal > budget * 7 ? 'over-budget' : ''}">
        Estimated cost for priced meals: KSh ${Math.round(estimatedTotal).toLocaleString('en-KE')}
        ${pricedMeals < plannedMeals
          ? `(${pricedMeals} of ${plannedMeals} planned meals have cost estimates; comparison is incomplete)`
          : ''}
        · Weekly budget target: KSh ${(budget * 7).toLocaleString('en-KE')}
      </p>`
    : budget > 0
      ? `<p class="shopping-budget">Daily budget target: KSh ${budget.toLocaleString('en-KE')}. Add cost estimates to your recipes to compare planned meals with your budget.</p>`
      : ''

  if (!plannedMeals) {
    list.innerHTML = '<p class="empty-state">No meals planned for this week yet. Plan breakfast, lunch or supper to build your shopping list.</p>'
    return
  }

  list.innerHTML = `
    ${budgetLine}
    <p class="shopping-count">
      ${plannedMeals} planned meal${plannedMeals === 1 ? '' : 's'}
      · ${missing.length} missing ingredient${missing.length === 1 ? '' : 's'}
    </p>
    ${
      missing.length
        ? missing.map(item => `
            <div class="shopping-item">
              <label>
                <input type="checkbox" data-add-to-kitchen="${escapeHTML(item.name)}">
                <span>
                  <strong>${escapeHTML(item.name)}</strong>
                  <small>
                    Needed for ${item.meals.length} planned meal${item.meals.length === 1 ? '' : 's'}:
                    ${escapeHTML(item.meals.join(', '))}
                  </small>
                </span>
              </label>
            </div>
          `).join('')
        : '<p class="empty-state">Good news! Your kitchen has all listed ingredients for the planned meals this week.</p>'
    }
  `
}


$('#shopping-list').addEventListener('change', event => {
  const input = event.target.closest('[data-add-to-kitchen]')
  if (!input || !input.checked) return
  const name = input.dataset.addToKitchen
  const ingredient = findExactIngredient(name)
  if (ingredient) ingredients.add(ingredient.name)
  else addIngredientToCatalogue(name)
  saveData()
  renderIngredients()
  renderShoppingList()
  showToast(`${name} added to your kitchen.`)
})

$('#refresh-shopping').addEventListener('click', renderShoppingList)

// ==================================================
// 17. INITIAL DISPLAY
// ==================================================

renderDateTracker()
renderDailyMeals()
renderIngredients()
renderRecipes()
renderHistory()
renderHouseholdSummary()
renderShoppingList()
