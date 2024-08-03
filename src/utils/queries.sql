CREATE TABLE users (
    id SERIAL PRIMARY KEY NOT NULL,
    email VARCHAR(319) NOT NULL,
    password VARCHAR(200) NOT NULL,
    refresh_token TEXT
);

CREATE TABLE syllabus_metadata (
    id PRIMARY KEY NOT NULL,
    name VARCHAR(255) NOT NULL,
    university_name TEXT,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

ALTER TABLE syllabus_metadata
ADD COLUMN course_instructor VARCHAR(255),
ADD COLUMN course_description TEXT

CREATE TYPE cat AS ENUM ('Exam', 'Project', 'Homework');

CREATE TABLE deadlines (
    syllabus_metadata_id INTEGER NOT NULL,
    category cat NOT NULL,
    due_date TIMESTAMPTZ,
    FOREIGN KEY(syllabus_metadata_id) REFERENCES syllabus_metadata(id)
);