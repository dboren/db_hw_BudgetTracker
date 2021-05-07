let db;
let budgetVersion;

const request = indexedDB.open('BudgetTrackerDB', budgetVersion || 1);