import { Types } from 'mongoose';

// Helper to generate ObjectId-like strings if mongoose is not available in this context
// In the actual server seed script, you would fetch real Category IDs
const CATEGORY_IDS = {
  MEN: new Types.ObjectId('6765d2a0c8b1a2b3c4d5e6f1'),
  WOMEN: new Types.ObjectId('6765d2a0c8b1a2b3c4d5e6f2'),
  UNISEX: new Types.ObjectId('6765d2a0c8b1a2b3c4d5e6f3'),
  ORIENTAL: new Types.ObjectId('6765d2a0c8b1a2b3c4d5e6f4'),
  FRENCH: new Types.ObjectId('6765d2a0c8b1a2b3c4d5e6f5'),
};

export const productsSeed = [
  // Men's Perfumes
  {
    name: "Royal Oud",
    description: "A luxurious men's fragrance combining Cambodian oud oil with touches of aromatic woods. Gives you a strong presence and unmatched confidence.",
    slug: "royal-oud-men",
    variants: [
      { size: "50ml", price: 250, stock: 50, comparePrice: 300 },
      { size: "100ml", price: 450, stock: 30, comparePrice: 550 }
    ],
    categories: [CATEGORY_IDS.MEN, CATEGORY_IDS.ORIENTAL],
    images: ["/products/transparent/royal-oud.png", "/products/transparent/royal-oud-box.png"],
    isActive: true,
    isFeatured: true,
    averageRating: 4.8,
    reviewCount: 125,
    tags: ["oud", "men", "luxury", "winter"],
    seo: {
      title: "Royal Oud Men's Perfume - Tarkeba",
      description: "Best men's oud perfume from Tarkeba",
      keywords: ["oud", "men's perfume", "royal"]
    }
  },
  {
    name: "Ocean Breeze",
    description: "A refreshing fragrance inspired by ocean waves and citrus. Perfect for daily use and morning times.",
    slug: "ocean-breeze-men",
    variants: [
      { size: "75ml", price: 180, stock: 100 }
    ],
    categories: [CATEGORY_IDS.MEN, CATEGORY_IDS.FRENCH],
    images: ["/products/transparent/ocean-breeze.png"],
    isActive: true,
    isFeatured: false,
    averageRating: 4.5,
    reviewCount: 42,
    tags: ["fresh", "summer", "daily"]
  },
  {
    name: "Black Night",
    description: "A mysterious evening fragrance blending hot spices and leather. For evening outings and special occasions.",
    slug: "black-night-men",
    variants: [
      { size: "100ml", price: 320, stock: 20 }
    ],
    categories: [CATEGORY_IDS.MEN],
    images: ["/products/transparent/black-night.png"],
    isActive: true,
    isFeatured: true,
    averageRating: 4.9,
    reviewCount: 80,
    tags: ["evening", "strong", "leather"]
  },
  {
    name: "Cedar Wood",
    description: "Warm cedar wood scent with a touch of vanilla. Perfect balance between strength and calmness.",
    slug: "cedar-wood-men",
    variants: [
      { size: "50ml", price: 200, stock: 60 }
    ],
    categories: [CATEGORY_IDS.MEN],
    images: ["/products/transparent/cedar-wood.png"],
    isActive: true,
    isFeatured: false,
    averageRating: 4.6,
    reviewCount: 30,
    tags: ["woody", "classic"]
  },

  // Women's Perfumes
  {
    name: "Flower Garden",
    description: "A fragrant bouquet of jasmine and Damask rose. A delicate feminine fragrance reflecting beauty and softness.",
    slug: "flower-garden-women",
    variants: [
      { size: "50ml", price: 220, stock: 80 },
      { size: "100ml", price: 380, stock: 40 }
    ],
    categories: [CATEGORY_IDS.WOMEN, CATEGORY_IDS.FRENCH],
    images: ["/products/transparent/flower-garden.png"],
    isActive: true,
    isFeatured: true,
    averageRating: 4.7,
    reviewCount: 95,
    tags: ["flowers", "women", "soft"]
  },
  {
    name: "Vanilla Dream",
    description: "Warm sweet fragrance with high concentration of vanilla and musk. Gives you a feeling of warmth and attraction.",
    slug: "vanilla-dream-women",
    variants: [
      { size: "75ml", price: 260, stock: 55 }
    ],
    categories: [CATEGORY_IDS.WOMEN],
    images: ["/products/transparent/vanilla-dream.png"],
    isActive: true,
    isFeatured: true,
    averageRating: 4.8,
    reviewCount: 150,
    tags: ["vanilla", "sweet", "attractive"]
  },
  {
    name: "Pomegranate Musk",
    description: "Charming blend of white musk and pomegranate extract. Long-lasting scent of cleanliness and freshness.",
    slug: "pomegranate-musk-women",
    variants: [
      { size: "50ml", price: 190, stock: 120 } // Tola size maybe?
    ],
    categories: [CATEGORY_IDS.WOMEN, CATEGORY_IDS.ORIENTAL],
    images: ["/products/transparent/pomegranate-musk.png"],
    isActive: true,
    isFeatured: false,
    averageRating: 4.9,
    reviewCount: 200,
    tags: ["musk", "clean", "daily"]
  },
  {
    name: "Golden Amber",
    description: "Luxury amber with touches of saffron. A fragrance for big occasions leaving an unforgettable trace.",
    slug: "golden-amber-women",
    variants: [
      { size: "100ml", price: 400, stock: 25 }
    ],
    categories: [CATEGORY_IDS.WOMEN, CATEGORY_IDS.ORIENTAL],
    images: ["/products/transparent/golden-amber.png"],
    isActive: true,
    isFeatured: false,
    averageRating: 4.6,
    reviewCount: 45,
    tags: ["amber", "luxury", "evening"]
  },

  // Unisex / Oriental
  {
    name: "Royal Saffron",
    description: "Red gold (saffron) in its finest form. Unisex fragrance characterized by luxury and high stability.",
    slug: "royal-saffron-unisex",
    variants: [
      { size: "50ml", price: 350, stock: 40 },
      { size: "100ml", price: 600, stock: 15 }
    ],
    categories: [CATEGORY_IDS.UNISEX, CATEGORY_IDS.ORIENTAL],
    images: ["/products/transparent/royal-saffron.png"],
    isActive: true,
    isFeatured: true,
    averageRating: 5.0,
    reviewCount: 60,
    tags: ["saffron", "oriental", "unisex"]
  },
  {
    name: "Patchouli Intense",
    description: "Concentrated patchouli fragrance for lovers of deep earthy scents. Stability lasts for more than 24 hours.",
    slug: "patchouli-intense-unisex",
    variants: [
      { size: "100ml", price: 280, stock: 70 }
    ],
    categories: [CATEGORY_IDS.UNISEX, CATEGORY_IDS.FRENCH],
    images: ["/products/transparent/patchouli.png"],
    isActive: true,
    isFeatured: false,
    averageRating: 4.4,
    reviewCount: 25,
    tags: ["patchouli", "strong", "winter"]
  }
];
