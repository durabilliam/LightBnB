SELECT properties.id, title, cost_per_night, AVG(rating) AS average_rating
FROM properties
JOIN property_reviews ON properties.id = property_id
WHERE city LIKE '%ancouv%'
--WHERE properties.city = 'Vancouver'
GROUP BY properties.id
HAVING AVG(rating) >= 4
ORDER BY cost_per_night
LIMIT 10;

-- SELECT title
-- FROM properties
-- WHERE city = 'Vancouver'

-- Show all details about properties located in Vancouver including their average rating.

-- Select all columns from the properties table for properties located in Vancouver, and the average rating for each property.
-- Order the results from lowest cost_per_night to highest cost_per_night.
-- Limit the number of results to 10.
-- Only show listings that have a rating >= 4 stars.
-- To build this incrementally, you can start by getting all properties without the average rating first.



-- SELECT AVG(end_date - start_date) AS average_duration
-- FROM reservations



-- SELECT students.name as student, AVG(assignment_submissions.duration) as average_assignment_duration
-- FROM students
-- JOIN assignment_submissions ON students.id = student_id
-- WHERE students.end_date IS NULL
-- GROUP BY students.name
-- ORDER BY AVG(assignment_submissions.duration) DESC;

-- SELECT id, name, email, password
-- FROM users
-- WHERE email = 'tristanjacobs@gmail.com'

-- SELECT id, name, email, cohort_id
-- FROM students
-- WHERE github IS NULL
-- ORDER BY cohort_id;

-- Get details about a single user.

-- Select their id, name, email, and password.
-- Select a single user using their email address. Use tristanjacobs@gmail.com for now.