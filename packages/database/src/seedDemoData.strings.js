"use strict";
/**
 * Locale-aware display strings for the demo seed.
 *
 * Each entity has a stable `key` (always English) used as the in-process map
 * key, and a locale-specific `name` (and optionally `description`) stored in
 * the database.  Downstream code continues to look up IDs by the English key,
 * so only this file needs to change when adding a new locale.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSeedLocale = getSeedLocale;
var en = {
    suppliers: [
        {
            key: "Acme Steel Supply",
            name: "Acme Steel Supply",
            readableId: "ACME-STEEL",
            typeKey: "Raw Material",
            contact: {
                firstName: "Michael",
                lastName: "Torres",
                email: "mtorres@acmesteel.com",
                workPhone: "+1-312-555-0101"
            },
            address: {
                addressLine1: "4500 Industrial Blvd",
                city: "Chicago",
                state: "IL",
                postalCode: "60632"
            }
        },
        {
            key: "Pacific Electronics",
            name: "Pacific Electronics",
            readableId: "PACIFIC-ELEC",
            typeKey: "Electronics",
            contact: {
                firstName: "Sarah",
                lastName: "Chen",
                email: "schen@pacificelectronics.com",
                workPhone: "+1-408-555-0202"
            },
            address: {
                addressLine1: "1200 Technology Drive",
                city: "San Jose",
                state: "CA",
                postalCode: "95110"
            }
        },
        {
            key: "FastCNC Services",
            name: "FastCNC Services",
            readableId: "FASTCNC",
            typeKey: "Contract Manufacturing",
            contact: {
                firstName: "David",
                lastName: "Kim",
                email: "dkim@fastcnc.com",
                workPhone: "+1-469-555-0303"
            },
            address: {
                addressLine1: "890 Precision Way",
                city: "Dallas",
                state: "TX",
                postalCode: "75201"
            }
        }
    ],
    customers: [
        {
            key: "Precision Motors LLC",
            name: "Precision Motors LLC",
            readableId: "PRECISION-MOTORS",
            typeKey: "OEM",
            contact: {
                firstName: "Jennifer",
                lastName: "Walsh",
                email: "jwalsh@precisionmotors.com",
                workPhone: "+1-614-555-0401"
            },
            address: {
                addressLine1: "750 Motor Drive",
                city: "Columbus",
                state: "OH",
                postalCode: "43215"
            }
        },
        {
            key: "West Coast Robotics",
            name: "West Coast Robotics",
            readableId: "WESTCOAST-ROBOTICS",
            typeKey: "Distributor",
            contact: {
                firstName: "Alex",
                lastName: "Nguyen",
                email: "anguyen@wcrobotics.com",
                workPhone: "+1-206-555-0502"
            },
            address: {
                addressLine1: "3200 Innovation Pkwy",
                city: "Seattle",
                state: "WA",
                postalCode: "98101"
            }
        },
        {
            key: "Northern Aerospace",
            name: "Northern Aerospace",
            readableId: "NORTHERN-AERO",
            typeKey: "End User",
            contact: {
                firstName: "Marcus",
                lastName: "Jensen",
                email: "mjensen@northernaero.com",
                workPhone: "+1-763-555-0603"
            },
            address: {
                addressLine1: "5800 Aerospace Blvd",
                city: "Minneapolis",
                state: "MN",
                postalCode: "55411"
            }
        }
    ],
    shippingMethods: [
        { name: "UPS Ground", carrier: "UPS" },
        { name: "FedEx 2-Day", carrier: "FedEx" },
        { name: "USPS Priority Mail", carrier: "USPS" }
    ],
    processes: [
        {
            key: "CNC Machining",
            name: "CNC Machining",
            factor: "Minutes/Piece",
            type: "Inside"
        },
        {
            key: "Assembly",
            name: "Assembly",
            factor: "Hours/Piece",
            type: "Inside"
        },
        {
            key: "Quality Inspection",
            name: "Quality Inspection",
            factor: "Minutes/Piece",
            type: "Inside"
        },
        {
            key: "Welding",
            name: "Welding",
            factor: "Minutes/Piece",
            type: "Inside"
        },
        {
            key: "Cutting",
            name: "Cutting",
            factor: "Minutes/Piece",
            type: "Inside"
        },
        { key: "Sewing", name: "Sewing", factor: "Minutes/Piece", type: "Inside" },
        {
            key: "Finishing",
            name: "Finishing",
            factor: "Minutes/Piece",
            type: "Inside"
        }
    ],
    workCenters: [
        {
            key: "CNC Mill #1",
            name: "CNC Mill #1",
            description: "3-axis CNC milling center",
            laborRate: 50,
            machineRate: 100,
            processes: ["CNC Machining", "Quality Inspection"]
        },
        {
            key: "Assembly Station 1",
            name: "Assembly Station 1",
            description: "General assembly bench",
            laborRate: 40,
            machineRate: 0,
            processes: ["Assembly"]
        },
        {
            key: "Welding Cell A",
            name: "Welding Cell A",
            description: "MIG/TIG welding station",
            laborRate: 55,
            machineRate: 65,
            processes: ["Welding"]
        },
        {
            key: "Cutting Table 1",
            name: "Cutting Table 1",
            description: "Fabric spreading and cutting station with rotary cutter",
            laborRate: 35,
            machineRate: 20,
            processes: ["Cutting", "Quality Inspection"]
        },
        {
            key: "Sewing Line A",
            name: "Sewing Line A",
            description: "Industrial sewing machine line for garment assembly",
            laborRate: 30,
            machineRate: 15,
            processes: ["Sewing", "Finishing"]
        }
    ],
    items: [
        {
            readableId: "STEEL-ROD-01",
            name: "1020 Steel Rod 1 inch",
            description: 'Cold-rolled 1020 steel rod, 1" diameter',
            type: "Material",
            replenishmentSystem: "Buy",
            itemTrackingType: "Inventory",
            uom: "EA"
        },
        {
            readableId: "BEARING-6205",
            name: "6205 Deep Groove Bearing",
            description: "SKF 6205-2RS deep groove ball bearing",
            type: "Part",
            replenishmentSystem: "Buy",
            itemTrackingType: "Inventory",
            uom: "EA"
        },
        {
            readableId: "BRACKET-001",
            name: "Mounting Bracket A",
            description: "Machined aluminum mounting bracket, Type A",
            type: "Part",
            replenishmentSystem: "Make",
            itemTrackingType: "Inventory",
            uom: "EA"
        },
        {
            readableId: "SHAFT-ASM-001",
            name: "Drive Shaft Assembly",
            description: "Precision-machined drive shaft assembly",
            type: "Part",
            replenishmentSystem: "Make",
            itemTrackingType: "Inventory",
            uom: "EA"
        },
        {
            readableId: "CTRL-PCB-001",
            name: "Control PCB Rev2",
            description: "Motor control printed circuit board, revision 2",
            type: "Part",
            replenishmentSystem: "Buy",
            itemTrackingType: "Inventory",
            uom: "EA"
        },
        {
            readableId: "FASTENER-KIT-01",
            name: "M6 Fastener Kit",
            description: "M6 bolts, nuts, and washers kit (50 pcs)",
            type: "Consumable",
            replenishmentSystem: "Buy",
            itemTrackingType: "Inventory",
            uom: "EA"
        },
        {
            readableId: "TSHIRT-001",
            name: "Classic Cotton T-Shirt",
            description: "100% cotton crew-neck t-shirt, available in S–2XL and multiple colors",
            type: "Part",
            replenishmentSystem: "Make",
            itemTrackingType: "Inventory",
            uom: "EA"
        },
        {
            readableId: "JACKET-001",
            name: "Denim Work Jacket",
            description: "Heavy-duty denim jacket with snap buttons, sized S–2XL",
            type: "Part",
            replenishmentSystem: "Make",
            itemTrackingType: "Inventory",
            uom: "EA"
        },
        {
            readableId: "FABRIC-CTN-01",
            name: "Cotton Fabric (per meter)",
            description: "180 GSM cotton jersey fabric, natural white",
            type: "Part",
            replenishmentSystem: "Buy",
            itemTrackingType: "Inventory",
            uom: "MT"
        },
        {
            readableId: "THREAD-PLY-01",
            name: "Polyester Thread (500m)",
            description: "40/2 polyester sewing thread, 500m spool",
            type: "Consumable",
            replenishmentSystem: "Buy",
            itemTrackingType: "Inventory",
            uom: "EA"
        }
    ],
    postingGroups: [
        { name: "Finished Goods", description: "Manufactured finished products" },
        { name: "Raw Materials", description: "Raw material inputs" },
        { name: "Purchased Parts", description: "Bought-in components" },
        { name: "Consumables", description: "Low-value consumable items" }
    ],
    abilities: [
        "CNC Machining",
        "TIG Welding",
        "MIG Welding",
        "Assembly",
        "Quality Inspection",
        "Forklift Operation"
    ],
    shifts: [
        {
            key: "Day Shift",
            name: "Day Shift",
            start: "07:00:00",
            end: "15:00:00",
            mon: true,
            tue: true,
            wed: true,
            thu: true,
            fri: true
        },
        {
            key: "Night Shift",
            name: "Night Shift",
            start: "15:00:00",
            end: "23:00:00",
            mon: true,
            tue: true,
            wed: true,
            thu: true,
            fri: true
        }
    ],
    holidays: [
        { name: "New Year's Day", date: "2026-01-01" },
        { name: "Independence Day", date: "2026-07-04" },
        { name: "Thanksgiving", date: "2026-11-26" },
        { name: "Christmas Day", date: "2026-12-25" }
    ],
    configParams: {
        sizeLabel: "Size",
        colorLabel: "Color",
        sizeOptions: ["S", "M", "L", "XL", "2XL"],
        colorOptions: ["Black", "White", "Navy", "Red"]
    },
    garmentOps: {
        tshirtCutDesc: "Cutting",
        tshirtSewDesc: "Sewing",
        tshirtPressDesc: "Pressing",
        tshirtQiDesc: "QC",
        jacketCutDesc: "Cutting",
        jacketSewDesc: "Sewing",
        jacketHardwareDesc: "Hardware",
        jacketQiDesc: "QC"
    },
    mesItems: [
        {
            readableId: "VALVE-BODY-001",
            name: "Valve Body",
            description: "Cast iron valve body, 1-inch NPT"
        },
        {
            readableId: "GEAR-A-001",
            name: "Spur Gear A",
            description: "Steel spur gear, module 2, 40 teeth"
        },
        {
            readableId: "FRAME-001",
            name: "Welded Frame Assembly",
            description: "Steel tube welded frame assembly"
        },
        {
            readableId: "HOUSING-001",
            name: "Bearing Housing",
            description: "Machined bearing housing, 6205 bore"
        }
    ]
};
var zh = {
    suppliers: [
        {
            key: "Acme Steel Supply",
            name: "华钢材料供应",
            readableId: "ACME-STEEL",
            typeKey: "Raw Material",
            contact: {
                firstName: "伟",
                lastName: "张",
                email: "w.zhang@huagang.cn",
                workPhone: "+86-21-5555-0101"
            },
            address: {
                addressLine1: "工业大道4500号",
                city: "上海",
                state: "上海",
                postalCode: "200000"
            }
        },
        {
            key: "Pacific Electronics",
            name: "泛太电子",
            readableId: "PACIFIC-ELEC",
            typeKey: "Electronics",
            contact: {
                firstName: "芳",
                lastName: "李",
                email: "f.li@pantai-elec.cn",
                workPhone: "+86-755-5555-0202"
            },
            address: {
                addressLine1: "科技路1200号",
                city: "深圳",
                state: "广东",
                postalCode: "518000"
            }
        },
        {
            key: "FastCNC Services",
            name: "精速数控",
            readableId: "FASTCNC",
            typeKey: "Contract Manufacturing",
            contact: {
                firstName: "明",
                lastName: "王",
                email: "m.wang@jingsucnc.cn",
                workPhone: "+86-512-5555-0303"
            },
            address: {
                addressLine1: "精密工业路890号",
                city: "苏州",
                state: "江苏",
                postalCode: "215000"
            }
        }
    ],
    customers: [
        {
            key: "Precision Motors LLC",
            name: "精密电机有限公司",
            readableId: "PRECISION-MOTORS",
            typeKey: "OEM",
            contact: {
                firstName: "丽",
                lastName: "陈",
                email: "l.chen@jinmidianji.cn",
                workPhone: "+86-571-5555-0401"
            },
            address: {
                addressLine1: "电机大道750号",
                city: "杭州",
                state: "浙江",
                postalCode: "310000"
            }
        },
        {
            key: "West Coast Robotics",
            name: "西部机器人科技",
            readableId: "WESTCOAST-ROBOTICS",
            typeKey: "Distributor",
            contact: {
                firstName: "强",
                lastName: "刘",
                email: "q.liu@xibujiqiren.cn",
                workPhone: "+86-28-5555-0502"
            },
            address: {
                addressLine1: "创新大道3200号",
                city: "成都",
                state: "四川",
                postalCode: "610000"
            }
        },
        {
            key: "Northern Aerospace",
            name: "北方航空工业",
            readableId: "NORTHERN-AERO",
            typeKey: "End User",
            contact: {
                firstName: "军",
                lastName: "赵",
                email: "j.zhao@beifanghangkong.cn",
                workPhone: "+86-24-5555-0603"
            },
            address: {
                addressLine1: "航空路5800号",
                city: "沈阳",
                state: "辽宁",
                postalCode: "110000"
            }
        }
    ],
    shippingMethods: [
        { name: "顺丰标准", carrier: "UPS" },
        { name: "中通快递", carrier: "FedEx" },
        { name: "邮政优先", carrier: "USPS" }
    ],
    processes: [
        {
            key: "CNC Machining",
            name: "数控加工",
            factor: "Minutes/Piece",
            type: "Inside"
        },
        { key: "Assembly", name: "装配", factor: "Hours/Piece", type: "Inside" },
        {
            key: "Quality Inspection",
            name: "质量检验",
            factor: "Minutes/Piece",
            type: "Inside"
        },
        { key: "Welding", name: "焊接", factor: "Minutes/Piece", type: "Inside" },
        { key: "Cutting", name: "裁剪", factor: "Minutes/Piece", type: "Inside" },
        { key: "Sewing", name: "缝制", factor: "Minutes/Piece", type: "Inside" },
        { key: "Finishing", name: "整理", factor: "Minutes/Piece", type: "Inside" }
    ],
    workCenters: [
        {
            key: "CNC Mill #1",
            name: "数控铣床1号",
            description: "三轴数控加工中心",
            laborRate: 50,
            machineRate: 100,
            processes: ["CNC Machining", "Quality Inspection"]
        },
        {
            key: "Assembly Station 1",
            name: "装配工位1",
            description: "通用装配工作台",
            laborRate: 40,
            machineRate: 0,
            processes: ["Assembly"]
        },
        {
            key: "Welding Cell A",
            name: "焊接工位A",
            description: "MIG/TIG焊接站",
            laborRate: 55,
            machineRate: 65,
            processes: ["Welding"]
        },
        {
            key: "Cutting Table 1",
            name: "裁剪台1",
            description: "面料铺展与裁剪工作台，配备旋转裁刀",
            laborRate: 35,
            machineRate: 20,
            processes: ["Cutting", "Quality Inspection"]
        },
        {
            key: "Sewing Line A",
            name: "缝纫线A",
            description: "工业缝纫机流水线，用于服装装配",
            laborRate: 30,
            machineRate: 15,
            processes: ["Sewing", "Finishing"]
        }
    ],
    items: [
        {
            readableId: "STEEL-ROD-01",
            name: "1020钢棒 25mm",
            description: "冷拔1020钢棒，直径25mm",
            type: "Material",
            replenishmentSystem: "Buy",
            itemTrackingType: "Inventory",
            uom: "EA"
        },
        {
            readableId: "BEARING-6205",
            name: "6205深沟球轴承",
            description: "SKF 6205-2RS深沟球轴承",
            type: "Part",
            replenishmentSystem: "Buy",
            itemTrackingType: "Inventory",
            uom: "EA"
        },
        {
            readableId: "BRACKET-001",
            name: "安装支架A型",
            description: "铝合金安装支架，A型",
            type: "Part",
            replenishmentSystem: "Make",
            itemTrackingType: "Inventory",
            uom: "EA"
        },
        {
            readableId: "SHAFT-ASM-001",
            name: "驱动轴总成",
            description: "精密加工驱动轴总成",
            type: "Part",
            replenishmentSystem: "Make",
            itemTrackingType: "Inventory",
            uom: "EA"
        },
        {
            readableId: "CTRL-PCB-001",
            name: "控制电路板Rev2",
            description: "电机控制印制电路板，第二版",
            type: "Part",
            replenishmentSystem: "Buy",
            itemTrackingType: "Inventory",
            uom: "EA"
        },
        {
            readableId: "FASTENER-KIT-01",
            name: "M6紧固件套装",
            description: "M6螺栓、螺母和垫圈套装（50件）",
            type: "Consumable",
            replenishmentSystem: "Buy",
            itemTrackingType: "Inventory",
            uom: "EA"
        },
        {
            readableId: "TSHIRT-001",
            name: "经典棉质T恤",
            description: "100%纯棉圆领T恤，S–2XL多色可选",
            type: "Part",
            replenishmentSystem: "Make",
            itemTrackingType: "Inventory",
            uom: "EA"
        },
        {
            readableId: "JACKET-001",
            name: "牛仔工作夹克",
            description: "重磅牛仔夹克，按扣设计，S–2XL",
            type: "Part",
            replenishmentSystem: "Make",
            itemTrackingType: "Inventory",
            uom: "EA"
        },
        {
            readableId: "FABRIC-CTN-01",
            name: "棉布面料（每米）",
            description: "180克棉质针织布，本白色",
            type: "Part",
            replenishmentSystem: "Buy",
            itemTrackingType: "Inventory",
            uom: "MT"
        },
        {
            readableId: "THREAD-PLY-01",
            name: "涤纶缝纫线（500米）",
            description: "40/2涤纶缝纫线，500米/筒",
            type: "Consumable",
            replenishmentSystem: "Buy",
            itemTrackingType: "Inventory",
            uom: "EA"
        }
    ],
    postingGroups: [
        { name: "成品", description: "制造成品" },
        { name: "原材料", description: "原材料投入" },
        { name: "采购件", description: "外购零部件" },
        { name: "耗材", description: "低值耗材" }
    ],
    abilities: ["数控加工", "TIG焊接", "MIG焊接", "装配", "质量检验", "叉车操作"],
    shifts: [
        {
            key: "Day Shift",
            name: "白班",
            start: "07:00:00",
            end: "15:00:00",
            mon: true,
            tue: true,
            wed: true,
            thu: true,
            fri: true
        },
        {
            key: "Night Shift",
            name: "夜班",
            start: "15:00:00",
            end: "23:00:00",
            mon: true,
            tue: true,
            wed: true,
            thu: true,
            fri: true
        }
    ],
    holidays: [
        { name: "元旦", date: "2026-01-01" },
        { name: "春节", date: "2026-01-28" },
        { name: "劳动节", date: "2026-05-01" },
        { name: "国庆节", date: "2026-10-01" }
    ],
    configParams: {
        sizeLabel: "尺码",
        colorLabel: "颜色",
        sizeOptions: ["S", "M", "L", "XL", "2XL"],
        colorOptions: ["黑色", "白色", "藏青色", "红色"]
    },
    garmentOps: {
        tshirtCutDesc: "裁剪",
        tshirtSewDesc: "缝制",
        tshirtPressDesc: "熨烫",
        tshirtQiDesc: "质检",
        jacketCutDesc: "裁剪",
        jacketSewDesc: "缝制",
        jacketHardwareDesc: "五金",
        jacketQiDesc: "质检"
    },
    mesItems: [
        {
            readableId: "VALVE-BODY-001",
            name: "阀体",
            description: "铸铁阀体，1英寸NPT螺纹"
        },
        {
            readableId: "GEAR-A-001",
            name: "直齿轮A型",
            description: "钢制直齿轮，模数2，40齿"
        },
        {
            readableId: "FRAME-001",
            name: "焊接框架总成",
            description: "钢管焊接框架总成"
        },
        {
            readableId: "HOUSING-001",
            name: "轴承座",
            description: "精加工轴承座，6205孔径"
        }
    ]
};
function getSeedLocale(language) {
    if (language === "zh")
        return zh;
    return en;
}
