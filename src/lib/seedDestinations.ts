import { Destination } from './db';

export const seedDestinations: Destination[] = [
  {
    id: "tokyo",
    name: "Tokyo",
    country: "Japan",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=1200&q=80",
    description: "A neon-lit metropolis where futuristic technology meets centuries-old shrines and traditions.",
    tags: ["URBAN", "FOOD", "TECHNOLOGY"],
    category: "Cities",
    highlights: [
      {
        title: "Sensō-ji Temple Tour",
        description: "Explore Tokyo's oldest and most iconic Buddhist temple in the historic Asakusa district.",
        category: "Activity",
        address: "2-3-1 Asakusa, Taito City, Tokyo 111-0032, Japan"
      },
      {
        title: "Sushi Tasting in Tsukiji",
        description: "Savor the freshest sashimi and nigiri breakfast at the historic outer fish market.",
        category: "Food",
        address: "4-16-2 Tsukiji, Chuo City, Tokyo 104-0045, Japan"
      },
      {
        title: "Shibuya Crossing Experience",
        description: "Walk across the world's busiest pedestrian intersection and view it from an elevated observatory.",
        category: "Activity",
        address: "2-2-1 Dogenzaka, Shibuya City, Tokyo 150-0043, Japan"
      },
      {
        title: "Robot Restaurant Dinner Show",
        description: "An eccentric, high-energy performance featuring giant robots, neon lights, and taiko drums.",
        category: "Activity",
        address: "1-7-7 Kabukicho, Shinjuku City, Tokyo 160-0021, Japan"
      },
      {
        title: "Ramen at Ichiran Shinjuku",
        description: "Enjoy a fully customizable bowl of rich tonkotsu ramen in an individual dining booth.",
        category: "Food",
        address: "3-34-11 Shinjuku, Shinjuku City, Tokyo 160-0022, Japan"
      }
    ]
  },
  {
    id: "paris",
    name: "Paris",
    country: "France",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
    description: "The global center for art, fashion, gastronomy, and architectural masterpieces along the Seine.",
    tags: ["ROMANTIC", "ART", "HISTORY"],
    category: "Cities",
    highlights: [
      {
        title: "Eiffel Tower Summit Access",
        description: "Ascend to the highest accessible deck for panoramic views over the Parisian landscape.",
        category: "Activity",
        address: "Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France"
      },
      {
        title: "Louvre Museum Guided Tour",
        description: "See the Mona Lisa, Venus de Milo, and thousands of timeless treasures with an expert guide.",
        category: "Activity",
        address: "Rue de Rivoli, 75001 Paris, France"
      },
      {
        title: "Wine and Cheese Tasting",
        description: "Sample curated French wines paired with artisanal cheeses in an authentic underground cellar.",
        category: "Food",
        address: "32 Rue de l'Arbre Sec, 75001 Paris, France"
      },
      {
        title: "Palace of Versailles Day Trip",
        description: "Tour the breathtaking Hall of Mirrors and the vast, beautifully manicured royal gardens.",
        category: "Activity",
        address: "Place d'Armes, 78000 Versailles, France"
      },
      {
        title: "Pastry Tasting at Angelina",
        description: "Indulge in the legendary L'Africain hot chocolate and the exquisite Mont-Blanc pastry.",
        category: "Food",
        address: "226 Rue de Rivoli, 75001 Paris, France"
      }
    ]
  },
  {
    id: "bali",
    name: "Bali",
    country: "Indonesia",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
    description: "A tropical paradise famed for its forested volcanic mountains, iconic rice paddies, and beaches.",
    tags: ["NATURE", "BEACH", "CULTURE"],
    category: "Beaches",
    highlights: [
      {
        title: "Ubud Monkey Forest Walk",
        description: "Walk through a sacred sanctuary home to over a thousand free-roaming long-tailed macaques.",
        category: "Activity",
        address: "Jl. Monkey Forest, Ubud, Gianyar, Bali 80571, Indonesia"
      },
      {
        title: "Mount Batur Sunrise Trek",
        description: "Hike an active volcano early in the morning to catch a stunning sunrise above the clouds.",
        category: "Activity",
        address: "Kintamani, Bangli Regency, Bali 80652, Indonesia"
      },
      {
        title: "Babi Guling at Ibu Oka",
        description: "Feast on Bali's most famous traditional spit-roasted suckling pig served with rice and spices.",
        category: "Food",
        address: "Jl. Tegal Sari No.2, Ubud, Gianyar, Bali 80571, Indonesia"
      },
      {
        title: "Scuba Diving in Tulamben",
        description: "Explore the historic USAT Liberty shipwreck teeming with vibrant marine life and coral reefs.",
        category: "Activity",
        address: "Tulamben Beach, Kubu, Karangasem, Bali 80853, Indonesia"
      },
      {
        title: "Jimbaran Bay Seafood Dinner",
        description: "Enjoy a fresh, candlelit grilled seafood platter right on the sand as the sun sets.",
        category: "Food",
        address: "Jl. Pantai Muaya, Jimbaran, Kuta Selatan, Bali 80361, Indonesia"
      }
    ]
  },
  {
    id: "london",
    name: "London",
    country: "United Kingdom",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80",
    description: "A vibrant 21st-century capital deeply rooted in royal heritage, theater, and global finance.",
    tags: ["HISTORY", "URBAN", "CULTURE"],
    category: "Cities",
    highlights: [
      {
        title: "Tower of London Tour",
        description: "Discover centuries of royal history and marvel at the dazzling Crown Jewels collection.",
        category: "Activity",
        address: "London EC3N 4AB, United Kingdom"
      },
      {
        title: "The London Eye Flight",
        description: "Take a ride on the giant observation wheel for unbeatable views of Big Ben and Parliament.",
        category: "Activity",
        address: "Riverside Building, County Hall, London SE1 7PB, United Kingdom"
      },
      {
        title: "Afternoon Tea at The Ritz",
        description: "Experience the quintessential British tradition of loose-leaf tea, scones, and finger sandwiches.",
        category: "Food",
        address: "150 Piccadilly, St. James's, London W1J 9BR, United Kingdom"
      },
      {
        title: "West End Theater Show",
        description: "Watch a world-class musical or dramatic production in London's historic theater district.",
        category: "Activity",
        address: "Shaftesbury Avenue, London W1D 6BA, United Kingdom"
      },
      {
        title: "Fish and Chips at Poppies",
        description: "Savor award-winning, authentic 1940s-style traditional British battered fish and chips.",
        category: "Food",
        address: "6-8 Hanbury St, London E1 6QR, United Kingdom"
      }
    ]
  },
  {
    id: "new-york-city",
    name: "New York City",
    country: "United States",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80",
    description: "The city that never sleeps, known for its iconic skyscrapers, Broadway shows, and diverse neighborhoods.",
    tags: ["URBAN", "ENTERTAINMENT", "FOOD"],
    category: "Cities",
    highlights: [
      {
        title: "Empire State Building Deck",
        description: "Soar to the 86th floor for breathtaking 360-degree views of the Manhattan skyline.",
        category: "Activity",
        address: "20 W 34th St, New York, NY 10001, United States"
      },
      {
        title: "Broadway Musical Performance",
        description: "Immerse yourself in theatrical excellence with a top-tier live show in Times Square.",
        category: "Activity",
        address: "226 W 46th St, New York, NY 10036, United States"
      },
      {
        title: "New York Pizza Tour",
        description: "Sample legendary coal-fired and brick-oven slices across Brooklyn and Manhattan.",
        category: "Food",
        address: "119 Fulton St, New York, NY 10038, United States"
      },
      {
        title: "Central Park Bike Tour",
        description: "Pedal past Bethesda Fountain, Strawberry Fields, and the reservoir on a guided excursion.",
        category: "Activity",
        address: "56 W 56th St, New York, NY 10019, United States"
      },
      {
        title: "Delicatessen Feast at Katz's",
        description: "Taste the legendary, piled-high pastrami on rye at New York's oldest classic deli.",
        category: "Food",
        address: "205 E Houston St, New York, NY 10002, United States"
      }
    ]
  },
  {
    id: "rome",
    name: "Rome",
    country: "Italy",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80",
    description: "A sprawling cosmopolitan city with nearly 3,000 years of globally influential art and architecture.",
    tags: ["HISTORY", "ART", "FOOD"],
    category: "Culture",
    highlights: [
      {
        title: "Colosseum & Forum Arena Tour",
        description: "Walk the gladiatorial arena floor and explore the heart of the ancient Roman Empire.",
        category: "Activity",
        address: "Piazza del Colosseo, 1, 00184 Roma RM, Italy"
      },
      {
        title: "Vatican Museums & Sistine Chapel",
        description: "Admire Michelangelo's iconic ceiling frescoes and the stunning St. Peter's Basilica.",
        category: "Activity",
        address: "Viale Vaticano, 00165 Città del Vaticano, Italy"
      },
      {
        title: "Cacio e Pepe at Da Enzo al 29",
        description: "Dine on authentic, perfectly executed Roman pasta in the charming Trastevere district.",
        category: "Food",
        address: "Via dei Vascellari, 29, 00153 Roma RM, Italy"
      },
      {
        title: "Gelato Making Masterclass",
        description: "Learn the secrets of making creamy, authentic Italian gelato from a local master chef.",
        category: "Activity",
        address: "Piazza de' Ricci, 129, 00186 Roma RM, Italy"
      },
      {
        title: "Trevi Fountain Food Walk",
        description: "Toss a coin into the fountain and sample local street foods like supplì and pizza al taglio.",
        category: "Food",
        address: "Piazza di Trevi, 00187 Roma RM, Italy"
      }
    ]
  },
  {
    id: "barcelona",
    name: "Barcelona",
    country: "Spain",
    image: "https://images.unsplash.com/photo-1583422874117-1a0027a3a6f9?auto=format&fit=crop&w=1200&q=80",
    description: "The seaside capital of Catalonia, characterized by whimsical Gaudí architecture and a lively beach scene.",
    tags: ["ARCHITECTURE", "BEACH", "FOOD"],
    category: "Culture",
    highlights: [
      {
        title: "Sagrada Família Basilica Tour",
        description: "Be awed by Antoni Gaudí's unfinished modernist masterpiece and its vibrant stained glass windows.",
        category: "Activity",
        address: "Carrer de Mallorca, 401, 08013 Barcelona, Spain"
      },
      {
        title: "Park Güell Architectural Walk",
        description: "Stroll through a colorful, fairytale-like public park system designed by Gaudí.",
        category: "Activity",
        address: "Carrer d'Olot, s/n, 08024 Barcelona, Spain"
      },
      {
        title: "Tapas Crawl in El Born",
        description: "Hop from bar to bar tasting patatas bravas, Iberian ham, and fresh seafood tapas.",
        category: "Food",
        address: "Passeig del Born, 08003 Barcelona, Spain"
      },
      {
        title: "Flamenco Show at Tablao Cordobes",
        description: "Experience the passion of authentic Spanish flamenco dancing inside a historic venue.",
        category: "Activity",
        address: "La Rambla, 35, 08002 Barcelona, Spain"
      },
      {
        title: "Paella Cooking Class",
        description: "Visit La Boqueria market for ingredients and learn to cook a traditional seafood paella.",
        category: "Food",
        address: "La Rambla, 91, 08001 Barcelona, Spain"
      }
    ]
  },
  {
    id: "sydney",
    name: "Sydney",
    country: "Australia",
    image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=80",
    description: "Australia's largest city, best known for its sparkling harbor, golden beaches, and majestic opera house.",
    tags: ["BEACH", "URBAN", "NATURE"],
    category: "Cities",
    highlights: [
      {
        title: "Sydney Opera House Tour",
        description: "Go behind the scenes of this UNESCO World Heritage architectural wonder.",
        category: "Activity",
        address: "Bennelong Point, Sydney NSW 2000, Australia"
      },
      {
        title: "Sydney Harbour Bridge Climb",
        description: "Climb to the very top of the bridge structure for unrivaled views of the expansive harbor.",
        category: "Activity",
        address: "3 Cumberland St, The Rocks NSW 2000, Australia"
      },
      {
        title: "Seafood Feast at Fish Market",
        description: "Indulge in freshly shucked oysters, king prawns, and grilled rock lobster.",
        category: "Food",
        address: "Corner Bank St and Pyrmont Bridge Rd, Pyrmont NSW 2009, Australia"
      },
      {
        title: "Bondi to Coogee Coastal Walk",
        description: "Trek a breathtaking cliffside trail connecting stunning beaches and rock pools.",
        category: "Activity",
        address: "Queen Elizabeth Drive, Bondi Beach NSW 2026, Australia"
      },
      {
        title: "Fine Dining at Quay",
        description: "Savor a world-renowned multi-course menu overlooking the brilliantly lit harbor.",
        category: "Food",
        address: "Overseas Passenger Terminal, The Rocks NSW 2000, Australia"
      }
    ]
  },
  {
    id: "san-francisco",
    name: "San Francisco",
    country: "United States",
    image: "https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?auto=format&fit=crop&w=1200&q=80",
    description: "A cultural and financial centerpiece of California, famous for rolling hills, fog, and the Golden Gate.",
    tags: ["URBAN", "NATURE", "FOOD"],
    category: "Cities",
    highlights: [
      {
        title: "Alcatraz Island Night Tour",
        description: "Take a chilling ferry ride and audio tour of the cell blocks of the legendary federal prison.",
        category: "Activity",
        address: "Bld 33, San Francisco, CA 94133, United States"
      },
      {
        title: "Golden Gate Bridge Bike Ride",
        description: "Rent a bicycle to cross the iconic suspension bridge all the way into sunny Sausalito.",
        category: "Activity",
        address: "Golden Gate Bridge, San Francisco, CA 94129, United States"
      },
      {
        title: "Clam Chowder at Boudin Bakery",
        description: "Enjoy world-famous sourdough clam chowder bread bowls right on Fisherman's Wharf.",
        category: "Food",
        address: "160 Jefferson St, San Francisco, CA 94133, United States"
      },
      {
        title: "Mission District Taco Crawl",
        description: "Taste the best authentic Mission-style burritos and tacos in the city's artistic core.",
        category: "Food",
        address: "2889 24th St, San Francisco, CA 94110, United States"
      },
      {
        title: "Muir Woods Redwood Excursion",
        description: "Walk among towering, ancient coastal redwood trees just north of the city limits.",
        category: "Activity",
        address: "1 Muir Woods Rd, Mill Valley, CA 94941, United States"
      }
    ]
  },
  {
    id: "cape-town",
    name: "Cape Town",
    country: "South Africa",
    image: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=1200&q=80",
    description: "A port city beneath the majestic Table Mountain, where wild oceans meet rich heritage and wine fields.",
    tags: ["NATURE", "ADVENTURE", "WINE"],
    category: "Nature",
    highlights: [
      {
        title: "Table Mountain Cableway Ride",
        description: "Glide to the summit in a rotating cable car for panoramic views of the Atlantic coastline.",
        category: "Activity",
        address: "Tafelberg Rd, Gardens, Cape Town 8001, South Africa"
      },
      {
        title: "Boulders Beach Penguin Visit",
        description: "Get up close with a land-based colony of wild African penguins in Simon's Town.",
        category: "Activity",
        address: "Kleintuin Rd, Simon's Town, Cape Town 7995, South Africa"
      },
      {
        title: "Cape Malay Curry in Bo-Kaap",
        description: "Taste unique, aromatic sweet-and-spicy stews inside the iconic, brightly painted neighborhood.",
        category: "Food",
        address: "100 Wale St, Schotsche Kloof, Cape Town 8001, South Africa"
      },
      {
        title: "Robben Island Museum Tour",
        description: "Visit the historic maximum-security prison where Nelson Mandela spent 18 years.",
        category: "Activity",
        address: "Robben Island, Cape Town 7400, South Africa"
      },
      {
        title: "Wine Tasting in Groot Constantia",
        description: "Sample historic, world-class wines at South Africa's oldest estate, founded in 1685.",
        category: "Food",
        address: "Groot Constantia Rd, Constantia, Cape Town 7806, South Africa"
      }
    ]
  },
  {
    id: "cairo",
    name: "Cairo",
    country: "Egypt",
    image: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=1200&q=80",
    description: "An ancient metropolis set on the Nile River, housing monumental pharaonic history and bustling markets.",
    tags: ["HISTORY", "CULTURE", "ARCHAEOLOGY"],
    category: "Culture",
    highlights: [
      {
        title: "Giza Pyramids & Sphinx Tour",
        description: "Behold the Great Pyramid of Giza, the last remaining wonder of the ancient world.",
        category: "Activity",
        address: "Al Haram, Giza Governorate 3512201, Egypt"
      },
      {
        title: "Egyptian Museum Guided Walk",
        description: "View the treasures of King Tutankhamun and an unparalleled collection of ancient artifacts.",
        category: "Activity",
        address: "Tahrir Square, Downtown Cairo, Cairo Governorate 4272003, Egypt"
      },
      {
        title: "Koshary Feast at Abou Tarek",
        description: "Savor Egypt's ultimate comfort street food made of rice, macaroni, lentils, chickpeas, and spicy tomato sauce.",
        category: "Food",
        address: "16 Champollion Rd, Maroof, Qasr El Nil, Cairo Governorate 4271111, Egypt"
      },
      {
        title: "Khan el-Khalili Bazaar Walk",
        description: "Navigate a chaotic, colorful labyrinth of spices, souvenirs, perfumes, and jewelry workshops.",
        category: "Activity",
        address: "El-Gamaleya, El Jammaliyya, Cairo Governorate 4331302, Egypt"
      },
      {
        title: "Traditional Dinner on Nile Cruise",
        description: "Enjoy an Egyptian buffet accompanied by traditional Tanoura and belly dancing on the river.",
        category: "Food",
        address: "Corniche El Nil, Maadi, Cairo Governorate 11728, Egypt"
      }
    ]
  },
  {
    id: "reykjavik",
    name: "Reykjavik",
    country: "Iceland",
    image: "https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1200&q=80",
    description: "The coastal capital of Iceland, serving as a gateway to geothermal wonders, glaciers, and aurora views.",
    tags: ["NATURE", "ADVENTURE", "GEOTHERMAL"],
    category: "Nature",
    highlights: [
      {
        title: "Blue Lagoon Thermal Bathing",
        description: "Soak in mineral-rich, milky-blue geothermal waters surrounded by raw lava fields.",
        category: "Activity",
        address: "Norðurljósavegur 9, 240 Grindavík, Iceland"
      },
      {
        title: "Golden Circle Waterfalls Tour",
        description: "See the explosive Geysir, Gullfoss waterfall, and Thingvellir National Park fissures.",
        category: "Activity",
        address: "Route 35, Gullfoss, 801, Iceland"
      },
      {
        title: "Icelandic Hot Dog Tasting",
        description: "Try a lamb-based hot dog 'with everything' at the world-famous Bæjarins Beztu Pylsur.",
        category: "Food",
        address: "Tryggvagata 1, 101 Reykjavík, Iceland"
      },
      {
        title: "Northern Lights Boat Cruise",
        description: "Sail away from the city's light pollution into dark bay waters to seek the elusive Aurora Borealis.",
        category: "Activity",
        address: "Ægisgarður 5, 101 Reykjavík, Iceland"
      },
      {
        title: "Traditional Seafood at Sea Baron",
        description: "Warm up with a bowl of rich, creamy lobster soup and grilled fish skewers by the old harbor.",
        category: "Food",
        address: "Geirsgata 4a, 101 Reykjavík, Iceland"
      }
    ]
  },
  {
    id: "rio-de-janeiro",
    name: "Rio de Janeiro",
    country: "Brazil",
    image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1200&q=80",
    description: "A huge seaside city famed for its Copacabana beach, Corcovado mountain, and explosive Carnival.",
    tags: ["BEACH", "CULTURE", "FESTIVAL"],
    category: "Beaches",
    highlights: [
      {
        title: "Christ the Redeemer Train Ride",
        description: "Ascend Corcovado Mountain to stand before the colossal, world-famous Art Deco statue.",
        category: "Activity",
        address: "Parque Nacional da Tijuca, Cosme Velho, Rio de Janeiro - RJ, Brazil"
      },
      {
        title: "Sugarloaf Mountain Cable Car",
        description: "Ride a two-stage cable car network to witness a spectacular sunset over Guanabara Bay.",
        category: "Activity",
        address: "Av. Pasteur, 520 - Urca, Rio de Janeiro - RJ, 22290-240, Brazil"
      },
      {
        title: "Churrascaria Dinner at Fogo de Chão",
        description: "Indulge in an endless tableside parade of premium fire-roasted Brazilian meats.",
        category: "Food",
        address: "Av. Repórter Nestor Moreira, s/n - Botafogo, Rio de Janeiro - RJ, 22290-210, Brazil"
      },
      {
        title: "Copacabana Beach Volleyball & Surf",
        description: "Immerse yourself in local beach culture with beach sports and refreshing coconut water.",
        category: "Activity",
        address: "Avenida Atlântica, Copacabana, Rio de Janeiro - RJ, 22070-011, Brazil"
      },
      {
        title: "Feijoada Tasting at Casa de Feijoada",
        description: "Savor Brazil's national dish: a rich stew of black beans, pork, and beef served with farofa.",
        category: "Food",
        address: "Rua Prudente de Morais, 10 - Ipanema, Rio de Janeiro - RJ, 22420-040, Brazil"
      }
    ]
  },
  {
    id: "bangkok",
    name: "Bangkok",
    country: "Thailand",
    image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80",
    description: "A high-rise metropolis filled with ornate shrines, vibrant canal life, and intense street food.",
    tags: ["FOOD", "CULTURE", "URBAN"],
    category: "Cities",
    highlights: [
      {
        title: "The Grand Palace Expedition",
        description: "Admire the spectacular royal architecture and the holy Temple of the Emerald Buddha.",
        category: "Activity",
        address: "Na Phra Lan Rd, Phra Borom Maha Ratchawang, Phra Nakhon, Bangkok 10200, Thailand"
      },
      {
        title: "Wat Arun Sunset View",
        description: "Cross the Chao Phraya River to see the porcelain-encrusted spires of the Temple of Dawn.",
        category: "Activity",
        address: "158 Thanon Wang Doem, Wat Arun, Bangkok Yai, Bangkok 10600, Thailand"
      },
      {
        title: "Michelin Crab Omelet at Jay Fai",
        description: "Queue up for the legendary, crispy, and massive crab meat omelet cooked over charcoal.",
        category: "Food",
        address: "327 Maha Chai Rd, Samran Rat, Phra Nakhon, Bangkok 10200, Thailand"
      },
      {
        title: "Damnoen Saduak Floating Market",
        description: "Paddle past local wooden boats stacked high with tropical fruits, souvenirs, and hot noodles.",
        category: "Activity",
        address: "Damnoen Saduak, Ratchaburi 70130, Thailand"
      },
      {
        title: "Pad Thai at Thip Samai",
        description: "Feast on the city's most celebrated traditional Pad Thai wrapped in a thin layer of egg omelet.",
        category: "Food",
        address: "313-315 Maha Chai Rd, Samran Rat, Phra Nakhon, Bangkok 10200, Thailand"
      }
    ]
  },
  {
    id: "brussels",
    name: "Brussels",
    country: "Belgium",
    image: "https://images.unsplash.com/photo-1491557345352-5929e343484a?auto=format&fit=crop&w=1200&q=80",
    description: "The capital of the European Union, celebrated for its opulent Grand Place, comics, chocolate, and beer.",
    tags: ["CULTURE", "FOOD", "ARCHITECTURE"],
    category: "Culture",
    highlights: [
      {
        title: "Grand Place Architectural Walk",
        description: "Stroll through Europe's most elegant square, bordered by gold-trimmed guild houses.",
        category: "Activity",
        address: "Grand Place, 1000 Brussels, Belgium"
      },
      {
        title: "Atomium Structure Exploration",
        description: "Step inside a massive, futuristic steel crystal model offering sky-high views over Brussels.",
        category: "Activity",
        address: "Square de l'Atomium, 1020 Brussels, Belgium"
      },
      {
        title: "Belgian Waffle Feast at Maison Dandoy",
        description: "Enjoy a fresh, hot Brussels waffle topped with melted Belgian chocolate and whipped cream.",
        category: "Food",
        address: "Rue Charles Buls 14, 1000 Brussels, Belgium"
      },
      {
        title: "Comic Strip Route Walking Tour",
        description: "Track down giant, colorful murals dedicated to Tintin, Smurfs, and other Belgian comic heroes.",
        category: "Activity",
        address: "Rue du Marché au Charbon, 1000 Brussels, Belgium"
      },
      {
        title: "Trappist Beer Tasting at Delirium",
        description: "Navigate a menu of over 2,000 international brews inside this legendary basement pub.",
        category: "Food",
        address: "Impasse de la Fidélité 4, 1000 Brussels, Belgium"
      }
    ]
  },
  {
    id: "singapore",
    name: "Singapore",
    country: "Singapore",
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80",
    description: "A global financial hub and garden city, known for its ultra-modern design and diverse hawker culture.",
    tags: ["URBAN", "FOOD", "FUTURE"],
    category: "Cities",
    highlights: [
      {
        title: "Gardens by the Bay Light Show",
        description: "Walk the high skyway between towering, futuristic Supertrees glowing with music and lights.",
        category: "Activity",
        address: "18 Marina Gardens Dr, Singapore 018953"
      },
      {
        title: "Marina Bay Sands SkyPark",
        description: "Stand atop the world's largest cantilevered observation platform overlooking the city skyline.",
        category: "Activity",
        address: "10 Bayfront Ave, Singapore 018956"
      },
      {
        title: "Chicken Rice at Tian Tian",
        description: "Try the world-renowned, incredibly tender Hainanese chicken rice at Maxwell Food Centre.",
        category: "Food",
        address: "1 Kadayanallur St, #01-10/11 Maxwell Food Centre, Singapore 069184"
      },
      {
        title: "Night Safari Wilderness Tram",
        description: "Ride through an open-air rainforest to witness nocturnal animals roaming freely in natural habitats.",
        category: "Activity",
        address: "80 Mandai Lake Rd, Singapore 729826"
      },
      {
        title: "Chilli Crab Dinner at Jumbo",
        description: "Crack open sweet, meaty mud crabs drenched in a rich, sweet, and spicy egg-sauce gravy.",
        category: "Food",
        address: "20 Upper Circular Rd, #01-48 The Riverwalk, Singapore 058416"
      }
    ]
  },
  {
    id: "sydney-coastal",
    name: "Sydney Coast",
    country: "Australia",
    image: "https://images.unsplash.com/photo-1524820197278-540916411e20?auto=format&fit=crop&w=1200&q=80",
    description: "A second look at Sydney's outer coastal beauty, surfing hotspots, and sub-tropical National Parks.",
    tags: ["BEACH", "SURFING", "ADVENTURE"],
    category: "Beaches",
    highlights: [
      {
        title: "Manly Beach Surf Lesson",
        description: "Learn to catch premium Pacific waves with certified professional instructors on the northern beaches.",
        category: "Activity",
        address: "North Steyne, Manly NSW 2095, Australia"
      },
      {
        title: "Taronga Zoo Sky Safari",
        description: "Ride a cable car above exotic animal enclosures with the beautiful harbor as your background.",
        category: "Activity",
        address: "Bradleys Head Rd, Mosman NSW 2088, Australia"
      },
      {
        title: "Meat Pie at Harry's Cafe de Wheels",
        description: "Bite into a historic 'Tiger' meat pie topped with mashed potatoes, mushy peas, and gravy.",
        category: "Food",
        address: "Cowper Wharf Roadway, Woolloomooloo NSW 2011, Australia"
      },
      {
        title: "Royal National Park Figure 8 Pools",
        description: "Hike along a challenging coastal platform to find unique, perfectly circular natural rock pools.",
        category: "Activity",
        address: "Sir Bertram Stevens Dr, Royal National Park NSW 2233, Australia"
      },
      {
        title: "Aussie BBQ at Watsons Bay Hotel",
        description: "Feast on chargrilled steaks and fresh local barramundi overlooking the quiet harbor waters.",
        category: "Food",
        address: "1 Military Rd, Watsons Bay NSW 2030, Australia"
      }
    ]
  },
  {
    id: "auckland",
    name: "Auckland",
    country: "New Zealand",
    image: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=1200&q=80",
    description: "A major city built around two large harbors, dominated by volcanic cones and close wine islands.",
    tags: ["NATURE", "ADVENTURE", "WINE"],
    category: "Nature",
    highlights: [
      {
        title: "Sky Tower SkyJump Experience",
        description: "Leap off New Zealand's tallest man-made building in a thrilling 192-meter base jump.",
        category: "Activity",
        address: "Victoria St W & Federal St, Auckland CBD, Auckland 1010, New Zealand"
      },
      {
        title: "Waiheke Island Wine Tasting",
        description: "Take a fast ferry to sample award-winning syrahs and bordeaux blends on a stunning island.",
        category: "Food",
        address: "183 Onetangi Rd, Onetangi, Waiheke Island 1081, New Zealand"
      },
      {
        title: "Rangitoto Island Volcano Hike",
        description: "Trek through extensive raw lava fields to reach the panoramic summit of an iconic volcanic island.",
        category: "Activity",
        address: "Rangitoto Island, Hauraki Gulf, Auckland 1010, New Zealand"
      },
      {
        title: "Maori Cultural Show & Museum",
        description: "Watch a powerful, authentic Haka war dance performance and explore Pacific artifacts.",
        category: "Activity",
        address: "The Domain, Parnell, Auckland 1010, New Zealand"
      },
      {
        title: "Hokey Pokey Ice Cream at Giapo",
        description: "Savor avant-garde, luxury handmade ice cream featuring classic New Zealand hokey pokey honeycomb.",
        category: "Food",
        address: "12 Gore St, Auckland CBD, Auckland 1010, New Zealand"
      }
    ]
  },
  {
    id: "mumbai",
    name: "Mumbai",
    country: "India",
    image: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=1200&q=80",
    description: "A chaotic, high-energy metropolis home to the massive Bollywood industry and historic colonial architecture.",
    tags: ["CULTURE", "FOOD", "HISTORY"],
    category: "Culture",
    highlights: [
      {
        title: "Gateway of India Guided Walk",
        description: "Stroll by the iconic 1924 waterfront archway facing the Arabian Sea and the historic Taj Mahal Palace.",
        category: "Activity",
        address: "Apollo Bandar, Colaba, Mumbai, Maharashtra 400001, India"
      },
      {
        title: "Elephanta Caves Boat Excursion",
        description: "Cruise across the harbor to view majestic 5th-century rock-cut cave temples dedicated to Shiva.",
        category: "Activity",
        address: "Elephanta Island, Gharapuri, Maharashtra 400094, India"
      },
      {
        title: "Vada Pav Tasting at Ashok Vada Pav",
        description: "Bite into Mumbai's favorite spicy potato street food burger served with sweet and fiery chutneys.",
        category: "Food",
        address: "Kashinath Dhuru Marg, Dadar West, Mumbai, Maharashtra 400028, India"
      },
      {
        title: "Marine Drive Sunset Promenade",
        description: "Walk the C-shaped concrete arc along the coast, affectionately nicknamed the Queen's Necklace.",
        category: "Activity",
        address: "Netaji Subhash Chandra Bose Road, Marine Drive, Mumbai, Maharashtra 400020, India"
      },
      {
        title: "Parsi Feast at Britannia & Co.",
        description: "Feast on the famous berry pulao, salli boti, and caramel custard inside a vintage Parsi cafe.",
        category: "Food",
        address: "17 Orchard Rd, Ballard Estate, Fort, Mumbai, Maharashtra 400001, India"
      }
    ]
  },
  {
    id: "shanghai",
    name: "Shanghai",
    country: "China",
    image: "https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=1200&q=80",
    description: "China's largest economic capital, where colonial waterfront buildings stand across from space-age towers.",
    tags: ["URBAN", "FUTURE", "FOOD"],
    category: "Cities",
    highlights: [
      {
        title: "The Bund Architectural Walk",
        description: "Stroll along the historic waterfront lined with spectacular 1930s European-style banks and trading houses.",
        category: "Activity",
        address: "Zhongshan East 1st Rd, Huangpu, Shanghai 200002, China"
      },
      {
        title: "Shanghai Tower Observation Deck",
        description: "Ascend to the world's highest indoor observatory on the 118th floor of this twisting skyscraper.",
        category: "Activity",
        address: "501 Yincheng Middle Rd, Lujiazui, Pudong, Shanghai 200120, China"
      },
      {
        title: "Xiaolongbao Tasting at Jia Jia Tang Bao",
        description: "Devour world-famous hot, delicate soup dumplings filled with succulent pork and crab roe.",
        category: "Food",
        address: "99 Huanghe Rd, Huangpu, Shanghai 200003, China"
      },
      {
        title: "Yu Garden Classical Exploration",
        description: "Wander through a magnificent Ming Dynasty garden featuring ornate pavilions and zigzag bridges.",
        category: "Activity",
        address: "279 Yuyuan Rd, Huangpu, Shanghai 200010, China"
      },
      {
        title: "Shengjianbao Feast at Yang's Bling",
        description: "Savor crispy, pan-fried pork buns filled with hot broth and topped with sesame seeds.",
        category: "Food",
        address: "1601 Nanjing West Rd, Jing'an, Shanghai 200040, China"
      }
    ]
  }
];
