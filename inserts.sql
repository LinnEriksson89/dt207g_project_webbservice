/* DT207G - Backend-baserad webbutveckling
 * Projekt
 * Linn Eriksson, VT24
 */

--Testdata for menu-database.

--Menu categories.
INSERT INTO menu_category VALUES(null, 'Huvudrätter', 'Huvudrätter som alltid är tillgängliga.');
INSERT INTO menu_category VALUES(null, 'Vegetariskt', 'Vegetariska rätter som alltid är tillgängliga.');
INSERT INTO menu_category VALUES(null, 'Efterrätter', 'Vårt utbud av efterräter.');
INSERT INTO menu_category VALUES(null, 'Sallader', 'Sallader som alltid går att beställa, serveras med bröd och valfri dressing.');
INSERT INTO menu_category VALUES(null, 'Barnmeny', 'Mindre portioner och snällare smaker.');

--Menu items for lunch-menu.
INSERT INTO lunch_item VALUES(null, 'Köttfärslimpa', 'Köttfärslimpa med gräddsås och kokta morötter.', 'Gluten, Ägg, Mjölk', 0, 1);
INSERT INTO lunch_item VALUES(null, 'Köttbullar', 'Köttbullar med potatis och gräddsås.', 'Gluten, Mjölk', 1, 1);
INSERT INTO lunch_item VALUES(null, 'Fiskgratäng', 'Fiskgratäng med räkor och potatismos', 'Skaldjur, Mjölk', 0, 1);
INSERT INTO lunch_item VALUES(null, 'Kålpudding', 'Kålpudding med gräddsås', 'Gluten, Mjölk', 0, 1);
INSERT INTO lunch_item VALUES(null, 'Isterband', 'Isterband med persiljestuvad potatis', 'Mjölk', 0, 1);
INSERT INTO lunch_item VALUES(null, 'Oxrullader', 'Oxrullader med färskost, serveras med potatis.', 'Ägg, Mjölk', 5, 1);
INSERT INTO lunch_item VALUES(null, 'Stekt torskfilé', 'Stekt torskfilé med kall örtsås.', 'Mjölk', 0, 1);
INSERT INTO lunch_item VALUES(null, 'Panerad rödspätta', 'Panerad rödspätta med hollandaisesås.', 'Gluten, Ägg, Mjölk', 0, 1);
INSERT INTO lunch_item VALUES(null, 'Plommonspäckad fläskkarre', 'Plommonspäckad fläskkarre med gräddsås.', 'Ägg, Mjölk', 5, 1);
INSERT INTO lunch_item VALUES(null, 'Ärtsoppa', 'Ärtsoppa med pannkakor.', 'Gluten, Ägg, Mjölk', 4, 1);
INSERT INTO lunch_item VALUES(null, 'Ugnspannkaka', 'Ugnspannkaka med fläsk och lingonsylt.', 'Gluten, Ägg, Mjölk', 4, 1);
INSERT INTO lunch_item VALUES(null, 'Tacopasta', 'Spagetti med tacokryddad köttfärssås.', 'Gluten, Ägg, Mjölk', 0, 1);
INSERT INTO lunch_item VALUES(null, 'Pannbiff', 'Pannbiff med stekt lök, gräddsås och lingonsylt.', 'Gluten, Mjölk', 0, 1);
INSERT INTO lunch_item VALUES(null, 'Korvstroganoff', 'Korvstroganof med ris', 'Gluten, Ägg, Mjölk', 0, 1);
INSERT INTO lunch_item VALUES(null, 'Flygande Jakob', 'Kycklinggryta med chilisås, banan och jordnötter. Serveras med ris.', 'Mjölk', 0, 2);
INSERT INTO lunch_item VALUES(null, 'Schnitzel', 'Schnitzel med stekt potatis och bearnaise.', 'Gluten, Ägg, Mjölk', 0, 2);

--Menu items for "huvudrätter"
INSERT INTO menu_item VALUES(null, 1, 'Raggmunk', 99.99, 'Raggmunk med fläsk och lingonsylt', 'Gluten, Ägg, Mjölk');
INSERT INTO menu_item VALUES(null, 1, 'Köttbullar', 99.99, 'Köttbullar med potatis och gräddsås.', 'Gluten, Ägg, Mjölk');
INSERT INTO menu_item VALUES(null, 1, 'Skaldjurspasta', 99.99, 'Spagetti med vitvinssås innehållander räkor, musslor och crabsticks.', 'Skaldjur, Gluten, Ägg, Mjölk');
INSERT INTO menu_item VALUES(null, 1, 'Panerad rödspätta', 99.99, 'Panerad rödspätta med hollandaisesås.', 'Gluten, Ägg, Mjölk');
INSERT INTO menu_item VALUES(null, 1, 'Schnitzel', 99.99, 'Schnitzel med stekt potatis och bearnaise.', 'Gluten, Ägg, Mjölk');

--Menu items for "vegetariskt".
INSERT INTO menu_item VALUES(null, 2, 'Halloumiburgare', 69.99, 'Halloumiburgare serveras med pommes fritt.', 'Gluten, Mjölk');
INSERT INTO menu_item VALUES(null, 2, 'Linsgryta', 69.99, 'Vegansk linsgryta serverad med bröd.', 'Gluten');
INSERT INTO menu_item VALUES(null, 2, 'Kikärtsgryta', 75.99, 'Kikärtsgryta med koriander, serveras med bröd.', 'Gluten');
INSERT INTO menu_item VALUES(null, 2, 'Panerade grönsaker', 79.99, 'Säsongens grönsaker paneras och serveras med stekt potatis och örtsås.', 'Gluten, Ägg, Mjölk');
INSERT INTO menu_item VALUES(null, 2, 'Broccoli-/blomkålsgratäng', 85.99, 'Broccoli-/blomkålsgratäng med bönröra, vegansk.', '-');

--Menu items for "efterrätter".
INSERT INTO menu_item VALUES(null, 3, 'Glass', 35.99, 'Två kulor glass med tillbehör, fråga efter säsongens smak.', 'Ägg, Mjölk');
INSERT INTO menu_item VALUES(null, 3, 'Marängsviss', 55.99, 'Vaniljglass, maränger och chokladsås.', 'Ägg, Mjölk');
INSERT INTO menu_item VALUES(null, 3, 'Småkaka', 25.99, 'Två olika sorters småkakor, fråga efter säsongens smak', 'Gluten, Ägg, Mjölk');
INSERT INTO menu_item VALUES(null, 3, 'Äppelpaj', 45.99, 'Äppelpaj serverad med vaniljsås.', 'Gluten, Ägg, Mjölk');

--Menu items for "sallader".
INSERT INTO menu_item VALUES(null, 4, 'Kyckling', 95.99, 'Kycklingsallad med säsongens grönsaker.', 'Gluten, Mjölk');
INSERT INTO menu_item VALUES(null, 4, 'Skinka', 95.99, 'Sallad med skinka, ost och säsongens grönsaker.', 'Mjölk');
INSERT INTO menu_item VALUES(null, 4, 'Räkor', 95.99, 'Sallad med räkor, ägg och säsongens grönsaker.', 'Gluten, Ägg, Mjölk');
INSERT INTO menu_item VALUES(null, 4, 'Amerikansk', 95.99, 'Sallad med räkor, skinka, ost och säsongens grönsaker.', 'Gluten, Mjölk');
INSERT INTO menu_item VALUES(null, 4, 'Halloumi', 95.99, 'Vegetarisk halloumisallad med säsongens grönsaker.', 'Mjölk');

--Menu items for "Barnmeny".
INSERT INTO menu_item VALUES(null, 5, 'Korv och potatis', 64.99, 'Stekt korv, stekt potatis och dipsås.', '-');
INSERT INTO menu_item VALUES(null, 5, 'Chicken nuggets', 64.99, 'Chicken nuggets med pommes fritt och dipsås.', 'Gluten, Ägg');
INSERT INTO menu_item VALUES(null, 5, 'Hamburgare', 69.99, '90g hamburgare med pommes. Kan fås som ostburgare.', 'Gluten');
INSERT INTO menu_item VALUES(null, 5, 'Fiskpinnar', 69.99, 'Fiskpinnar, potatismos och remouladsås.', 'Gluten, Ägg, Mjölk');
INSERT INTO menu_item VALUES(null, 5, 'Pannkakor', 59.99, 'Pannkakor med grädde och sylt.', 'Gluten, Ägg, Mjölk');
INSERT INTO menu_item VALUES(null, 5, 'Linsgryta', 59.99, 'Vegansk linsgryta, serveras med bröd.', 'Gluten');