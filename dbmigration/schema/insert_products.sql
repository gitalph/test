INSERT INTO
    products (id, code, name, description, price, quantity, created_at)
VALUES (
        1,
        'chef_d_escadron_rouchard_gn',
        'Chef d''Escadron Rouchard | Gendarmerie Nationale',
        'Born into an old aristocratic family, Rouchard enlisted in the Gendarmerie Nationale at her first opportunity as a way to avoid compulsory enrollment at a notorious Swiss finishing school for young women. She quickly impressed her superiors with her offensive strategies, hostage negotiations, and her proficiency with a blade. After several promotions, she became known by the nickname ''Le Couteau'' (The Knife), though some attribute this to her blunt wit. She is always called in when no one else knows what to do. ''It is but a scratch.''',
        14.9,
        39,
        to_timestamp(1632906963)
    )
ON CONFLICT (id) DO UPDATE SET 
    code = EXCLUDED.code,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    quantity = EXCLUDED.quantity,
    created_at = EXCLUDED.created_at;

INSERT INTO
    products (id, code, name, description, price, quantity, created_at)
VALUES (
        2,
        'chem_haz_capitaine_gn',
        'Chem-Haz Capitaine | Gendarmerie Nationale',
        'As leader for Chemical and BioHazard combat operations in populated areas, the Chem-Haz Capitaine plays a crucial role within the Gendarmerie Nationale. Celebrated for orchestrating the successful rescue of civilians during a notorious sarin gas attack in 1997 at a crowded airport, he exemplifies readiness and composure. ''Don''t forget to breathe.''',
        17.92,
        82,
        to_timestamp(1632987943)
    )
ON CONFLICT (id) DO UPDATE SET 
    code = EXCLUDED.code,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    quantity = EXCLUDED.quantity,
    created_at = EXCLUDED.created_at;

INSERT INTO
    products (id, code, name, description, price, quantity, created_at)
VALUES (
        3,
        'chem_haz_specialist_swat',
        'Chem-Haz Specialist | SWAT',
        'Chem-Haz Specialist | SWAT: Specialists in chemical defense capable of surviving and executing missions in toxic environments for hours. They fearlessly charge into danger where others retreat. ''Feels like home.''',
        9.85,
        118,
        to_timestamp(1607710588)
    )
ON CONFLICT (id) DO UPDATE SET 
    code = EXCLUDED.code,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    quantity = EXCLUDED.quantity,
    created_at = EXCLUDED.created_at;

INSERT INTO
    products (id, code, name, description, price, quantity, created_at)
VALUES (
        4,
        'chicken_capsule',
        'Chicken Capsule',
        'Chicken Capsule: A container capsule released in 2019 that includes a variety of stickers created by community artist Slid3. It is available only as an in-game offer.',
        0.93,
        0,
        to_timestamp(1566524435)
    )
ON CONFLICT (id) DO UPDATE SET 
    code = EXCLUDED.code,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    quantity = EXCLUDED.quantity,
    created_at = EXCLUDED.created_at;

INSERT INTO
    products ( id, code, name, description, price, quantity, created_at )
VALUES (
        5,
        'talon_knife_case_hardened_mw',
        '★ Talon Knife | Case Hardened (Minimal Wear)',
        '★ Talon Knife | Case Hardened (Minimal Wear): Премиальный нож из CS:GO с характерной закалённой отделкой и минимальными следами износа. Оценён за свою уникальную текстуру и привлекательный внешний вид, этот нож пользуется спросом среди коллекционеров.',
        6952.68,
        9,
        to_timestamp(1535988313)
    )
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    quantity = EXCLUDED.quantity,
    created_at = EXCLUDED.created_at;

INSERT INTO
    products ( id, code, name, description, price, quantity, created_at )
VALUES (
        6,
        'm9_bayonet_lore_mw',
        '★ M9 Bayonet | Lore (Minimal Wear)',
        '★ M9 Bayonet | Lore (Minimal Wear): Изящный нож-баян с эксклюзивным дизайном в стиле lore и минимальными следами износа. Этот предмет ценится коллекционерами за детализированное оформление и редкость.',
        2023.58,
        3,
        to_timestamp(1535988303)
    )
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    quantity = EXCLUDED.quantity,
    created_at = EXCLUDED.created_at;

INSERT INTO
    products ( id, code, name, description, price, quantity, created_at )
VALUES (    
        7,
        'new_item_alpha',
        'New Item Alpha',
        'Description for New Item Alpha',
        50.0,
        20,
        to_timestamp(1650000000)
    )
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    quantity = EXCLUDED.quantity,
    created_at = EXCLUDED.created_at;

INSERT INTO
    products ( id, code, name, description, price, quantity, created_at )
VALUES (
        8,
        'new_item_beta',
        'New Item Beta',
        'Description for New Item Beta',
        75.5,
        15,
        to_timestamp(1650100000)
    )
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    quantity = EXCLUDED.quantity,
    created_at = EXCLUDED.created_at;