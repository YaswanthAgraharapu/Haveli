/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MenuItem {
  name: string;
  price: string;
  description?: string;
  isPopular?: boolean;
}

export interface MenuCategory {
  categoryName: string;
  items: MenuItem[];
}

export const RESTAURANT_NAME = "Haveli Banquet Hall And Restaurant";
export const GOOGLE_RATING = "4.0/5 (383 reviews)";
export const CONTACT_PHONES = ["9985084847", "7981562535", "7013220053"];
export const GOOGLE_MAPS_URL = "https://maps.app.goo.gl/WLeMQ6w6LB3CdikF7";

// Clean extracted menu matching categories requested
export const menuCategories: MenuCategory[] = [
  {
    categoryName: "Soups",
    items: [
      { name: "Veg Corn Soup", price: "120", description: "Sweet and creamy golden corn kernels simmered in a light broth with garden fresh vegetables.", isPopular: true },
      { name: "Manchow Soup Veg", price: "130", description: "Spicy and tangy soy-based thick soup served with crispy noodles." },
      { name: "Hot and Sour Veg Soup", price: "130", description: "A hot and sour fusion broth with black fungus, carrots, and bamboo shoots." },
      { name: "Veg Cantonese Soup", price: "130", description: "Mildly spiced Cantonese style clear broth loaded with green leafy vegetables." },
      { name: "Tomato Soup", price: "130", description: "Classic velvety rich vine-ripened tomato soup infused with fresh herbs and butter." },
      { name: "Tomato Hot Chilli Soup", price: "130", description: "A fiery kick added to our classic tomato soup for spicy food lovers." },
      { name: "Veg Tomyum Soup", price: "130", description: "Thai hot and sour broth featuring lemongrass, galangal, kaffir lime, and mushrooms." },
      { name: "Veg Clear Soup", price: "120", description: "Simple, light nutritional vegetable stock with diced crunch vegetables." },
      { name: "Chicken Corn Soup", price: "140", description: "Creamy comfort soup featuring sweet corn, shredded chicken, and egg drops.", isPopular: true },
      { name: "Chicken Manchow Soup", price: "140", description: "Dark brown garlic, ginger, coriander, and chicken soup topped with fried noodles." },
      { name: "Chicken Hot and Sour Soup", price: "140", description: "Traditional Sichuan soup, thick and hearty, sour and spicy with chicken strips." },
      { name: "Chicken Cantonese Soup", price: "140", description: "Cantonese clear chicken broth accented with subtle white pepper and sesame oil." },
      { name: "Chicken Tomyum Soup", price: "140", description: "Spicy, tangy and aromatic Thai chicken soup with classic citrus herbs." },
      { name: "Chicken Clear Soup", price: "140", description: "Nourishing, light-bodied standard clear soup with boiled chicken cubes." }
    ]
  },
  {
    categoryName: "Starters",
    items: [
      // Veg Starters
      { name: "Veg Manchuriya (Dry & Wet)", price: "190", description: "Crisp vegetable balls tossed in dynamic garlic, ginger, and soy glaze.", isPopular: true },
      { name: "Spicy Veg Starter", price: "190", description: "Stir fried field fresh veggies with local dry red pepper seasonings." },
      { name: "Veg Kumbhaji", price: "220", description: "Traditional batter-coated fried crispy vegetable cluster balls." },
      { name: "Chilli Baby Corn", price: "220", description: "Tender fried baby corn spears tossed with fresh capsicum, onions, and chillies." },
      { name: "Crispy Baby Corn", price: "220", description: "Golden fried, light and crispy seasoned baby corn fingers." },
      { name: "Veg Spring Roll", price: "190", description: "Perfectly rolled golden skins stuffed with seasoned sautéed julienne vegetables." },
      { name: "Mushroom Salt & Pepper", price: "210", description: "Crisp fried fresh button mushrooms wok-tossed with crushed black pepper and sea salt." },
      { name: "Dragon Mushroom", price: "240", description: "Fiery red mushrooms stir-fried with sweet and spicy dragon sauces." },
      { name: "Chilli Mushroom (Dry & Wet)", price: "240", description: "Fresh button mushrooms cooked with fiery capsicum and spicy soy chilli mix." },
      { name: "Mushroom Manchuria", price: "230", description: "Chunky mushrooms cooked in flavorful coriander and light garlic Manchurian gravies." },
      { name: "Paneer 65", price: "230", description: "Rich cubical paneer marinated in local spices, deep fried and yogurt-tempered.", isPopular: true },
      { name: "Crispy Paneer", price: "250", description: "Double-coated crunchy paneer chunks infused with special aromatic spices." },
      { name: "Spicy Paneer Starter", price: "250", description: "Sizzling paneer cubes wok-tossed in ultra-hot red chilli paste." },
      { name: "Paneer Manchuria", price: "250", description: "Soft paneer cubes seasoned and served dry/wet in Manchurian glaze." },
      { name: "Apollo Paneer", price: "250", description: "Our special paneer cubes tossed in tangy, spicy yogurt curry leaf sauce." },
      { name: "Paneer Majestic", price: "260", description: "Strips of fresh cottage cheese marinated, deep-fried and glazed in yellow cream curd spice sauce.", isPopular: true },
      { name: "Veg Sizzler", price: "260", description: "A hot sizzling platter of grilled vegetables, paneer steak, and fries." },
      { name: "Veg Halaking", price: "430", description: "Our premium signature royal vegetable dumpling kebab, double baked." },
      { name: "Crispy Corn", price: "210", description: "Sweet corn kernels coated in starch, fried crisp, and tossed with spring onions and dry spices." },
      { name: "Green Tikki", price: "230", description: "Healthy shallow-fried pan patties made of paneer, spinach, and green peas." },
      { name: "Golden Baby Corn", price: "220", description: "Deep-fried batter-dipped whole baby corns served with spicy dip." },
      // Non-Veg Starters
      { name: "Egg Spring Roll", price: "200", description: "Crunchy wrapper rolls filled with spicy scrambled egg and vegetables." },
      { name: "Chilli Chicken (Dry & Wet)", price: "280", description: "Boneless chicken pieces tossed with green chillies, onions, and vibrant soy glaze.", isPopular: true },
      { name: "Chicken 65", price: "280", description: "Classic spicy, deep-fried chicken starter originating from south India, tempered in chili and yogurt.", isPopular: true },
      { name: "Chicken Manchuria", price: "270", description: "Diced chicken wok-tossed in garlic-onion sauce." },
      { name: "Chicken Spring Roll", price: "260", description: "Crisp golden wraps filled with tasty minced hot chicken." },
      { name: "Chicken Majestic", price: "300", description: "Shredded chicken dry strips cooked with rich yogurt, green chillies, and curry leaves.", isPopular: true },
      { name: "Chicken 555", price: "300", description: "Richly red-spiced garlic chicken strips garnished with cashew nuts." },
      { name: "Chicken 777", price: "300", description: "Fabulous fried chicken fingers glazed with local special green chili-garlic paste." },
      { name: "Dragon Chicken", price: "300", description: "Succulent thin chicken strips wok-tossed in sweet cashew, honey, and chilli sauce." },
      { name: "Chicken Lollipop", price: "300", description: "Succulent chicken drumettes shaped into lollipops, fried crisp, served with hot Sichuan dip.", isPopular: true },
      { name: "Cashewnut Chicken Starter", price: "330", description: "Fried chicken chunks and toasted whole cashews tossed with rich garlic sauce." },
      { name: "Chicken Sizzler", price: "340", description: "Sizzling iron plate loaded with grilled chicken steaks, tossed vegetables, and sauce." },
      { name: "Cheesy Crispy Chicken", price: "310", description: "Gently battered crunchy chicken breast bites topped with melting hot cheese." },
      { name: "Rayalaseema Pepper Chicken", price: "310", description: "Crushed black pepper, curry leaves, and tender chicken slow-cooked the traditional Andhra dry way.", isPopular: true },
      { name: "Crunchy Chicken", price: "310", description: "Golden crumb-coated crispy chicken tenders." },
      { name: "Chilli Garlic Chicken", price: "330", description: "Very hot and garlicky fried chicken cubes." },
      { name: "Slice Chicken", price: "310", description: "Perfectly sliced lean chicken breast stir-fried with seasonal herbs." },
      { name: "Chicken Drumsticks", price: "330", description: "Fleshy bone-in leg pieces deep fried and glazed with spicy red sauce." },
      { name: "Ginger Chicken (Dry & Wet)", price: "310", description: "Fragrant fresh ginger roots and garlic cooked with succulent chicken." },
      // Mutton Starters
      { name: "Mutton Fry", price: "380", description: "Succulent mutton pieces pan-fried with caramelized onions and signature spices." },
      { name: "Ginger Mutton", price: "390", description: "Tender bone-in mutton pieces infused with fresh sharp ginger glaze." },
      { name: "Chilli Mutton", price: "410", description: "Boneless juicy lamb bites stir-fried with hot green chilies." },
      { name: "Mutton Manchuria", price: "410", description: "Diced lamb cooked Chinese-style with dark soy and green onion." }
    ]
  },
  {
    categoryName: "Chinese",
    items: [
      { name: "Chilli Prawns", price: "330", description: "Juicy shrimp tossed with green peppers and hot chili sauce." },
      { name: "Salt & Pepper Prawns", price: "330", description: "Lightly dusted prawns wok-tossed with spring onions, salt, and black pepper." },
      { name: "Ginger Prawns", price: "330", description: "Succulent prawns sauteed in sharp aromatic garlic/ginger sauce." },
      { name: "Chilli Garlic Prawns", price: "330", description: "Stir-fried prawns in rich red chili paste and fried crushed garlic." },
      { name: "Pepper Prawns", price: "330", description: "Shrimps pan-fried in hot freshly ground peppercorns." },
      { name: "Golden Fried Prawns", price: "330", description: "Batter-coated golden fried prawns served with sweet sweet-chili dip." },
      { name: "Loose Prawns", price: "330", description: "Extremely popular crispy batter fried shrimp dry snack seasoned with local spices.", isPopular: true },
      { name: "Loose Crab", price: "330", description: "De-shelled crispy fried crab meat seasoned with black pepper." },
      { name: "Ginger Crab", price: "330", description: "Crab claws wok-tossed with garlic, onion, and fresh ginger juice." },
      { name: "Schezwan Crab", price: "330", description: "Crab legs tossed cooked in authentic fiery red Schezwan pepper sauce." },
      { name: "Red Pepper Crab", price: "330", description: "Whole crab portions stir fried with bell peppers and roasted red chillies." },
      { name: "Chilli Crab", price: "330", description: "Crab chunks cooked in spicy sweet and sour tomato chili gravy." },
      { name: "Chilli Hot Sizzler", price: "330", description: "Sizzling fresh selection of prawns and squid in fiery oyster garlic sauce." },
      { name: "Chilli Slice Fish Sizzler", price: "510", description: "Elite premium fish filet served sizzling hot with heavy soy, garlic, and greens." },
      { name: "Apollo Fish", price: "360", description: "A famous Hyderabadi special recipe - fried boneless fish chunks tossed in spicy, tangy curd-based temper.", isPopular: true },
      { name: "Chilli Garlic Fish", price: "330", description: "Boneless fish pieces tossed with crisp garlic flakes and fresh chillies." },
      { name: "Ginger Fish (Dry & Wet)", price: "330", description: "Wok cooked juicy fish cubes flavored natively with hand ground ginger paste." },
      { name: "Fish Manchuria (Dry & Wet)", price: "330", description: "Crisp batter-friend fish bites drenched in dynamic coriander onion Manchurian soy sauce." },
      { name: "Chilli Fish (Dry & Wet)", price: "310", description: "Spicy stir-fried fish cubes with peppers and hot red chilli sauce." }
    ]
  },
  {
    categoryName: "Fried Rice",
    items: [
      { name: "Veg Fried Rice", price: "170", description: "Soft basmati rice cooked with finely chopped green carrots, beans, and light soy seasoning." },
      { name: "Schezwan Veg Fried Rice", price: "200", description: "Stir-fried rice with field vegetables, tossed in signature fiery in-house Schezwan sauce." },
      { name: "Mix Veg Fried Rice", price: "220", description: "Generously loaded with assorted hand-picked garden vegetables, paneer and sweet corn." },
      { name: "Paneer Fried Rice", price: "210", description: "Fluffy rice wok-fried with colorful capsicums and soft spiced paneer cubes." },
      { name: "Kaju Fried Rice", price: "210", description: "Richly satisfying veggie fried rice loaded with whole toasted premium golden cashews.", isPopular: true },
      { name: "Jeera Rice", price: "180", description: "Basmati rice tempered with ghee, roasted cumin seeds, and freshly chopped coriander." },
      { name: "Mushroom Fried Rice", price: "210", description: "Stir-fried rice with freshly sliced field button mushrooms with green onions." },
      { name: "Corn Fried Rice", price: "210", description: "Sweet golden corn kernels tossed with seasoned rice." },
      { name: "Manchurian Fried Rice", price: "230", description: "Wok rice tossed with minced vegetable Manchurian pieces." },
      { name: "Curd Rice", price: "100", description: "Traditional soothing Southern comfort food of soft-cooked rice mixed with creamy curd and toasted mustard tempering." },
      { name: "Special Curd Rice", price: "120", description: "Our elite curd rice fortified with fresh pomegranate seeds, cashew nuts, grapes, and heavy creamy texture." },
      { name: "Chicken Fried Rice", price: "240", description: "Classic authentic wok fried rice with seasoned fresh egg, chicken shreds, and spring onions.", isPopular: true },
      { name: "Schezwan Chicken Fried Rice", price: "259", description: "Spicy basmati rice stir fried with tender chicken shreds and eggs in hot Schezwan paste." },
      { name: "Mixed Fried Rice", price: "270", description: "The ultimate combo! Fried rice loaded with chicken, mutton, egg, prawns and rich spices.", isPopular: true },
      { name: "Chicken Manchuria Fried Rice", price: "259", description: "Unique fusion rice featuring diced chicken Manchurian cubes tossed directly in the rice." },
      { name: "Egg Fried Rice", price: "210", description: "Simple street-style authentic fried rice containing heavy scrambled egg curds." },
      { name: "Schezwan Egg Fried Rice", price: "230", description: "Egg-scrambled basmati rice tossed with hot and spicy Schezwan stir-fry oil." }
    ]
  },
  {
    categoryName: "Noodles",
    items: [
      { name: "Veg Soft Noodles", price: "190", description: "Wok-cooked soft Hakka noodles tossed with healthy julienne carrots, cabbage, and peppers." },
      { name: "Schezwan Soft Noodles", price: "200", description: "Spicy stir-fried soft noodles tossed in our special garlic-chilli Schezwan sauce." },
      { name: "Mix Veg Soft Noodles", price: "210", description: "Combination noodle platter loaded with garden veggies, mushrooms, and paneer bits." },
      { name: "Hakka Soft Noodles", price: "230", description: "Mildly seasoned genuine style Chinese soft noodles tossed with light spring onions and sesame oil." },
      { name: "Veg Fry Noodles", price: "240", description: "Slightly pan-crisped fried noodles topped with rich mixed vegetable brown gravy." },
      { name: "Chicken Soft Noodles", price: "230", description: "Wok-tossed stir noodles rich with delicious chicken shreds, eggs, and local spices.", isPopular: true },
      { name: "Schezwan Chicken Soft Noodles", price: "240", description: "Peppery wok noodles seasoned with chicken strips in very hot Schezwan paste." },
      { name: "Mixed Non Veg Noodles", price: "240", description: "Luxury combo of soft noodles loaded with egg, tender chicken, lamb, and shrimp.", isPopular: true }
    ]
  },
  {
    categoryName: "Veg Curries",
    items: [
      { name: "Mix Veg Curry", price: "200", description: "A colorful assortment of seasonal fresh vegetables simmered in a spiced onion-tomato gravy." },
      { name: "Veg Chatpat", price: "210", description: "Tangy and medium-spiced vegetable gravy infused with dried mango powder." },
      { name: "Plain Palak", price: "189", description: "Smooth seasoned spinach puree slow-cooked with fresh garlic cloves and butter." },
      { name: "Palak Paneer", price: "210", description: "Soft cubes of cottage cheese dipped in comforting creamy spiced fresh spinach gravy." },
      { name: "Paneer Butter Masala", price: "220", description: "Globally loved rich and sweet tomato-cashew creamy gravy with soft paneer slices and real butter.", isPopular: true },
      { name: "Kadai Veg", price: "220", description: "Sautéed vegetables and colored bell peppers cooked in traditional iron kadai with freshly-pounded kadai masala." },
      { name: "Capsicum Mushroom", price: "220", description: "Plump fresh white mushrooms and crisp green peppers cooked in semi-dry gravy." },
      { name: "Paneer Baby Corn Curry", price: "230", description: "Combination of tender baby corn shoots and soft paneer in creamy onion gravy." },
      { name: "Tomato Curry", price: "170", description: "Traditional home-style sour tomato stew cooked with mustard seeds and curry leaves." },
      { name: "Tomato Cashew", price: "220", description: "Luxurious creamy sweet tomato gravy topped with fried whole premium cashew nuts." },
      { name: "Veg Kolhapuri", price: "220", description: "Extremely fiery and highly spiced mixed vegetable curry from Kolhapur, Maharashtra." },
      { name: "Veg Jaipuri", price: "220", description: "Mouthwatering rich Rajasthani veg curry topped with papad rolls and cream." },
      { name: "Veg Palmuri", price: "230", description: "Our local special blend curry with hand ground country spices and fresh vegetables." },
      { name: "Ulavacharu Veg Curry", price: "230", description: "Traditional thick fermented horse gram soup curry - highly rich, sour, and comforting.", isPopular: true },
      { name: "Veg Avakai Curry", price: "220", description: "Unique spicy curry spiced with classic Andhra mango pickle flavors." },
      { name: "Dal Fry", price: "150", description: "Creamy cooked yellow pigeon peas garnished with light spices." },
      { name: "Dal Tadka", price: "179", description: "Smooth yellow lentils tempered with ghee, dry red chillies, garlic cloves, and cumin." },
      { name: "Dal Palak", price: "179", description: "Wholesome combination of cooked yellow yellow split dal with fresh baby spinach." },
      { name: "Tomato Dal", price: "179", description: "Native Andhra recipe (Pappu) of yellow split lentils cooked soft with sour tomatoes and chili." },
      { name: "Capsicum Dal", price: "179", description: "Unique yellow dal curry flavored with crunchy green green peppers." },
      { name: "Gongura Dal", price: "200", description: "Very authentic Andhra sour formulation - dal cooked with fresh red sorrel leaves.", isPopular: true },
      { name: "Aloo Sweet Corn Curry", price: "179", description: "Soft boiled potatoes and sweet corn cooked in rich buttery yellow curry." },
      { name: "Mushroom Masala", price: "210", description: "Button mushrooms pan cooked with fine chopped onion tomato gravy." },
      { name: "Capsicum Curry", price: "220", description: "Green bell pepper halves cooked in traditional peanut sesame-sesame seed gravy." },
      { name: "Cashewnut Curry", price: "260", description: "Royal rich luxury cashew based gravy containing toasted whole cashews in cream.", isPopular: true },
      { name: "Methi Chaman", price: "230", description: "Kashmiri sweet-scented fresh fenugreek leaves and cottage cheese cooked with cream." },
      { name: "Methi Veg", price: "230", description: "Finely chopped bitter-sweet fresh fenugreek cooked with dynamic mixed vegetables." },
      { name: "Gobi Masala", price: "170", description: "Sautéed cauliflower florets cooked with comforting ginger-garlic paste." },
      { name: "Aloo Gobi Curry (Masala)", price: "180", description: "Potatoes and cauliflower sautéed together in solid dry Indian spices." },
      { name: "Veg Dopiyaza", price: "220", description: "Mixed veggies cooked with a double amount of diced and pureed caramelized onions." },
      { name: "Kadai Paneer", price: "230", description: "Paneer cubes and colorful capsicum cooked natively in freshly ground dry coriander seeds masala.", isPopular: true },
      { name: "Cashew Paneer Curry", price: "270", description: "The ultimate kingly vegetarian main - cottage cheese cubes and premium cashews in golden rich cream sauce." }
    ]
  },
  {
    categoryName: "Non-Veg Curries",
    items: [
      // Chicken Curries
      { name: "Chicken Curry (Bone/Boneless)", price: "250", description: "Authentic Indian home-style chicken stew cooked with chef's specialty spices." },
      { name: "Andhra Chicken Curry", price: "260", description: "Very fiery, hot, and richly spiced traditional bone-in chicken curry originating natively from Andhra Pradesh.", isPopular: true },
      { name: "Chicken Masala", price: "260", description: "Thick, brown colored slow-cooked spicy chicken dry masala." },
      { name: "Kadai Chicken", price: "270", description: "Bone-in chicken slow-cooked with thick bell peppers, onions and crushed black coriander seeds in round kadai." },
      { name: "Chicken Kolhapuri", price: "260", description: "Extremely spicy, red-hot mutton/chicken curry made of robust hand-roasted Kolhapuri spices." },
      { name: "Chicken Dopiyaza", price: "270", description: "Juicy chicken cubes cooked with crisp cubed boiled onions and mild herbs." },
      { name: "Chicken Chettinad", price: "270", description: "Peppery, authentic Tamil Nadu recipe of chicken simmered in dry roasted coconut and star anise gravy." },
      { name: "Chicken Mughlai", price: "300", description: "Premium, mildly sweet royal rich gravy featuring shredded chicken and whisked eggs yolk." },
      { name: "Butter Chicken", price: "310", description: "Iconic sweet, creamy tomato-rich orange gravy loaded with tandoor grilled chicken chunks finished with real heavy cream.", isPopular: true },
      { name: "Gongura Chicken Roast Curry", price: "260", description: "Andhra special - sour tangy red sorrel leaves paste cooked with juicy masala chicken.", isPopular: true },
      { name: "Palamuri Chicken Curry", price: "310", description: "Local chef's specialty - intensely spicy, roasted coriander and country chicken recipe." },
      { name: "Shahi Chicken Curry", price: "290", description: "Mughlai style rich almond-cashew white gravy with chicken chunks." },
      { name: "Chicken Chatpat", price: "290", description: "Succulent boneless chicken pieces cooked with tang of tamarind and dry mango." },
      { name: "Chicken Tikka Masala", price: "310", description: "Succulent charcoal clay oven-roasted chicken tikka cubes simmered in spicy red tomato onion gravy." },
      { name: "NTR Ruchulu Kodikura", price: "310", description: "Our supreme house signature specialty named after legendary taste. Intensely flavorful, rich country chicken curry.", isPopular: true },
      { name: "Pachimirchi Kodikura", price: "310", description: "Spicy and delicious country style chicken cooked with purely green chili salsa paste." },
      // Mutton Curries
      { name: "Mutton Rogan Josh", price: "410", description: "Kashmiri classic - tender lamb cooked in royal aromatic saffron root oil and dried red chillies." },
      { name: "Mutton Chilli Curry", price: "410", description: "Fiery mutton pieces tossed with green chillies in a thick onion gravy." },
      { name: "Mutton Gongura Curry", price: "410", description: "Tender goat cooked with tangy sour sorrel leaves - highly recommended Andhra delicacy.", isPopular: true },
      { name: "Mutton Avakaya Curry", price: "390", description: "Bone-in lamb pieces cooked with traditional mango pickle masala." },
      { name: "Mutton Red Chilli Curry", price: "410", description: "Warm, spicy, and extremely hot lamb slow-cooked with pure Guntur red chili paste." },
      { name: "Palamuri Mutton Curry", price: "370", description: "Spiced country lamb slow-cooked with traditional local dried coconut shreds." },
      { name: "Ulavacharu Mutton Curry", price: "410", description: "Ultra elite local dish of mutton slow-cooked inside heavy horse gram soup broth.", isPopular: true },
      { name: "Mutton Masala", price: "410", description: "Thick and highly aromatic, cardamom-scented dry goat meat stew." },
      { name: "Rayalaseema Mutton Curry", price: "410", description: "Robust and fiery hot Rayalaseema styled black pepper mutton curry." },
      { name: "Kolhapuri Mutton Curry", price: "410", description: "Extra spicy rural styled red-hot Kolhapuri lamb stew." },
      { name: "Mutton Dopyaza", price: "410", description: "Juicy mutton stew with chunks of dynamic caramel onions." },
      // Prawns & Fish Curries
      { name: "Prawns Curry", price: "340", description: "Tender fresh-water shrimp simmered in authentic Indian coconut tomato sauce." },
      { name: "Ulavacharu Prawns Curry", price: "370", description: "Elite prawns curry flavored with traditional fermented horse-gram." },
      { name: "Gongura Prawns Curry", price: "340", description: "Spicy prawns cooked with rich sour red sorrel leaves paste." },
      { name: "Prawns Red Chilli Curry", price: "340", description: "Juicy shrimp cooked with extreme red-hot ground spice mixtures." },
      { name: "Fish Curry", price: "330", description: "Traditional Southern style fish curry featuring tamarind water, raw mango slice, and mustard seed.", isPopular: true },
      { name: "Lemon Fish Curry", price: "330", description: "Tangy fresh citrus juice and ginger slow-cooked with boneless fish cubes." },
      { name: "Palamuri Fish Curry", price: "320", description: "Rural themed fish curry cooked with hand ground native spices and coriander." }
    ]
  },
  {
    categoryName: "Biryani",
    items: [
      // Chicken Biryani
      { name: "Chicken Dum Biryani", price: "250", description: "World-famous long-grain basmati rice layered with raw marinated chicken, saffron and slow-cooked in sealed handi.", isPopular: true },
      { name: "Fry Piece Chicken Biryani", price: "260", description: "Fluffy basmati biryani rice topped with freshly fried, spicy crunchy chicken bone-in pieces.", isPopular: true },
      { name: "Boneless Chicken Biryani", price: "280", description: "Aromatic basmati rice cooked layered with tender boneless chicken nuggets in smooth spice style." },
      { name: "Chicken Mughlai Biryani", price: "310", description: "Creamy flavored biryani rice served with cashew gravy and boiled egg drops on top." },
      { name: "Chicken Sahi Biryani", price: "310", description: "Mughlai style sweet-scented biryani layered with nuts, saffron and royal rose water extracts." },
      { name: "Chicken Kolapuri Biryani", price: "310", description: "Highly spicy and peppery red biryani styled from the royal courts of Kolhapur." },
      { name: "Green Chilli Chicken Biryani", price: "310", description: "Teasingly spicy biryani made with chicken cooked in pure green chili salsa." },
      { name: "Red Chilli Chicken Biryani", price: "310", description: "Hot-as-fire red hot Guntur chili chicken biryani layered on basmati rice." },
      { name: "Avakai Chicken Biryani", price: "310", description: "Very unique Andhra fusion: basmati biryani flavored with fiery spicy mango pickle of Andhra Pradesh." },
      { name: "Ulavacharu Chicken Biryani", price: "310", description: "Our best-selling regional masterpiece - biryani rice layered with dark rich horse-gram cream soup.", isPopular: true },
      { name: "Palamuri Chicken Biryani", price: "310", description: "Traditional native spicy coriander flavored chicken biryani." },
      { name: "Chicken Tikka Biryani", price: "320", description: "Tender boneless clay tandoor chicken tikka cubes layered with spiced basmati rice." },
      { name: "Kalmi Biryani", price: "330", description: "Royal majestic plate - clay oven grilled tender chicken drumsticks layered inside premium biryani rice.", isPopular: true },
      { name: "Malai Chicken Tikka Biryani", price: "330", description: "Creamy and sweet-scented malai grilled chicken tikka layered with rich saffron rice." },
      { name: "Chicken Ghee Roast Boneless Biryani", price: "330", description: "Elite boneless chicken cubes ghee-roasted in rich Mangalorean style, topped on basmati rice.", isPopular: true },
      { name: "Lolly Pop Biryani", price: "320", description: "Unique delicious kid-favorite combo: spiced biryani rice served with crisp golden chicken lollipops." },
      // Mutton Biryani
      { name: "Mutton Ghee Dum Biryani", price: "410", description: "Premium long grain basmati rice and fall-off-the-bone tender lamb rich with pure deshi ghee, slow dum baked.", isPopular: true },
      { name: "Mutton Fry Biryani", price: "410", description: "Flavored biryani basmati rice topped with spicy pan-fried bone-in mutton pieces." },
      { name: "Mutton Sahigosh Biryani", price: "420", description: "Rich royal formulation featuring almond gravy mutton chunks layered inside saffron rice." },
      { name: "Mutton Gongura Biryani", price: "410", description: "Andhra delicacy - sour tangy sorrel leaf mutton layered with fragrant basmati.", isPopular: true },
      { name: "Mutton Avakai Biryani", price: "410", description: "Pickle infused spicy marinated mutton layered elegantly inside biryani." },
      { name: "Ulavacharu Mutton Biryani", price: "410", description: "Top drawer culinary specialty - deep brown horse gram sauce mutton biryani.", isPopular: true },
      { name: "Mutton Ghee Roast Biryani", price: "420", description: "Tender goat cooked with heavy spices and real ghee, slow dum baked with biryani rice." },
      { name: "Mutton Keema Biryani", price: "420", description: "Minced spiced mutton keema cooked as masala, layered in rice with boiled egg slices." },
      { name: "Palamuri Mutton Biryani", price: "420", description: "Regional aromatic country styled mutton biryani cooked slow in handi." },
      // Veg Biryani
      { name: "Baby Corn Veg Biryani", price: "230", description: "Tender sweet baby corn cuts cooked in gravy and layered with basmati." },
      { name: "Mushroom Veg Biryani", price: "230", description: "Aromatic button mushrooms cooked in yogurt and layered under rice." },
      { name: "Paneer Baby Corn Veg Biryani", price: "250", description: "Double delight combo of soft paneer cubes and baby corn strands cooked in rich spices." },
      { name: "Paneer 65 Veg Biryani", price: "250", description: "Crunchy paneer 65 cubes loaded heavily inside hot aromatic biryani rice." },
      { name: "Paneer Tikka Veg Biryani", price: "280", description: "Smoky tandoor charcoal clay oven skewered paneer cubes layered with biryani rice.", isPopular: true },
      { name: "Ulavacharu Veg Biryani", price: "240", description: "Rare vegetarian delicacy - rich horse gram cream baked with spring veggies." },
      { name: "Veg Biryani", price: "210", description: "Gently spiced basmati rice steam-cooked containing select carrots, beans and potato chunks." }
    ]
  },
  {
    categoryName: "Tandoori",
    items: [
      { name: "Tandoori Chicken (Half/Full)", price: "290", description: "Classic orange skin chicken marinated beautifully in thick spiced curd, skewered on hot charcoal clay oven.", isPopular: true },
      { name: "Tangdi Kebab (Half/Full)", price: "170", description: "Fleshy bone-in chicken leg quarters coated with signature ground spices and tandoor baked." },
      { name: "Chicken Tikka", price: "320", description: "World classic chunk chicken breast marinated in yogurt and grilled nicely till charred." },
      { name: "Chicken Haryali Kebab", price: "330", description: "Cool and spicy mint-coriander paste coated chicken breast chunks charcoal baked." },
      { name: "Achari Chicken Tikka", price: "330", description: "Fiery sour mango pickle spice marinated succulent chicken tikkas.", isPopular: true },
      { name: "Chicken Seekh Kebab", price: "360", description: "Minced chicken seasoned with fresh green herbs, wrapped around hot iron rods and grilled." },
      { name: "Murgh Mastana Kebab", price: "340", description: "Chef's special double-spiced tender chicken breast with melting butter topping." },
      { name: "Pahadi Kebab", price: "330", description: "Rustic mountain style emerald green marinade with spinach, mint, and cilantro." },
      { name: "Murgh Malai Kebab", price: "330", description: "Velvety mild white marinade of cardamom, cream, cheese, and cashew paste.", isPopular: true },
      { name: "Chicken Banjara Kebab", price: "350", description: "Nomadic style robust pepper and yellow spice coated roasted chicken thighs." },
      { name: "Mutton Seekh Kebab", price: "410", description: "Juicy minced goat meat infused with hot green spices, cumin, and onion, skewered nicely.", isPopular: true },
      { name: "Prawn Tikka", price: "330", description: "Large tiger prawns marinated in classic red tandoor spices, tandoor grilled." },
      { name: "Fish Tikka", price: "330", description: "Boneless fresh fish cubes marinated in yellow mustard oil and clay oven baked." },
      { name: "Veg Platter", price: "460", description: "Fabulous large grazing board with paneer tikka, hara bhara kebab, seekh kebab and tandoori mushroom parts.", isPopular: true },
      { name: "Chicken Platter", price: "600", description: "Ultimate royal feast of Haveli: contains tandoori chicken, chicken tikka, seekh kebab, pahadi, and yellow malai, served with visual fire.", isPopular: true }
    ]
  },
  {
    categoryName: "Indian Breads",
    items: [
      { name: "Plain Roti", price: "30", description: "Healthy whole wheat flour round bread cooked inside clay oven tandoor." },
      { name: "Butter Roti", price: "35", description: "Hot clay-oven whole wheat flatbread glazed with melting golden butter." },
      { name: "Naan", price: "35", description: "Classic fine refined flour soft puffy bread dry-baked in clay oven." },
      { name: "Butter Naan", price: "40", description: "Soft, puffy refined flour bread glazed beautifully with delicious butter.", isPopular: true },
      { name: "Garlic Naan", price: "60", description: "Infused with chopped fresh garlic cloves and butter - our absolute top seller.", isPopular: true },
      { name: "Keema Naan", price: "150", description: "Decadent wheat bread stuffed with minced, cooked and highly aromatic mutton keema." },
      { name: "Kashmiri Naan", price: "150", description: "Sweet rich refined flour naan baked packed with dried raisins, cherries, almonds, and cashew dust." },
      { name: "Masala Kulcha", price: "60", description: "Wheat bread stuffed with spicy mashed potato, onion and black cumin seasoning." },
      { name: "Paneer Kulcha", price: "70", description: "Hot puffy flatbread loaded with delicious spiced cottage cheese crumble." },
      { name: "Pulka (Per Piece)", price: "15", description: "Home-style puffed whole wheat thin soft bread cooked on direct flame." },
      { name: "Roti Basket", price: "220", description: "Assorted display basket containing plain roti, butter naan, garlic naan, and stuffed kulchas to serve the family.", isPopular: true }
    ]
  },
  {
    categoryName: "Egg Specials",
    items: [
      { name: "Egg Biryani", price: "220", description: "Fragrant saffron basmati rice layered with boiled eggs deep-fried in spicy masala." },
      { name: "Palamuri Egg Biryani", price: "230", description: "Our region special coriander cardamom tempered egg biryani." },
      { name: "Egg Curry", price: "210", description: "Two fried boiled eggs dipped in rich onion-tomato country masala gravy." },
      { name: "Egg Buji", price: "100", description: "Dynamic Indian scrambled eggs cooked with fresh chopped chillies, onions, tomatoes and coriander." },
      { name: "Egg 65", price: "220", description: "Crisp batter dipped fried boiled eggs tossed in hot red curd dressing." },
      { name: "Boiled Eggs (3 Pieces)", price: "40", description: "Standard healthy hard-boiled farm fresh eggs served with pinch of black pepper." }
    ]
  },
  {
    categoryName: "Beverages",
    items: [
      { name: "Haveli Royal Lassi", price: "70", description: "Extremely thick sweet whipped yogurt drink infused with premium cardamom and rose syrup.", isPopular: true },
      { name: "Shahi Masala Chaas", price: "50", description: "Refreshed spiced buttermilk whipped with green chillies, ginger juice, roasted cumin, and black salt." },
      { name: "Fresh Lime Soda (Sweet/Salt)", price: "60", description: "Sparkling soda with hand-squeezed lime juice and customized sweet/salted syrup." },
      { name: "Fruit Punch Mocktail", price: "120", description: "Premium blend of delicious strawberry, mango, pineapple, and apple juices in heavy cream." },
      { name: "Assorted Soft Drinks", price: "40", description: "Chilled cold drinks (Coke, Thums Up, Sprite, Fanta)." },
      { name: "Mineral Water", price: "30", description: "Chilled pure bottled drinking water (1 Litre)." }
    ]
  },
  {
    categoryName: "Desserts",
    items: [
      { name: "Shahi Tukda", price: "120", description: "Genuine Hyderabad Mughal classic: deep fried ghee bread slices soaked in thick saffron rabri reduction, garnished gold foil.", isPopular: true },
      { name: "Double Ka Meetha", price: "100", description: "Warm and delicious native bread pudding cooked meticulously with heavy condensed milk and nuts." },
      { name: "Gulab Jamun with Vanilla Ice Cream", price: "90", description: "Two hot round syrup-soaked soft dumplings served inline with a scoop of premium vanilla ice cream." },
      { name: "Royal Kulfi Falooda", price: "150", description: "Traditional frozen rich kulfi ice-cream served over layers of corn-starch vermicelli, sweet basil seeds and rose milk.", isPopular: true }
    ]
  },
  {
    categoryName: "Others",
    items: [
      { name: "Roasted Papad (2 Pcs)", price: "35", description: "Crispy thin lentil flour rounds roasted in open tandoor." },
      { name: "Masala Papad (2 Pcs)", price: "50", description: "Topped with fine chopped tomatoes, onions, coriander, lime juice, and chaat spices." },
      { name: "Assorted Green Salad", price: "65", description: "Fresh garden slices of cucumber, carrot, tomato, onion and green green peppers." }
    ]
  }
];

// Structured Database JSON Output
export const structuredJsonOutput = {
  restaurant_name: RESTAURANT_NAME,
  rating: "4.0/5 based on 383 Google reviews",
  menu: menuCategories.reduce((acc, cat) => {
    acc[cat.categoryName.toLowerCase().replace(/\s+/g, "_")] = cat.items.map(item => ({
      name: item.name,
      price: `Rs. ${item.price}`
    }));
    return acc;
  }, {} as Record<string, { name: string; price: string }[]>)
};

// SEO Metadata and website copy
export const seoContent = {
  metaTitle: "Haveli Banquet Hall And Restaurant - Authentic Royal Dining",
  metaDescription: "Welcome to Haveli Banquet Hall And Restaurant. Savor our exquisite authentic biryani, clay tandoor starters and traditional Coastal curries. Rated 4.0/5 with 383 reviews. Book table today!",
  seoKeywords: "Haveli Banquet Hall And Restaurant, Haveli Banquet Hall, Haveli Restaurant, restaurants in Markapur, luxury dining Markapur, authentic biryani, banquet hall near me, tandoori chicken, Ulavacharu biryani",
  restaurantDescription: "Haveli Banquet Hall And Restaurant is Markapur's premier dining and celebrations destination, celebrated for its state-of-the-art golden red Royal Mughal themes, visual grandeur, and exquisite authentic taste. Spanning a massive area with a premium multi-cuisine menu and elegant spacious banquet facilities, we carry the legacy of fine Indian culinary heritage. Every dish is cooked by experienced native chefs using hand-pounded spices, cold-pressed oils, and high-quality local ingredients.",
  
  overviewText: "Nestled Opp. RTC Bus stand (Register Office Line, N.S Nagar) in Markapur, Haveli Banquet Hall And Restaurant stands as a majestic beacon of architectural grandeur and epicurean legacy. Melding royal Indian 'Haveli' themes with burgundy-red high-contrast luxury, this landmark has earned an impressive 4.0/5 Google Rating from 383 passionate local reviewers. With dual-functioning capabilities as an upscale family diner and a spacious, premium high-capacity banquet hall, it caters to everything from intimate candlelight dinners to grand golden wedding parties. Our multi-cuisine kitchen specializes in charcoal-baked clay tandoor starters, authentic Hyderabadi dum biryani, and legendary local Andhra masterpieces (such as NTR Ruchulu Kodikura and fermented Horse Gram 'Ulavacharu' gravies). Discover a celebration space where heritage meets culinary precision, offering an unforgettable royal experience.",

  topRecommended: [
    { name: "Ulavacharu Chicken/Mutton Biryani", price: "310 - 410", description: "Our ultimate house specialty, cooked with rich fermented horse-gram cream and long-grain premium basmati." },
    { name: "NTR Ruchulu Kodikura", price: "310", description: "An intensely rich, robust, peppery rustic country-chicken curry cooked slow in clay handis." },
    { name: "Haveli Chicken Platter", price: "600", description: "A fiery grand display board containing 5 distinct varieties of charcoal tandoor baked kebabs." },
    { name: "Loose Prawns", price: "330", description: "Extraordinarily popular crispy fried spiced coastal shrimp, dry tempered in chili-garlic oil." }
  ],
  bestVegDishes: [
    { name: "Paneer Majestic", price: "260", description: "Cottage cheese ribbons double-baked and glazed with golden cream yogurt masala." },
    { name: "Paneer Butter Masala", price: "220", description: "Mildly sweet cashew-rich tomato cream base gravy served with melting butter pats." },
    { name: "Cashewnut Paneer Curry", price: "270", description: "Decadent cream-simmered curry loaded with soft cottage cheese and whole roasted cashews." }
  ],
  bestNonVegDishes: [
    { name: "Chicken Ghee Roast Boneless Biryani", price: "330", description: "Fluffy fragrant rice combined with high-spiced boneless chicken slow-roasted in pure country ghee." },
    { name: "Mutton Ghee Dum Biryani", price: "410", description: "Royal goat meat cooked together with basmati under tightly sealed wheat-dough dum lids." },
    { name: "Rayalaseema Pepper Chicken", price: "310", description: "Peppery bone-in chicken slow dried with curry leaves and black peppercorn." }
  ],
  familyDiningSuitability: "With high-capacity bento-style luxury seating, specialized hand-washing clusters, soundproof ceiling aesthetics, and kid-neutral non-spicy food choices (like butter naan and paneer butter masala), Haveli is exceptionally rated as the #1 family dining restaurant in the whole district.",
  budgetEstimateForTwo: {
    budget: "Rs. 400 - 500",
    midRange: "Rs. 600 - 800",
    premium: "Rs. 1000 - 1200",
    description: "An average highly fulfilling meal for 2 people costs approximately Rs. 700. For light budget seekers, a Veg Pulao (Rs. 199) and cold lassi can feed two for under Rs. 400. For an premium multi-course feast (starters, main, breads & dessert), expect Rs. 1000-1200."
  },
  faqs: [
    {
      q: "Is there a dedicated parking space available at Haveli?",
      a: "Yes! Haveli Banquet Hall And Restaurant provides free spacious parking for over 50 cars and 100+ two-wheelers with round-the-clock secure guard surveillance."
    },
    {
      q: "What is the maximum capacity of Haveli Banquet Hall?",
      a: "Our state-of-the-art golden themed banquet hall can comfortably host and cater up to 400-500 guests simultaneously, optimized with premium air conditioning and sound configurations."
    },
    {
      q: "Can we customize the spice levels of the dishes?",
      a: "Absolutely! Our royal chefs specialize in customized cooking. While placing your order or booking, you can mention your preference: Mild, Medium, or Authentic Andhra Hot."
    },
    {
      q: "Does Haveli provide home delivery or catering?",
      a: "Yes, we accept bulk outdoor catering orders for weddings, birthdays, and corporate events. We are also live on local delivery platforms."
    }
  ]
};

// JSON-LD Schema
export const jsonLdSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Restaurant",
      "@id": GOOGLE_MAPS_URL,
      "name": RESTAURANT_NAME,
      "image": [
        "https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&q=80",
        "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=1200&q=80"
      ],
      "url": GOOGLE_MAPS_URL,
      "telephone": "+91-99850-84847, +91-79815-62535, +91-70132-20053",
      "priceRange": "$$",
      "menu": GOOGLE_MAPS_URL,
      "servesCuisine": ["North Indian", "South Indian", "Mughlai", "Biryani", "Chinese"],
      "acceptsReservations": "true",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Opp. RTC Bus stand, Register Office Line, N.S Nagar",
        "addressLocality": "Markapur",
        "addressRegion": "Andhra Pradesh",
        "postalCode": "523316",
        "addressCountry": "IN"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.0",
        "reviewCount": "383",
        "bestRating": "5",
        "worstRating": "1"
      }
    },
    {
      "@type": "LocalBusiness",
      "name": RESTAURANT_NAME,
      "image": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Opp. RTC Bus stand, Register Office Line, N.S Nagar",
        "addressLocality": "Markapur",
        "addressRegion": "Andhra Pradesh",
        "postalCode": "523316",
        "addressCountry": "IN"
      },
      "url": GOOGLE_MAPS_URL,
      "rating": {
        "@type": "Rating",
        "ratingValue": "4.0"
      }
    }
  ]
};

// Marketing Suggestions
export const marketingSuggestions = {
  blogTopics: [
    "The Secret History of Hyderabad Dum Biryani and the Royalty of Haveli",
    "Why Ulavacharu (Horse Gram Soup) Biryani is Taking the Region by Storm",
    "Hosting the Ultimate Wedding Party: A Look inside Haveli's Golden Banquet Hall",
    "Vegetarian Foodies' Delight: Top 7 Paneer & Cashew Main-Courses at Haveli",
    "How We Hand-Grind Our Secret spices at Haveli Restaurant: Back to Rural Methods",
    "The Art of the Clay Oven: Journey of our Spiced Tandoori Chicken from Clay to Flame",
    "Fulfilling Kids and Elders Alike: Why family get-togethers are Best Spent at Haveli",
    "Health and Taste Combos: Discovering the benefits of Dal Palak and Jeera Rice",
    "Top 5 Spicy Seafood Curries You Must Try on the Coastal Andhra Highway",
    "Celebrating Indian Festivals: What's on Haveli Restaurant's Festive Specials Menu This Season"
  ],
  localKeywords: [
    "best restaurants in Markapur",
    "Haveli banquet hall Markapur near highway",
    "where to get authentic dum biryani in Markapur",
    "highly rated non-veg restaurants near Markapur",
    "affordable banquet halls with catering in Markapur",
    "best family diner in Markapur Andhra Pradesh",
    "Haveli restaurant menu card with prices",
    "Ulavacharu chicken biryani online Markapur",
    "tandoori starters near town center",
    "prawns fry and fish curries near me",
    "clean hygienic restaurants near highway",
    "Haveli multi-cuisine menu banquet photo",
    "top rated restaurants Markapur Google reviews",
    "Haveli restaurant phone number for table booking",
    "pure butter naan and paneer butter masala Markapur",
    "party hall capacity Markapur local center",
    "Rayalaseema pepper chicken dry Andhra style",
    "traditional sweet buttermilk lassi Haveli",
    "wedding reception spaces in Markapur",
    "budget friendly meals for couples in Markapur"
  ],
  socialPosts: [
    "✨ Step out of the ordinary and experience royalty. With towering arches, state-of-the-art golden interiors, and aroma that pulls you in. Welcome to Haveli banquet. 🏰👑 #HaveliVibes #MarkapurFood",
    "🔥 Fresh, hot, smoky. Our clay tandoor is blazing to bring you the charred perfection of our special Achari Chicken Tikka! 🍢 Taste it tonight. #TandoorLove #HaveliStarters",
    "🍲 Two words: ULAVACHURU. BIRYANI. The ultimate combination of dark comforting horse-gram cream, and premium long-grain Basmati. 💯 Comment below if you are a fan! #SignatureDish #AndhraTaste",
    "👨‍👩‍👧‍👦 Cherished moments are best celebrated together. Gather your grandparents, toddlers, and cousins for a premium Sunday feast at our family-centric layouts! 🍽️ #FamilyTraditional #HaveliDiaries",
    "🍛 Spices freshly roasted, ghee generously poured, and lamb slow-cooked to melt on your tongue. Our iconic Mutton Ghee Dum Biryani is waiting for you! 🤤 #GheeDum #BiryaniKing",
    "🎉 Planning a wedding, baby shower, or corporate meetup? Let us turn it into a golden memory. Talk to our Banquet managers today! 🏢✨ #HaveliEvents #MarkapurBanquets",
    "🦐 Crispy on the outside, burst-of-flavors on the inside. Experience the highway's best 'Loose Prawns' fried to spectacular gold! 🍤 #SeafoodLove #CoastalHaveli",
    "🧀 Tender paneer cubes marinated in yogurt cream, golden-crisped, and tempered with green chillies. Yes, we are talking about the fan-favorite order: PANEER MAJESTIC! 👑 #VegMajestic #OnlyAtHaveli",
    "🍹 Chill out this summer with our legendary Shahi Masala Chaas and Haveli Royal Lassi! Thick, comforting, and authentic. 🥛❄️ #SummerSips #RoyalLassi",
    "📢 WEEKDAY DEAL: Reserve a table via our online website and get a complimentary portion of hot Shahi Tukda dessert on billing above Rs. 1000! 🍰 Book now! #WeekdayDiscounts #HaveliSpecial"
  ]
};
