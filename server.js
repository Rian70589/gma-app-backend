const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get("/api/inventory", async (req, res) => {
  const items = await prisma.inventory.findMany({ include: { supplier: true, warehouse: true } });
  res.json(items);
});

app.get("/api/suppliers", async (req, res) => {
  const suppliers = await prisma.supplier.findMany({ orderBy: { name: "asc" } });
  res.json(suppliers);
});

app.post("/api/suppliers", async (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Supplier name is required" });
  }

  try {
    const supplier = await prisma.supplier.create({
      data: { name: name.trim(), email: email?.trim() || null, phone: phone?.trim() || null }
    });
    res.status(201).json(supplier);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create supplier" });
  }
});

app.delete("/api/suppliers/:id", async (req, res) => {
  try {
    await prisma.supplier.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Supplier deleted successfully" });
  } catch (error) {
    console.error(error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Supplier not found" });
    }
    res.status(500).json({ error: "Failed to delete supplier" });
  }
});

app.get("/api/warehouses", async (req, res) => {
  const warehouses = await prisma.warehouse.findMany({ orderBy: { name: "asc" } });
  res.json(warehouses);
});

app.post("/api/warehouses", async (req, res) => {
  const { name, location } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Warehouse name is required" });
  }

  try {
    const warehouse = await prisma.warehouse.create({
      data: { name: name.trim(), location: location?.trim() || null }
    });
    res.status(201).json(warehouse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create warehouse" });
  }
});

app.delete("/api/warehouses/:id", async (req, res) => {
  try {
    await prisma.warehouse.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Warehouse deleted successfully" });
  } catch (error) {
    console.error(error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Warehouse not found" });
    }
    res.status(500).json({ error: "Failed to delete warehouse" });
  }
});

app.post("/api/inventory", async (req, res) => {
  const {
    category, oldClubName, newClubName, poNumber, newPo, style, colorCode, color,
    materials, description, size, allocation, availableBalance, cartonNumber,
    floorRow, palletNumber, rackNumber, lineNumber, side, otherLocation, remarks, stock
  } = req.body || {};

  if (!style || !style.trim() || !color || !color.trim() || !size || !size.trim()) {
    return res.status(400).json({ error: "Style, color, and size are required" });
  }

  const parsedStock = Number(stock || 0);
  if (!Number.isInteger(parsedStock) || parsedStock < 0) {
    return res.status(400).json({ error: "Stock must be a non-negative whole number" });
  }

  try {
    const item = await prisma.inventory.create({
      data: {
        category: category ? category.trim() : null,
        oldClubName: oldClubName ? oldClubName.trim() : null,
        newClubName: newClubName ? newClubName.trim() : null,
        poNumber: poNumber ? poNumber.trim() : null,
        newPo: newPo ? newPo.trim() : null,
        style: style.trim(),
        colorCode: colorCode ? colorCode.trim() : null,
        color: color.trim(),
        materials: materials ? materials.trim() : null,
        description: description ? description.trim() : null,
        size: size.trim(),
        allocation: allocation === "" || allocation == null ? null : Number(allocation),
        availableBalance: availableBalance === "" || availableBalance == null ? null : Number(availableBalance),
        cartonNumber: cartonNumber === "" || cartonNumber == null ? null : Number(cartonNumber),
        floorRow: floorRow ? floorRow.trim() : null,
        palletNumber: palletNumber ? palletNumber.trim() : null,
        rackNumber: rackNumber ? rackNumber.trim() : null,
        lineNumber: lineNumber ? lineNumber.trim() : null,
        side: side ? side.trim() : null,
        otherLocation: otherLocation ? otherLocation.trim() : null,
        remarks: remarks ? remarks.trim() : null,
        stock: parsedStock
      },
      include: { supplier: true, warehouse: true }
    });
    res.status(201).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create inventory item" });
  }
});

app.put("/api/inventory/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "Inventory item id must be valid" });
  }

  const {
    category,
    oldClubName,
    newClubName,
    poNumber,
    newPo,
    style,
    colorCode,
    color,
    materials,
    description,
    size,
    allocation,
    availableBalance,
    cartonNumber,
    floorRow,
    palletNumber,
    rackNumber,
    lineNumber,
    side,
    otherLocation,
    remarks,
    stock
  } = req.body || {};

  if (!style || !style.trim()) {
    return res.status(400).json({ error: "Style is required" });
  }

  if (!color || !color.trim()) {
    return res.status(400).json({ error: "Color is required" });
  }

  if (!size || !size.trim()) {
    return res.status(400).json({ error: "Size is required" });
  }

  const parsedStock = Number(stock);
  if (!Number.isInteger(parsedStock) || parsedStock < 0) {
    return res.status(400).json({ error: "Stock must be a non-negative whole number" });
  }

  try {
    const item = await prisma.inventory.update({
      where: { id },
      data: {
        category: category ? category.trim() : null,
        oldClubName: oldClubName ? oldClubName.trim() : null,
        newClubName: newClubName ? newClubName.trim() : null,
        poNumber: poNumber ? poNumber.trim() : null,
        newPo: newPo ? newPo.trim() : null,
        style: style.trim(),
        colorCode: colorCode ? colorCode.trim() : null,
        color: color.trim(),
        materials: materials ? materials.trim() : null,
        description: description ? description.trim() : null,
        size: size.trim(),
        allocation: allocation === "" || allocation == null ? null : Number(allocation),
        availableBalance: availableBalance === "" || availableBalance == null ? null : Number(availableBalance),
        cartonNumber: cartonNumber === "" || cartonNumber == null ? null : Number(cartonNumber),
        floorRow: floorRow ? floorRow.trim() : null,
        palletNumber: palletNumber ? palletNumber.trim() : null,
        rackNumber: rackNumber ? rackNumber.trim() : null,
        lineNumber: lineNumber ? lineNumber.trim() : null,
        side: side ? side.trim() : null,
        otherLocation: otherLocation ? otherLocation.trim() : null,
        remarks: remarks ? remarks.trim() : null,
        stock: parsedStock
      },
      include: { supplier: true, warehouse: true }
    });
    res.json(item);
  } catch (error) {
    console.error(error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Inventory item not found" });
    }
    res.status(500).json({ error: "Failed to update inventory item" });
  }
});

app.patch("/api/inventory/:id/locations", async (req, res) => {
  const supplierId = req.body.supplierId == null ? null : Number(req.body.supplierId);
  const warehouseId = req.body.warehouseId == null ? null : Number(req.body.warehouseId);

  if ((supplierId !== null && !Number.isInteger(supplierId)) || (warehouseId !== null && !Number.isInteger(warehouseId))) {
    return res.status(400).json({ error: "Supplier and warehouse IDs must be valid integers" });
  }

  try {
    const item = await prisma.inventory.update({
      where: { id: parseInt(req.params.id) },
      data: { supplierId, warehouseId },
      include: { supplier: true, warehouse: true }
    });
    res.json(item);
  } catch (error) {
    console.error(error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Inventory item not found" });
    }
    res.status(500).json({ error: "Failed to assign inventory locations" });
  }
});

app.get("/api/customers", async (req, res) => {
  const customers = await prisma.customer.findMany({ orderBy: { name: "asc" } });
  res.json(customers);
});

app.post("/api/customers", async (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Customer name is required" });
  }

  try {
    const customer = await prisma.customer.create({
      data: {
        name: name.trim(),
        email: email?.trim() || null,
        phone: phone?.trim() || null
      }
    });
    res.status(201).json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create customer" });
  }
});

app.delete("/api/customers/:id", async (req, res) => {
  try {
    await prisma.customer.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error(error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.status(500).json({ error: "Failed to delete customer" });
  }
});

app.get("/api/orders", async (req, res) => {
  const orders = await prisma.order.findMany({ include: { customerLink: true, inventory: true } });
  res.json(orders);
});

// Create new order
app.post("/api/orders", async (req, res) => {
  const { customer, customerId, poNumber, status, expectedDate, inventoryId, quantity } = req.body;
  const parsedCustomerId = Number(customerId);
  const parsedInventoryId = Number(inventoryId);
  const parsedQuantity = Number(quantity);

  try {
    if ((!customer && !Number.isInteger(parsedCustomerId)) || !poNumber || !expectedDate || !Number.isInteger(parsedInventoryId)) {
      return res.status(400).json({ error: "Customer, PO number, expected date, and inventory item are required" });
    }

    if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
      return res.status(400).json({ error: "Quantity must be a positive whole number" });
    }

    const newOrder = await prisma.$transaction(async (transaction) => {
      const customerRecord = Number.isInteger(parsedCustomerId)
        ? await transaction.customer.findUnique({ where: { id: parsedCustomerId } })
        : null;

      if (Number.isInteger(parsedCustomerId) && !customerRecord) {
        throw new Error("CUSTOMER_NOT_FOUND");
      }

      if (status === "Confirmed") {
        const stockUpdate = await transaction.inventory.updateMany({
          where: { id: parsedInventoryId, stock: { gte: parsedQuantity } },
          data: { stock: { decrement: parsedQuantity } }
        });

        if (stockUpdate.count === 0) {
          throw new Error("INSUFFICIENT_STOCK");
        }
      }

      return transaction.order.create({
        data: {
          customer: customerRecord?.name || customer,
          customerId: customerRecord?.id,
          poNumber,
          status,
          quantity: parsedQuantity,
          inventoryId: parsedInventoryId,
          expectedDate: new Date(expectedDate)
        },
        include: { customerLink: true, inventory: true }
      });
    });
    res.json(newOrder);
  } catch (error) {
    console.error(error);
    if (error.message === "INSUFFICIENT_STOCK") {
      return res.status(400).json({ error: "Insufficient stock for this order" });
    }
    if (error.message === "CUSTOMER_NOT_FOUND") {
      return res.status(400).json({ error: "Customer not found" });
    }
    res.status(500).json({ error: "Failed to create order" });
  }
});

// Update order status
app.put("/api/orders/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedOrder = await prisma.$transaction(async (transaction) => {
      const order = await transaction.order.findUnique({ where: { id: parseInt(id) } });

      if (!order) {
        throw new Error("ORDER_NOT_FOUND");
      }

      if (status === "Confirmed" && order.status !== "Confirmed" && order.inventoryId) {
        const stockUpdate = await transaction.inventory.updateMany({
          where: { id: order.inventoryId, stock: { gte: order.quantity } },
          data: { stock: { decrement: order.quantity } }
        });

        if (stockUpdate.count === 0) {
          throw new Error("INSUFFICIENT_STOCK");
        }
      }

      return transaction.order.update({
        where: { id: order.id },
        data: { status }
      });
    });
    res.json(updatedOrder);
  } catch (error) {
    console.error(error);
    if (error.message === "ORDER_NOT_FOUND") {
      return res.status(404).json({ error: "Order not found" });
    }
    if (error.message === "INSUFFICIENT_STOCK") {
      return res.status(400).json({ error: "Insufficient stock for this order" });
    }
    res.status(500).json({ error: "Failed to update order status" });
  }
});

// Delete order
app.delete("/api/orders/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.order.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete order" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
