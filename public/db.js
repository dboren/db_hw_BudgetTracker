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

request.onerror = function (event) {
    console.log(`Error: ${event.target.errorCode}`);
  };

function checkDatabase() {
    console.log('check database invoked');

    let transaction = db.transaction(['BudgetTrackerStore'], 'readwrite');

    const store = transaction.objectStore('BudgetTrackerStore');

    const getAll = store.getAll();

    getAll.onsuccess = function () {
        if (getAll.result.length > 0) {
            fetch('/api/transaction/bulk', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                },
            }).then((response) => response.json())
            .then((res) => {
                if (res.length !== 0) {
                    transaction = db.transaction(['BudgetTrackerStore'], 'readwrite');

                    const currentStore = transaction.objectStore('BudgetTrackerStore');

                    currentStore.clear();
                    console.log('Clearing current store');
                }

            });
        }
    };
};

request.onsuccess = function (event) {
    console.log('Database request successful');
    db = event.target.result;

    if (navigator.onLine) {
        console.log('Backend online');
        checkDatabase();
    }
};

const saveRecord = (record) => {
    console.log('saving record');

    const transaction = db.transaction(['BudgetTrackerStore'], 'readwrite');

    const store = transaction.objectStore('BudgetTrackerStore');

    store.add(record);
};

window.addEventListener('online', checkDatabase);