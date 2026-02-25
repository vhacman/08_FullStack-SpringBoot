-- Dati iniziali del rifugio.
--
-- Strategia: INSERT ... ON DUPLICATE KEY UPDATE
--   - Se il record NON esiste  → viene inserito completo (installazione nuova)
--   - Se il record ESISTE GIÀ  → aggiorna solo sterilized e arrival_date
--     (utile quando si aggiungono nuovi campi a un DB già popolato)
--
-- Campi:
--   sterilized   : 1 = sterilizzato, 0 = non sterilizzato
--   arrival_date : data di arrivo nel rifugio (usata per la lista soppressione)
--
-- Logica lista soppressione (oggi = 2026-02-21):
--   Regola 1 — arrival_date < 2023-02-21  →  nel rifugio da più di 3 anni
--   Regola 2 — age > 10  AND  arrival_date < 2025-02-21  →  anziano + ≥1 anno qui

INSERT INTO pet (id, name, species, age, notes, sex, status, sterilized, arrival_date) VALUES
(1,   'Buddy',    'Dog',        3,  'Very playful, loves children.',                          'MALE',   'AVAILABLE', 1, '2021-05-10'),  -- regola 1
(2,   'Luna',     'Cat',        2,  'Initially shy but very affectionate.',                   'FEMALE', 'AVAILABLE', 0, '2024-03-15'),
(3,   'Oliver',   'Cat',        5,  'Looking for a quiet home without other cats.',           'MALE',   'AVAILABLE', 1, '2025-08-22'),
(4,   'Max',      'Dog',        1,  'Full of energy puppy, needs training.',                  'MALE',   'AVAILABLE', 0, '2026-01-05'),
(5,   'Bella',    'Dog',        7,  'Patient and calm, ideal for elderly people.',            'FEMALE', 'AVAILABLE', 1, '2019-11-30'),  -- regola 1
(6,   'Charlie',  'Rabbit',     2,  'Loves carrots and running in the garden.',               'MALE',   'AVAILABLE', 0, '2024-07-14'),
(7,   'Lucy',     'Cat',        4,  'Used to apartment life.',                                'FEMALE', 'AVAILABLE', 1, '2023-04-01'),
(8,   'Cooper',   'Dog',        6,  'Great companion for hiking.',                            'MALE',   'AVAILABLE', 0, '2022-09-18'),  -- regola 1
(9,   'Daisy',    'Dog',        2,  'Friendly with all other dogs.',                          'FEMALE', 'AVAILABLE', 1, '2025-02-28'),
(10,  'Milo',     'Cat',        1,  'Very curious, loves to climb everywhere.',               'MALE',   'AVAILABLE', 0, '2021-12-03'),  -- regola 1
(11,  'Rocky',    'Dog',        8,  'A big gentle giant, very protective.',                   'MALE',   'AVAILABLE', 1, '2020-06-15'),  -- regola 1
(12,  'Molly',    'Cat',        3,  'Loves cuddles on your lap.',                             'FEMALE', 'AVAILABLE', 0, '2024-11-20'),
(13,  'Teddy',    'Hamster',    1,  'Small and lively, active at night.',                     'MALE',   'AVAILABLE', 1, '2025-09-07'),
(14,  'Lola',     'Dog',        4,  'Rescued from the street, looking for trust.',            'FEMALE', 'AVAILABLE', 0, '2023-03-25'),
(15,  'Leo',      'Cat',        9,  'Senior cat, looking for a couch for long naps.',         'MALE',   'AVAILABLE', 1, '2020-01-10'),  -- regola 1
(16,  'Toby',     'Dog',        5,  'Good on leash, obedient.',                               'MALE',   'AVAILABLE', 0, '2023-06-12'),
(17,  'Penny',    'Rabbit',     3,  'Very clean, uses the litter box.',                       'FEMALE', 'AVAILABLE', 1, '2024-04-08'),
(18,  'Jack',     'Dog',        2,  'Loves water and playing with the ball.',                 'MALE',   'AVAILABLE', 0, '2025-01-19'),
(19,  'Stella',   'Cat',        6,  'Independent, great shadow hunter.',                      'FEMALE', 'AVAILABLE', 1, '2022-10-05'),  -- regola 1
(20,  'Zeus',     'Dog',        4,  'Large size, needs outdoor space.',                       'MALE',   'AVAILABLE', 0, '2023-07-30'),
(21,  'Nala',     'Cat',        2,  'Very vocal, responds when you talk to her.',             'FEMALE', 'AVAILABLE', 1, '2024-05-17'),
(22,  'Duke',     'Dog',        3,  'Ex hunting dog, very obedient.',                         'MALE',   'AVAILABLE', 0, '2025-03-09'),
(23,  'Ginger',   'Guinea Pig', 1,  'Loves peppers and being with company.',                  'FEMALE', 'AVAILABLE', 1, '2025-11-14'),
(24,  'Buster',   'Dog',        10, 'Senior but still very lively.',                          'MALE',   'AVAILABLE', 0, '2020-08-22'),  -- regola 1
(25,  'Chloe',    'Cat',        5,  'Elegant and reserved.',                                  'FEMALE', 'AVAILABLE', 1, '2023-09-04'),
(26,  'Simba',    'Cat',        1,  'Very playful, loves feather toys.',                      'MALE',   'AVAILABLE', 0, '2024-12-01'),
(27,  'Rosie',    'Dog',        4,  'Very sweet and sensitive, needs patience.',              'FEMALE', 'AVAILABLE', 1, '2025-07-11'),
(28,  'Bruno',    'Dog',        6,  'Loves sleeping at the foot of the bed.',                 'MALE',   'AVAILABLE', 0, '2022-03-28'),  -- regola 1
(29,  'Cleo',     'Cat',        7,  'Very calm, perfect for pet therapy.',                    'FEMALE', 'AVAILABLE', 1, '2024-02-14'),
(30,  'Oscar',    'Cat',        2,  'Black cat, very lucky and affectionate.',                'MALE',   'AVAILABLE', 0, '2025-10-06'),
(31,  'Sam',      'Dog',        3,  'Intelligent, learns commands quickly.',                  'MALE',   'AVAILABLE', 1, '2023-05-19'),
(32,  'Heidi',    'Dog',        5,  'Gets along with cats.',                                  'FEMALE', 'AVAILABLE', 0, '2024-08-30'),
(33,  'Felix',    'Cat',        4,  'Looking for a home with a fenced garden.',               'MALE',   'AVAILABLE', 1, '2021-07-04'),  -- regola 1
(34,  'Zoe',      'Cat',        8,  'Very wise, observes everything from the window.',        'FEMALE', 'AVAILABLE', 0, '2020-04-16'),  -- regola 1
(35,  'Thor',     'Dog',        2,  'Strong and athletic, ideal for runners.',                'MALE',   'AVAILABLE', 1, '2025-06-23'),
(36,  'Ruby',     'Dog',        1,  'Small breed, loves being held.',                         'FEMALE', 'AVAILABLE', 0, '2026-01-12'),
(37,  'Sasha',    'Cat',        3,  'Loves hiding in cardboard boxes.',                       'FEMALE', 'AVAILABLE', 1, '2024-09-27'),
(38,  'Murphy',   'Dog',        4,  'Very protective of his family.',                         'MALE',   'AVAILABLE', 0, '2023-11-08'),
(39,  'Pepper',   'Cat',        1,  'Endless energy, loves chasing balls.',                   'MALE',   'AVAILABLE', 1, '2025-04-15'),
(40,  'Koda',     'Dog',        2,  'Gets lonely sometimes, needs company.',                  'MALE',   'AVAILABLE', 0, '2024-01-31'),
(41,  'Maya',     'Dog',        6,  'Very calm during car rides.',                            'FEMALE', 'AVAILABLE', 1, '2022-07-09'),  -- regola 1
(42,  'George',   'Cat',        5,  'A true gentleman, very well behaved.',                   'MALE',   'AVAILABLE', 0, '2023-08-17'),
(43,  'Mia',      'Cat',        2,  'Small and agile, loves jumping on furniture.',           'FEMALE', 'AVAILABLE', 1, '2024-10-03'),
(44,  'Rex',      'Dog',        3,  'Looking for an active family.',                          'MALE',   'AVAILABLE', 0, '2025-05-22'),
(45,  'Sophie',   'Dog',        9,  'Needs a controlled diet.',                               'FEMALE', 'AVAILABLE', 1, '2020-12-11'),  -- regola 1
(46,  'Simba',    'Cat',        4,  'Loves sunbathing on the balcony.',                       'MALE',   'AVAILABLE', 0, '2024-03-26'),
(47,  'Otis',     'Parrot',     12, 'Can whistle several famous songs.',                      'MALE',   'AVAILABLE', 1, '2024-06-18'),  -- regola 2 (età>10, arrivo<2025-02-21)
(48,  'Abby',     'Dog',        5,  'Very good with other animals.',                          'FEMALE', 'AVAILABLE', 0, '2023-10-14'),
(49,  'Jasper',   'Cat',        6,  'Independent but appreciates chin scratches.',            'MALE',   'AVAILABLE', 1, '2024-07-07'),
(50,  'Blue',     'Dog',        1,  'Beautiful eyes, lively personality.',                    'MALE',   'AVAILABLE', 0, '2025-08-29'),
(51,  'Willow',   'Cat',        3,  'Loves to sleep on the radiator.',                        'FEMALE', 'AVAILABLE', 1, '2024-11-15'),
(52,  'Marley',   'Dog',        4,  'Loves playing with water and mud.',                      'MALE',   'AVAILABLE', 0, '2021-09-03'),  -- regola 1
(53,  'Romeo',    'Cat',        2,  'A real heartbreaker, very sweet.',                       'MALE',   'AVAILABLE', 1, '2025-02-05'),
(54,  'Jasmine',  'Dog',        7,  'Very composed, walks well on leash.',                    'FEMALE', 'AVAILABLE', 0, '2023-01-20'),  -- regola 1 (gen 2023 < feb 2023)
(55,  'Shadow',   'Cat',        5,  'Disappears and reappears like a shadow.',                'MALE',   'AVAILABLE', 1, '2024-04-12'),
(56,  'Rusty',    'Dog',        8,  'Looking for a home with few stairs.',                    'MALE',   'AVAILABLE', 0, '2020-02-14'),  -- regola 1
(57,  'Coco',     'Dog',        1,  'Loves cuddles and treats.',                              'FEMALE', 'AVAILABLE', 1, '2025-12-03'),
(58,  'Sooty',    'Cat',        4,  'Loves sitting on owner''s shoulders.',                   'MALE',   'AVAILABLE', 0, '2023-07-16'),
(59,  'Finn',     'Dog',        3,  'Always ready for a new adventure.',                      'MALE',   'AVAILABLE', 1, '2024-06-09'),
(60,  'Millie',   'Cat',        6,  'Looking for a home without young children.',             'FEMALE', 'AVAILABLE', 0, '2022-11-28'),  -- regola 1
(61,  'Benny',    'Dog',        2,  'Very shy with strangers.',                               'MALE',   'AVAILABLE', 1, '2025-03-17'),
(62,  'Gracie',   'Cat',        7,  'Loves watching birds outside.',                          'FEMALE', 'AVAILABLE', 0, '2023-05-24'),
(63,  'Apollo',   'Dog',        5,  'Very alert guard dog.',                                  'MALE',   'AVAILABLE', 1, '2024-08-11'),
(64,  'Honey',    'Dog',        4,  'Sweet as honey, very calm.',                             'FEMALE', 'AVAILABLE', 0, '2025-01-07'),
(65,  'Smokey',   'Cat',        8,  'Perfect house cat, very clean.',                         'MALE',   'AVAILABLE', 1, '2022-04-30'),  -- regola 1
(66,  'Diesel',   'Dog',        3,  'Very strong, needs a firm hand.',                        'MALE',   'AVAILABLE', 0, '2023-09-13'),
(67,  'Lulu',     'Cat',        1,  'Sociable and playful kitten.',                           'FEMALE', 'AVAILABLE', 1, '2025-07-02'),
(68,  'Rex',      'Turtle',     15, 'Very slow, loves fresh lettuce.',                        'MALE',   'AVAILABLE', 0, '2020-10-25'),  -- regola 1 E regola 2 (età>10)
(69,  'Frankie',  'Dog',        6,  'Loves being around people.',                             'MALE',   'AVAILABLE', 1, '2024-02-18'),
(70,  'Tilly',    'Cat',        5,  'Looking for a quiet home in the countryside.',           'FEMALE', 'AVAILABLE', 0, '2023-12-06'),
(71,  'Bear',     'Dog',        2,  'Looks like a teddy bear, very soft.',                    'MALE',   'AVAILABLE', 1, '2025-05-08'),
(72,  'Ziggy',    'Cat',        3,  'Very agile, a real acrobat.',                            'MALE',   'AVAILABLE', 0, '2024-09-19'),
(73,  'Gus',      'Dog',        7,  'Loves long quiet walks.',                                'MALE',   'AVAILABLE', 1, '2021-06-14'),  -- regola 1
(74,  'Mimi',     'Cat',        4,  'Loves being brushed.',                                   'FEMALE', 'AVAILABLE', 0, '2023-04-27'),
(75,  'Chance',   'Dog',        1,  'Looking for his second chance.',                         'MALE',   'AVAILABLE', 1, '2025-11-30'),
(76,  'Tigger',   'Cat',        2,  'Always on the move, very active.',                       'MALE',   'AVAILABLE', 0, '2024-01-22'),
(77,  'Pip',      'Hamster',    1,  'Tiny but with a big personality.',                       'MALE',   'AVAILABLE', 1, '2025-08-15'),
(78,  'Lady',     'Dog',        5,  'Elegant and very well behaved at home.',                 'FEMALE', 'AVAILABLE', 0, '2022-08-07'),  -- regola 1
(79,  'Sammy',    'Cat',        9,  'Very quiet senior cat.',                                 'MALE',   'AVAILABLE', 1, '2020-03-18'),  -- regola 1
(80,  'Harley',   'Dog',        3,  'Energetic, loves frisbee.',                              'MALE',   'AVAILABLE', 0, '2024-10-04'),
(81,  'Misty',    'Cat',        6,  'Loves high and safe places.',                            'FEMALE', 'AVAILABLE', 1, '2023-06-29'),
(82,  'Boone',    'Dog',        4,  'Very loyal, never leaves you alone.',                    'MALE',   'AVAILABLE', 0, '2021-11-10'),  -- regola 1
(83,  'Nikita',   'Cat',        2,  'Affectionate but only on her terms.',                    'FEMALE', 'AVAILABLE', 1, '2024-03-05'),
(84,  'Ranger',   'Dog',        1,  'Great sense of direction.',                              'MALE',   'AVAILABLE', 0, '2025-09-22'),
(85,  'Skye',     'Cat',        5,  'Magnetic blue eyes, very calm.',                         'FEMALE', 'AVAILABLE', 1, '2023-08-16'),
(86,  'Ace',      'Dog',        2,  'Very smart, learns tricks quickly.',                     'MALE',   'AVAILABLE', 0, '2025-04-13'),
(87,  'Cookie',   'Dog',        6,  'Sweet and cuddly, loves sofas.',                         'FEMALE', 'AVAILABLE', 1, '2022-05-21'),  -- regola 1
(88,  'Dusty',    'Cat',        3,  'Loves playing with yarn.',                               'MALE',   'AVAILABLE', 0, '2024-07-30'),
(89,  'Scout',    'Dog',        4,  'Always alert, very curious.',                            'MALE',   'AVAILABLE', 1, '2023-10-09'),
(90,  'Cleo',     'Cat',        7,  'Regal and calm.',                                        'FEMALE', 'AVAILABLE', 0, '2024-12-17'),
(91,  'Winston',  'Dog',        5,  'A bit stubborn but very affectionate.',                  'MALE',   'AVAILABLE', 1, '2021-08-06'),  -- regola 1
(92,  'Izzy',     'Cat',        1,  'Sociable kitten, loves playing with other cats.',        'FEMALE', 'AVAILABLE', 0, '2025-06-24'),
(93,  'Hank',     'Dog',        8,  'A wise old soul looking for rest.',                      'MALE',   'AVAILABLE', 1, '2020-01-29'),  -- regola 1
(94,  'Sugar',    'Dog',        2,  'Very sweet, loves lots of pets.',                        'FEMALE', 'AVAILABLE', 0, '2024-04-11'),
(95,  'Bento',    'Cat',        4,  'Very clean, loves his bed.',                             'MALE',   'AVAILABLE', 1, '2023-07-04'),
(96,  'Archie',   'Dog',        3,  'Sociable at the park with everyone.',                    'MALE',   'AVAILABLE', 0, '2025-10-28'),
(97,  'Lexi',     'Cat',        6,  'Independent cat, looking for a spacious home.',          'FEMALE', 'AVAILABLE', 1, '2022-12-15'),  -- regola 1
(98,  'Moose',    'Dog',        2,  'Large breed, huge heart.',                               'MALE',   'AVAILABLE', 0, '2024-05-02'),
(100, 'Patches',  'Cat',        5,  'Multicolor coat, very unique.',                          'FEMALE', 'AVAILABLE', 1, '2023-11-19'),
(101, 'Kyra',     'Dog',        4,  'Very intelligent, loves puzzle games.',                  'FEMALE', 'AVAILABLE', 0, '2025-01-14'),
(102, 'Simba',    'Dog',        1,  'Always happy, tail always wagging.',                     'MALE',   'AVAILABLE', 1, '2025-08-07'),
(103, 'Phoebe',   'Cat',        3,  'A bit crazy, loves running at night.',                   'FEMALE', 'AVAILABLE', 0, '2024-06-23'),
(104, 'Remi',     'Dog',        2,  'Great companion for joggers.',                           'MALE',   'AVAILABLE', 1, '2023-09-30'),
(105, 'Nala',     'Dog',        5,  'Very protective of her bed.',                            'FEMALE', 'AVAILABLE', 0, '2024-11-12'),
(106, 'Oreo',     'Cat',        2,  'Black and white, very sociable.',                        'MALE',   'AVAILABLE', 1, '2025-03-20'),
(107, 'Kobe',     'Dog',        3,  'Loves jumping and playing tug-of-war.',                  'MALE',   'AVAILABLE', 0, '2024-02-26'),
(108, 'Hazel',    'Cat',        8,  'Very calm, loves sitting on laps.',                      'FEMALE', 'AVAILABLE', 1, '2022-07-18'),  -- regola 1
(109, 'Tank',     'Dog',        6,  'Very lazy, loves snoring loudly.',                       'MALE',   'AVAILABLE', 0, '2023-04-14'),
(110, 'Sassy',    'Cat',        4,  'Strong personality, decides when to be petted.',         'FEMALE', 'AVAILABLE', 1, '2024-08-05'),
(111, 'Mickey',   'Dog',        1,  'Small and curious, explores every corner.',              'MALE',   'AVAILABLE', 0, '2025-12-09'),
(112, 'Rico',     'Parrot',     20, 'Talks a lot, knows many words.',                         'MALE',   'AVAILABLE', 1, '2024-09-16'),  -- regola 2 (età>10, arrivo<2025-02-21)
(113, 'Gigi',     'Cat',        5,  'Loves boxes and hiding spots.',                          'FEMALE', 'AVAILABLE', 0, '2023-11-03'),
(114, 'Major',    'Dog',        4,  'Very disciplined, responds well to commands.',           'MALE',   'AVAILABLE', 1, '2024-05-28'),
(115, 'Peanut',   'Dog',        2,  'Tiny, loves sitting in bags.',                           'MALE',   'AVAILABLE', 0, '2025-07-17'),
(116, 'Caspian',  'Cat',        3,  'Long-haired cat, needs brushing.',                       'MALE',   'AVAILABLE', 1, '2024-01-09'),
(117, 'Dolly',    'Dog',        7,  'Very affectionate, seeks human contact.',                'FEMALE', 'AVAILABLE', 0, '2022-09-26'),  -- regola 1
(118, 'Nugget',   'Rabbit',     1,  'Very tender, loves fresh vegetables.',                   'MALE',   'AVAILABLE', 1, '2025-04-30'),
(119, 'Chief',    'Dog',        5,  'The pack leader, very calm.',                            'MALE',   'AVAILABLE', 0, '2021-03-22'),  -- regola 1
(120, 'Xena',     'Cat',        2,  'Warrior cat, very brave.',                               'FEMALE', 'AVAILABLE', 1, '2024-10-14'),
(121, 'Hunter',   'Dog',        3,  'Always with his nose to the ground, follows scents.',   'MALE',   'AVAILABLE', 0, '2025-02-01'),
(122, 'Zelda',    'Cat',        6,  'Very curious, loves exploring.',                         'FEMALE', 'AVAILABLE', 1, '2023-06-11'),
(123, 'Marlow',   'Dog',        4,  'Loves cuddles behind the ears.',                         'MALE',   'AVAILABLE', 0, '2024-07-25'),
(124, 'Buffy',    'Cat',        1,  'Little fly catcher.',                                    'FEMALE', 'AVAILABLE', 1, '2025-11-08'),
(125, 'Atlas',    'Dog',        2,  'Big and strong but very sweet.',                         'MALE',   'AVAILABLE', 0, '2024-03-19'),
(126, 'Suki',     'Cat',        5,  'Loves sunbathing on the balcony.',                       'FEMALE', 'AVAILABLE', 1, '2023-08-27'),
(127, 'Bowie',    'Dog',        1,  'Different colored eyes, very lively.',                   'MALE',   'AVAILABLE', 0, '2025-09-15'),
(128, 'Freya',    'Cat',        4,  'Very silent and elegant cat.',                           'FEMALE', 'AVAILABLE', 1, '2024-06-04'),
(129, 'Rocco',    'Dog',        6,  'Loves long naps in the sun.',                            'MALE',   'AVAILABLE', 0, '2022-10-31'),  -- regola 1
(130, 'Jinx',     'Cat',        2,  'Very playful, loves ambush games.',                      'MALE',   'AVAILABLE', 1, '2025-01-28'),
(131, 'Baloo',    'Dog',        5,  'Big and lazy, loves eating.',                            'MALE',   'AVAILABLE', 0, '2023-12-16'),
(132, 'Yuki',     'Cat',        3,  'Completely white, very beautiful.',                      'FEMALE', 'AVAILABLE', 1, '2024-08-22'),
(133, 'Flash',    'Dog',        1,  'Runs super fast, tireless.',                             'MALE',   'AVAILABLE', 0, '2025-07-03'),
(134, 'Mabel',    'Dog',        8,  'Elderly lady, very quiet.',                              'FEMALE', 'AVAILABLE', 1, '2020-05-13'),  -- regola 1
(135, 'Salem',    'Cat',        5,  'Black cat, very intelligent.',                           'MALE',   'AVAILABLE', 0, '2023-10-07'),
(136, 'Turbo',    'Hamster',    1,  'Runs on his wheel all night.',                           'MALE',   'AVAILABLE', 1, '2025-04-19'),
(137, 'Gemma',    'Dog',        4,  'A true gem of a dog, very good.',                        'FEMALE', 'AVAILABLE', 0, '2024-09-08'),
(138, 'Pippin',   'Cat',        2,  'Very small for his age.',                                'MALE',   'AVAILABLE', 1, '2025-06-26'),
(139, 'Banzai',   'Dog',        3,  'Always ready to jump on you for joy.',                   'MALE',   'AVAILABLE', 0, '2024-02-13'),
(140, 'Vesper',   'Cat',        6,  'Looking for a home without dogs.',                       'FEMALE', 'AVAILABLE', 1, '2022-11-04'),  -- regola 1
(141, 'Odin',     'Dog',        4,  'Powerful dog, very obedient.',                           'MALE',   'AVAILABLE', 0, '2024-04-29'),
(142, 'Daphne',   'Dog',        2,  'Very vain, loves being brushed.',                        'FEMALE', 'AVAILABLE', 1, '2025-08-11'),
(143, 'Figaro',   'Cat',        3,  'Loves ''singing'' for food.',                            'MALE',   'AVAILABLE', 0, '2023-07-18'),
(144, 'Roo',      'Dog',        1,  'Jumps like a kangaroo for happiness.',                   'MALE',   'AVAILABLE', 1, '2025-10-25'),
(145, 'Blanche',  'Cat',        9,  'Looking for peace and love in a serene home.',           'FEMALE', 'AVAILABLE', 0, '2021-04-07'),  -- regola 1
(146, 'Rex',      'Iguana',     5,  'Requires heated terrarium and specific care.',           'MALE',   'AVAILABLE', 1, '2023-03-14'),
(147, 'Clover',   'Dog',        3,  'Brings luck to whoever adopts him.',                     'MALE',   'AVAILABLE', 0, '2024-11-30'),
(148, 'Fifi',     'Cat',        7,  'Very affectionate lap cat.',                             'FEMALE', 'AVAILABLE', 1, '2022-06-09'),  -- regola 1
(149, 'Brutus',   'Dog',        5,  'Scary name but heart of gold.',                          'MALE',   'AVAILABLE', 0, '2024-01-16'),
(150, 'Tess',     'Dog',        4,  'Good with children and other animals.',                  'FEMALE', 'AVAILABLE', 1, '2025-05-04'),
(151, 'Mocha',    'Cat',        2,  'Coffee colored, very lively.',                           'FEMALE', 'AVAILABLE', 0, '2024-07-21'),
(152, 'Sarge',    'Dog',        6,  'Very calm, perfect for apartment living.',               'MALE',   'AVAILABLE', 1, '2021-09-28'),  -- regola 1
(153, 'Pip',      'Cat',        1,  'Very small and shy kitten.',                             'MALE',   'AVAILABLE', 0, '2025-12-12'),
(154, 'Bonnie',   'Dog',        2,  'Looking for her Clyde (or a dynamic human).',            'FEMALE', 'AVAILABLE', 1, '2024-03-08'),
(155, 'Clyde',    'Dog',        2,  'Inseparable from his friend Bonnie.',                    'MALE',   'AVAILABLE', 0, '2024-03-08'),
(156, 'Inky',     'Cat',        4,  'All black, very mysterious.',                            'MALE',   'AVAILABLE', 1, '2023-10-23'),
(157, 'Copper',   'Dog',        3,  'Loves digging in the garden.',                           'MALE',   'AVAILABLE', 0, '2025-02-14'),
(158, 'Pearl',    'Cat',        8,  'A rare pearl of sweetness.',                             'FEMALE', 'AVAILABLE', 1, '2022-08-17'),  -- regola 1
(159, 'Axel',     'Dog',        1,  'Very energetic, loves running.',                         'MALE',   'AVAILABLE', 0, '2025-09-29'),
(160, 'Bijou',    'Cat',        5,  'Small and precious, very reserved.',                     'FEMALE', 'AVAILABLE', 1, '2024-05-15'),
(161, 'Goliath',  'Dog',        4,  'Giant size, needs lots of space.',                       'MALE',   'AVAILABLE', 0, '2023-12-28'),
(162, 'Queenie',  'Cat',        7,  'Acts like the queen of the house.',                      'FEMALE', 'AVAILABLE', 1, '2022-03-05'),  -- regola 1
(163, 'Sparky',   'Dog',        2,  'Loves squeaky toys.',                                    'MALE',   'AVAILABLE', 0, '2025-01-22'),
(164, 'Dottie',   'Dog',        5,  'Full of cute spots.',                                    'FEMALE', 'AVAILABLE', 1, '2024-09-04'),
(165, 'Snowball', 'Cat',        3,  'Soft as a snowball.',                                    'MALE',   'AVAILABLE', 0, '2023-05-17'),
(166, 'Barnaby',  'Dog',        9,  'Looking for a quiet home for his retirement.',           'MALE',   'AVAILABLE', 1, '2020-07-30'),  -- regola 1
(167, 'Moxie',    'Cat',        1,  'Full of character and initiative.',                      'FEMALE', 'AVAILABLE', 0, '2025-11-14'),
(168, 'Benson',   'Dog',        6,  'Very wise, rarely barks.',                               'MALE',   'AVAILABLE', 1, '2024-04-26'),
(169, 'Truffle',  'Pig',        2,  'Very intelligent, lives in the garden.',                 'MALE',   'AVAILABLE', 0, '2023-08-09'),
(170, 'Lana',     'Cat',        4,  'Loves sleeping on people''s laps.',                      'FEMALE', 'AVAILABLE', 1, '2022-12-21'),  -- regola 1
(171, 'Puck',     'Dog',        3,  'Always ready to joke and play.',                         'MALE',   'AVAILABLE', 0, '2024-06-15'),
(172, 'Zorro',    'Cat',        2,  'Has a black spot over his eyes like a mask.',            'MALE',   'AVAILABLE', 1, '2025-03-26'),
(173, 'Roxie',    'Dog',        1,  'Lively puppy, loves to chew.',                           'FEMALE', 'AVAILABLE', 0, '2025-10-07'),
(174, 'Monty',    'Snake',      3,  'Ball python, calm and used to handling.',                'MALE',   'AVAILABLE', 1, '2024-08-18'),
(175, 'Cricket',  'Dog',        4,  'Small and hoppy.',                                       'MALE',   'AVAILABLE', 0, '2023-09-30'),
(176, 'Homer',    'Dog',        7,  'Loves eating and sleeping, very quiet.',                 'MALE',   'AVAILABLE', 1, '2021-05-11'),  -- regola 1
(177, 'Elsa',     'Cat',        5,  'Regal and a bit distant at first.',                      'FEMALE', 'AVAILABLE', 0, '2024-11-23'),
(178, 'Butters',  'Dog',        2,  'Sweet as butter, wouldn''t hurt a fly.',                 'MALE',   'AVAILABLE', 1, '2025-07-05'),
(179, 'Wanda',    'Cat',        6,  'Loves chin scratches.',                                  'FEMALE', 'AVAILABLE', 0, '2022-10-14'),  -- regola 1
(180, 'Pesto',    'Parrot',     4,  'Very colorful, loves fruit.',                            'MALE',   'AVAILABLE', 1, '2024-02-20'),
(181, 'Dobby',    'Dog',        3,  'Very big and funny ears.',                               'MALE',   'AVAILABLE', 0, '2025-04-08'),
(182, 'Pixie',    'Cat',        1,  'Small and magical, very lively.',                        'FEMALE', 'AVAILABLE', 1, '2025-12-27'),
(183, 'Gulliver', 'Dog',        5,  'Loves traveling and discovering new places.',            'MALE',   'AVAILABLE', 0, '2024-01-03'),
(184, 'Snoopy',   'Dog',        4,  'Always hunting for food.',                               'MALE',   'AVAILABLE', 1, '2023-11-10'),
(185, 'Cinder',   'Cat',        2,  'Ash gray color, very elegant.',                          'FEMALE', 'AVAILABLE', 0, '2025-06-19'),
(186, 'Pippo',    'Dog',        6,  'A bit clumsy but very funny.',                           'MALE',   'AVAILABLE', 1, '2022-04-26'),  -- regola 1
(187, 'Nilla',    'Cat',        3,  'Looking for a home with lots of natural light.',         'FEMALE', 'AVAILABLE', 0, '2024-07-12'),
(188, 'Titus',    'Dog',        8,  'Senior dog, just wants affection.',                      'MALE',   'AVAILABLE', 1, '2020-09-15'),  -- regola 1
(189, 'Frito',    'Dog',        2,  'Small breed, sunny personality.',                        'MALE',   'AVAILABLE', 0, '2025-03-31'),
(190, 'Juju',     'Cat',        4,  'Very quiet, a great roommate.',                          'FEMALE', 'AVAILABLE', 1, '2024-10-28'),
(191, 'Kaiser',   'Dog',        5,  'Very proud, excellent guard dog.',                       'MALE',   'AVAILABLE', 0, '2023-06-04'),
(192, 'Lilly',    'Cat',        1,  'Very sweet kitten, loves purring.',                      'FEMALE', 'AVAILABLE', 1, '2025-08-23'),
(193, 'Pongo',    'Dog',        3,  'Full of spots, very playful.',                           'MALE',   'AVAILABLE', 0, '2024-05-10'),
(194, 'Meowth',   'Cat',        2,  'Talks a lot (always meowing).',                          'MALE',   'AVAILABLE', 1, '2023-07-26'),
(195, 'Hodor',    'Dog',        6,  'Big, strong and very loyal.',                            'MALE',   'AVAILABLE', 0, '2022-01-19'),  -- regola 1
(196, 'Muffin',   'Dog',        1,  'So sweet you''d want to eat him.',                       'FEMALE', 'AVAILABLE', 1, '2025-11-06'),
(197, 'Slinky',   'Ferret',     2,  'Very flexible and playful.',                             'MALE',   'AVAILABLE', 0, '2024-03-28'),
(198, 'Yoda',     'Cat',        10, 'Wise and very calm, looking for peace.',                 'MALE',   'AVAILABLE', 1, '2023-08-14'),
(199, 'Rambo',    'Dog',        4,  'Very brave, loves adventure.',                           'MALE',   'AVAILABLE', 0, '2024-12-05'),
(200, 'Zuzu',     'Cat',        3,  'Loves chasing laser pointers.',                          'FEMALE', 'AVAILABLE', 1, '2025-09-17')
-- ON DUPLICATE KEY UPDATE: se il record esiste già (stessa PK), aggiorna solo
-- i due campi nuovi invece di fallire o ignorare tutta la riga.
-- Gli altri campi (name, species, ecc.) non vengono toccati.
AS new_vals
ON DUPLICATE KEY UPDATE
    sterilized   = new_vals.sterilized,
    arrival_date = new_vals.arrival_date;
