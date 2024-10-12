CREATE TABLE users (
    id SERIAL PRIMARY KEY NOT NULL,
    email VARCHAR(319) NOT NULL,
    password VARCHAR(200) NOT NULL,
    refresh_token TEXT
);

CREATE TABLE syllabus_metadata (
    id SERIAL PRIMARY KEY,  -- Automatically incrementing ID
	course_name TEXT NOT Null,
    university_name TEXT NOT NULL,
	instructor_name TEXT NOT Null,
	syllabus_file BYTEA,  -- Column to store the PDF file in binary format
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TYPE cat AS ENUM ('Exam', 'Project', 'Homework');

CREATE TABLE deadlines (
    course_name VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    due_date TIMESTAMPTZ,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id)
);