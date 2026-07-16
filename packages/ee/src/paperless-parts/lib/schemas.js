"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderSchema = exports.ShipmentSchema = exports.ShippingOptionSchema = exports.PaymentDetailsSchema = exports.OrderItemSchema = exports.ComponentSchema = exports.ShopOperationSchema = exports.ShopOperationQuantitySchema = exports.CostingVariableSchema = exports.FacilitySchema = exports.SalesPersonSchema = exports.CustomerSchema = exports.CompanySchema = exports.ContactSchema = exports.AccountSchema = exports.AccountMetricsSchema = exports.AddressSchema = void 0;
var zod_1 = require("zod");
// Address schema
exports.AddressSchema = zod_1.z.object({
    id: zod_1.z.number().optional().nullable(),
    erp_code: zod_1.z.string().optional().nullable(),
    attention: zod_1.z.string().optional().nullable(),
    address1: zod_1.z.string().optional().nullable(),
    address2: zod_1.z.string().optional().nullable(),
    business_name: zod_1.z.string().optional().nullable(),
    city: zod_1.z.string().optional().nullable(),
    country: zod_1.z.string().optional().nullable(),
    facility_name: zod_1.z.string().optional().nullable(),
    phone: zod_1.z.string().optional().nullable(),
    phone_ext: zod_1.z.string().optional().nullable(),
    postal_code: zod_1.z.string().optional().nullable(),
    state: zod_1.z.string().optional().nullable()
});
// Account metrics schema
exports.AccountMetricsSchema = zod_1.z.object({
    order_revenue_all_time: zod_1.z.number().optional().nullable(),
    order_revenue_last_thirty_days: zod_1.z.number().optional().nullable(),
    quotes_sent_all_time: zod_1.z.number().optional().nullable(),
    quotes_sent_last_thirty_days: zod_1.z.number().optional().nullable()
});
// Account schema
exports.AccountSchema = zod_1.z.object({
    erp_code: zod_1.z.string().optional().nullable(),
    id: zod_1.z.number().optional().nullable(),
    metrics: exports.AccountMetricsSchema.optional().nullable(),
    notes: zod_1.z.string().optional().nullable(),
    name: zod_1.z.string().optional().nullable(),
    payment_terms: zod_1.z.string().optional().nullable(),
    payment_terms_period: zod_1.z.number().optional().nullable()
});
// Contact schema
exports.ContactSchema = zod_1.z.object({
    account: exports.AccountSchema.optional().nullable(),
    email: zod_1.z.string().email().optional().nullable(),
    first_name: zod_1.z.string().optional().nullable(),
    id: zod_1.z.number().optional().nullable(),
    last_name: zod_1.z.string().optional().nullable(),
    notes: zod_1.z.string().optional().nullable(),
    phone: zod_1.z.string().optional().nullable(),
    phone_ext: zod_1.z.string().optional().nullable()
});
// Company schema for customer
exports.CompanySchema = zod_1.z.object({
    business_name: zod_1.z.string().optional().nullable(),
    erp_code: zod_1.z.string().optional().nullable(),
    id: zod_1.z.number().optional().nullable(),
    metrics: exports.AccountMetricsSchema.optional().nullable(),
    notes: zod_1.z.string().optional().nullable(),
    phone: zod_1.z.string().optional().nullable(),
    phone_ext: zod_1.z.string().optional().nullable()
});
// Customer schema
exports.CustomerSchema = zod_1.z.object({
    id: zod_1.z.number().optional().nullable(),
    company: exports.CompanySchema.optional().nullable(),
    email: zod_1.z.string().email().optional().nullable(),
    first_name: zod_1.z.string().optional().nullable(),
    last_name: zod_1.z.string().optional().nullable(),
    notes: zod_1.z.string().optional().nullable(),
    phone: zod_1.z.string().optional().nullable(),
    phone_ext: zod_1.z.string().optional().nullable()
});
// Sales person schema
exports.SalesPersonSchema = zod_1.z.object({
    first_name: zod_1.z.string().optional().nullable(),
    last_name: zod_1.z.string().optional().nullable(),
    avatar_color: zod_1.z.string().optional().nullable(),
    email: zod_1.z.string().email().optional().nullable(),
    erp_code: zod_1.z.string().optional().nullable()
});
// Facility schema
exports.FacilitySchema = zod_1.z.object({
    name: zod_1.z.string().optional().nullable(),
    address: exports.AddressSchema.optional().nullable(),
    is_default: zod_1.z.boolean().optional().nullable(),
    phone: zod_1.z.string().optional().nullable(),
    phone_ext: zod_1.z.string().optional().nullable(),
    url: zod_1.z.string().optional().nullable()
});
// Costing variable schema
exports.CostingVariableSchema = zod_1.z.object({
    label: zod_1.z.string().optional().nullable(),
    variable_class: zod_1.z.string().optional().nullable(),
    value_type: zod_1.z
        .enum(["number", "currency", "boolean", "string", "table", "date"])
        .nullable()
        .optional()
        .nullable(),
    value: zod_1.z.any().optional().nullable(),
    row: zod_1.z.record(zod_1.z.string(), zod_1.z.unknown()).optional().nullable(),
    options: zod_1.z.unknown().optional().nullable(),
    type: zod_1.z
        .enum(["number", "currency", "boolean", "string", "table", "date"])
        .nullable()
        .optional()
        .nullable()
});
// Shop operation quantity schema
exports.ShopOperationQuantitySchema = zod_1.z.object({
    price: zod_1.z.string().optional().nullable(), // API returns as string
    manual_price: zod_1.z.string().optional().nullable(),
    lead_time: zod_1.z.number().optional().nullable(),
    manual_lead_time: zod_1.z.number().optional().nullable(),
    quantity: zod_1.z.number().optional().nullable()
});
// Shop operation schema
exports.ShopOperationSchema = zod_1.z.object({
    id: zod_1.z.number().optional().nullable(),
    category: zod_1.z.string().optional().nullable(),
    cost: zod_1.z.string().optional().nullable(), // API returns as string
    costing_variables: zod_1.z.array(exports.CostingVariableSchema).optional().nullable(),
    is_finish: zod_1.z.boolean().optional().nullable(),
    is_outside_service: zod_1.z.boolean().optional().nullable(),
    name: zod_1.z.string().optional().nullable(),
    operation_definition_name: zod_1.z.string().optional().nullable(),
    operation_definition_erp_code: zod_1.z.string().optional().nullable(),
    notes: zod_1.z.string().optional().nullable(),
    quantities: zod_1.z.array(exports.ShopOperationQuantitySchema).optional().nullable(),
    position: zod_1.z.number().optional().nullable(),
    runtime: zod_1.z.number().optional().nullable(),
    setup_time: zod_1.z.number().optional().nullable()
});
// Component schema
exports.ComponentSchema = zod_1.z.object({
    id: zod_1.z.number().optional().nullable(),
    child_ids: zod_1.z.array(zod_1.z.number()).optional().nullable(),
    children: zod_1.z.array(zod_1.z.unknown()).optional().nullable(), // TODO: array of child_id and quantity objects
    description: zod_1.z.string().optional().nullable(),
    export_controlled: zod_1.z.boolean().optional().nullable(),
    finishes: zod_1.z.array(zod_1.z.unknown()).optional().nullable(),
    innate_quantity: zod_1.z.number().optional().nullable(),
    is_assembly: zod_1.z.boolean().optional().nullable(),
    is_root_component: zod_1.z.boolean().optional().nullable(),
    material: zod_1.z.unknown().optional().nullable(),
    material_operations: zod_1.z.array(zod_1.z.unknown()).optional().nullable(), // TODO - similar to shop operations, but without runtime and setup time
    obtain_method: zod_1.z.string().optional().nullable(),
    parent_ids: zod_1.z.array(zod_1.z.number()).optional().nullable(),
    part_custom_attrs: zod_1.z.array(zod_1.z.unknown()).optional().nullable(),
    part_name: zod_1.z.string().optional().nullable(),
    part_number: zod_1.z.string().optional().nullable(),
    part_url: zod_1.z.string().url().optional().nullable(),
    part_uuid: zod_1.z.string().uuid().optional().nullable(),
    process: zod_1.z.unknown().optional().nullable(),
    purchased_component: zod_1.z.unknown().optional().nullable(), // TODO - object that leads to the purchased component table, can have shop operations,
    revision: zod_1.z.string().optional().nullable(),
    shop_operations: zod_1.z.array(exports.ShopOperationSchema).optional().nullable(),
    supporting_files: zod_1.z.array(zod_1.z.unknown()).optional().nullable(),
    thumbnail_url: zod_1.z.string().url().optional().nullable(),
    type: zod_1.z.string().optional().nullable(),
    deliver_quantity: zod_1.z.number().optional().nullable(),
    make_quantity: zod_1.z.number().optional().nullable()
});
// Order item schema
exports.OrderItemSchema = zod_1.z.object({
    id: zod_1.z.number().optional().nullable(),
    components: zod_1.z.array(exports.ComponentSchema).optional().nullable(),
    description: zod_1.z.string().optional().nullable(),
    expedite_revenue: zod_1.z.string().optional().nullable(), // API returns as string or null
    export_controlled: zod_1.z.boolean().optional().nullable(),
    filename: zod_1.z.string().optional().nullable(),
    lead_days: zod_1.z.number().optional().nullable(),
    markup_1_price: zod_1.z.string().optional().nullable(), // API returns as string
    markup_1_name: zod_1.z.string().optional().nullable(),
    markup_2_price: zod_1.z.string().optional().nullable(), // API returns as string
    markup_2_name: zod_1.z.string().optional().nullable(),
    private_notes: zod_1.z.string().optional().nullable(),
    public_notes: zod_1.z.string().optional().nullable(),
    quantity: zod_1.z.number().optional().nullable(),
    quantity_outstanding: zod_1.z.number().optional().nullable(),
    quote_item_id: zod_1.z.number().optional().nullable(),
    quote_item_type: zod_1.z.enum(["automatic", "manual"]).optional().nullable(),
    root_component_id: zod_1.z.number().optional().nullable(),
    ships_on: zod_1.z.string().optional().nullable(), // Date string
    total_price: zod_1.z.string().optional().nullable(), // API returns as string
    unit_price: zod_1.z.string().optional().nullable(), // API returns as string
    base_price: zod_1.z.string().optional().nullable(), // API returns as string
    add_on_fees: zod_1.z.unknown().optional().nullable(),
    unit_price_before_discounts: zod_1.z.string().optional().nullable(), // API returns as string
    ordered_add_ons: zod_1.z.array(zod_1.z.unknown()).optional().nullable(),
    pricing_items: zod_1.z.array(zod_1.z.unknown()).optional().nullable()
});
// Payment details schema
exports.PaymentDetailsSchema = zod_1.z.object({
    card_brand: zod_1.z.string().optional().nullable(),
    card_last4: zod_1.z.string().optional().nullable(),
    net_payout: zod_1.z.string().optional().nullable(), // API returns as string
    payment_type: zod_1.z.enum(["credit_card", "purchase_order"]).optional().nullable(),
    purchase_order_number: zod_1.z.string().optional().nullable(),
    purchasing_dept_contact_email: zod_1.z.string().email().optional().nullable(),
    purchasing_dept_contact_name: zod_1.z.string().optional().nullable(),
    shipping_cost: zod_1.z.string().optional().nullable(), // API returns as string
    subtotal: zod_1.z.string().optional().nullable(), // API returns as string
    tax_cost: zod_1.z.string().optional().nullable(), // API returns as string
    tax_rate: zod_1.z.string().optional().nullable(), // API returns as string
    payment_terms: zod_1.z.string().optional().nullable(),
    total_price: zod_1.z.string().optional().nullable() // API returns as string
});
// Shipping option schema
exports.ShippingOptionSchema = zod_1.z.object({
    customers_account_number: zod_1.z.string().optional().nullable(),
    customers_carrier: zod_1.z.string().optional().nullable(),
    shipping_method: zod_1.z.string().optional().nullable(),
    type: zod_1.z.string().optional().nullable()
});
// Shipment schema
exports.ShipmentSchema = zod_1.z.array(zod_1.z.unknown()); // Empty array in the example
// Main Order schema
exports.OrderSchema = zod_1.z.object({
    uuid: zod_1.z.string().uuid().optional().nullable(),
    billing_info: exports.AddressSchema.optional().nullable(),
    created: zod_1.z.string().optional().nullable(), // Loosened datetime restriction
    contact: exports.ContactSchema.optional().nullable(),
    customer: exports.CustomerSchema.optional().nullable(),
    deliver_by: zod_1.z.string().optional().nullable(),
    estimator: exports.SalesPersonSchema.optional().nullable(),
    send_from_facility: exports.FacilitySchema.optional().nullable(),
    erp_code: zod_1.z.string().optional().nullable(),
    number: zod_1.z.number().optional().nullable(),
    order_items: zod_1.z.array(exports.OrderItemSchema).optional().nullable(),
    payment_details: exports.PaymentDetailsSchema.optional().nullable(),
    private_notes: zod_1.z.string().optional().nullable(),
    purchase_order_file_url: zod_1.z.string().url().optional().nullable(),
    quote_erp_code: zod_1.z.string().optional().nullable(),
    quote_number: zod_1.z.number().optional().nullable(),
    quote_revision_number: zod_1.z.number().optional().nullable(),
    sales_person: exports.SalesPersonSchema.optional().nullable(),
    salesperson: exports.SalesPersonSchema.optional().nullable(),
    shipments: exports.ShipmentSchema.optional().nullable(),
    shipping_info: exports.AddressSchema.optional().nullable(),
    shipping_option: exports.ShippingOptionSchema.optional().nullable(),
    ships_on: zod_1.z.string().optional().nullable(), // Date string
    status: zod_1.z
        .enum([
        "pending",
        "confirmed",
        "on_hold",
        "in_process",
        "completed",
        "cancelled"
    ])
        .optional()
        .nullable(),
    quote_rfq_number: zod_1.z.string().optional().nullable()
});
