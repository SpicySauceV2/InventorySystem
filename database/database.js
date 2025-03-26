const { query } = require("express");
const Query = require("mysql/lib/protocol/sequences/Query");
const mysql = require("mysql2");


class Database {
    constructor() {
        if (!Database.instance) {
            this.connection = null;
            Database.instance = this;
        }
        return Database.instance;
    }
    

    connect() {
        return new Promise((resolve, reject) => {
            console.log("Attempting to connect to the database...");
            this.connection = mysql.createConnection({
                host: "127.0.0.1",
                user: "root",
                password: "Enderson21!",
                database: "store_inventory",
            });
    
            this.connection.connect((error) => {
                if (error) {
                    console.error("Error connecting to the database:", error);
                    reject(error); // Reject the promise if there's an error
                    return;
                }
    
                console.log("Connected to the database successfully.");
                resolve();
            });
        });
    }
    getCategories(callback){
       // Construct the query
       const query = `
       SELECT *
       FROM category
   `;

   // Execute the query
   this.connection.query(query, (error, results) => {
       if (error) {
           console.error("Database Query Error:", error);
           return callback(error, null);
       }

       console.log("Executed successfully. Results:", results);
       callback(null, results);
   });

}
    getCategoryused(id,callback){
        const query = `
        select *
        from inventory
        INNER JOIN category ON inventory.category_id = category.category_id
        where category.category_id = ?
        `
        this.connection.query(query,[id],(error,results)=>{
            if (error) {
                console.error("Database Query Error:", error);
                return callback(error, null);
            }
    
            console.log("Executed successfully. Results:", results);
            callback(null, results);
        });
    }
    
    getFilteredItems( categories, minPrice, maxPrice, callback) {
        // Ensure the connection is valid
        if (!this.connection) {
            console.error("Database connection is not established.");
            return callback(new Error("Database connection not established"), null);
        }
    
    
        // Start building the base query
        const query = `
            SELECT * 
            FROM inventory
            INNER JOIN category ON inventory.category_id = category.category_id
            WHERE item_price BETWEEN ? AND ?
            AND category.category_name IN (?)
        `;
    
        // Ensure categories is an array before passing
        if (Array.isArray(categories)) {
            categories = categories.map(category => category.trim());
        }
    
        // Execute the query with parameters in the correct order
        this.connection.query(query, [minPrice, maxPrice, categories], (error, results) => {
            if (error) {
                console.error("Database Query Error:", error);
                return callback(error, null);
            }
    
            console.log("Executed successfully. Results:", results);
            callback(null, results);
        });
    }

    getPriceItems(minPrice, maxPrice,callback){
        // Ensure the connection is valid
        if (!this.connection) {
            console.error("Database connection is not established.");
            return callback(new Error("Database connection not established"), null);
        }
        
        
        // Start building the base query
        const query = `
            SELECT * 
            FROM inventory
            INNER JOIN category ON inventory.category_id = category.category_id
            WHERE item_price BETWEEN ? AND ?
        `;
        // Execute the query
        this.connection.query(query, [minPrice, maxPrice],(error, results) => {
            if (error) {
                console.error("Database Query Error:", error);
                return callback(error, null);
            }
    
            console.log("Executed successfully. Results:", results);
            callback(null, results);
        });

    }
    getAllStockItems( callback) {
        // Ensure the connection is valid
        if (!this.connection) {
            console.error("Database connection is not established.");
            return callback(new Error("Database connection not established"), null);
        }
    

    
        // Construct the query
        const query = `
            SELECT *
            FROM inventory
            INNER JOIN category ON inventory.category_id = category.category_id
        `;
    
        // Execute the query
        this.connection.query(query, (error, results) => {
            if (error) {
                console.error("Database Query Error:", error);
                return callback(error, null);
            }
    
            console.log("Executed successfully. Results:", results);
            callback(null, results);
        });
    }
    moveFrontStock(items, callback) {
        if (!this.connection) {
            console.error('Database connection is not established.');
            return callback(new Error('Database connection not established'));
        }
    
        let errorOccurred = false;
    
        // Use a counter to track the progress of item updates
        let processedCount = 0;
    
        items.forEach((item) => {
            const sql = 'UPDATE inventory SET front_stock = front_stock + ?, back_stock = back_stock - ? WHERE item_id = ?';
            this.connection.query(sql, [item.quantity, item.quantity, item.id], (err, result) => {
                processedCount++;
    
                if (err) {
                    console.error('Error executing query:', err);
    
                    // Call the callback with the first error and prevent further execution
                    if (!errorOccurred) {
                        errorOccurred = true;
                        return callback(err);
                    }
                }
    
                // If all items are processed and no errors occurred, call the callback
                if (processedCount === items.length && !errorOccurred) {
                    callback(null);
                }
            });
        });
    }
    
    moveBackStock(items, callback) {
        if (!this.connection) {
            console.error('Database connection is not established.');
            return callback(new Error('Database connection not established'));
        }
    
        let errorOccurred = false;
    
        // Use a counter to track the progress of item updates
        let processedCount = 0;
    
        items.forEach((item) => {
            const query = 'UPDATE inventory SET back_stock = back_stock + ?, front_stock = front_stock - ? WHERE item_id = ?';
            this.connection.query(query, [item.quantity, item.quantity, item.id], (err, result) => {
                processedCount++;
    
                if (err) {
                    console.error('Error executing query:', err);
    
                    // Call the callback with the first error and prevent further execution
                    if (!errorOccurred) {
                        errorOccurred = true;
                        return callback(err);
                    }
                }
    
                // If all items are processed and no errors occurred, call the callback
                if (processedCount === items.length && !errorOccurred) {
                    callback(null);
                }
            });
        });
    }
    getItem (id,callback){
        const query = `
            SELECT *
            FROM inventory
            INNER JOIN category ON inventory.category_id = category.category_id
            where item_id = (?)
        `;

        this.connection.query(query,[id], (error, results) => {
            if (error) {
                console.error("Database Query Error:", error);
                return callback(error, null);
            }
    
            console.log("Executed successfully. Results:", results);
            callback(null, results);
        });
    }
    getItemByName (name,callback){
        const query = `
            SELECT item_name
            FROM inventory
            INNER JOIN category ON inventory.category_id = category.category_id
            where item_name = (?)
        `;

        this.connection.query(query,[name], (error, results) => {
            if (error) {
                console.error("Database Query Error:", error);
                return callback(error, null);
            }
    
            console.log("Executed successfully. Results:", results);
            callback(null, results);
        });
    }
    updateItem(id, name, price, category, weight, note,back_stock ,front_stock, callback) {
        const query = `
            UPDATE inventory
            SET item_name = ?, item_price = ?, category_id = ?, item_weight = ?, item_note = ? , back_stock = ?, front_stock = ?
            WHERE item_id = ?
        `;
    
        this.connection.query(query, [name, price, category, weight, note,back_stock,front_stock, id], (error, results) => {
            if (error) {
                console.error("Database Query Error:", error);
                return callback(error);
            }
    
            console.log("Executed successfully. Results:", results);
            callback(null);
        });
    }
    addCategory(categorie,callback){
        const query = `
            INSERT INTO category (category_name)
            VALUES (?)
        `
        this.connection.query(query,[categorie], (error, results) => {
            if (error) {
                console.error("Database Query Error:", error);
                return callback(error);
            }
    
            console.log("Executed successfully. Results:", results);
            callback(null);
        });
    }
    addItem(name, price, category, weight, note,back_stock, callback) {
        const query = `
            INSERT INTO inventory (item_name, item_price, category_id, item_weight, item_note, back_stock, front_stock)
            VALUES (?, ?, ?, ?, ?, ?, 0)
        `;
    
        this.connection.query(query, [name, price, category, weight, note,back_stock], (error, results) => {
            if (error) {
                console.error("Database Query Error:", error);
                return callback(error);
            }
    
            console.log("Executed successfully. Results:", results);
            callback(null);
        });
    }
    deleteItem(id,callback){
        const query = `delete from inventory where item_id = ?
        `
        this.connection.query(query,[id],(error,results)=>{
            if (error) {
                console.error("Database Query Error:", error);
                return callback(error);
            }
    
            console.log("Executed successfully deleted item");
            callback(null);
        })
    }
    deleteCategory(id,callback){
        const query= `
        delete 
        from category
        where category_id = ?
        `
        this.connection.query(query,[id],(error,results)=>{
            if(error){
                console.log("Database Query error:", error);
                return callback(error);
            }
            console.log("Executed successfully deleted item");
            callback(null);

        })
    }

    addUser(user,hashedPass){
        const query = `INSERT INTO users (userName,password)
        VALUES (?,?);
        `
        this.connection.query(query,[user,hashedPass],(error) =>{
            if (error){
                console.error("Database Query Error:", error);
                
            }
            console.log("successfully added:",user)
            
        }); 
    }
    loginUser(user, hashedPass, callback) {
        const query = `
            select *
            from users
            where username = ? and password = ?
        `;
        this.connection.query(query, [user, hashedPass], (error, results) => {
            if (error) {
                console.error("Database Query Error:", error);
                return callback(error, null); // Send back the error
            }
    
            if (results.length > 0) {
                return callback(null, results[0]); // Send back the user data
            } else {
                return callback(null, null); // No matching user
            }
        });
    }

}
   
   


module.exports = Database;