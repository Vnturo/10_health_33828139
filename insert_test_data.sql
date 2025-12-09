USE health;

INSERT INTO users (username, first_name, last_name, email, hashedPassword) 
VALUES ('gold', 'gold', 'smiths', 'goldsmiths@gold.com', '$2b$10$JYwCZ9nqeAvCoknzp5hERO3bjd.NIdW81tLwq5xTMY6Jc2N67PGhu');

INSERT INTO workouts (username, name, duration, calories) VALUES 
('gold', 'Morning Jog', 30, 250),
('gold', 'Yoga Session', 45, 150),
('gold', 'Stair Master', 20, 350),
('gold', 'Cycling', 60, 500),
('gold', 'Swimming', 40, 400),
('gold', 'Cardio', 25, 200);

INSERT INTO goals (username, height_cm, start_weight, target_weight)
VALUES ('gold', 175, 80.0, 70.0);

INSERT INTO weight_history (username, weight, date) VALUES
('gold', 80.0, '2024-03-01 10:00:00'),
('gold', 78.5, '2024-03-08 10:00:00'),
('gold', 77.0, '2024-03-15 10:00:00'),
('gold', 76.5, '2024-03-22 10:00:00'),
('gold', 75.0, '2024-03-29 10:00:00');