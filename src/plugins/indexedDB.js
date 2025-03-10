// indexedDBService.js
// Abre o inicializa una base de datos IndexedDB, con la posibilidad de crear almacenes de objetos.
// Recibe el nombre de la base de datos (dbName) y la versión (version), con un valor predeterminado de 1.
export const openDatabase = (dbName, version = 1) => {
    return new Promise((resolve, reject) => {
        // Abre o crea la base de datos con el nombre y la versión especificados.
        const request = indexedDB.open(dbName, version);

        // Se ejecuta solo si es la primera vez que se crea la base de datos o si se actualiza a una nueva versión.
        // Aquí se puede definir la estructura de la base de datos, como los almacenes de objetos (object stores).
        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            // Verifica si el almacén de objetos 'departamentos' no existe y lo crea con la clave primaria 'id'.
            if (!db.objectStoreNames.contains('departamentos')) {
                db.createObjectStore('departamentos', { keyPath: 'id' });
            }
            // Verifica si el almacén de objetos 'municipios' no existe y lo crea con la clave primaria 'id'.
            if (!db.objectStoreNames.contains('municipios')) {
                db.createObjectStore('municipios', { keyPath: 'id' });
            }
            // Verifica si el almacén de objetos 'distritos' no existe y lo crea con la clave primaria 'id'.
            if (!db.objectStoreNames.contains('distritos')) {
                db.createObjectStore('distritos', { keyPath: 'id' });
            }
        };

        // Se ejecuta cuando la base de datos se abre o crea correctamente.
        // El resultado (db) es la conexión a la base de datos, y se resuelve en la promesa.
        request.onsuccess = (event) => {
            resolve(event.target.result);
            console.info(`🌟 database "${dbName}" initialized 🆕`);
        };

        // Se ejecuta si ocurre un error al abrir o crear la base de datos.
        request.onerror = (event) => {
            console.error(`Error al intentar eliminar la base de datos "${dbName}":`,)
            reject(event.target.errorCode); // Proporciona el código de error para diagnóstico.
        };
    });
};

// Inserta o actualiza datos en un almacén de objetos especificado en la base de datos.
// Recibe la conexión a la base de datos (db), el nombre del almacén (storeName), y los datos a insertar (data).
export const addData = (db, storeName, data) => {
    return new Promise((resolve, reject) => {
        // Crea una transacción de lectura/escritura en el almacén de objetos especificado.
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);

        // Inserta o actualiza cada elemento de datos en el almacén usando 'put', que reemplaza datos existentes si la clave coincide.
        data.forEach(item => store.put(item));

        // Resuelve la promesa cuando la transacción se completa sin errores.
        transaction.oncomplete = () => resolve();

        // Rechaza la promesa si ocurre un error en la transacción.
        transaction.onerror = (event) => reject(event.target.error);
    });
};

// Recupera todos los datos de un almacén de objetos especificado.
// Recibe la conexión a la base de datos (db) y el nombre del almacén (storeName).
export const fetchDataFromStore = (db, storeName) => {
    return new Promise((resolve, reject) => {
        // Crea una transacción de solo lectura en el almacén de objetos especificado.
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);

        // Solicita obtener todos los datos del almacén.
        const request = store.getAll();

        // Resuelve la promesa con los datos obtenidos si la solicitud es exitosa.
        request.onsuccess = () => resolve(request.result);

        // Rechaza la promesa si ocurre un error en la solicitud.
        request.onerror = (event) => reject(event.target.error);
    });
};

// Función para eliminar una base de datos de IndexedDB completa.
// Recibe el nombre de la base de datos (dbName) que se desea eliminar y devuelve una promesa.
export const deleteDatabase = (dbName) => {
    return new Promise((resolve, reject) => {
        // Solicita la eliminación de la base de datos usando el nombre especificado.
        // Este método inicia la eliminación de la base de datos si no hay conexiones activas.
        const request = indexedDB.deleteDatabase(dbName);

        // Evento que se ejecuta si la base de datos se elimina con éxito.
        // Esto significa que la base de datos ha sido eliminada del sistema.
        request.onsuccess = () => {
            resolve(); // Resuelve la promesa indicando que la operación fue exitosa.
        };

        // Evento que se ejecuta si ocurre un error durante el proceso de eliminación.
        // Puede suceder si algo impide que el navegador complete la operación.
        request.onerror = (event) => {
            console.error(`Error al intentar eliminar la base de datos '${dbName}':`, event.target.error);
            reject(event.target.error); // Rechaza la promesa pasando el error para identificar el problema.
        };

        // Evento que se ejecuta si la eliminación de la base de datos está "bloqueada".
        // Esto sucede cuando hay otras conexiones abiertas a la base de datos en otra pestaña o proceso.
        // En este caso, el navegador no puede eliminar la base de datos hasta que se cierren esas conexiones.
        request.onblocked = () => {
            console.warn(`La eliminación de la base de datos '${dbName}' está bloqueada. Cierre otras conexiones.`);
            reject(new Error("La operación de eliminación está bloqueada.")); // Rechaza la promesa indicando que la eliminación fue bloqueada.
        };
    });
};

