-- 1.) Inserting value to account table
INSERT INTO public.account (
    account_firstname,
    account_lastnaname,
    account_email,
    account_password
)
VALUES (
    'Tony',
    'Stark',
    'tony@starkent.com',
    'Iam1ronM@n'
);


-- 2.) Modify Toppny Starks recpord
UPDATE public.account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';


-- 3.) Delete the Tony Stark record from the database.
DELETE FROM public.account
WHERE account_email = 'tony@starkent.com';


-- 4.) Modify the "GM Hummer" record
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'Do you have 6 kids and like to go offroading? The Hummer gives you the small interiors with an engine to get you out of any muddy or rocky situation.',
'Do you have 6 kids and like to go offroading? The Hummer gives you a huge interior with an engine to get you out of any muddy or rocky situation.')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';


-- 5.) Inner join to select the make and model fields from the inventory table and the classification name
SELECT 
    i.inv_make,
    i.inv_model,
    c.classification_name
FROM 
    public.inventory i
INNER JOIN 
    public.classification c
ON 
    i.classification_id = c.classification_id
WHERE 
    c.classification_name = 'Sport';


-- 6.) Update all records in the inventory table
UPDATE public.inventory
SET
    inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
