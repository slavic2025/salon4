-- Script SQL pentru seed stiliști în Supabase
-- Rulează acest script în Supabase SQL Editor

-- 1. Creez utilizatorii în auth.users
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES 
(
  '2edd5c29-0240-45c1-94c6-f3fd06170221',
  'elena.dumitrescu@salon-test.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Elena Dumitrescu"}',
  false,
  '',
  '',
  '',
  ''
),
(
  '262c0713-860a-45d3-b97f-a5d295096f60',
  'cristina.marinescu@salon-test.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Cristina Marinescu"}',
  false,
  '',
  '',
  '',
  ''
),
(
  '3cb08d91-c0e3-4c90-b7fe-77c593c1cfd6',
  'andreea.popa@salon-test.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Andreea Popa"}',
  false,
  '',
  '',
  '',
  ''
);

-- 2. Creez stiliștii în public.stylists
INSERT INTO public.stylists (
  id,
  full_name,
  email,
  phone,
  description,
  is_active,
  created_at,
  updated_at
) VALUES 
(
  '2edd5c29-0240-45c1-94c6-f3fd06170221',
  'Elena Dumitrescu',
  'elena.dumitrescu@salon-test.com',
  '0722123458',
  'Specialist în coafuri moderne și vopsit profesional',
  true,
  NOW(),
  NOW()
),
(
  '262c0713-860a-45d3-b97f-a5d295096f60',
  'Cristina Marinescu',
  'cristina.marinescu@salon-test.com',
  '0722123459',
  'Expert în manichiură, pedichiură și tratamente faciale',
  true,
  NOW(),
  NOW()
),
(
  '3cb08d91-c0e3-4c90-b7fe-77c593c1cfd6',
  'Andreea Popa',
  'andreea.popa@salon-test.com',
  '0722123460',
  'Specialist în extensii gene și make-up pentru evenimente',
  true,
  NOW(),
  NOW()
);

-- 3. Asociez stiliștii cu toate serviciile existente
INSERT INTO public.stylists_to_services (stylist_id, service_id)
SELECT 
  s.id as stylist_id,
  sv.id as service_id
FROM public.stylists s
CROSS JOIN public.services sv
WHERE s.id IN (
  '2edd5c29-0240-45c1-94c6-f3fd06170221',
  '262c0713-860a-45d3-b97f-a5d295096f60',
  '3cb08d91-c0e3-4c90-b7fe-77c593c1cfd6'
)
ON CONFLICT (stylist_id, service_id) DO NOTHING;

-- 4. Adaug program de lucru standard (luni-vineri 09:00-17:00) pentru fiecare stilist
INSERT INTO public.work_schedules (stylist_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT 
  s.id as stylist_id,
  d.day_of_week,
  '09:00'::time as start_time,
  '17:00'::time as end_time,
  NOW() as created_at,
  NOW() as updated_at
FROM public.stylists s
CROSS JOIN (
  SELECT 0 as day_of_week UNION ALL
  SELECT 1 UNION ALL
  SELECT 2 UNION ALL
  SELECT 3 UNION ALL
  SELECT 4
) d
WHERE s.id IN (
  '2edd5c29-0240-45c1-94c6-f3fd06170221',
  '262c0713-860a-45d3-b97f-a5d295096f60',
  '3cb08d91-c0e3-4c90-b7fe-77c593c1cfd6'
)
ON CONFLICT (stylist_id, day_of_week) DO NOTHING;

-- 5. Verific rezultatele
SELECT 'Stylists created:' as info, COUNT(*) as count FROM public.stylists WHERE id IN (
  '2edd5c29-0240-45c1-94c6-f3fd06170221',
  '262c0713-860a-45d3-b97f-a5d295096f60',
  '3cb08d91-c0e3-4c90-b7fe-77c593c1cfd6'
);

SELECT 'Stylist-service links created:' as info, COUNT(*) as count FROM public.stylists_to_services WHERE stylist_id IN (
  '2edd5c29-0240-45c1-94c6-f3fd06170221',
  '262c0713-860a-45d3-b97f-a5d295096f60',
  '3cb08d91-c0e3-4c90-b7fe-77c593c1cfd6'
);

SELECT 'Work schedules created:' as info, COUNT(*) as count FROM public.work_schedules WHERE stylist_id IN (
  '2edd5c29-0240-45c1-94c6-f3fd06170221',
  '262c0713-860a-45d3-b97f-a5d295096f60',
  '3cb08d91-c0e3-4c90-b7fe-77c593c1cfd6'
); 