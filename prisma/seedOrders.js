const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.order.createMany({
    data: [
      { customer: "Academy Sports", poNumber: "PO-250514-001", status: "Confirmed", expectedDate: new Date("2025-05-20") },
      { customer: "DICK'S Sporting Goods", poNumber: "PO-250513-008", status: "In Production", expectedDate: new Date("2025-05-22") },
      { customer: "Sports Direct", poNumber: "PO-250512-003", status: "Confirmed", expectedDate: new Date("2025-05-25") }
    ]
  });
}

main()
  .then(() => console.log("Orders seeded!"))
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
