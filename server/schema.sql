CREATE DATABASE IF NOT EXISTS chat;

USE chat;

-- ---
-- Table 'Messages'
-- 
-- ---

DROP TABLE IF EXISTS Messages;
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Rooms;
    
CREATE TABLE Messages (
  id INTEGER NOT NULL AUTO_INCREMENT,
  text MEDIUMTEXT,
  id_Users INTEGER,
  id_Rooms INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

-- ---
-- Table 'Users'
-- 
-- ---

    
CREATE TABLE Users (
  id INTEGER NOT NULL AUTO_INCREMENT,
  username VARCHAR(255),
  PRIMARY KEY (id),
  UNIQUE (username)
);

-- ---
-- Table 'Rooms'
-- 
-- ---

    
CREATE TABLE Rooms (
  id INTEGER NOT NULL AUTO_INCREMENT,
  roomname VARCHAR(255),
  PRIMARY KEY (id),
  UNIQUE (roomname)
);

-- ---
-- Foreign Keys 
-- ---

ALTER TABLE Messages ADD FOREIGN KEY (id_Users) REFERENCES Users (id) ON DELETE CASCADE;
ALTER TABLE Messages ADD FOREIGN KEY (id_Rooms) REFERENCES Rooms (id) ON DELETE CASCADE;

-- ---
-- Table Properties
-- ---

-- ALTER TABLE Messages ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE Users ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE Rooms ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ---
-- Test Data
-- ---

-- INSERT INTO Messages (id,text,id_Users,id_Rooms,created_at,updated_at) VALUES
-- ('','','','','','');
-- INSERT INTO Users (id,username) VALUES
-- ('','');
-- INSERT INTO Rooms (id,name) VALUES
-- ('','');

/* Create other tables and define schemas for them here! */




/*  Execute this file from the command line by typing:
 *    mysql -u root < server/schema.sql
 *  to create the database and the tables.*/

