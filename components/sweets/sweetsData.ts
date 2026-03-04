export type Category = "sweets" | "flowers" | "hearts";

export interface SweetItem {
  id: number;
  name: string;
  emoji: string;
  image?: string; // path in /public/items/, e.g. "/items/rose.png"
  flavor: string;
  meaning: string;
  color: string;
  category: Category;
}

export const sweetsData: SweetItem[] = [
  // ─── Sweets (12) ───
  { id: 1, name: "Lollipop", emoji: "🍭", flavor: "Strawberry", meaning: "Playfulness & Joy", color: "#FF6B9D", category: "sweets" },
  { id: 2, name: "Chocolate Bar", emoji: "🍫", flavor: "Rich Cocoa", meaning: "Comfort & Warmth", color: "#8B4513", category: "sweets" },
  { id: 3, name: "Candy", emoji: "🍬", flavor: "Mixed Fruit", meaning: "Sweet Memories", color: "#FF85A2", category: "sweets" },
  { id: 4, name: "Cookie", emoji: "🍪", flavor: "Butter Vanilla", meaning: "Home & Togetherness", color: "#D4A574", category: "sweets" },
  { id: 5, name: "Cupcake", emoji: "🧁", flavor: "Pink Frosting", meaning: "Celebration", color: "#FFB6C1", category: "sweets" },
  { id: 6, name: "Doughnut", emoji: "🍩", flavor: "Glazed Sugar", meaning: "Fun & Indulgence", color: "#E8913A", category: "sweets" },
  { id: 7, name: "Ice Cream", emoji: "🍦", flavor: "Vanilla Swirl", meaning: "Happiness & Delight", color: "#FCEABB", category: "sweets" },
  { id: 8, name: "Cake", emoji: "🎂", flavor: "Birthday Cake", meaning: "Milestones & Love", color: "#FFD700", category: "sweets" },
  { id: 9, name: "Honey Pot", emoji: "🍯", flavor: "Golden Honey", meaning: "Sweetness of Life", color: "#F0C040", category: "sweets" },
  { id: 10, name: "Shortcake", emoji: "🍰", flavor: "Strawberry Cream", meaning: "Elegance & Grace", color: "#FFC0CB", category: "sweets" },
  { id: 11, name: "Pie", emoji: "🥧", flavor: "Warm Apple", meaning: "Tradition & Care", color: "#CD853F", category: "sweets" },
  { id: 12, name: "Shaved Ice", emoji: "🍧", flavor: "Rainbow Syrup", meaning: "Refreshing Joy", color: "#87CEEB", category: "sweets" },
  { id: 37, name: "Chocolate Chunks", emoji: "🍫", image: "/items/chocolate-chunks.png", flavor: "Dark Cocoa", meaning: "Rich Indulgence", color: "#5D3A1A", category: "sweets" },
  { id: 38, name: "Chocolate Truffles", emoji: "🟤", image: "/items/chocolate-truffles.png", flavor: "Ganache", meaning: "Luxury & Elegance", color: "#6B3E26", category: "sweets" },
  { id: 39, name: "Strawberry Candy", emoji: "🍓", image: "/items/strawberry-candy.png", flavor: "Sweet Strawberry", meaning: "Berry Sweet Love", color: "#FF4D6D", category: "sweets" },
  { id: 40, name: "Heart Gummies", emoji: "💗", image: "/items/heart-gummies.png", flavor: "Fruity Hearts", meaning: "Chewy Affection", color: "#FF69B4", category: "sweets" },
  { id: 41, name: "Wrapped Candies", emoji: "🎀", image: "/items/wrapped-candies.png", flavor: "Assorted", meaning: "Surprise & Delight", color: "#E040FB", category: "sweets" },

  // ─── Flowers (12) ───
  { id: 13, name: "Rose", emoji: "🌹", image: "/items/rose.png", flavor: "Floral", meaning: "Love & Romance", color: "#E63946", category: "flowers" },
  { id: 14, name: "Tulip", emoji: "🌷", flavor: "Spring", meaning: "New Beginnings", color: "#FF6B6B", category: "flowers" },
  { id: 15, name: "Sunflower", emoji: "🌻", flavor: "Sunshine", meaning: "Adoration & Loyalty", color: "#FFD93D", category: "flowers" },
  { id: 16, name: "Cherry Blossom", emoji: "🌸", flavor: "Sakura", meaning: "Beauty & Renewal", color: "#FFB7C5", category: "flowers" },
  { id: 17, name: "Hibiscus", emoji: "🌺", flavor: "Tropical", meaning: "Delicate Beauty", color: "#FF4081", category: "flowers" },
  { id: 18, name: "Daisy", emoji: "🌼", flavor: "Fresh", meaning: "Innocence & Purity", color: "#FFF176", category: "flowers" },
  { id: 19, name: "Bouquet", emoji: "💐", image: "/items/bouqet.png", flavor: "Mixed Blooms", meaning: "Gratitude & Appreciation", color: "#E991DC", category: "flowers" },
  { id: 20, name: "Dried Flower", emoji: "🥀", flavor: "Preserved", meaning: "Everlasting Memory", color: "#C9544D", category: "flowers" },
  { id: 21, name: "Lotus", emoji: "🪷", flavor: "Serene", meaning: "Purity & Enlightenment", color: "#F8BBD0", category: "flowers" },
  { id: 22, name: "White Blossom", emoji: "💮", flavor: "Elegant", meaning: "Sincerity & Devotion", color: "#FFFFFF", category: "flowers" },
  { id: 23, name: "Four-Leaf Clover", emoji: "🍀", flavor: "Lucky", meaning: "Good Luck", color: "#66BB6A", category: "flowers" },
  { id: 24, name: "Lavender Sprig", emoji: "💜", flavor: "Lavender", meaning: "Calm & Serenity", color: "#CE93D8", category: "flowers" },
  { id: 42, name: "Pink Peony", emoji: "🏵️", image: "/items/pink-peony.png", flavor: "Peony", meaning: "Prosperity & Romance", color: "#FF8FAB", category: "flowers" },
  { id: 43, name: "Yellow Hibiscus", emoji: "🌼", image: "/items/yellow-hibiscus.png", flavor: "Tropical Sun", meaning: "Radiance & Warmth", color: "#FFD700", category: "flowers" },
  { id: 44, name: "Pink Lily", emoji: "🌺", image: "/items/pink-lily.png", flavor: "Lily", meaning: "Grace & Admiration", color: "#FF7EB3", category: "flowers" },
  { id: 45, name: "Purple Rose", emoji: "🌹", image: "/items/purple-rose.png", flavor: "Majestic", meaning: "Enchantment & Mystery", color: "#9C27B0", category: "flowers" },
  { id: 46, name: "Rose Bouquet", emoji: "💐", image: "/items/rose-bouqet.png", flavor: "Rose Garden", meaning: "Endless Devotion", color: "#F8BBD0", category: "flowers" },
  { id: 47, name: "Pink Watercolor Rose", emoji: "🌹", image: "/items/pink-watercolor-rose.png", flavor: "Watercolor", meaning: "Gentle Beauty", color: "#F48FB1", category: "flowers" },
  { id: 48, name: "Blue Clematis", emoji: "💙", image: "/items/blue-clematis.png", flavor: "Midnight", meaning: "Ingenuity & Wisdom", color: "#5C6BC0", category: "flowers" },
  { id: 49, name: "Blue Lotus Pair", emoji: "🪷", image: "/items/blue-lotus-pair.png", flavor: "Twilight", meaning: "Harmony & Balance", color: "#7986CB", category: "flowers" },
  { id: 50, name: "Red Garden Rose", emoji: "🌹", image: "/items/red-garden-rose.png", flavor: "Classic", meaning: "Timeless Love", color: "#C62828", category: "flowers" },
  { id: 51, name: "White Blossom Spray", emoji: "💮", image: "/items/white-blossom-spray.png", flavor: "Delicate", meaning: "Pure Intentions", color: "#F5F5F5", category: "flowers" },

  // ─── Hearts (12) ───
  { id: 25, name: "Red Heart", emoji: "❤️", flavor: "Passionate", meaning: "Deep Love", color: "#E53935", category: "hearts" },
  { id: 26, name: "Pink Heart", emoji: "🩷", flavor: "Tender", meaning: "Gentle Affection", color: "#F48FB1", category: "hearts" },
  { id: 27, name: "Orange Heart", emoji: "🧡", flavor: "Warm", meaning: "Caring Friendship", color: "#FF9800", category: "hearts" },
  { id: 28, name: "Yellow Heart", emoji: "💛", flavor: "Bright", meaning: "Happiness & Joy", color: "#FFEE58", category: "hearts" },
  { id: 29, name: "Green Heart", emoji: "💚", flavor: "Fresh", meaning: "Growth & Harmony", color: "#66BB6A", category: "hearts" },
  { id: 30, name: "Blue Heart", emoji: "💙", flavor: "Cool", meaning: "Trust & Stability", color: "#42A5F5", category: "hearts" },
  { id: 31, name: "Purple Heart", emoji: "💜", flavor: "Royal", meaning: "Enchantment & Excitement", color: "#AB47BC", category: "hearts" },
  { id: 32, name: "Sparkling Heart", emoji: "💖", flavor: "Sparkling", meaning: "Adoring Love", color: "#FF80AB", category: "hearts" },
  { id: 33, name: "Heart with Ribbon", emoji: "💝", flavor: "Gift", meaning: "Love as a Gift", color: "#EC407A", category: "hearts" },
  { id: 34, name: "Revolving Hearts", emoji: "💞", flavor: "Dancing", meaning: "Mutual Love", color: "#F06292", category: "hearts" },
  { id: 35, name: "Growing Heart", emoji: "💗", flavor: "Blooming", meaning: "Love Growing Stronger", color: "#E91E63", category: "hearts" },
  { id: 36, name: "Heart Exclamation", emoji: "❣️", flavor: "Bold", meaning: "Strong Affection", color: "#D32F2F", category: "hearts" },
];

export const categories: { key: Category | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "sweets", label: "Sweets" },
  { key: "flowers", label: "Flowers" },
  { key: "hearts", label: "Hearts" },
];
