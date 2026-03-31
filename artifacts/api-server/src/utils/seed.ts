import { db, purposesTable } from "@workspace/db";
import { sql } from "drizzle-orm";

const PURPOSES = [
  {
    id: 1,
    number: 1,
    title: "Simple Living",
    shortDescription: "Embrace a natural way of life rooted in spiritual values.",
    fullDescription: "One of the foundations of ISKCON is the principle of simple living and high thinking. By choosing a lifestyle free from unnecessary complexity and consumption, we create space for spiritual growth. Simple living means caring for our basic needs without exploitation, living in harmony with nature, and dedicating our time to what truly matters: our relationship with Krishna.",
    icon: "leaf",
    officialText: "To bring the members closer together for the purpose of teaching a simpler and more natural way of life.",
  },
  {
    id: 2,
    number: 2,
    title: "Community",
    shortDescription: "Build a loving spiritual family on the path together.",
    fullDescription: "Community is at the heart of ISKCON life. We are called to create environments where devotees encourage one another, share the journey, and practice devotional service together. A strong community reflects the joy of unity in diversity, where every member feels welcomed, valued, and nourished.",
    icon: "users",
    officialText: "To bring the members of the Society together with each other and nearer to Krishna, the prime entity, and thus to develop the idea within the members, and humanity at large, that each soul is part and parcel of the quality of Godhead (Krishna).",
  },
  {
    id: 3,
    number: 3,
    title: "Holy Place",
    shortDescription: "Create and maintain sacred spaces for transcendence.",
    fullDescription: "ISKCON temples and centers are holy places where the divine presence of Krishna is felt. They are sanctuaries where devotees come to worship, hear and chant the holy names, take prasadam, and be spiritually uplifted. Every home of a devotee can also become a holy place — a small temple filled with love and remembrance of God.",
    icon: "temple",
    officialText: "To erect for the members and for society at large, a holy place of transcendental pastimes, dedicated to the personality of Krishna.",
  },
  {
    id: 4,
    number: 4,
    title: "Accessing",
    shortDescription: "Open the doors to spiritual knowledge for everyone.",
    fullDescription: "ISKCON is committed to making the eternal wisdom of the Vedas accessible to all people, regardless of background or belief. Through books, digital media, educational programs, and personal outreach, we provide everyone the opportunity to encounter the teachings of the Bhagavad-gita and Srimad-Bhagavatam. Accessing is the first step on the path of spiritual awakening.",
    icon: "book-open",
    officialText: "To systematically propagate spiritual knowledge to society at large and to educate all peoples in the techniques of spiritual life in order to check the imbalance of values in life and to achieve real unity and peace in the world.",
  },
  {
    id: 5,
    number: 5,
    title: "Learning",
    shortDescription: "Deepen understanding through study and devotional hearing.",
    fullDescription: "Study and hearing are at the heart of spiritual progress. ISKCON encourages every devotee to deepen their understanding through regular reading of sacred texts, attending classes, and listening to lectures by qualified teachers. Learning transforms information into wisdom, and wisdom into liberation.",
    icon: "graduation-cap",
    officialText: "To propagate a consciousness of Krishna as it is revealed in the Bhagavad-gita and Srimad-Bhagavatam.",
  },
  {
    id: 6,
    number: 6,
    title: "Applying",
    shortDescription: "Put spiritual principles into practice in daily life.",
    fullDescription: "Spiritual knowledge has its full value only when applied. Through sankirtan, service, and daily practice, devotees bring Krishna consciousness into every aspect of life — work, family, and relationships. Applying the teachings is the bridge between hearing and transformation.",
    icon: "hands",
    officialText: "To teach and encourage the sankirtan movement, congregational chanting of the holy names of God, as revealed in the teachings of Lord Sri Chaitanya Mahaprabhu.",
  },
  {
    id: 7,
    number: 7,
    title: "Sharing",
    shortDescription: "Spread Krishna consciousness with open hands and heart.",
    fullDescription: "The greatest act of compassion is to share Krishna consciousness with those who are searching. Through books, media, conversations, and outreach, every devotee becomes a messenger of hope. Sharing is not just an activity — it is an expression of love for all living beings.",
    icon: "share",
    officialText: "To, with a view towards achieving the aforementioned purposes, publish and distribute periodicals, magazines, books and other writings.",
  },
];

export async function seedPurposes() {
  try {
    const existing = await db.select({ id: purposesTable.id }).from(purposesTable);
    if (existing.length >= 7) return;

    for (const p of PURPOSES) {
      await db.execute(sql`
        INSERT INTO purposes (id, number, title, short_description, full_description, icon)
        VALUES (${p.id}, ${p.number}, ${p.title}, ${p.shortDescription}, ${p.fullDescription}, ${p.icon})
        ON CONFLICT (id) DO NOTHING
      `);
    }

    await db.execute(sql`SELECT setval(pg_get_serial_sequence('purposes', 'id'), 7, true)`);

    console.log("[Seed] 7 purposes inserted successfully");
  } catch (err) {
    console.error("[Seed] Failed to seed purposes:", err);
  }
}
