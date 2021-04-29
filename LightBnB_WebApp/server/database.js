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

 const getAllProperties = (options, limit = 10) => {
  // const sqlQuery = {
  //   text:(`SELECT * FROM properties LIMIT $1`, [limit])
  // };
  return pool
    //.query(sqlQuery)
    .query(`SELECT * FROM properties LIMIT $1`, [limit])
    .then((result) => result.rows)
    .catch((err) => err.message)
    // .then((result) => {
    //   result.rows,
    //   console.log(result.rows);
    // })
//     .catch((err) => {
//       console.log(err.message);
//     });
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
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
