import type { Database } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Seeds full demo data for bypass users - customers, suppliers, items, orders, etc.
 * Based on seed-dev-full.ts logic adapted for Supabase client.
 */
export async function seedFullDemoData(
  client: SupabaseClient<Database>,
  companyId: string,
  userId: string,
  locationId: string
): Promise<void> {
  try {
    console.log(`[seedFullDemoData] Starting for company ${companyId}`);

    // Helper to check if a row exists
    const rowExists = async (table: string, column: string, value: string): Promise<boolean> => {
      try {
        const { data } = await client
          .from(table as any)
          .select("id")
          .eq(column as any, value)
          .eq("companyId" as any, companyId)
          .limit(1)
          .maybeSingle();
        return !!data;
      } catch (err) {
        console.error(`[rowExists] Error checking ${table}.${column}:`, err);
        return false;
      }
    };

  // Supplier types
  const supplierTypeNames = ["Raw Material", "Electronics", "Contract Manufacturing"];
  const supplierTypeIds: Record<string, string> = {};
  for (const typeName of supplierTypeNames) {
    const { data: existing } = await client
      .from("supplierType")
      .select("id")
      .eq("name", typeName)
      .eq("companyId", companyId)
      .limit(1)
      .maybeSingle();

    if (existing) {
      supplierTypeIds[typeName] = existing.id;
    } else {
      const { data } = await client
        .from("supplierType")
        .insert({ name: typeName, companyId, createdBy: userId })
        .select("id")
        .single();
      if (data) supplierTypeIds[typeName] = data.id;
    }
  }

  // Customer types
  const customerTypeNames = ["OEM", "Distributor", "End User"];
  const customerTypeIds: Record<string, string> = {};
  for (const typeName of customerTypeNames) {
    const { data: existing } = await client
      .from("customerType")
      .select("id")
      .eq("name", typeName)
      .eq("companyId", companyId)
      .limit(1)
      .maybeSingle();

    if (existing) {
      customerTypeIds[typeName] = existing.id;
    } else {
      const { data } = await client
        .from("customerType")
        .insert({ name: typeName, companyId, createdBy: userId })
        .select("id")
        .single();
      if (data) customerTypeIds[typeName] = data.id;
    }
  }

  // Suppliers
  const suppliersData = [
    {
      name: "Acme Steel Supply",
      typeKey: "Raw Material",
      contact: { firstName: "Michael", lastName: "Torres", email: "mtorres@acmesteel.com", workPhone: "+1-312-555-0101" },
      address: { addressLine1: "4500 Industrial Blvd", city: "Chicago", state: "IL", postalCode: "60632" },
    },
    {
      name: "Pacific Electronics",
      typeKey: "Electronics",
      contact: { firstName: "Sarah", lastName: "Chen", email: "schen@pacificelectronics.com", workPhone: "+1-408-555-0202" },
      address: { addressLine1: "1200 Technology Drive", city: "San Jose", state: "CA", postalCode: "95110" },
    },
    {
      name: "FastCNC Services",
      typeKey: "Contract Manufacturing",
      contact: { firstName: "David", lastName: "Kim", email: "dkim@fastcnc.com", workPhone: "+1-469-555-0303" },
      address: { addressLine1: "890 Precision Way", city: "Dallas", state: "TX", postalCode: "75201" },
    },
  ];

  const supplierIds: Record<string, string> = {};
  for (const s of suppliersData) {
    const { data: existing } = await client
      .from("supplier")
      .select("id")
      .eq("name", s.name)
      .eq("companyId", companyId)
      .limit(1)
      .maybeSingle();

    if (existing) {
      supplierIds[s.name] = existing.id;
      continue;
    }

    const { data: supplierData } = await client
      .from("supplier")
      .insert({
        name: s.name,
        supplierTypeId: supplierTypeIds[s.typeKey],
        supplierStatus: "Active",
        companyId,
        createdBy: userId
      })
      .select("id")
      .single();

    if (!supplierData) continue;
    const supplierId = supplierData.id;
    supplierIds[s.name] = supplierId;

    const { data: addrData } = await client
      .from("address")
      .insert({
        addressLine1: s.address.addressLine1,
        city: s.address.city,
        stateProvince: s.address.state,
        postalCode: s.address.postalCode,
        companyId
      })
      .select("id")
      .single();

    if (addrData) {
      await client.from("supplierLocation").insert({
        supplierId,
        addressId: addrData.id,
        name: "Main Office"
      });
    }

    const { data: contactData } = await client
      .from("contact")
      .insert({
        firstName: s.contact.firstName,
        lastName: s.contact.lastName,
        email: s.contact.email,
        workPhone: s.contact.workPhone,
        companyId
      })
      .select("id")
      .single();

    if (contactData) {
      await client.from("supplierContact").insert({
        supplierId,
        contactId: contactData.id
      });
    }
  }

  // Get active customer status
  const { data: activeCustomerStatus } = await client
    .from("customerStatus")
    .select("id")
    .eq("name", "Active")
    .eq("companyId", companyId)
    .limit(1)
    .maybeSingle();

  const activeCustomerStatusId = activeCustomerStatus?.id;

  // Customers
  const customersData = [
    {
      name: "Precision Motors LLC",
      typeKey: "OEM",
      contact: { firstName: "Jennifer", lastName: "Walsh", email: "jwalsh@precisionmotors.com", workPhone: "+1-614-555-0401" },
      address: { addressLine1: "750 Motor Drive", city: "Columbus", state: "OH", postalCode: "43215" },
    },
    {
      name: "West Coast Robotics",
      typeKey: "Distributor",
      contact: { firstName: "Alex", lastName: "Nguyen", email: "anguyen@wcrobotics.com", workPhone: "+1-206-555-0502" },
      address: { addressLine1: "3200 Innovation Pkwy", city: "Seattle", state: "WA", postalCode: "98101" },
    },
    {
      name: "Northern Aerospace",
      typeKey: "OEM",
      contact: { firstName: "Robert", lastName: "Patel", email: "rpatel@northernaerospace.com", workPhone: "+1-617-555-0603" },
      address: { addressLine1: "1 Aerospace Blvd", city: "Boston", state: "MA", postalCode: "02108" },
    },
  ];

  const customerIds: Record<string, string> = {};
  for (const c of customersData) {
    const { data: existing } = await client
      .from("customer")
      .select("id")
      .eq("name", c.name)
      .eq("companyId", companyId)
      .limit(1)
      .maybeSingle();

    if (existing) {
      customerIds[c.name] = existing.id;
      continue;
    }

    const { data: customerData } = await client
      .from("customer")
      .insert({
        name: c.name,
        customerTypeId: customerTypeIds[c.typeKey],
        customerStatusId: activeCustomerStatusId,
        companyId,
        createdBy: userId
      })
      .select("id")
      .single();

    if (!customerData) continue;
    const customerId = customerData.id;
    customerIds[c.name] = customerId;

    const { data: addrData } = await client
      .from("address")
      .insert({
        addressLine1: c.address.addressLine1,
        city: c.address.city,
        stateProvince: c.address.state,
        postalCode: c.address.postalCode,
        companyId
      })
      .select("id")
      .single();

    if (addrData) {
      await client.from("customerLocation").insert({
        customerId,
        addressId: addrData.id,
        name: "Main Office"
      });
    }

    const { data: contactData } = await client
      .from("contact")
      .insert({
        firstName: c.contact.firstName,
        lastName: c.contact.lastName,
        email: c.contact.email,
        workPhone: c.contact.workPhone,
        companyId
      })
      .select("id")
      .single();

    if (contactData) {
      await client.from("customerContact").insert({
        customerId,
        contactId: contactData.id
      });
    }
  }

  // Departments
  const departmentNames = ["Engineering", "Manufacturing", "Operations", "Quality"];
  for (const deptName of departmentNames) {
    if (!(await rowExists("department", "name", deptName))) {
      await client.from("department").insert({
        name: deptName,
        companyId,
        createdBy: userId
      });
    }
  }

  // Cost centers
  const costCenterNames = ["Manufacturing Operations", "Engineering R&D", "General & Administrative"];
  for (const ccName of costCenterNames) {
    if (!(await rowExists("costCenter", "name", ccName))) {
      await client.from("costCenter").insert({
        name: ccName,
        companyId,
        createdBy: userId
      });
    }
  }

  // Warehouse
  const { data: existingWH } = await client
    .from("warehouse")
    .select("id")
    .eq("name", "Main Warehouse")
    .eq("companyId", companyId)
    .limit(1)
    .maybeSingle();

  if (!existingWH) {
    await client.from("warehouse").insert({
      name: "Main Warehouse",
      locationId,
      companyId,
      createdBy: userId
    });
  }

  // Items - expanded list
  const itemsData = [
    {
      readableId: "STEEL-ROD-01",
      name: "1020 Steel Rod 1 inch",
      description: "Cold-rolled 1020 steel rod, 1\" diameter",
      type: "Material",
      replenishmentSystem: "Buy",
      itemTrackingType: "Inventory",
      uom: "EA",
    },
    {
      readableId: "ALUMINUM-SHEET",
      name: "Aluminum Sheet 6061-T6",
      description: "4x8 ft aluminum sheet, 0.125\" thick",
      type: "Material",
      replenishmentSystem: "Buy",
      itemTrackingType: "Inventory",
      uom: "EA",
    },
    {
      readableId: "PLASTIC-PELLETS",
      name: "ABS Plastic Pellets",
      description: "Black ABS injection molding pellets",
      type: "Material",
      replenishmentSystem: "Buy",
      itemTrackingType: "Inventory",
      uom: "LB",
    },
    {
      readableId: "BEARING-6205",
      name: "6205 Deep Groove Bearing",
      description: "SKF 6205-2RS deep groove ball bearing",
      type: "Part",
      replenishmentSystem: "Buy",
      itemTrackingType: "Inventory",
      uom: "EA",
    },
    {
      readableId: "BEARING-6206",
      name: "6206 Deep Groove Bearing",
      description: "SKF 6206-2RS deep groove ball bearing",
      type: "Part",
      replenishmentSystem: "Buy",
      itemTrackingType: "Inventory",
      uom: "EA",
    },
    {
      readableId: "BRACKET-001",
      name: "Mounting Bracket A",
      description: "Machined aluminum mounting bracket, Type A",
      type: "Part",
      replenishmentSystem: "Make",
      itemTrackingType: "Inventory",
      uom: "EA",
    },
    {
      readableId: "BRACKET-002",
      name: "Mounting Bracket B",
      description: "Machined aluminum mounting bracket, Type B",
      type: "Part",
      replenishmentSystem: "Make",
      itemTrackingType: "Inventory",
      uom: "EA",
    },
    {
      readableId: "SHAFT-ASM-001",
      name: "Drive Shaft Assembly",
      description: "Precision-machined drive shaft assembly",
      type: "Part",
      replenishmentSystem: "Make",
      itemTrackingType: "Inventory",
      uom: "EA",
    },
    {
      readableId: "GEAR-SPUR-10T",
      name: "Spur Gear 10 Tooth",
      description: "Hardened steel spur gear, 10 teeth",
      type: "Part",
      replenishmentSystem: "Buy",
      itemTrackingType: "Inventory",
      uom: "EA",
    },
    {
      readableId: "CTRL-PCB-001",
      name: "Control PCB Rev2",
      description: "Motor control printed circuit board, revision 2",
      type: "Part",
      replenishmentSystem: "Buy",
      itemTrackingType: "Inventory",
      uom: "EA",
    },
    {
      readableId: "SENSOR-TEMP-01",
      name: "Temperature Sensor K-Type",
      description: "Thermocouple temperature sensor",
      type: "Part",
      replenishmentSystem: "Buy",
      itemTrackingType: "Inventory",
      uom: "EA",
    },
    {
      readableId: "MOTOR-STEPPER-01",
      name: "NEMA 23 Stepper Motor",
      description: "2.8A stepper motor with encoder",
      type: "Part",
      replenishmentSystem: "Buy",
      itemTrackingType: "Inventory",
      uom: "EA",
    },
    {
      readableId: "CABLE-PWR-01",
      name: "Power Cable 18AWG",
      description: "Stranded copper power cable",
      type: "Part",
      replenishmentSystem: "Buy",
      itemTrackingType: "Inventory",
      uom: "FT",
    },
    {
      readableId: "FASTENER-KIT-01",
      name: "M6 Fastener Kit",
      description: "M6 bolts, nuts, and washers kit (50 pcs)",
      type: "Consumable",
      replenishmentSystem: "Buy",
      itemTrackingType: "Inventory",
      uom: "EA",
    },
    {
      readableId: "FASTENER-KIT-02",
      name: "M8 Fastener Kit",
      description: "M8 bolts, nuts, and washers kit (50 pcs)",
      type: "Consumable",
      replenishmentSystem: "Buy",
      itemTrackingType: "Inventory",
      uom: "EA",
    },
    {
      readableId: "GREASE-TUBE",
      name: "Lithium Grease",
      description: "Multi-purpose lithium grease tube",
      type: "Consumable",
      replenishmentSystem: "Buy",
      itemTrackingType: "Inventory",
      uom: "EA",
    },
    {
      readableId: "CUTTING-FLUID",
      name: "CNC Cutting Fluid",
      description: "Water-soluble cutting fluid concentrate",
      type: "Consumable",
      replenishmentSystem: "Buy",
      itemTrackingType: "Inventory",
      uom: "GAL",
    },
    {
      readableId: "ASSEMBLY-MOTOR-001",
      name: "Electric Motor Assembly M1",
      description: "Complete electric motor assembly with housing",
      type: "Product",
      replenishmentSystem: "Make",
      itemTrackingType: "Inventory",
      uom: "EA",
    },
    {
      readableId: "ASSEMBLY-PUMP-001",
      name: "Hydraulic Pump Assembly P1",
      description: "Hydraulic pump with mounting bracket",
      type: "Product",
      replenishmentSystem: "Make",
      itemTrackingType: "Inventory",
      uom: "EA",
    },
    {
      readableId: "ASSEMBLY-CTRL-001",
      name: "Control Unit Assembly C1",
      description: "Complete control unit with PCB and housing",
      type: "Product",
      replenishmentSystem: "Make",
      itemTrackingType: "Inventory",
      uom: "EA",
    },
  ];

  console.log(`[seedFullDemoData] Seeding ${itemsData.length} items...`);
  const itemIds: Record<string, string> = {};
  for (const item of itemsData) {
    try {
      const { data: existing } = await client
        .from("item")
        .select("id")
        .eq("readableId", item.readableId)
        .eq("companyId", companyId)
        .limit(1)
        .maybeSingle();

      if (existing) {
        itemIds[item.readableId] = existing.id;
        console.log(`[seedFullDemoData] Item ${item.readableId} already exists`);
        continue;
      }

      const { data, error } = await client
        .from("item")
        .insert({
          readableId: item.readableId,
          name: item.name,
          description: item.description,
          type: item.type,
          replenishmentSystem: item.replenishmentSystem,
          itemTrackingType: item.itemTrackingType,
          unitOfMeasureCode: item.uom,
          active: true,
          companyId,
          createdBy: userId
        })
        .select("id")
        .single();

      if (error) {
        console.error(`[seedFullDemoData] Error creating item ${item.readableId}:`, error);
      } else if (data) {
        itemIds[item.readableId] = data.id;
        console.log(`[seedFullDemoData] Created item ${item.readableId}`);
      }
    } catch (err) {
      console.error(`[seedFullDemoData] Exception creating item ${item.readableId}:`, err);
    }
  }

  console.log(`[seedFullDemoData] Completed. Created ${Object.keys(itemIds).length} items`);
  } catch (err) {
    console.error("[seedFullDemoData] Fatal error:", err);
    throw err;
  }
}
