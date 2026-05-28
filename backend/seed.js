import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    brand: { type: String, trim: true },
    category: { type: String, trim: true, default: "General" },
    images: [{ type: String }],
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ratings: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

const products = [
  { title: "Fjallraven Backpack", description: "Your perfect pack for everyday use and walks in the forest. Stash your laptop up to 15 inches in the padded sleeve.", price: 109.95, stock: 50, brand: "Fjallraven", category: "Bags", images: ["https://fakestoreapi.com/img/81fAn0X5zhL._AC_UY550_.jpg"], ratings: 3.9, numReviews: 120 },
  { title: "Mens Casual Premium Slim Fit T-Shirts", description: "Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight and soft fabric for breathable.", price: 22.3, stock: 100, brand: "Opna", category: "Clothing", images: ["https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg"], ratings: 4.1, numReviews: 259 },
  { title: "Mens Cotton Jacket", description: "Great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions such as working, hiking, camping.", price: 55.99, stock: 75, brand: "Fashion", category: "Clothing", images: ["https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg"], ratings: 4.7, numReviews: 500 },
  { title: "Mens Casual Slim Fit", description: "The color could be slightly different between on the screen and in practice.", price: 15.99, stock: 200, brand: "MBJ", category: "Clothing", images: ["https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg"], ratings: 2.1, numReviews: 430 },
  { title: "John Hardy Women Gold Silver Dragon Bracelet", description: "From our Legends Collection, the Naga was inspired by the mythical water dragon that protects the ocean pearl.", price: 695, stock: 15, brand: "John Hardy", category: "Jewellery", images: ["https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_FMwebp_QL65_.jpg"], ratings: 4.6, numReviews: 400 },
  { title: "Solid Gold Petite Micropave", description: "Satisfaction Guaranteed. Return or exchange any order within 30 days. Designed and sold by Hafeez Center.", price: 168, stock: 20, brand: "Hafeez Center", category: "Jewellery", images: ["https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_FMwebp_QL65_.jpg"], ratings: 3.9, numReviews: 70 },
  { title: "White Gold Plated Princess Ring", description: "Classic Created Wedding Engagement Solitaire Diamond Promise Ring for Her.", price: 9.99, stock: 30, brand: "Rose Gold", category: "Jewellery", images: ["https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_FMwebp_QL65_.jpg"], ratings: 3.0, numReviews: 400 },
  { title: "Pierced Owl Rose Gold Plated Earring", description: "Rose Gold Plated Double Flared Tunnel Plug Earring. Made of 316L Stainless Steel.", price: 10.99, stock: 100, brand: "Pierced Owl", category: "Jewellery", images: ["https://fakestoreapi.com/img/51UDEzMJVpL._AC_UL640_FMwebp_QL65_.jpg"], ratings: 1.9, numReviews: 100 },
  { title: "WD 2TB Elements Portable External Hard Drive", description: "USB 3.0 and USB 2.0 Compatibility Fast data transfers Improve PC Performance High Capacity.", price: 64, stock: 45, brand: "WD", category: "Electronics", images: ["https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg"], ratings: 3.3, numReviews: 203 },
  { title: "SanDisk SSD PLUS 1TB Internal SSD", description: "Easy upgrade for faster boot up, shutdown, and improved performance.", price: 109, stock: 60, brand: "SanDisk", category: "Electronics", images: ["https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg"], ratings: 2.9, numReviews: 470 },
  { title: "Silicon Power 256GB SSD", description: "3D NAND flash are applied to deliver high transfer speeds and remarkable performance.", price: 109, stock: 80, brand: "Silicon Power", category: "Electronics", images: ["https://fakestoreapi.com/img/71kWymZ+c+L._AC_SX679_.jpg"], ratings: 4.8, numReviews: 319 },
  { title: "WD 4TB Gaming Drive for Playstation 4", description: "Expand your PS4 gaming experience. Play games off the external hard drive.", price: 114, stock: 35, brand: "WD", category: "Electronics", images: ["https://fakestoreapi.com/img/61mtL65D4cL._AC_SX679_.jpg"], ratings: 4.8, numReviews: 400 },
  { title: "Acer SB220Q 21.5 inches Full HD IPS Monitor", description: "21.5 inches Full HD 1920 x 1080 widescreen IPS display And Radeon free Sync technology.", price: 599, stock: 25, brand: "Acer", category: "Electronics", images: ["https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_.jpg"], ratings: 2.9, numReviews: 250 },
  { title: "Samsung 49-Inch CHG90 Curved Gaming Monitor", description: "49 INCHES SUPER ULTRAWIDE 32:9 ASPECT RATIO monitor with QUANTUM DOT QLED TECHNOLOGY.", price: 999.99, stock: 10, brand: "Samsung", category: "Electronics", images: ["https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_.jpg"], ratings: 2.2, numReviews: 140 },
  { title: "BIYLACLESEN Women 3-in-1 Snowboard Jacket", description: "Note: The Jackets is US Standard Size. Material: 100% Polyester.", price: 56.99, stock: 40, brand: "BIYLACLESEN", category: "Clothing", images: ["https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg"], ratings: 2.6, numReviews: 235 },
  { title: "Lock and Love Women Faux Leather Moto Biker Jacket", description: "100% POLYURETHANE PU and 95% POLYESTER, 5% SPANDEX. Faux leather material for style and comfort.", price: 29.95, stock: 55, brand: "Lock and Love", category: "Clothing", images: ["https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_.jpg"], ratings: 2.9, numReviews: 340 },
  { title: "Rain Jacket Women Windbreaker Striped Raincoat", description: "Lightweight perfect for trip or casual wear. Long sleeve and hooded for protection.", price: 39.99, stock: 65, brand: "Fashion", category: "Clothing", images: ["https://fakestoreapi.com/img/71HblAHs1xL._AC_UY879_-2.jpg"], ratings: 3.8, numReviews: 679 },
  { title: "MBJ Women Solid Short Sleeve Boat Neck Top", description: "95% RAYON 5% SPANDEX, Made in USA or Imported. Lightweight fabric with great stretch for comfort.", price: 9.85, stock: 150, brand: "MBJ", category: "Clothing", images: ["https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_.jpg"], ratings: 4.7, numReviews: 130 },
  { title: "Opna Women Short Sleeve Moisture Wicking Shirt", description: "100% Polyester, Machine wash, Lightweight, roomy and highly functional.", price: 7.95, stock: 120, brand: "Opna", category: "Clothing", images: ["https://fakestoreapi.com/img/51eg55uWmdL._AC_UX679_.jpg"], ratings: 4.5, numReviews: 146 },
  { title: "DANVOUY Womens T Shirt Casual Cotton Short", description: "95% COTTON, 5% SPANDEX. Features: Casual, Short Sleeve, Letter Print, V-Neck, Fashion Tees.", price: 12.99, stock: 90, brand: "DANVOUY", category: "Clothing", images: ["https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_.jpg"], ratings: 3.6, numReviews: 145 },
];

const seed = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    const DB_NAME = process.env.DB_NAME;
    if (!MONGODB_URI) throw new Error("MONGODB_URI not found in .env file");

    await mongoose.connect(`${MONGODB_URI}/${DB_NAME}`);
    console.log("✅ MongoDB connected");

    await Product.deleteMany({});
    console.log("🗑️  Cleared existing products");

    const inserted = await Product.insertMany(products);
    console.log(`\n✅ Successfully seeded ${inserted.length} products!\n`);
    inserted.forEach((p, i) => {
      console.log(`  ${i + 1}. ${p.title} — $${p.price} [${p.category}] ID: ${p._id}`);
    });
  } catch (error) {
    console.error("❌ Seed failed:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("\n✅ Done! MongoDB disconnected.");
  }
};

seed();