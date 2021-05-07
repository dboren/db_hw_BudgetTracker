let db;
let budgetVersion;

const request = indexedDB.open('BudgetTrackerDB', budgetVersion || 1);

request.onupgradeneeded = function (event) {
    console.log('Upgrade needed in IndexedDB');

    const { oldVersion } = event;
    const newVersion = event.newVersion || db.version;

    console.log(`DB updated from version ${oldVersion} to version ${newVersion}`);

    db = event.target.result;

    if (db.objectStoreNames.length === 0) {
        db.createObjectStore('BudgetTrackerStore', { autoIncrement: true });
    }
};

request.onerror = function (err) {
    console.log(`Error: ${err.target.errorCode}`);
  };

