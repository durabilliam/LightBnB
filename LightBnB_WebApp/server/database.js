const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

// pool.connect().then( () => {
//   getAllProperties()
// });
/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */

 const getUserWithEmail = (email) => {

  const queryString = `SELECT * FROM users WHERE email = $1;`
  const values = [email];

  return pool
    .query(queryString, values)
    .then((result) => { const user = result.rows[0]
      //console.log(result.rows[0]),
      //console.log("WWWW", user)
      return user;
      })
    .catch((err) => user = null)
 }

 exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
 const getUserWithId = (id) => {
   const queryString = `SELECT * FROM users WHERE id = $1;`
   const values = [id];
   return pool
     //.query(`SELECT * FROM users WHERE id = ${id};`)
     .query(queryString, values)
     .then((result) => { const user = result.rows[0]
       //console.log("XXXX", result.rows);
       //console.log("YYYY",result.rows[0]);
       return user
       })
    .catch((err) => err.message)
 }
//  const addUser =  function(user) {
//   const userId = Object.keys(users).length + 1;
//   user.id = userId;
//   users[userId] = user;
//   return Promise.resolve(user);
// }
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */

 const addUser =  ({name, password, email}) => {

  const queryString = `INSERT INTO users (name, password, email) VALUES ($1, $2, $3) RETURNING *;`
  const values = [name, password, email];
  //pool.query(queryString, values);
  console.log(values);
   return pool
    .query(queryString, values)
    .then((result) => result.rows[0])
    .catch((err) => err.message)
}
// const addUser =  function(user) {
//   const userId = Object.keys(users).length + 1;
//   user.id = userId;
//   users[userId] = user;
//   return Promise.resolve(user);
// }
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit) {
  const queryString = `SELECT properties.*, reservations.*, avg(rating) as average_rating
                       FROM reservations
                       JOIN properties ON reservations.property_id = properties.id
                       JOIN property_reviews ON properties.id = property_reviews.property_id
                       WHERE reservations.guest_id = $1
                       AND reservations.end_date < now()::date
                       GROUP BY properties.id, reservations.id
                       ORDER BY reservations.start_date
                       LIMIT $2;`
  
  const values = [guest_id, 10];
   return pool
     .query(queryString, values)
     .then((result) => { 
       console.log("RESER", result.rows)
       return result.rows
       //return users[id]
       })
    .catch((err) => err.message)
 }


  //return getAllProperties(null, 2);
  //}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */


  
  const getAllProperties = function (options, limit = 10) {
    //let limit = 10
    console.log(limit);
    const queryParams = [];
    
    let queryString = `
    SELECT properties.*, avg(property_reviews.rating) as average_rating
    FROM properties
    JOIN property_reviews ON properties.id = property_id
    `;

    //If Searching By City
    if (options.city) {
      queryParams.push(`%${options.city}%`);
      if (queryString.length >1){
        queryString += `AND city LIKE $${queryParams.length} `;
      } else {
        queryString += `WHERE city LIKE $${queryParams.length} `;
      }
    }

    //If Searching By Owner
    if (options.owner_id) {
      queryParams.push(`%${options.owner_id}%`);
      if (queryString.length > 1) {
        queryString += `AND owner_id LIKE $${queryParams.length} `;
      } else {
        queryString += `WHERE owner_id LIKE $${queryParams.length} `;
      }
    }

    //If on a budget!!
    if (options.minimum_price_per_night && options.maximum_price_per_night) {
      const min = options.minimum_price_per_night*100
      const max = options.maximum_price_per_night*100
      queryParams.push(min);
      queryParams.push(max);
      if (queryString.length > 1) { 
        queryString += `AND cost_per_night > $${queryParams.length - 1} AND cost_per_night < $${queryParams.length}`;
      } else {
        queryString += `WHERE cost_per_night > $${queryParams.length - 1} AND cost_per_night < $${queryParams.length}`;
      }
    }

    
    //If Picky
    if(options.minimum_rating){
      queryParams.push(options.minimum_rating);
      queryString += `
    GROUP BY properties.id
    HAVING AVG(rating) >= $${queryParams.length}
    ORDER BY cost_per_night
    `;
    }else {
    queryString += `
    GROUP BY properties.id
    ORDER BY cost_per_night
    `;
    }
    
    queryParams.push(limit);
    queryString += `LIMIT $${queryParams.length};`;
      
    console.log(queryString, queryParams, limit);
      
    return pool.query(queryString, queryParams).then((res) => res.rows);
  };



// const getAllProperties = function(options, limit = 10) {=
//   const limitedProperties = {};
//   for (let i = 1; i <= limit; i++) {
//     limitedProperties[i] = properties[i];
//   }
//   return Promise.resolve(limitedProperties);
// }
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(properties) {
  const queryString = `INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *;`
  const values =[properties.owner_id, properties.title, properties.description, properties.thumbnail_photo_url, properties.cover_photo_url, properties.cost_per_night, properties.parking_spaces, properties.number_of_bathrooms, properties.number_of_bedrooms, properties.country, properties.street, properties.city, properties.province, properties.post_code];
  
   return pool
    .query(queryString, values)
    .then(result => console.log('DDDD', result.rows[0]))
    .catch((err) => console.error(err.message))

  // const propertyId = Object.keys(properties).length + 1;
  // property.id = propertyId;
  // properties[propertyId] = property;
  // return Promise.resolve(property);
}
exports.addProperty = addProperty;
