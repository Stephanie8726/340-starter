const pool = require("../database/");

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  );
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
        WHERE i.classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getInventoryByClassificationId error " + error);
  }
}

async function getVehicleById(vehicleId) {
  try {
    const result = await pool.query(
      `SELECT * From public.inventory WHERE inv_id = $1`,
      [vehicleId]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error fetching vehicle by Id:" + error);
  }
}


/* ***************************
 * W04 Assignment: Adding New Classifications and Vehicles
 * Adding new classification
 * ************************** */
async function addClassification(classification_name) {
  try {
    const result = await pool.query(
      `INSERT INTO public.classification (classification_name) 
       VALUES ($1) RETURNING *`, 
      [classification_name]
    );
    return result.rows[0]; 
  } catch (error) {
    console.error("Error adding classification:", error);
    throw error; 
  }
}

/* ***************************
 * Adding new inventory 
 * ************************** */
async function addInventory(inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id) {
  try {
    const result = await pool.query(
      `INSERT INTO public.inventory (inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`, 
      [inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error adding inventory item:", error);
    throw error;
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getVehicleById,
  addClassification,
  addInventory
};