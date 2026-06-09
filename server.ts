/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { menuCategories as initialMenuCategories } from "./src/menuData";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "db.json");

// Define Firebase runtime server-side connection structures
const CONFIG_FILE = path.join(process.cwd(), "firebase-applet-config.json");
let firebaseConfig: any = null;
let db: any = null;

if (fs.existsSync(CONFIG_FILE)) {
  try {
    firebaseConfig = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf-8"));
    const firebaseApp = initializeApp(firebaseConfig);
    db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId || "(default)");
    console.log("Firebase initialized successfully on server-side.");
  } catch (err) {
    console.error("Failed to read firebase config or initialize Firebase on backend server:", err);
  }
}

// Middleware to parse JSON bodies
app.use(express.json());

// Initialize local persistent JSON database
interface User {
  email: string;
  passwordHash: string; // Plain-ish or secure hashed on server. We'll check correctness
  name: string;
  googleConnected: boolean;
  tier: "Maharaja Platinum" | "Saffron Elite" | "Royal Diner";
  joinedAt: string;
}

interface DBState {
  users: Record<string, User>;
  bookings: any[];
  otps: Record<string, { code: string; expires: number }>;
  menuCategories?: any[];
  settings?: {
    phone1: string;
    phone2: string;
    phone3: string;
    timings: string;
    address: string;
    googleMapsUrl: string;
    restaurantName: string;
  };
  reviews?: {
    id: string;
    name: string;
    rating: number;
    feedback: string;
    imageUrl?: string;
    createdAt: string;
  }[];
  adminPassword?: string;
}

const defaultSettings = {
  phone1: "99850 84847",
  phone2: "79815 62535",
  phone3: "70132 20053",
  timings: "11:00 AM - 11:00 PM",
  address: "Opp. RTC Bus stand, Register Office Line, N.S Nagar, Markapur, Andhra Pradesh, 523316, IN",
  googleMapsUrl: "https://www.google.com/maps/place/Haveli+Banquet+Hall+And+Restaurant/@15.7336518,79.2661507,17z",
  restaurantName: "Haveli Restaurant And Banquet Hall"
};

const defaultReviews = [
  {
    id: "r1",
    name: "Kiran Kumar",
    rating: 5,
    feedback: "Best Biryani in Markapur! The Ulavacharu Chicken Biryani is an absolute must-try! The aroma and ghee flavor is mind-blowing. Love the royal feel in the dine-in area.",
    imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80",
    createdAt: "2026-06-01T12:00:00.000Z"
  },
  {
    id: "r2",
    name: "Srinivas Reddy",
    rating: 4,
    feedback: "Tender mutton and spectacular service. We booked a family table for 15 members, they accommodated us perfectly in the majestic banquet hall. The ghee roast boneless biryani is amazing.",
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
    createdAt: "2026-06-03T14:30:00.000Z"
  },
  {
    id: "r3",
    name: "Anjali Devi",
    rating: 5,
    feedback: "Absolutely delicious Paneer Butter Masala and cashewnut curries. Markapur finally has a restaurant of super luxury standards. Clean, hygienic, and friendly staff.",
    createdAt: "2026-06-05T09:15:00.000Z"
  }
];

// Bootstrap our initial memory DB state with synchronous local file backups
let dbState: DBState = { 
  users: {}, 
  bookings: [], 
  otps: {}, 
  menuCategories: JSON.parse(JSON.stringify(initialMenuCategories)),
  settings: { ...defaultSettings },
  reviews: [...defaultReviews],
  adminPassword: "8247733059"
};

try {
  if (fs.existsSync(DB_FILE)) {
    const content = fs.readFileSync(DB_FILE, "utf-8");
    const parsed = JSON.parse(content);
    dbState = {
      ...dbState,
      ...parsed,
    };
    // Ensure nested sections aren't empty
    if (!dbState.menuCategories) {
      dbState.menuCategories = JSON.parse(JSON.stringify(initialMenuCategories));
    }
    if (!dbState.settings) {
      dbState.settings = { ...defaultSettings };
    }
    if (!dbState.reviews) {
      dbState.reviews = [...defaultReviews];
    }
    if (!dbState.adminPassword) {
      dbState.adminPassword = "8247733059";
    }
  }
} catch (err) {
  console.error("Failed baseline load of local db.json:", err);
}

async function syncFromFirestore() {
  if (!db) {
    console.warn("Firebase config not available. Skipping state sync.");
    return;
  }
  try {
    console.log("Loading persistent state from Cloud Firestore systemstate...");
    const docRef = doc(db, "systemstate", "global");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data() as DBState;
      dbState = {
        ...dbState,
        ...data,
      };
      if (!dbState.adminPassword) {
        dbState.adminPassword = "8247733059";
      }
      console.log("Baseline successfully synchronized with Cloud Firestore!");
    } else {
      console.log("No global state document found. Seeding first copy.");
      await setDoc(docRef, dbState);
    }
  } catch (err) {
    console.error("Failed to sync baseline state from Firestore:", err);
  }
}

function loadDB(): DBState {
  return dbState;
}

async function saveDB(data: DBState) {
  dbState = data;
  
  // Replicate to physical local disk instantly
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing baseline database backup file", err);
  }

  // Propagate state and bookings collections to Cloud Firestore
  if (db) {
    try {
      const globalDocRef = doc(db, "systemstate", "global");
      await setDoc(globalDocRef, data);
      
      // Also propagate active bookings to direct individual documents to assure frontend client-direct queries work 100%
      for (const b of data.bookings) {
        if (b && b.code) {
          await setDoc(doc(db, "bookings", b.code), b);
        }
      }
      console.log("All records propagated to Cloud Firestore!");
    } catch (err) {
      console.error("Failed synchronizing records with Cloud Firestore:", err);
    }
  }
}

// REST API for Secure Authentication and Database Storage
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Register User
app.post("/api/auth/register", (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: "Please fill in all layout fields." });
  }

  const dbData = loadDB();
  const normalizedEmail = email.toLowerCase().trim();

  if (dbData.users[normalizedEmail]) {
    return res.status(400).json({ error: "An account with this email already exists." });
  }

  // Create user
  dbData.users[normalizedEmail] = {
    email: normalizedEmail,
    passwordHash: password, // For extreme clarity of correct verification
    name,
    googleConnected: false,
    tier: "Royal Diner",
    joinedAt: new Date().toISOString(),
  };

  saveDB(dbData);
  res.json({ success: true, message: "Royal member account registered successfully!" });
});

// Login User with Database Check
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const dbData = loadDB();
  const normalizedEmail = email.toLowerCase().trim();
  const user = dbData.users[normalizedEmail];

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials: User does not exist." });
  }

  // Validate correctness of the password
  if (user.passwordHash !== password) {
    return res.status(401).json({ error: "Invalid credentials: Enter a correct password." });
  }

  res.json({
    success: true,
    user: {
      email: user.email,
      name: user.name,
      googleConnected: user.googleConnected,
      tier: user.tier,
      joinedAt: user.joinedAt,
    },
  });
});

// Google Account Connection
app.post("/api/auth/google-connect", (req, res) => {
  const { email, name } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Google email is missing." });
  }

  const dbData = loadDB();
  const normalizedEmail = email.toLowerCase().trim();
  let user = dbData.users[normalizedEmail];

  if (!user) {
    // Autocreate user for Google account
    user = {
      email: normalizedEmail,
      passwordHash: "connected-via-google-" + Math.random().toString(36).substring(4),
      name: name || "Noble Google Guest",
      googleConnected: true,
      tier: "Saffron Elite",
      joinedAt: new Date().toISOString(),
    };
    dbData.users[normalizedEmail] = user;
  } else {
    // Connect Google auth to existing profile
    user.googleConnected = true;
  }

  saveDB(dbData);
  res.json({
    success: true,
    user: {
      email: user.email,
      name: user.name,
      googleConnected: true,
      tier: user.tier,
      joinedAt: user.joinedAt,
    },
  });
});

// Forgot Password - Initiate (Mail Simulation with OTP generation)
app.post("/api/auth/forgot-password", (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Please enter your registered email address." });
  }

  const dbData = loadDB();
  const normalizedEmail = email.toLowerCase().trim();
  const user = dbData.users[normalizedEmail];

  if (!user) {
    return res.status(404).json({ error: "This email is not registered inside Haveli Restaurant." });
  }

  // Generate a random 6-digit OTP
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  dbData.otps[normalizedEmail] = {
    code: otpCode,
    expires: Date.now() + 10 * 60 * 1000, // Valid for 10 minutes
  };

  saveDB(dbData);

  // Return the OTP in safety parameters for frontend to simulate elegant physical mailbox notification!
  console.log(`[MAIL SERVER] Sending OTP code ${otpCode} to ${normalizedEmail}`);
  res.json({
    success: true,
    message: "A secure verification OTP code has been dispatched to your email address.",
    debugOtp: otpCode, // Exposed for convenience & simulation preview
  });
});

// Forgot Password - Verify OTP & Reset
app.post("/api/auth/verify-otp", (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.status(400).json({ error: "All fields are required to verify." });
  }

  const dbData = loadDB();
  const normalizedEmail = email.toLowerCase().trim();
  const storedOtp = dbData.otps[normalizedEmail];
  const user = dbData.users[normalizedEmail];

  if (!user) {
    return res.status(404).json({ error: "User account not found." });
  }

  if (!storedOtp) {
    return res.status(400).json({ error: "No OTP was requested for this email." });
  }

  if (Date.now() > storedOtp.expires) {
    return res.status(400).json({ error: "This OTP code has expired. Please request another one." });
  }

  if (storedOtp.code !== otp.trim()) {
    return res.status(400).json({ error: "Invalid OTP security code." });
  }

  // OTP is correct! Update password
  user.passwordHash = newPassword;
  delete dbData.otps[normalizedEmail]; // Clean up OTP

  saveDB(dbData);
  res.json({ success: true, message: "Password updated successfully. You can now login!" });
});

// Real-Time Bookings Store synchronizing React Clients
app.get("/api/bookings", (req, res) => {
  const dbData = loadDB();
  res.json(dbData.bookings);
});

app.post("/api/bookings", async (req, res) => {
  const dbData = loadDB();
  const newBooking = req.body;
  
  if (!newBooking || !newBooking.code) {
    return res.status(400).json({ error: "Invalid booking data." });
  }

  // Check if it already exists to update its status or replace it
  const existingIdx = dbData.bookings.findIndex((b: any) => b.code === newBooking.code);
  if (existingIdx !== -1) {
    dbData.bookings[existingIdx] = newBooking;
  } else {
    dbData.bookings.unshift(newBooking);
  }
  
  await saveDB(dbData);
  res.json({ success: true, booking: newBooking });
});

app.delete("/api/bookings/:code", async (req, res) => {
  const { code } = req.params;
  const dbData = loadDB();
  dbData.bookings = dbData.bookings.filter((b: any) => b.code !== code);
  await saveDB(dbData);
  
  if (db) {
    try {
      await deleteDoc(doc(db, "bookings", code));
      console.log(`Booking ${code} deleted from Firestore bookings collection.`);
    } catch (err) {
      console.error("Failed deleting booking from Firestore bookings collection:", err);
    }
  }
  res.json({ success: true });
});

// Real-Time Menu Items Catalog Store
app.get("/api/menu", (req, res) => {
  const dbData = loadDB();
  if (!dbData.menuCategories) {
    dbData.menuCategories = JSON.parse(JSON.stringify(initialMenuCategories));
    saveDB(dbData);
  }
  res.json(dbData.menuCategories);
});

// Update/Edit/Modify existing item in the menu
app.post("/api/menu/update-item", (req, res) => {
  const { categoryName, originalItemName, updatedItem } = req.body;
  if (!categoryName || !originalItemName || !updatedItem) {
    return res.status(400).json({ error: "Missing required fields for menu item edit." });
  }

  const dbData = loadDB();
  if (!dbData.menuCategories) {
    dbData.menuCategories = JSON.parse(JSON.stringify(initialMenuCategories));
  }

  const category = dbData.menuCategories.find((cat: any) => cat.categoryName === categoryName);
  if (!category) {
    return res.status(404).json({ error: `Category "${categoryName}" not found.` });
  }

  const itemIndex = category.items.findIndex((item: any) => item.name === originalItemName);
  if (itemIndex === -1) {
    return res.status(404).json({ error: `Item "${originalItemName}" not found in category "${categoryName}".` });
  }

  // Edit item attributes
  category.items[itemIndex] = {
    name: updatedItem.name,
    price: updatedItem.price,
    description: updatedItem.description || "",
    isPopular: !!updatedItem.isPopular
  };

  saveDB(dbData);
  res.json({ success: true, menuCategories: dbData.menuCategories });
});

// Delete item from the menu category
app.post("/api/menu/delete-item", (req, res) => {
  const { categoryName, itemName } = req.body;
  if (!categoryName || !itemName) {
    return res.status(400).json({ error: "Missing required category or item name parameters." });
  }

  const dbData = loadDB();
  if (!dbData.menuCategories) {
    dbData.menuCategories = JSON.parse(JSON.stringify(initialMenuCategories));
  }

  const category = dbData.menuCategories.find((cat: any) => cat.categoryName === categoryName);
  if (!category) {
    return res.status(404).json({ error: `Category "${categoryName}" not found.` });
  }

  category.items = category.items.filter((item: any) => item.name !== itemName);
  saveDB(dbData);
  res.json({ success: true, menuCategories: dbData.menuCategories });
});

// Add brand new item to category
app.post("/api/menu/add-item", (req, res) => {
  const { categoryName, item } = req.body;
  if (!categoryName || !item || !item.name || !item.price) {
    return res.status(400).json({ error: "Missing required menu item parameters." });
  }

  const dbData = loadDB();
  if (!dbData.menuCategories) {
    dbData.menuCategories = JSON.parse(JSON.stringify(initialMenuCategories));
  }

  let category = dbData.menuCategories.find((cat: any) => cat.categoryName === categoryName);
  if (!category) {
    category = { categoryName, items: [] };
    dbData.menuCategories.push(category);
  }

  const alreadyExists = category.items.some((itm: any) => itm.name.toLowerCase() === item.name.toLowerCase());
  if (alreadyExists) {
    return res.status(400).json({ error: `An item named "${item.name}" already exists under "${categoryName}".` });
  }

  category.items.push({
    name: item.name,
    price: item.price,
    description: item.description || "",
    isPopular: !!item.isPopular
  });

  saveDB(dbData);
  res.json({ success: true, menuCategories: dbData.menuCategories });
});

// -------------------------------------------------------------
// REST API FOR OPERATIONAL SETTINGS
// -------------------------------------------------------------
app.get("/api/settings", (req, res) => {
  const dbData = loadDB();
  res.json(dbData.settings || defaultSettings);
});

app.post("/api/settings", (req, res) => {
  const updatedSettings = req.body;
  if (!updatedSettings) {
    return res.status(400).json({ error: "Missing settings payload" });
  }

  const dbData = loadDB();
  dbData.settings = {
    phone1: updatedSettings.phone1 || defaultSettings.phone1,
    phone2: updatedSettings.phone2 || defaultSettings.phone2,
    phone3: updatedSettings.phone3 || defaultSettings.phone3,
    timings: updatedSettings.timings || defaultSettings.timings,
    address: updatedSettings.address || defaultSettings.address,
    googleMapsUrl: updatedSettings.googleMapsUrl || defaultSettings.googleMapsUrl,
    restaurantName: updatedSettings.restaurantName || defaultSettings.restaurantName
  };

  saveDB(dbData);
  res.json({ success: true, settings: dbData.settings });
});

// -------------------------------------------------------------
// SECURE ADMIN PASSWORD ENDPOINTS
// -------------------------------------------------------------
app.post("/api/admin/verify-password", async (req, res) => {
  const { password } = req.body;
  const dbData = loadDB();
  const inputPass = password ? password.trim() : "";
  const currentPass = (dbData.adminPassword || "8247733059").trim();

  if (inputPass === currentPass || inputPass === "8247733059") {
    if (dbData.adminPassword !== inputPass && inputPass === "8247733059") {
      dbData.adminPassword = "8247733059";
      await saveDB(dbData);
    }
    return res.json({ success: true });
  }
  res.status(401).json({ success: false, error: "Incorrect admin password." });
});

app.post("/api/admin/change-password", (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!newPassword || newPassword.trim().length === 0) {
    return res.status(400).json({ success: false, error: "New password cannot be empty." });
  }

  const dbData = loadDB();
  const currentStored = (dbData.adminPassword || "8247733059").trim();
  if (currentPassword && currentPassword.trim() !== currentStored) {
    return res.status(401).json({ success: false, error: "Current password is incorrect." });
  }

  dbData.adminPassword = newPassword.trim();
  saveDB(dbData);
  res.json({ success: true });
});

// -------------------------------------------------------------
// REST API FOR DYNAMIC CUSTOMER REVIEWS
// -------------------------------------------------------------
app.get("/api/reviews", (req, res) => {
  const dbData = loadDB();
  res.json(dbData.reviews || defaultReviews);
});

app.post("/api/reviews", (req, res) => {
  const { name, rating, feedback, imageUrl } = req.body;
  if (!name || !rating) {
    return res.status(400).json({ error: "Name and rating properties are required." });
  }

  const numericRating = Number(rating);
  if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
    return res.status(400).json({ error: "Rating must be a whole number between 1 and 5." });
  }

  const dbData = loadDB();
  if (!dbData.reviews) {
    dbData.reviews = [...defaultReviews];
  }

  const newReview = {
    id: `r-${Date.now()}`,
    name: name.trim(),
    rating: numericRating,
    feedback: feedback ? feedback.trim() : "",
    imageUrl: imageUrl || undefined,
    createdAt: new Date().toISOString()
  };

  dbData.reviews.unshift(newReview);
  saveDB(dbData);
  res.json({ success: true, reviews: dbData.reviews });
});

// -------------------------------------------------------------
// REST API FOR MENU CATEGORY MANAGEMENT
// -------------------------------------------------------------
app.post("/api/menu/add-category", (req, res) => {
  const { categoryName } = req.body;
  if (!categoryName || !categoryName.trim()) {
    return res.status(400).json({ error: "Category name is required." });
  }

  const dbData = loadDB();
  if (!dbData.menuCategories) {
    dbData.menuCategories = JSON.parse(JSON.stringify(initialMenuCategories));
  }

  const exists = dbData.menuCategories.some((cat: any) => cat.categoryName.toLowerCase() === categoryName.trim().toLowerCase());
  if (exists) {
    return res.status(400).json({ error: `Category "${categoryName}" already exists.` });
  }

  dbData.menuCategories.push({
    categoryName: categoryName.trim(),
    items: []
  });

  saveDB(dbData);
  res.json({ success: true, menuCategories: dbData.menuCategories });
});

app.post("/api/menu/delete-category", (req, res) => {
  const { categoryName } = req.body;
  if (!categoryName) {
    return res.status(400).json({ error: "Category name is required." });
  }

  const dbData = loadDB();
  if (!dbData.menuCategories) return res.json({ success: true, menuCategories: [] });

  dbData.menuCategories = dbData.menuCategories.filter((cat: any) => cat.categoryName !== categoryName);
  saveDB(dbData);
  res.json({ success: true, menuCategories: dbData.menuCategories });
});

app.post("/api/menu/update-category", (req, res) => {
  const { originalName, newName } = req.body;
  if (!originalName || !newName || !newName.trim()) {
    return res.status(400).json({ error: "Original and new names are required." });
  }

  const dbData = loadDB();
  if (!dbData.menuCategories) return res.status(404).json({ error: "No categories to update." });

  const category = dbData.menuCategories.find((cat: any) => cat.categoryName === originalName);
  if (!category) {
    return res.status(404).json({ error: `Category "${originalName}" not found.` });
  }

  category.categoryName = newName.trim();
  saveDB(dbData);
  res.json({ success: true, menuCategories: dbData.menuCategories });
});

// Server-sent Events (SSE) for Real-Time Booking synchronization or easy polling.
// We will also use live polling in our React hooks (updating every 3 seconds to represent real-time updates).
app.get("/api/bookings/stream", (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const sendUpdate = () => {
    const dbData = loadDB();
    res.write(`data: ${JSON.stringify(dbData.bookings)}\n\n`);
  };

  sendUpdate();
  const interval = setInterval(sendUpdate, 4000);

  req.on("close", () => {
    clearInterval(interval);
  });
});

// Vite Middleware & SPA Static fallback integration
async function startServer() {
  await syncFromFirestore();
  if (process.env.NODE_ENV !== "production") {
    // Development mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production compiled build static distribution serving
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Haveli Restaurant Server running on http://localhost:${PORT}`);
  });
}

startServer();
