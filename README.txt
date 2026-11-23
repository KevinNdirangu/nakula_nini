KWA MATHE - WEEKLY PLANNER UPGRADE

INSTALL
1. Close the Vite dev server (Ctrl+C in its CMD window).
2. Extract this ZIP.
3. Copy the src folder from the extracted package into your project folder:
   D:\nitakula-nini\src
4. Allow Windows to replace main.js and style.css.
5. Start the app again:
   npm run dev -- --host 0.0.0.0
6. Refresh the app on your laptop and phone.

WHAT'S INCLUDED
- Weekly date tracker for planned meals and cooked meals.
- Per-day breakfast, lunch and supper planning.
- Household profile: adults and children.
- Default servings based on household size, adjustable per planned meal.
- Weekly shopping list built from missing ingredients in planned meals.
- Shared ingredients are grouped and show which meals need them.
- Tick an item in the shopping list to add it to My Kitchen.
- Optional user-entered approximate meal cost and nutrition values for custom meals.
- Optional daily budget target and a cautious comparison when cost estimates exist.

IMPORTANT LIMITATIONS
- Existing localStorage data key is preserved.
- Cost and nutrition values are not invented; add your own estimates to custom meals.
- Recipe ingredient quantities are not yet consistently stored, so the shopping list groups missing ingredients but does not calculate weights or quantities.
- Household servings are planning targets; they do not yet scale ingredient quantities automatically.
- Existing starter recipes do not have verified cost or nutrition figures.

VALIDATION
- JavaScript syntax checked with node --check.
- Full browser/device interaction testing has not been performed in this environment.
