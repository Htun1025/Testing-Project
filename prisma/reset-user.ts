import "dotenv/config";
import { db } from "../src/lib/db";

async function main() {
  const result = await db.user.deleteMany({});

  console.log(`Deleted ${result.count} users successfully.`);
}

main()
  .catch((error) => {
    console.error("Delete error:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });