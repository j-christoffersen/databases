USE chat;

DELETE FROM Messages;
DELETE FROM Users;
DELETE FROM Rooms;

INSERT INTO Users (username) VALUES ('Walter White'), ('Walt Jr.'), ('John Snow');

INSERT INTO Rooms (name) VALUES ('main'), ('party');

INSERT INTO Messages (text, id_Users, id_Rooms) VALUES ('I am the one who knocks', 1, 1),
('Winter is Coming', 3, 1), ('LETS BOOGIE', 2, 2);