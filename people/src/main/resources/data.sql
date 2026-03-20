-- ============================================================
-- DATABASE: genetics
-- ============================================================
USE genetics;

-- ============================================================
-- DDL — riproduce esattamente ciò che genera Hibernate
-- (con ddl-auto=update le tabelle vengono create in automatico
--  all'avvio; questa sezione è solo documentativa)
-- ============================================================

CREATE TABLE IF NOT EXISTS person (
    id          INTEGER      NOT NULL AUTO_INCREMENT,
    birth_year  INTEGER      NOT NULL,
    first_name  VARCHAR(255),
    gender      VARCHAR(255),
    last_name   VARCHAR(255),
    father_id   INTEGER,
    mother_id   INTEGER,
    PRIMARY KEY (id),
    CONSTRAINT fk_person_father FOREIGN KEY (father_id) REFERENCES person (id),
    CONSTRAINT fk_person_mother FOREIGN KEY (mother_id) REFERENCES person (id)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS trait (
    id          INTEGER      NOT NULL AUTO_INCREMENT,
    description VARCHAR(255),
    name        VARCHAR(255),
    person_id   INTEGER,
    PRIMARY KEY (id),
    CONSTRAINT fk_trait_person FOREIGN KEY (person_id) REFERENCES person (id)
) ENGINE = InnoDB;

-- ============================================================
-- DATI DI PROVA
--
-- Albero genealogico Rossi-Bianchi (3 generazioni)
--
--  Gen 0 (capostipiti, nessun genitore registrato):
--    1  Caio Rossi        M 1910
--    3  Livia Verde       F 1915
--    4  Bruno Bianchi     M 1908
--    7  Flavia Neri       F 1912
--
--  Gen 1:
--    5  Ferdinando Rossi  M 1938  padre=1 madre=3   ← usato in /test3
--    6  Sofia Bianchi     F 1939  padre=4 madre=7
--    8  Carla Rossi       F 1940  padre=1 madre=3   (sorella di Ferdinando)
--
--  Gen 2 (figli di Ferdinando e Sofia):
--    2  Marco Rossi       M 1962  padre=5 madre=6   ← /test (findById 2)
--    9  Laura Rossi       F 1964  padre=5 madre=6   ← fratelli di Marco → /test2
--   10  Giovanni Rossi    M 1967  padre=5 madre=6   ← fratelli di Marco → /test2
--
--  /test  → findById(2)            → Marco Rossi
--  /test2 → findBrothers(2)        → Laura, Giovanni
--  /test3 → findSonsOf("Ferdinando") → Marco, Laura, Giovanni
--  /test4 → findByTrait("Miopia")  → Ferdinando, Marco
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;

INSERT IGNORE INTO person (id, first_name, last_name, birth_year, gender, father_id, mother_id) VALUES
-- Capostipiti (nessun genitore)
(1,  'Caio',       'Rossi',   1910, 'M', NULL, NULL),
(3,  'Livia',      'Verde',   1915, 'F', NULL, NULL),
(4,  'Bruno',      'Bianchi', 1908, 'M', NULL, NULL),
(7,  'Flavia',     'Neri',    1912, 'F', NULL, NULL),
-- Generazione 1
(5,  'Ferdinando', 'Rossi',   1938, 'M', 1, 3),
(6,  'Sofia',      'Bianchi', 1939, 'F', 4, 7),
(8,  'Carla',      'Rossi',   1940, 'F', 1, 3),
-- Generazione 2: figli di Ferdinando e Sofia
(2,  'Marco',      'Rossi',   1962, 'M', 5, 6),
(9,  'Laura',      'Rossi',   1964, 'F', 5, 6),
(10, 'Giovanni',   'Rossi',   1967, 'M', 5, 6);

ALTER TABLE person AUTO_INCREMENT = 11;

SET FOREIGN_KEY_CHECKS = 1;

-- Tratti ereditari
INSERT IGNORE INTO trait (name, description, person_id) VALUES
('Miopia',      'Vista corta, difficoltà a vedere da lontano — ereditata da Caio', 5),  -- Ferdinando
('Miopia',      'Vista corta ereditata dal padre Ferdinando',                       2),  -- Marco
('Daltonismo',  'Incapacità di distinguere rosso e verde',                          1),  -- Caio
('Daltonismo',  'Daltonismo ereditato da Caio',                                     8),  -- Carla
('Presbiopia',  'Difficoltà di messa a fuoco da vicino in età avanzata',            3),  -- Livia
('Ipertensione','Pressione arteriosa elevata, fattore di rischio familiare',         4);  -- Bruno
