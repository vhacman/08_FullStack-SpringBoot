-- =====================================================
-- Script INSERT per database gestione alberghiera - sbbv03
-- =====================================================

USE sbbv03;

-- =====================================================
-- HOTELS (2 hotel in città diverse)
-- =====================================================

INSERT INTO hotel (id, name, address, city) VALUES 
(1, 'Hotel Roma Luxury', 'Via Veneto 45', 'Roma'),
(2, 'Hotel Milano Grand', 'Corso Venezia 12', 'Milano');

-- =====================================================
-- ROOMS (5+ camere per ogni hotel con tipologie diverse)
-- Hotel 1 - Roma
-- =====================================================

INSERT INTO room (id, name, description, base_price, hotel_id, status, last_cleaned) VALUES 
(1, 'Single 101', 'Camera singola con letto alla francese', 80.00, 1, 'AVAILABLE', '2026-02-20'),
(2, 'Double 102', 'Camera matrimoniale con vista città', 120.00, 1, 'AVAILABLE', '2026-02-22'),
(3, 'Suite 201', 'Suite presidenziale con salotto e jacuzzi', 250.00, 1, 'AVAILABLE', '2026-02-18'),
(4, 'Deluxe 103', 'Camera doppia con balcone panoramico', 180.00, 1, 'AVAILABLE', '2026-02-25'),
(5, 'Triple 104', 'Camera tripla con letto singolo + matrimoniale', 150.00, 1, 'AVAILABLE', '2026-02-15');

-- =====================================================
-- ROOMS (5+ camere per ogni hotel con tipologie diverse)
-- Hotel 2 - Milano
-- =====================================================

INSERT INTO room (id, name, description, base_price, hotel_id, status, last_cleaned) VALUES 
(6, 'Single 301', 'Camera singola moderna e funzionale', 75.00, 2, 'AVAILABLE', '2026-02-21'),
(7, 'Double 302', 'Camera matrimoniale con armadio walk-in', 130.00, 2, 'AVAILABLE', '2026-02-23'),
(8, 'Suite 401', 'Suite executive con area lavoro e vista', 280.00, 2, 'AVAILABLE', '2026-02-19'),
(9, 'Deluxe 303', 'Camera doppia premium con minibar', 160.00, 2, 'AVAILABLE', '2026-02-26'),
(10, 'Triple 304', 'Camera familiare con 3 letti singoli', 145.00, 2, 'AVAILABLE', '2026-02-17'),
(11, 'Twin 305', 'Camera doppia con due letti singoli', 110.00, 2, 'AVAILABLE', '2026-02-24');

-- =====================================================
-- GUESTS (10 ospiti italiani con Codice Fiscale valido)
-- =====================================================

INSERT INTO guest (id, first_name, last_name, ssn, dob, address, city) VALUES 
(1, 'Marco', 'Rossi', 'RSSMRC85T10H501A', '1985-12-10', 'Via Garibaldi 15', 'Firenze'),
(2, 'Giulia', 'Bianchi', 'BNCGLI92L75G702B', '1992-07-25', 'Via Roma 42', 'Napoli'),
(3, 'Alessandro', 'Verdi', 'VRDLSN88M01L049C', '1988-08-01', 'Corso Umberto 88', 'Torino'),
(4, 'Sofia', 'Ferrari', 'FRRSFA95T58A794D', '1995-12-18', 'Via Mazzini 23', 'Bologna'),
(5, 'Luca', 'Esposito', 'SPLLCU90A14F205F', '1990-01-14', 'Via Napoli 67', 'Palermo'),
(6, 'Anna', 'Romano', 'RMNNNA82E41H294G', '1982-05-01', 'Via Milano 34', 'Genova'),
(7, 'Francesco', 'Ricci', 'RCCFNC87B22D969H', '1987-02-22', 'Via Torino 11', 'Verona'),
(8, 'Chiara', 'Colombo', 'CLMCHR94S69L736I', '1994-11-29', 'Via Veneto 78', 'Padova'),
(9, 'Matteo', 'Bruno', 'BRNMTT91C08E463J', '1991-03-08', 'Corso Vittorio 56', 'Trieste'),
(10, 'Laura', 'Marchetti', 'MRCLRA89T52G478K', '1989-12-12', 'Via Dante 99', 'Modena');

-- =====================================================
-- BOOKINGS (15 prenotazioni con coerenza status/room)
-- =====================================================

-- Booking 1: CHECKED_IN → Room OCCUPIED (Camera 2 - Double Roma)
INSERT INTO booking (id, guest_id, room_id, check_in, check_out, price, notes, status) VALUES 
(1, 1, 2, '2026-02-25', '2026-02-28', 360, 'Ospite VIP, richiede culla', 'CHECKED_IN');

UPDATE room SET status = 'OCCUPIED' WHERE id = 2;

-- Booking 2: CHECKED_OUT → Room TO_CLEAN (Camera 7 - Double Milano)
INSERT INTO booking (id, guest_id, room_id, check_in, check_out, price, notes, status) VALUES 
(2, 2, 7, '2026-02-20', '2026-02-23', 390, 'Check-out anticipato', 'CHECKED_OUT');

UPDATE room SET status = 'TO_CLEAN' WHERE id = 7;

-- Booking 3: COMPLETE → Room AVAILABLE (Camera 3 - Suite Roma)
INSERT INTO booking (id, guest_id, room_id, check_in, check_out, price, notes, status) VALUES 
(3, 3, 3, '2026-02-10', '2026-02-15', 1250, 'Pernottamento lungo, anniversario', 'COMPLETE');

UPDATE room SET status = 'AVAILABLE', last_cleaned = '2026-02-15' WHERE id = 3;

-- Booking 4: PENDING (Camera 1 - Single Roma, futura)
INSERT INTO booking (id, guest_id, room_id, check_in, check_out, price, notes, status) VALUES 
(4, 4, 1, '2026-03-05', '2026-03-07', 160, 'Prenotazione flex', 'PENDING');

-- Booking 5: CANCELED (Camera 8 - Suite Milano)
INSERT INTO booking (id, guest_id, room_id, check_in, check_out, price, notes, status) VALUES 
(5, 5, 8, '2026-02-22', '2026-02-25', 840, 'Annullata per emergenza familiare', 'CANCELED');

-- Booking 6: COMPLETE → Room AVAILABLE (Camera 4 - Deluxe Roma, passata)
INSERT INTO booking (id, guest_id, room_id, check_in, check_out, price, notes, status) VALUES 
(6, 6, 4, '2026-02-01', '2026-02-03', 360, 'Viaggio lavoro', 'COMPLETE');

UPDATE room SET status = 'AVAILABLE', last_cleaned = '2026-02-03' WHERE id = 4;

-- Booking 7: CHECKED_IN → Room OCCUPIED (Camera 9 - Deluxe Milano)
INSERT INTO booking (id, guest_id, room_id, check_in, check_out, price, notes, status) VALUES 
(7, 7, 9, '2026-02-26', '2026-03-01', 480, 'Business trip', 'CHECKED_IN');

UPDATE room SET status = 'OCCUPIED' WHERE id = 9;

-- Booking 8: PENDING (Camera 5 - Triple Roma, futura)
INSERT INTO booking (id, guest_id, room_id, check_in, check_out, price, notes, status) VALUES 
(8, 8, 5, '2026-03-10', '2026-03-14', 600, 'Vacanza famiglia', 'PENDING');

-- Booking 9: COMPLETE → Room AVAILABLE (Camera 6 - Single Milano, passata)
INSERT INTO booking (id, guest_id, room_id, check_in, check_out, price, notes, status) VALUES 
(9, 9, 6, '2026-01-28', '2026-01-30', 150, 'Weekend break', 'COMPLETE');

UPDATE room SET status = 'AVAILABLE', last_cleaned = '2026-01-30' WHERE id = 6;

-- Booking 10: CHECKED_OUT → Room TO_CLEAN (Camera 10 - Triple Milano)
INSERT INTO booking (id, guest_id, room_id, check_in, check_out, price, notes, status) VALUES 
(10, 10, 10, '2026-02-23', '2026-02-26', 435, 'Familia con bambini', 'CHECKED_OUT');

UPDATE room SET status = 'TO_CLEAN' WHERE id = 10;

-- Booking 11: COMPLETE → Room AVAILABLE (Camera 11 - Twin Milano, passata)
INSERT INTO booking (id, guest_id, room_id, check_in, check_out, price, notes, status) VALUES 
(11, 1, 11, '2026-02-05', '2026-02-07', 220, 'Trasferta', 'COMPLETE');

UPDATE room SET status = 'AVAILABLE', last_cleaned = '2026-02-07' WHERE id = 11;

-- Booking 12: PENDING (Camera 2 - Double Roma, futura)
INSERT INTO booking (id, guest_id, room_id, check_in, check_out, price, notes, status) VALUES 
(12, 3, 2, '2026-03-15', '2026-03-18', 360, 'Conferma in attesa', 'PENDING');

-- Booking 13: CANCELED (Camera 7 - Double Milano)
INSERT INTO booking (id, guest_id, room_id, check_in, check_out, price, notes, status) VALUES 
(13, 5, 7, '2026-03-01', '2026-03-05', 520, 'Cambio programmi', 'CANCELED');

-- Booking 14: CHECKED_IN → Room OCCUPIED (Camera 1 - Single Roma)
INSERT INTO booking (id, guest_id, room_id, check_in, check_out, price, notes, status) VALUES 
(14, 7, 1, '2026-02-27', '2026-03-01', 320, 'Check-in notturno', 'CHECKED_IN');

UPDATE room SET status = 'OCCUPIED' WHERE id = 1;

-- Booking 15: COMPLETE → Room AVAILABLE (Camera 5 - Triple Roma, passata)
INSERT INTO booking (id, guest_id, room_id, check_in, check_out, price, notes, status) VALUES 
(15, 9, 5, '2026-01-20', '2026-01-23', 450, 'Soggiorno relax', 'COMPLETE');

UPDATE room SET status = 'AVAILABLE', last_cleaned = '2026-01-23' WHERE id = 5;

-- =====================================================
-- USERS (2 ADMIN + 2 RECEPTIONIST)
-- =====================================================

INSERT INTO user (id, username, password, email, first_name, last_name, role, hotel_id) VALUES 
(1, 'admin_roma', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin.roma@hotelsbb.com', 'Roberto', 'Ricci', 'ADMIN', 1),
(2, 'admin_milano', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin.milano@hotelsbb.com', 'Elena', 'Costa', 'ADMIN', 2),
(3, 'reception_roma', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'reception.roma@hotelsbb.com', 'Paolo', 'Fontana', 'RECEPTIONIST', 1),
(4, 'reception_milano', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'reception.milano@hotelsbb.com', 'Maria', 'Bianchi', 'RECEPTIONIST', 2);