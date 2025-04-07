-- Create Users table
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phoneNumber TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'student',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Events table
CREATE TABLE events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  date TEXT NOT NULL,
  fee REAL NOT NULL,
  imageUrl TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Payments table
CREATE TABLE payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  eventId INTEGER NOT NULL,
  amount REAL NOT NULL,
  transactionId TEXT,
  screenshot TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (eventId) REFERENCES events(id)
);

-- Insert admin user
INSERT INTO users (name, phoneNumber, role) VALUES ('Admin', '9999999999', 'admin');

-- Insert sample events
INSERT INTO events (name, description, date, fee, imageUrl) VALUES 
('Freshers Party', 'Welcome party for new students', '2023-09-15', 500, 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30'),
('CSI Workshop', 'Learn about the latest technologies', '2023-10-20', 300, 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4'),
('KNT Association Annual Meet', 'Networking event for KNT members', '2023-11-05', 400, 'https://images.unsplash.com/photo-1540575467063-178a50c2df87');