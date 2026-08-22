const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.inventory.createMany({
    data: [
      {
        category: "Fan Shop",
        oldClubName: null,
        newClubName: null,
        poNumber: "4500005337",
        newPo: "4500008717",
        style: "AGA-6489",
        colorCode: "MNT/WT",
        color: "MINTWHITE",
        materials: "AGA-6489_MINTWHITE_M",
        description: "mens 60% cotton 40% polyester knit sweatshirt",
        size: "M",
        allocation: null,
        availableBalance: 2,
        cartonNumber: 45,
        floorRow: null,
        palletNumber: null,
        rackNumber: "RACK-8",
        lineNumber: "LINE-H-1",
        side: "Left side",
        otherLocation: null,
        remarks: null,
        stock: 2
      },
      {
        category: "Fan Shop",
        oldClubName: null,
        newClubName: null,
        poNumber: "4500005333",
        newPo: "4500008717",
        style: "AGA-6488",
        colorCode: "NVY/WT",
        color: "NAVY/WHITE",
        materials: "AGA-6488_NAVY/WHITE_10-12",
        description: "boys 60% cotton 40% polyester knit sweatshirt",
        size: "10-12",
        allocation: null,
        availableBalance: 6,
        cartonNumber: 62,
        floorRow: null,
        palletNumber: null,
        rackNumber: "RACK-3",
        lineNumber: "LINE-C-5",
        side: "Right side",
        otherLocation: null,
        remarks: null,
        stock: 6
      }
    ]
  });
}

main()
  .then(() => {
    console.log("Database seeded!");
  })
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
