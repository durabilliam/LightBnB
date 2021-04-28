SELECT properties.*, reservations.*, avg(rating) as average_rating
FROM reservations
JOIN properties ON reservations.property_id = properties.id
JOIN property_reviews ON properties.id = property_reviews.property_id
WHERE reservations.guest_id = 1
AND reservations.end_date < now()::date
GROUP BY properties.id, reservations.id
ORDER BY reservations.start_date
LIMIT 10;


-- SELECT properties.id,  
--        properties.title as title, 
--        properties.cost_per_night as cost_per_night,
--        start_date,
--        AVG(rating) AS average_rating
-- FROM properties
-- JOIN reservations ON properties.id = property_id
-- JOIN property_reviews ON reservations.id = reservation_id
-- WHERE reservations.guest_id = 1
-- GROUP BY properties.id, properties.title, properties.cost_per_night, start_date,reservations.end_date
-- HAVING reservations.end_date <= NOW()
-- ORDER BY start_date
-- LIMIT 10
