SELECT AVG(end_date - start_date) AS average_duration
FROM reservations;



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