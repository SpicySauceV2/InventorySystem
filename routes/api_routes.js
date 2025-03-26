const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt") 
const Database  = require("../database/database.js")
const db = new Database();
db.connect()

function capitalizeFirstLetter(string) {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}



router.get("/filterd_store_items", (req, res) => {
    let { categories, minPrice, maxPrice } = req.query;

    // Split the categories if they are present
    if (categories) {
        categories = categories.split(",");
    }

    // If categories are provided and valid
    if (categories && categories.length > 0) {
        db.getFilteredItems(categories, minPrice, maxPrice, (error, results) => {
            if (error) {
                return res.status(500).send("Error fetching filtered items");
            }
            res.json(results);
        });
    } else {
        // If no categories, just fetch items based on price range
        db.getPriceItems(minPrice, maxPrice, (error, results) => {
            if (error) {
                return res.status(500).send("Error fetching items");
            }
            res.json(results);
        });
    }
});

// Endpoint to fetch all front stock items
router.get("/initialize_store", (req, res) => {
    db.getAllStockItems((error, results) => {
        if (error) {
            return res.status(500).send("Error fetching front stock items");
        }
        res.json(results);
    });
});

router.get("/get_all_categories",(req,res)=>{
    db.getCategories((error,results)=>{
        if (error) {
            return res.status(500).send("Error fetching front stock items");
        }
        res.json(results);
    })
})

router.get("/category",(req,res)=>{
    const id = req.query
    db.getCategoryused((error,results)=>{
        if (error) {
            return res.status(500).send("Error fetching front stock items");
        }
        res.json(results);
        
        
    })
})

// Endpoint to fetch an updated item
router.get("/updated_item", (req, res) => {
    // Extract 'id' from query parameters
    const { id } = req.query;

    // Check if 'id' is provided
    if (!id) {
        return res.status(400).send("Item ID is required");
    }

    // Fetch item from the database
    db.getItem(id, (error, results) => {
        if (error) {
            return res.status(500).send("Error fetching item");
        }
        res.json(results);
    });
});



router.put('/move-items', (req, res) => {
    const { items, tableid } = req.body;

    // Validate request data
    if (!items || !Array.isArray(items) || !tableid) {
        console.error('Invalid request data:', req.body);
        return res.status(400).send('Invalid request data');
    }

    console.log('Received items:', items);
    console.log('Table ID:', tableid);

    // Determine the appropriate database method to call
    const dbMethod = tableid === 'front' ? 'moveBackStock' : 'moveFrontStock';

    console.log(`Performing ${dbMethod} operation...`);

    db[dbMethod](items, (error) => {
        if (error) {
            console.error(`Error moving ${tableid} stock:`, error);
            return res.status(500).send(`Error moving ${tableid} stock`);
        }

        res.json({ message: `Successfully moved items to ${tableid}` });
    });
});

router.post('/updateItem', (req, res) => {
    console.log("Received req.body:", req.body);
  
    const { back_stock, category, front_stock, id, name, note, price, weight } = req.body;
  
     // Check if the required fields are present
    if (!id || !name || !price || !category || !weight) {
        console.error("Invalid request data:", req.body);
        return res.status(400).send("Missing required fields");
    }
    

    db.updateItem(id, name, price, category, weight, note, back_stock, front_stock, (error) => {
      if (error) {
        console.error("Error updating item:", error);
        return res.status(500).send("Error updating item");
      }
  
      res.json({ message: "Item updated successfully" });
    });
  });
  

  router.post("/addCategory", (req, res) => {
    let { categoryName } = req.body;

    // Capitalize the first letter of the category name
    if (categoryName) {
        categoryName = capitalizeFirstLetter(categoryName);
    } else {
        console.error("Invalid request data:", req.body);
        return res.status(400).send("Invalid request data");
    }

    // Fetch existing categories
    db.getCategories((error, results) => {
        if (error) {
            console.error("Error fetching categories:", error);
            return res.status(500).send("Error fetching categories");
        }

        // Check if category already exists
        const categoryExists = results.some((category) => category.category_name === categoryName);

        if (categoryExists) {
            return res.status(400).send("Category already exists");
        }

        // Add the new category
        db.addCategory(categoryName, (error) => {
            if (error) {
                console.error("Error adding category:", error);
                return res.status(500).send("Error adding category");
            }

            return console.log("Item added successfully" ),res.redirect('back');;
        });
    });
});

    router.post("/addItem",(req,res)=>{
        const {price,category,weight,itemDescription,back_stock} = req.body;
        let { name } = req.body;
        if (!name || !price || !category || !weight || !back_stock) {
            console.error("Invalid request data:", req.body);
            return res.status(400).send("Invalid request data");
        }
        if (name) {
            name = capitalizeFirstLetter(name);
      
        }
        db.getItemByName(name, (error,result) => {
            if (error) {
                console.error("Error fetching item:", error);
                return res.status(500).send("Error fetching item");
            }
            if (result.length > 0) {
                // Item already exists
                console.warn("Item already exists:", name);
                return res.send('<script>alert("Item already exist"); window.history.back();</script>');
            }
            
            else{
                db.addItem(name, price, category, weight, itemDescription,back_stock, (error) => {
                    if (error && error.code === "ER_DUP_ENTRY") {
                        console.warn("Duplicate entry error:", name);
                        return res.status(400).json({ message: "Item already exists."});
                    }
                    if (error) {
                        console.error("Error adding item:", error);
                        return res.status(500).send("Error adding item");
                    }
                
                    return res.send('<script>alert("Item added successfully"); window.location.reload();</script>');
                }); 
            }
        
        });
    });

    router.post("/login",async (req,res)=>{
            const hashedPassword =  await bcrypt.hash(req.body.pwd,10)
           
            db.loginUser(req.body.name,hashedPassword,(error,results) => {
                if (error) {
                    console.error("Error fetching item:", error);
                    return res.status(500).send("Error fetching item");
                }
                if (results = "Match"){
                    res.redirect("/hub")
                }
            })

    })



    router.delete("/delete_item",(req,res)=>{
        const {id} = req.query
        db.getItem(id, (error, results) => {
            if (error) {
                console.error("Error fetching item:", error);
                return res.status(500).send("Error fetching item");
            }
            if (results.back_stock > 0 || results.front_stock > 0){
                // Item already exists
                console.warn("Item has items in stock ");
                return res.status(400).send("Item has items in stock");
            }
            else{
                db.deleteItem(id,(error)=>{
                    if (error) {
                        console.error("Error fetching item:", error);
                        return res.status(500).send("Error fetching item");
                    }
                    return res.json({message:"Item deleted"})
                })
            }
    

        })
    })
    router.delete("/delete_category", (req, res) => {
        const { id } = req.query;
        db.getCategoryused(id, (error, results) => {
            if (error) {
                console.error("Error fetching category:", error);
                return res.status(500).json({ message: "Error fetching category" });
            }
            if (results.length > 0) {
                return res.status(400).json({ message: "Category still in use" }); // 400 bad request
            } else {
                db.deleteCategory(id, (error) => {
                    if (error) {
                        return res.status(500).json({ message: "Error deleting category" });
                    } else {
                        return res.json({ message: "Successfully deleted category" });
                    }
                });
            }
        });
    });

 


module.exports = router
