"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDatabase = seedDatabase;
const db_js_1 = require("../config/db.js");
const role_model_js_1 = require("../models/role.model.js");
const user_model_js_1 = require("../models/user.model.js");
const auth_model_js_1 = require("../models/auth.model.js");
const organization_model_js_1 = require("../models/organization.model.js");
const staff_model_js_1 = require("../models/staff.model.js");
const trainingCentre_model_js_1 = require("../models/trainingCentre.model.js");
const program_model_js_1 = require("../models/program.model.js");
const cohort_model_js_1 = require("../models/cohort.model.js");
const beneficiaryProfile_model_js_1 = require("../models/beneficiaryProfile.model.js");
const application_model_js_1 = require("../models/application.model.js");
const enrollment_model_js_1 = require("../models/enrollment.model.js");
const biometric_model_js_1 = require("../models/biometric.model.js");
const attendance_model_js_1 = require("../models/attendance.model.js");
const certificate_model_js_1 = require("../models/certificate.model.js");
const auditLog_model_js_1 = require("../models/auditLog.model.js");
const roles_js_1 = require("../constants/roles.js");
const permissions_js_1 = require("../constants/permissions.js");
const enums_js_1 = require("../constants/enums.js");
async function seedDatabase() {
    console.log("[Seed] Starting database initialization & seed...");
    await (0, db_js_1.connectDB)();
    // Clear existing collections
    await Promise.all([
        role_model_js_1.Role.deleteMany({}),
        role_model_js_1.Permission.deleteMany({}),
        user_model_js_1.User.deleteMany({}),
        auth_model_js_1.Auth.deleteMany({}),
        organization_model_js_1.Organization.deleteMany({}),
        staff_model_js_1.Staff.deleteMany({}),
        staff_model_js_1.Partner.deleteMany({}),
        staff_model_js_1.Volunteer.deleteMany({}),
        trainingCentre_model_js_1.TrainingCentre.deleteMany({}),
        trainingCentre_model_js_1.RoomFacility.deleteMany({}),
        trainingCentre_model_js_1.Asset.deleteMany({}),
        trainingCentre_model_js_1.DocumentRecord.deleteMany({}),
        program_model_js_1.SkillArea.deleteMany({}),
        program_model_js_1.Program.deleteMany({}),
        cohort_model_js_1.Cohort.deleteMany({}),
        cohort_model_js_1.TrainingSession.deleteMany({}),
        cohort_model_js_1.TrainingCalendarEvent.deleteMany({}),
        beneficiaryProfile_model_js_1.BeneficiaryProfile.deleteMany({}),
        application_model_js_1.Application.deleteMany({}),
        enrollment_model_js_1.Enrollment.deleteMany({}),
        biometric_model_js_1.BiometricDevice.deleteMany({}),
        biometric_model_js_1.BiometricIdentity.deleteMany({}),
        biometric_model_js_1.BiometricEvent.deleteMany({}),
        attendance_model_js_1.AttendancePolicy.deleteMany({}),
        attendance_model_js_1.AttendanceRecord.deleteMany({}),
        certificate_model_js_1.Certificate.deleteMany({}),
        auditLog_model_js_1.Announcement.deleteMany({}),
        auditLog_model_js_1.Notification.deleteMany({}),
        auditLog_model_js_1.AuditLog.deleteMany({}),
        auditLog_model_js_1.OrgSettings.deleteMany({}),
    ]);
    console.log("[Seed] Cleared all existing records.");
    // 1. Seed Permissions & Default Roles
    const permDocs = Object.entries(permissions_js_1.PERMISSIONS).map(([name, code]) => ({
        code,
        name: name.replace(/_/g, " "),
        module: code.split(":")[0],
    }));
    await role_model_js_1.Permission.insertMany(permDocs);
    for (const roleConfig of Object.values(roles_js_1.DEFAULT_ROLES)) {
        await role_model_js_1.Role.create(roleConfig);
    }
    console.log("[Seed] Seeded Roles & Permissions.");
    // 2. Organization Info
    const org = await organization_model_js_1.Organization.create({
        name: "Adele Empowerment Foundation",
        code: "AEF",
        tagline: "Building Skills, Empowering Lives, Transforming Communities",
        description: "A non-profit foundation providing physical vocational training, technical certifications, and youth empowerment across Nigeria.",
        email: "info@adelefoundation.org",
        phone: "+234 1 800 23353",
        address: "Plot 104, Adele Empowerment Way, Central Business District",
        state: "Lagos",
        lga: "Ikeja",
        country: "Nigeria",
        website: "https://adelefoundation.org",
        primaryColor: "#0d9488",
        secondaryColor: "#0f172a",
        establishedDate: new Date("2020-01-15"),
        registrationNumber: "CAC/IT/NO/148920",
    });
    // 3. Training Centres
    const centre1 = await trainingCentre_model_js_1.TrainingCentre.create({
        name: "Adele TVET Excellence Centre (Port Harcourt)",
        centreCode: "AEF-CTR-PH",
        address: "Plot 12, Trans-Amadi Industrial Layout, Port Harcourt",
        state: "Rivers",
        lga: "Port Harcourt",
        contactEmail: "ph.centre@adelefoundation.org",
        contactPhone: "+234 802 111 0001",
        capacity: 150,
        status: "active",
        accreditationDetails: {
            accreditedBy: "National Board for Technical Education (NBTE)",
            accreditationNumber: "NBTE/TVET/AEF/2024/09",
            validUntil: new Date("2028-12-31"),
        },
        geoCoordinates: {
            latitude: 4.8156,
            longitude: 7.0498,
        },
        notes: "Primary South-South regional flagship training hub featuring advanced solar simulator rigs and dual digital laboratories.",
    });
    const centre2 = await trainingCentre_model_js_1.TrainingCentre.create({
        name: "Adele Vocational & Technical Hub (Yenagoa)",
        centreCode: "AEF-CTR-YEN",
        address: "Mbiama-Yenagoa Road, Ekeki, Yenagoa",
        state: "Bayelsa",
        lga: "Yenagoa",
        contactEmail: "yenagoa.centre@adelefoundation.org",
        contactPhone: "+234 802 111 0002",
        capacity: 120,
        status: "active",
        accreditationDetails: {
            accreditedBy: "Federal Ministry of Power & Renewable Energy / NBTE",
            accreditationNumber: "RE-ACCR-2025-11",
            validUntil: new Date("2029-06-30"),
        },
        geoCoordinates: {
            latitude: 4.9267,
            longitude: 6.2676,
        },
        notes: "Bayelsa State technical training centre for renewable energy, fabrication, and youth empowerment.",
    });
    // 5. Rooms / Facilities
    const roomSolar = await trainingCentre_model_js_1.RoomFacility.create({
        centreId: centre1._id,
        name: "Solar PV & Inverter Practical Workshop",
        roomNumber: "WS-01",
        type: "workshop",
        capacity: 30,
        equipment: [
            "Solar Simulator Benches",
            "Inverter Testing Racks",
            "Safety Harnesses",
            "Digital Multimeters",
            "Crimping Tools",
        ],
        isAvailable: true,
        status: "operational",
    });
    const roomComp1 = await trainingCentre_model_js_1.RoomFacility.create({
        centreId: centre1._id,
        name: "Digital Innovation Lab 1",
        roomNumber: "LAB-01",
        type: "computer lab",
        capacity: 35,
        equipment: [
            "35 Core i7 Workstations",
            "High-Speed Dedicated Fiber Router",
            "Smart Interactive 4K Screen",
            "UPS Backup Array",
        ],
        isAvailable: true,
        status: "operational",
    });
    const roomComp2 = await trainingCentre_model_js_1.RoomFacility.create({
        centreId: centre1._id,
        name: "Creative UI/UX & Design Studio",
        roomNumber: "LAB-02",
        type: "computer lab",
        capacity: 25,
        equipment: [
            "25 iMac Graphic Workstations",
            "Wacom Drawing Tablets",
            "Projector System",
        ],
        isAvailable: true,
        status: "operational",
    });
    const roomWeld = await trainingCentre_model_js_1.RoomFacility.create({
        centreId: centre2._id,
        name: "Welding & Heavy Fabrication Bay",
        roomNumber: "BAY-A",
        type: "practical bay",
        capacity: 25,
        equipment: [
            "MIG/TIG Inverter Welding Machines",
            "Fume Extractors",
            "Hydraulic Shears",
            "Flame Cutting Stations",
        ],
        isAvailable: true,
        status: "operational",
    });
    const roomSolarYen = await trainingCentre_model_js_1.RoomFacility.create({
        centreId: centre2._id,
        name: "Renewable Energy Practical Yard",
        roomNumber: "WS-YEN-01",
        type: "workshop",
        capacity: 30,
        equipment: [
            "Ground Mount Solar Arrays",
            "Battery Bank Testing Racks",
            "Charge Controllers",
        ],
        isAvailable: true,
        status: "operational",
    });
    // 6. Biometric Devices (Optical Fingerprint Scanners)
    const dev1 = await biometric_model_js_1.BiometricDevice.create({
        deviceName: "Port Harcourt Main Entrance Biometric Terminal",
        deviceSerial: "BIO-DEV-PH-01",
        centreId: centre1._id,
        locationDescription: "Main Entrance & Practical Workshop Corridor",
        model: "AEF OptiScan 5000 Pro (Optical Fingerprint Scanner)",
        deviceType: "Fingerprint",
        status: "Online",
        registeredTemplatesCount: 52,
        lastPingAt: new Date(),
    });
    const dev2 = await biometric_model_js_1.BiometricDevice.create({
        deviceName: "Port Harcourt Digital Lab Terminal",
        deviceSerial: "BIO-DEV-PH-02",
        centreId: centre1._id,
        locationDescription: "Digital Innovation Lab 1 & 2 Floor",
        model: "AEF OptiScan 5000 Pro (Optical Fingerprint Scanner)",
        deviceType: "Fingerprint",
        status: "Online",
        registeredTemplatesCount: 40,
        lastPingAt: new Date(),
    });
    const dev3 = await biometric_model_js_1.BiometricDevice.create({
        deviceName: "Yenagoa Hub Main Gate Scanner",
        deviceSerial: "BIO-DEV-YEN-01",
        centreId: centre2._id,
        locationDescription: "Administration & Workshop Hallway",
        model: "AEF OptiScan 5000 Pro (Optical Fingerprint Scanner)",
        deviceType: "Fingerprint",
        status: "Online",
        registeredTemplatesCount: 30,
        lastPingAt: new Date(),
    });
    // 7. Assets
    await trainingCentre_model_js_1.Asset.create([
        {
            assetTag: "AEF-AST-001",
            name: "5kW Hybrid Solar Training Rig & Battery Array",
            category: "solar hardware",
            centreId: centre1._id,
            roomId: roomSolar._id,
            condition: "excellent",
            status: "in use",
            purchaseDate: new Date("2024-03-10"),
            purchaseCost: 4500000,
            serialNumber: "SR-RIG-2024-088",
            supplier: "CleanTech Systems Ltd",
        },
        {
            assetTag: "AEF-AST-002",
            name: "Dell Precision Workstations (Batch of 35)",
            category: "it equipment",
            centreId: centre1._id,
            roomId: roomComp1._id,
            condition: "excellent",
            status: "in use",
            purchaseDate: new Date("2024-06-15"),
            purchaseCost: 18500000,
            supplier: "Zinox Technologies Nigeria",
        },
        {
            assetTag: "AEF-AST-003",
            name: "Industrial MIG/TIG Inverter Welding Stations",
            category: "welding & machinery",
            centreId: centre2._id,
            roomId: roomWeld._id,
            condition: "good",
            status: "in use",
            purchaseDate: new Date("2024-08-20"),
            purchaseCost: 6200000,
            supplier: "Industrial Tools & Machines Corp",
        },
        {
            assetTag: "AEF-AST-004",
            name: "AEF Foundation Trainee Shuttle Bus (18-Seater)",
            category: "vehicle",
            centreId: centre1._id,
            condition: "good",
            status: "in use",
            purchaseDate: new Date("2023-11-10"),
            purchaseCost: 14000000,
            serialNumber: "TOYOTA-HIACE-2023-PH",
        },
    ]);
    // 8. Staff Records (HR decoupled from accounts)
    const staffDirector = await staff_model_js_1.Staff.create({
        staffCode: "AEF-STF-0001",
        firstName: "Hon. Adele",
        lastName: "Oluwaseun",
        gender: "male",
        email: "admin@adelefoundation.org",
        phone: "+234 803 000 0001",
        position: "Executive Director & Founder",
        employmentStatus: "active",
        assignedCentreId: centre1._id,
        hasSystemAccount: true,
    });
    const staffManagerPH = await staff_model_js_1.Staff.create({
        staffCode: "AEF-STF-0002",
        firstName: "Engr. Kemi",
        lastName: "Adeyemi",
        gender: "female",
        email: "manager@adelefoundation.org",
        phone: "+234 803 000 0002",
        position: "Port Harcourt Centre Director & Technical Operations Lead",
        employmentStatus: "active",
        assignedCentreId: centre1._id,
        hasSystemAccount: true,
    });
    const staffManagerYen = await staff_model_js_1.Staff.create({
        staffCode: "AEF-STF-0005",
        firstName: "Dr. Tari",
        lastName: "Ebi",
        gender: "male",
        email: "tari.ebi@adelefoundation.org",
        phone: "+234 803 000 0005",
        position: "Yenagoa Hub Centre Director",
        employmentStatus: "active",
        assignedCentreId: centre2._id,
        hasSystemAccount: false,
    });
    const staffTrainerSolar = await staff_model_js_1.Staff.create({
        staffCode: "AEF-STF-0003",
        firstName: "Michael",
        lastName: "Okoro",
        gender: "male",
        email: "trainer@adelefoundation.org",
        phone: "+234 803 000 0003",
        position: "Lead Solar PV & Electrical Instructor",
        employmentStatus: "active",
        assignedCentreId: centre1._id,
        hasSystemAccount: true,
    });
    const staffTrainerDigital = await staff_model_js_1.Staff.create({
        staffCode: "AEF-STF-0006",
        firstName: "Engr. Dare",
        lastName: "Johnson",
        gender: "male",
        email: "dare.johnson@adelefoundation.org",
        phone: "+234 803 000 0006",
        position: "Lead Software Engineering & Cloud Instructor",
        employmentStatus: "active",
        assignedCentreId: centre1._id,
        hasSystemAccount: false,
    });
    const staffDriver = await staff_model_js_1.Staff.create({
        staffCode: "AEF-STF-0004",
        firstName: "Garba",
        lastName: "Aliyu",
        gender: "male",
        email: "garba.driver@adelefoundation.org",
        phone: "+234 803 000 0004",
        position: "Foundation Logistics Driver",
        employmentStatus: "active",
        assignedCentreId: centre1._id,
        hasSystemAccount: false,
    });
    // Link Centre Managers
    centre1.centreManagerId = staffManagerPH._id;
    await centre1.save();
    centre2.centreManagerId = staffManagerYen._id;
    await centre2.save();
    // 9. Partners
    const partnerFed = await staff_model_js_1.Partner.create({
        name: "Federal Ministry of Labour & Productivity",
        code: "FMLP-NG",
        type: "Government",
        contactPerson: {
            name: "Dr. Abubakar Sanusi",
            title: "Director of TVET",
            email: "abubakar.sanusi@labour.gov.ng",
            phone: "+234 9 290 8812",
        },
        email: "tvet@labour.gov.ng",
        state: "Abuja",
        status: "Active",
    });
    const partnerSolar = await staff_model_js_1.Partner.create({
        name: "Renewable Energy Association of Nigeria (REAN)",
        code: "REAN-ORG",
        type: "Sponsor",
        contactPerson: {
            name: "Engr. Stella Martins",
            title: "Program Officer",
            email: "stella@rean.org.ng",
            phone: "+234 803 772 1109",
        },
        email: "partnerships@rean.org.ng",
        state: "Rivers",
        status: "Active",
    });
    const partnerTech = await staff_model_js_1.Partner.create({
        name: "Tech4Dev Initiative",
        code: "TECH4DEV",
        type: "Corporate",
        contactPerson: {
            name: "Mrs. Folake Craig",
            title: "Director of Youth Programs",
            email: "folake@tech4dev.org",
            phone: "+234 802 334 9901",
        },
        email: "info@tech4dev.org",
        state: "Rivers",
        status: "Active",
    });
    // 9.1 Volunteers
    await staff_model_js_1.Volunteer.create([
        {
            volunteerCode: "AEF-VOL-001",
            firstName: "Chukwuma",
            lastName: "Okonkwo",
            email: "chukwuma.okonkwo@adelefoundation.org",
            phone: "+234 803 123 4567",
            gender: "male",
            skills: ["Solar Installation", "Inverter Testing", "Workshop Safety"],
            assignedCentreId: centre1._id,
            responsibilities: "Assisting instructors in the Solar PV Workshop and equipment calibration.",
            startDate: new Date("2026-01-15"),
            status: "active",
            emergencyContact: {
                name: "Amaka Okonkwo",
                relationship: "Sister",
                phone: "+234 803 999 1122",
            },
            notes: "Dedicated technical volunteer with background in electrical wiring.",
        },
        {
            volunteerCode: "AEF-VOL-002",
            firstName: "Amara",
            lastName: "Obi",
            email: "amara.obi@adelefoundation.org",
            phone: "+234 802 888 2345",
            gender: "female",
            skills: ["Frontend Web Development", "UI/UX Mentorship", "Python Basics"],
            assignedCentreId: centre1._id,
            responsibilities: "Mentoring digital media and web development students during open lab hours.",
            startDate: new Date("2026-02-01"),
            status: "active",
            emergencyContact: {
                name: "Emeka Obi",
                relationship: "Brother",
                phone: "+234 802 777 3344",
            },
            notes: "Alumni mentor assisting junior cohorts.",
        },
        {
            volunteerCode: "AEF-VOL-003",
            firstName: "Tunde",
            lastName: "Bakare",
            email: "tunde.bakare@adelefoundation.org",
            phone: "+234 805 444 8899",
            gender: "male",
            skills: ["Community Mobilization", "Logistics", "First Aid"],
            assignedCentreId: centre2._id,
            responsibilities: "Supporting Yenagoa centre outreach, student onboarding, and attendance coordination.",
            startDate: new Date("2026-01-10"),
            status: "active",
            emergencyContact: {
                name: "Kemi Bakare",
                relationship: "Spouse",
                phone: "+234 805 111 2233",
            },
            notes: "Active community volunteer in Bayelsa.",
        },
        {
            volunteerCode: "AEF-VOL-004",
            firstName: "Zainab",
            lastName: "Aliyu",
            email: "zainab.aliyu@adelefoundation.org",
            phone: "+234 809 555 6677",
            gender: "female",
            skills: ["Data Entry", "Beneficiary Support", "Documentation"],
            assignedCentreId: centre1._id,
            responsibilities: "Assisting administration with admissions filing and beneficiary records.",
            startDate: new Date("2025-10-01"),
            endDate: new Date("2026-03-31"),
            status: "completed",
            emergencyContact: {
                name: "Halima Aliyu",
                relationship: "Mother",
                phone: "+234 809 222 3344",
            },
            notes: "Completed 6-month internship volunteer cycle.",
        },
    ]);
    // 10. Skill Areas
    const skillSolar = await program_model_js_1.SkillArea.create({
        name: "Solar PV Installation & Energy Storage",
        code: "SOL-PV",
        category: "Renewable Energy",
        description: "Comprehensive design, mounting, inverter configuration, and maintenance of rooftop and mini-grid solar systems.",
        defaultDurationWeeks: 8,
        certificationType: "National Certification",
        requiredFacilities: ["Solar Workshop", "Roof Mockup Rig"],
        requiredEquipment: ["Multimeter", "Crimping Tools", "Inverters"],
    });
    const skillWeb = await program_model_js_1.SkillArea.create({
        name: "Full-Stack Web Development",
        code: "WEB-DEV",
        category: "Digital & ICT",
        description: "Modern web application development with React, Node.js, databases, and deployment architectures.",
        defaultDurationWeeks: 12,
        certificationType: "AEF Certificate of Competency",
        requiredFacilities: ["Computer Lab"],
    });
    const skillWeld = await program_model_js_1.SkillArea.create({
        name: "Welding & Steel Fabrication",
        code: "WLD-FAB",
        category: "Technical / Vocational",
        description: "Arc, MIG, and TIG welding techniques, industrial safety standards, and structural fabrication.",
        defaultDurationWeeks: 10,
        certificationType: "National Certification",
        requiredFacilities: ["Fabrication Bay"],
    });
    const skillUIUX = await program_model_js_1.SkillArea.create({
        name: "UI/UX Design & Digital Product Design",
        code: "UI-UX",
        category: "Creative Arts",
        description: "User research, wireframing, high-fidelity prototyping in Figma, design systems, and usability testing.",
        defaultDurationWeeks: 8,
        certificationType: "AEF Certificate of Competency",
        requiredFacilities: ["Computer Lab"],
    });
    const skillData = await program_model_js_1.SkillArea.create({
        name: "Data Analytics & AI Tools",
        code: "DATA-AI",
        category: "Digital & ICT",
        description: "Data cleaning, business intelligence reporting with PowerBI & Python, and modern AI automation tools.",
        defaultDurationWeeks: 8,
        certificationType: "AEF Certificate of Competency",
        requiredFacilities: ["Computer Lab"],
    });
    // 11. Programs
    const progTVET = await program_model_js_1.Program.create({
        title: "National TVET Solar PV & Clean Energy Initiative 2026",
        code: "PROG-TVET-SOLAR-2026",
        description: "Federal-sponsored clean energy technical certification delivered across Adele accredited training centres.",
        organizerType: "Government Owned",
        organizerName: "Federal Ministry of Labour / NBTE",
        partnerIds: [partnerFed._id, partnerSolar._id],
        deliveryRole: "Accredited Training Centre",
        status: "Active",
        skillAreaIds: [skillSolar._id, skillWeld._id],
        eligibilityCriteria: [
            "Age 18-35",
            "Minimum SSCE/WAEC qualification",
            "Physically fit for hands-on workshop training",
        ],
        requirements: [
            "Valid Government ID",
            "2 Passport Photographs",
            "Personal safety boots",
        ],
        maxSlots: 80,
        applicationStartDate: new Date("2026-08-01"),
        applicationDeadline: new Date("2026-09-30"),
        trainingStartDate: new Date("2026-10-05"),
        trainingEndDate: new Date("2026-12-05"),
        published: true,
        isFeatured: true,
    });
    const progDigital = await program_model_js_1.Program.create({
        title: "Adele Youth Digital Empowerment Accelerator (YDEA)",
        code: "PROG-YDEA-2026",
        description: "Adele Foundation proprietary intensive digital bootcamps for software engineers, product designers, and data analysts.",
        organizerType: "Adele Owned",
        organizerName: "Adele Empowerment Foundation",
        partnerIds: [partnerTech._id],
        deliveryRole: "Primary Host",
        status: "Active",
        skillAreaIds: [skillWeb._id, skillUIUX._id, skillData._id],
        eligibilityCriteria: [
            "Passion for technology and problem solving",
            "Basic computer literacy",
            "Commitment to full-time training",
        ],
        maxSlots: 90,
        applicationStartDate: new Date("2026-08-01"),
        applicationDeadline: new Date("2026-09-25"),
        trainingStartDate: new Date("2026-10-01"),
        trainingEndDate: new Date("2026-12-20"),
        published: true,
        isFeatured: true,
    });
    // 12. Cohorts
    const cohortPHSolar = await cohort_model_js_1.Cohort.create({
        name: "Port Harcourt TVET Clean Energy Cohort 01 (Fall 2026)",
        cohortCode: "PH-COH-2026-01",
        programId: progTVET._id,
        centreId: centre1._id,
        startDate: new Date("2026-09-01"),
        endDate: new Date("2026-11-30"),
        status: "in_progress",
        maxCapacity: 40,
        skillConfigs: [
            {
                skillAreaId: skillSolar._id,
                skillName: "Solar PV Installation",
                trainerStaffIds: [staffTrainerSolar._id],
                assignedRoomId: roomSolar._id,
                daysOfWeek: [1, 3, 5], // Mon, Wed, Fri
                startTime: "09:00",
                endTime: "12:00",
                durationWeeks: 8,
                maxCapacity: 25,
            },
            {
                skillAreaId: skillWeld._id,
                skillName: "Welding & Fabrication",
                trainerStaffIds: [staffTrainerSolar._id],
                assignedRoomId: roomWeld._id,
                daysOfWeek: [2, 4], // Tue, Thu
                startTime: "13:00",
                endTime: "16:00",
                durationWeeks: 8,
                maxCapacity: 15,
            },
        ],
    });
    const cohortPHDigital = await cohort_model_js_1.Cohort.create({
        name: "Port Harcourt Digital Skills Accelerator Cohort 01",
        cohortCode: "PH-DIG-2026-01",
        programId: progDigital._id,
        centreId: centre1._id,
        startDate: new Date("2026-09-01"),
        endDate: new Date("2026-11-30"),
        status: "in_progress",
        maxCapacity: 50,
        skillConfigs: [
            {
                skillAreaId: skillWeb._id,
                skillName: "Full-Stack Web Development",
                trainerStaffIds: [staffTrainerDigital._id],
                assignedRoomId: roomComp1._id,
                daysOfWeek: [1, 2, 3, 4], // Mon to Thu
                startTime: "09:00",
                endTime: "13:00",
                durationWeeks: 12,
                maxCapacity: 30,
            },
            {
                skillAreaId: skillUIUX._id,
                skillName: "UI/UX Design",
                trainerStaffIds: [staffTrainerDigital._id],
                assignedRoomId: roomComp2._id,
                daysOfWeek: [1, 3, 5],
                startTime: "14:00",
                endTime: "17:00",
                durationWeeks: 8,
                maxCapacity: 20,
            },
        ],
    });
    // 13. Training Sessions (Today & Upcoming)
    const today = new Date();
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    await cohort_model_js_1.TrainingSession.create([
        {
            cohortId: cohortPHSolar._id,
            programId: progTVET._id,
            centreId: centre1._id,
            skillAreaId: skillSolar._id,
            trainerStaffId: staffTrainerSolar._id,
            roomId: roomSolar._id,
            sessionDate: todayDate,
            startTime: "09:00",
            endTime: "12:00",
            topic: "Rooftop Inverter Wiring & Battery Balancing Practical",
            sessionType: "Regular Practical",
        },
        {
            cohortId: cohortPHDigital._id,
            programId: progDigital._id,
            centreId: centre1._id,
            skillAreaId: skillWeb._id,
            trainerStaffId: staffTrainerDigital._id,
            roomId: roomComp1._id,
            sessionDate: todayDate,
            startTime: "09:00",
            endTime: "13:00",
            topic: "REST API Architecture, Express Middleware & Token Authentication",
            sessionType: "Regular Practical",
        },
    ]);
    // 14. Training Calendar Exception Event
    await cohort_model_js_1.TrainingCalendarEvent.create({
        title: "National Independence Day Holiday",
        eventType: "Public Holiday",
        description: "Federal public holiday. Training centres closed; no attendance penalty.",
        startDate: new Date("2026-10-01"),
        endDate: new Date("2026-10-01"),
        affectsAttendance: true,
        createdBy: staffDirector._id,
    });
    // 15. Attendance Policy
    await attendance_model_js_1.AttendancePolicy.create({
        name: "Adele Foundation Standard Operational Attendance Policy",
        scopeType: "GLOBAL",
        defaultStartTime: "09:00",
        defaultEndTime: "12:00",
        gracePeriodMinutes: 15,
        lateThresholdMinutes: 45,
        minDailyDurationMinutes: 120,
        requireClockOut: true,
        allowMultipleClockIns: true,
        minAttendancePercentForCertificate: 80,
        lowAttendanceAlertThreshold: 75,
        criticalAttendanceAlertThreshold: 60,
        isDefault: true,
    });
    // 16. User Accounts & Auth Credentials
    // Super Admin
    const userAdmin = await user_model_js_1.User.create({
        email: "admin@adelefoundation.org",
        firstName: "Hon. Adele",
        lastName: "Oluwaseun",
        phone: "+234 803 000 0001",
        isStaff: true,
        isBeneficiary: false,
        staffRecordId: staffDirector._id,
        roles: ["SUPER_ADMIN"],
        scopeAssignments: [{ scopeType: "GLOBAL" }],
    });
    await auth_model_js_1.Auth.create({
        userId: userAdmin._id,
        email: userAdmin.email,
        password: "Admin@2026",
    });
    staffDirector.userId = userAdmin._id;
    await staffDirector.save();
    // Port Harcourt Centre Manager
    const userManager = await user_model_js_1.User.create({
        email: "manager@adelefoundation.org",
        firstName: "Engr. Kemi",
        lastName: "Adeyemi",
        phone: "+234 803 000 0002",
        isStaff: true,
        isBeneficiary: false,
        staffRecordId: staffManagerPH._id,
        roles: ["CENTRE_MANAGER"],
        scopeAssignments: [
            { scopeType: "CENTRE", targetId: centre1._id, targetName: centre1.name },
        ],
    });
    await auth_model_js_1.Auth.create({
        userId: userManager._id,
        email: userManager.email,
        password: "Manager@2026",
    });
    staffManagerPH.userId = userManager._id;
    await staffManagerPH.save();
    // Trainer
    const userTrainer = await user_model_js_1.User.create({
        email: "trainer@adelefoundation.org",
        firstName: "Michael",
        lastName: "Okoro",
        phone: "+234 803 000 0003",
        isStaff: true,
        isBeneficiary: false,
        staffRecordId: staffTrainerSolar._id,
        roles: ["TRAINER"],
        scopeAssignments: [
            {
                scopeType: "PROGRAM",
                targetId: progTVET._id,
                targetName: progTVET.title,
            },
        ],
    });
    await auth_model_js_1.Auth.create({
        userId: userTrainer._id,
        email: userTrainer.email,
        password: "Trainer@2026",
    });
    staffTrainerSolar.userId = userTrainer._id;
    await staffTrainerSolar.save();
    // 17. Sample Beneficiaries across different lifecycle stages
    // Beneficiary 1: Active Trainee (Solar PV - Port Harcourt)
    const userTrainee1 = await user_model_js_1.User.create({
        email: "trainee@adelefoundation.org",
        firstName: "John",
        lastName: "Eze",
        phone: "+234 810 555 0101",
        isStaff: false,
        isBeneficiary: true,
        roles: ["BENEFICIARY"],
        scopeAssignments: [{ scopeType: "GLOBAL" }],
    });
    await auth_model_js_1.Auth.create({
        userId: userTrainee1._id,
        email: userTrainee1.email,
        password: "Trainee@2026",
    });
    const bioProfile1 = await beneficiaryProfile_model_js_1.BeneficiaryProfile.create({
        userId: userTrainee1._id,
        beneficiaryCode: "AEF-BEN-2026-00101",
        firstName: "John",
        lastName: "Eze",
        gender: "Male",
        dateOfBirth: new Date("2001-05-14"),
        phone: "+234 810 555 0101",
        email: "trainee@adelefoundation.org",
        address: "22 Trans-Amadi Road, Port Harcourt",
        stateOfOrigin: "Enugu",
        lgaOfOrigin: "Nsukka",
        stateOfResidence: "Rivers",
        lgaOfResidence: "Port Harcourt",
        highestEducation: "OND/NCE",
        employmentStatus: "Unemployed",
        identificationType: "National NIN",
        identificationNumber: "99281726354",
        emergencyContact: {
            name: "Mary Eze",
            relationship: "Mother",
            phone: "+234 802 999 1234",
        },
        biometricRegistered: true,
        biometricIdentifier: "BIO-AEF-JOHN-EZE-TOKEN-01",
    });
    userTrainee1.beneficiaryProfileId = bioProfile1._id;
    await userTrainee1.save();
    const app1 = await application_model_js_1.Application.create({
        applicationNumber: "AEF-APP-2026-00042",
        beneficiaryId: bioProfile1._id,
        programId: progTVET._id,
        preferredSkillAreaId: skillSolar._id,
        preferredCentreId: centre1._id,
        status: enums_js_1.ApplicationStatus.ENROLLMENT_CONFIRMED,
        submittedAt: new Date("2026-08-10"),
        statusHistory: [
            {
                status: enums_js_1.ApplicationStatus.SUBMITTED,
                changedBy: userTrainee1._id,
                changedAt: new Date("2026-08-10"),
                reason: "Online application submitted",
            },
            {
                status: enums_js_1.ApplicationStatus.SELECTED,
                changedBy: userAdmin._id,
                changedAt: new Date("2026-08-20"),
                reason: "Qualified candidate selected",
            },
            {
                status: enums_js_1.ApplicationStatus.ENROLLMENT_CONFIRMED,
                changedBy: userManager._id,
                changedAt: new Date("2026-08-28"),
                reason: "Biometrics registered & enrolled",
            },
        ],
    });
    await biometric_model_js_1.BiometricIdentity.create({
        beneficiaryId: bioProfile1._id,
        centreId: centre1._id,
        biometricToken: "BIO-AEF-JOHN-EZE-TOKEN-01",
        registeredDeviceId: dev1._id,
        registeredByStaffId: staffManagerPH._id,
        qualityScore: 99,
    });
    const enr1 = await enrollment_model_js_1.Enrollment.create({
        enrollmentCode: "AEF-ENR-2026-00088",
        beneficiaryId: bioProfile1._id,
        applicationId: app1._id,
        programId: progTVET._id,
        cohortId: cohortPHSolar._id,
        skillAreaId: skillSolar._id,
        centreId: centre1._id,
        status: enums_js_1.EnrollmentStatus.ACTIVE,
        enrollmentDate: new Date("2026-09-01"),
        overallAttendanceRate: 94.5,
        verificationDetails: {
            verifiedByStaffId: staffManagerPH._id,
            verifiedAt: new Date("2026-08-28"),
            documentsChecked: true,
            identityVerified: true,
            physicalNotes: "NIN and WAEC verified in-person.",
        },
        biometricRegistrationDetails: {
            registeredByStaffId: staffManagerPH._id,
            registeredAt: new Date("2026-08-28"),
            deviceId: dev1._id,
            biometricIdentifier: "BIO-AEF-JOHN-EZE-TOKEN-01",
        },
        statusHistory: [
            {
                status: enums_js_1.EnrollmentStatus.SELECTED,
                changedBy: userAdmin._id,
                changedAt: new Date("2026-08-20"),
            },
            {
                status: enums_js_1.EnrollmentStatus.ACTIVE,
                changedBy: userManager._id,
                changedAt: new Date("2026-08-28"),
                reason: "Confirmed enrollment",
            },
        ],
    });
    bioProfile1.activeEnrollmentId = enr1._id;
    await bioProfile1.save();
    // Beneficiary 2: Active Trainee (Full-Stack Web Dev - Port Harcourt)
    const userTrainee2 = await user_model_js_1.User.create({
        email: "chinedu@gmail.com",
        firstName: "Chinedu",
        lastName: "Okafor",
        phone: "+234 814 333 4455",
        isStaff: false,
        isBeneficiary: true,
        roles: ["BENEFICIARY"],
        scopeAssignments: [{ scopeType: "GLOBAL" }],
    });
    await auth_model_js_1.Auth.create({
        userId: userTrainee2._id,
        email: userTrainee2.email,
        password: "Chinedu@2026",
    });
    const bioProfile2 = await beneficiaryProfile_model_js_1.BeneficiaryProfile.create({
        userId: userTrainee2._id,
        beneficiaryCode: "AEF-BEN-2026-00102",
        firstName: "Chinedu",
        lastName: "Okafor",
        gender: "Male",
        dateOfBirth: new Date("2000-11-20"),
        phone: "+234 814 333 4455",
        email: "chinedu@gmail.com",
        address: "8 Aba Road, Port Harcourt",
        stateOfOrigin: "Anambra",
        lgaOfOrigin: "Awka South",
        stateOfResidence: "Rivers",
        lgaOfResidence: "Port Harcourt",
        highestEducation: "HND/BSc",
        employmentStatus: "Unemployed",
        identificationType: "National NIN",
        identificationNumber: "88771122334",
        emergencyContact: {
            name: "Emeka Okafor",
            relationship: "Brother",
            phone: "+234 803 222 1100",
        },
        biometricRegistered: true,
        biometricIdentifier: "BIO-AEF-CHINEDU-OKAFOR-TOKEN-02",
    });
    userTrainee2.beneficiaryProfileId = bioProfile2._id;
    await userTrainee2.save();
    const app2 = await application_model_js_1.Application.create({
        applicationNumber: "AEF-APP-2026-00045",
        beneficiaryId: bioProfile2._id,
        programId: progDigital._id,
        preferredSkillAreaId: skillWeb._id,
        preferredCentreId: centre1._id,
        status: enums_js_1.ApplicationStatus.ENROLLMENT_CONFIRMED,
        submittedAt: new Date("2026-08-12"),
    });
    await biometric_model_js_1.BiometricIdentity.create({
        beneficiaryId: bioProfile2._id,
        centreId: centre1._id,
        biometricToken: "BIO-AEF-CHINEDU-OKAFOR-TOKEN-02",
        registeredDeviceId: dev2._id,
        registeredByStaffId: staffManagerPH._id,
        qualityScore: 98,
    });
    const enr2 = await enrollment_model_js_1.Enrollment.create({
        enrollmentCode: "AEF-ENR-2026-00089",
        beneficiaryId: bioProfile2._id,
        applicationId: app2._id,
        programId: progDigital._id,
        cohortId: cohortPHDigital._id,
        skillAreaId: skillWeb._id,
        centreId: centre1._id,
        status: enums_js_1.EnrollmentStatus.ACTIVE,
        enrollmentDate: new Date("2026-09-01"),
        overallAttendanceRate: 98.0,
        verificationDetails: {
            verifiedByStaffId: staffManagerPH._id,
            verifiedAt: new Date("2026-08-29"),
            documentsChecked: true,
            identityVerified: true,
        },
        biometricRegistrationDetails: {
            registeredByStaffId: staffManagerPH._id,
            registeredAt: new Date("2026-08-29"),
            deviceId: dev2._id,
            biometricIdentifier: "BIO-AEF-CHINEDU-OKAFOR-TOKEN-02",
        },
    });
    bioProfile2.activeEnrollmentId = enr2._id;
    await bioProfile2.save();
    // Beneficiary 3: Selected candidate awaiting biometrics (Yenagoa)
    const userCandidate3 = await user_model_js_1.User.create({
        email: "preye@gmail.com",
        firstName: "Ebimobowei",
        lastName: "Preye",
        phone: "+234 812 444 8899",
        isStaff: false,
        isBeneficiary: true,
        roles: ["BENEFICIARY"],
        scopeAssignments: [{ scopeType: "GLOBAL" }],
    });
    await auth_model_js_1.Auth.create({
        userId: userCandidate3._id,
        email: userCandidate3.email,
        password: "Preye@2026",
    });
    const bioProfile3 = await beneficiaryProfile_model_js_1.BeneficiaryProfile.create({
        userId: userCandidate3._id,
        beneficiaryCode: "AEF-BEN-2026-00103",
        firstName: "Ebimobowei",
        lastName: "Preye",
        gender: "Male",
        dateOfBirth: new Date("2003-09-22"),
        phone: "+234 812 444 8899",
        email: "preye@gmail.com",
        address: "15 Ekeki Road, Yenagoa",
        stateOfOrigin: "Bayelsa",
        lgaOfOrigin: "Yenagoa",
        stateOfResidence: "Bayelsa",
        lgaOfResidence: "Yenagoa",
        highestEducation: "Secondary (SSCE/WAEC)",
        employmentStatus: "Unemployed",
        emergencyContact: {
            name: "Tari Preye",
            relationship: "Father",
            phone: "+234 803 111 2233",
        },
        biometricRegistered: false,
    });
    const app3 = await application_model_js_1.Application.create({
        applicationNumber: "AEF-APP-2026-00055",
        beneficiaryId: bioProfile3._id,
        programId: progTVET._id,
        preferredSkillAreaId: skillSolar._id,
        preferredCentreId: centre2._id,
        status: enums_js_1.ApplicationStatus.SELECTED,
        submittedAt: new Date("2026-08-15"),
    });
    await enrollment_model_js_1.Enrollment.create({
        enrollmentCode: "AEF-ENR-2026-00095",
        beneficiaryId: bioProfile3._id,
        applicationId: app3._id,
        programId: progTVET._id,
        cohortId: cohortPHSolar._id,
        skillAreaId: skillSolar._id,
        centreId: centre2._id,
        status: enums_js_1.EnrollmentStatus.AWAITING_BIOMETRIC,
        verificationDetails: {
            verifiedByStaffId: staffManagerPH._id,
            verifiedAt: new Date(),
            documentsChecked: true,
            identityVerified: true,
            physicalNotes: "Candidate verified, awaiting fingerprint enrollment at Yenagoa centre.",
        },
    });
    // Beneficiary 4: Certified Graduate (Alumni)
    const userAlumni = await user_model_js_1.User.create({
        email: "blessing@gmail.com",
        firstName: "Blessing",
        lastName: "Adeleke",
        phone: "+234 809 111 7788",
        isStaff: false,
        isBeneficiary: true,
        roles: ["BENEFICIARY"],
        scopeAssignments: [{ scopeType: "GLOBAL" }],
    });
    await auth_model_js_1.Auth.create({
        userId: userAlumni._id,
        email: userAlumni.email,
        password: "Blessing@2026",
    });
    const bioProfileAlumni = await beneficiaryProfile_model_js_1.BeneficiaryProfile.create({
        userId: userAlumni._id,
        beneficiaryCode: "AEF-BEN-2026-00008",
        firstName: "Blessing",
        lastName: "Adeleke",
        gender: "Female",
        dateOfBirth: new Date("1999-04-18"),
        phone: "+234 809 111 7788",
        email: "blessing@gmail.com",
        address: "44 Peter Odili Road, Port Harcourt",
        stateOfOrigin: "Rivers",
        lgaOfOrigin: "Port Harcourt",
        stateOfResidence: "Rivers",
        lgaOfResidence: "Port Harcourt",
        highestEducation: "HND/BSc",
        employmentStatus: "Self-Employed",
        identificationType: "National NIN",
        identificationNumber: "77665544332",
        emergencyContact: {
            name: "Samuel Adeleke",
            relationship: "Father",
            phone: "+234 802 334 1122",
        },
        biometricRegistered: true,
        biometricIdentifier: "BIO-AEF-BLESSING-ADELEKE-008",
    });
    const appAlumni = await application_model_js_1.Application.create({
        applicationNumber: "AEF-APP-2026-00010",
        beneficiaryId: bioProfileAlumni._id,
        programId: progTVET._id,
        preferredSkillAreaId: skillSolar._id,
        preferredCentreId: centre1._id,
        status: enums_js_1.ApplicationStatus.ENROLLMENT_CONFIRMED,
        submittedAt: new Date("2026-06-01"),
    });
    const enrAlumni = await enrollment_model_js_1.Enrollment.create({
        enrollmentCode: "AEF-ENR-2026-00012",
        beneficiaryId: bioProfileAlumni._id,
        applicationId: appAlumni._id,
        programId: progTVET._id,
        cohortId: cohortPHSolar._id,
        skillAreaId: skillSolar._id,
        centreId: centre1._id,
        status: enums_js_1.EnrollmentStatus.COMPLETED,
        enrollmentDate: new Date("2026-06-15"),
        completionDate: new Date("2026-08-30"),
        overallAttendanceRate: 96.8,
        assessmentPassed: true,
        certificateIssued: true,
    });
    // 18. Attendance & Biometric History (Past 5 days)
    const sampleDates = [4, 3, 2, 1, 0].map((daysAgo) => {
        const d = new Date(todayDate);
        d.setDate(d.getDate() - daysAgo);
        return d;
    });
    for (const date of sampleDates) {
        const clockIn1 = new Date(date);
        clockIn1.setHours(8, 50, 0); // 8:50 AM on time
        const clockOut1 = new Date(date);
        clockOut1.setHours(12, 5, 0); // 12:05 PM clock out
        await biometric_model_js_1.BiometricEvent.create({
            deviceSerial: dev1.deviceSerial,
            centreId: centre1._id,
            biometricToken: "BIO-AEF-JOHN-EZE-TOKEN-01",
            scanType: enums_js_1.BiometricScanType.IN,
            timestamp: clockIn1,
            isMatched: true,
            beneficiaryId: bioProfile1._id,
            isProcessed: true,
        });
        await attendance_model_js_1.AttendanceRecord.create({
            beneficiaryId: bioProfile1._id,
            enrollmentId: enr1._id,
            cohortId: cohortPHSolar._id,
            skillAreaId: skillSolar._id,
            centreId: centre1._id,
            date,
            status: enums_js_1.AttendanceStatus.PRESENT,
            firstClockIn: clockIn1,
            lastClockOut: clockOut1,
            clockInEvents: [
                { timestamp: clockIn1, deviceId: dev1.deviceSerial, scanType: "IN" },
                { timestamp: clockOut1, deviceId: dev1.deviceSerial, scanType: "OUT" },
            ],
            durationMinutes: 195,
            isLate: false,
            minutesLate: 0,
            isExcused: false,
            isManualCorrection: false,
        });
        const clockIn2 = new Date(date);
        clockIn2.setHours(8, 55, 0);
        const clockOut2 = new Date(date);
        clockOut2.setHours(13, 0, 0);
        await attendance_model_js_1.AttendanceRecord.create({
            beneficiaryId: bioProfile2._id,
            enrollmentId: enr2._id,
            cohortId: cohortPHDigital._id,
            skillAreaId: skillWeb._id,
            centreId: centre1._id,
            date,
            status: enums_js_1.AttendanceStatus.PRESENT,
            firstClockIn: clockIn2,
            lastClockOut: clockOut2,
            clockInEvents: [
                { timestamp: clockIn2, deviceId: dev2.deviceSerial, scanType: "IN" },
                { timestamp: clockOut2, deviceId: dev2.deviceSerial, scanType: "OUT" },
            ],
            durationMinutes: 245,
            isLate: false,
            minutesLate: 0,
            isExcused: false,
            isManualCorrection: false,
        });
    }
    // 19. Verifiable Certificates
    const certAlumni = await certificate_model_js_1.Certificate.create({
        certificateNumber: "AEF-2026-SOL-00412",
        verificationCode: "aef-verify-7c9e12bf4089a8c",
        beneficiaryId: bioProfileAlumni._id,
        enrollmentId: enrAlumni._id,
        programId: progTVET._id,
        cohortId: cohortPHSolar._id,
        skillAreaId: skillSolar._id,
        centreId: centre1._id,
        issueDate: new Date("2026-08-30"),
        overallAttendanceRate: 96.8,
        overallAssessmentScore: 92,
        grade: "Distinction",
        authorizedSignatory: {
            name: "Hon. Adele Executive Director",
            title: "Executive Director, AEF",
        },
        issuingOrganization: "Adele Empowerment Foundation",
        status: "Issued",
    });
    enrAlumni.certificateId = certAlumni._id;
    await enrAlumni.save();
    // 21. Announcements
    await auditLog_model_js_1.Announcement.create([
        {
            title: "Orientation & Workshop Safety Briefing for Fall 2026 Trainees",
            content: "All active trainees across Port Harcourt and Yenagoa centres are expected in full safety gear (steel-toe boots and high-visibility vests) starting Monday 9:00 AM.",
            scopeType: "GLOBAL",
            priority: "High",
            publishedBy: userAdmin._id,
            publishedAt: new Date(),
            isActive: true,
        },
        {
            title: "Digital Hub Innovation Hackathon Announced",
            content: "Adele Foundation in partnership with Tech4Dev is hosting the 2026 Youth Tech Hackathon. Top 3 projects win incubation funding.",
            scopeType: "PROGRAM",
            targetProgramId: progDigital._id,
            priority: "Normal",
            publishedBy: userAdmin._id,
            publishedAt: new Date(),
            isActive: true,
        },
    ]);
    // 22. Notifications
    await auditLog_model_js_1.Notification.create([
        {
            recipientUserId: userTrainee1._id,
            title: "Biometric Check-in Confirmed",
            message: "Your optical fingerprint check-in was successfully recorded at Port Harcourt Excellence Centre.",
            type: "SUCCESS",
            isRead: true,
        },
        {
            recipientUserId: userTrainee1._id,
            title: "Upcoming Assessment Scheduled",
            message: "Solar PV Inverter Configuration Assessment is scheduled for Sep 20.",
            type: "INFO",
            isRead: false,
        },
    ]);
    // 23. Document Records (Accreditations, Policies, Curricula)
    await trainingCentre_model_js_1.DocumentRecord.create([
        {
            title: "NBTE TVET Institutional Accreditation 2024-2028",
            category: "Accreditation",
            fileUrl: "https://adelefoundation.org/docs/accreditation-nbte-2024.pdf",
            fileType: "application/pdf",
            fileSize: 2450000,
            isPublic: true,
            relatedCentreId: centre1._id,
            uploadedBy: userAdmin._id,
        },
        {
            title: "Standard Workshop Health & Safety Guidelines",
            category: "Policy",
            fileUrl: "https://adelefoundation.org/docs/safety-guidelines.pdf",
            fileType: "application/pdf",
            fileSize: 1200000,
            isPublic: true,
            uploadedBy: userAdmin._id,
        },
        {
            title: "Solar PV Practical Curriculum & Competency Matrix",
            category: "Program Curriculum",
            fileUrl: "https://adelefoundation.org/docs/solar-pv-curriculum.pdf",
            fileType: "application/pdf",
            fileSize: 3100000,
            isPublic: false,
            relatedProgramId: progTVET._id,
            uploadedBy: userAdmin._id,
        },
    ]);
    // 24. Audit Logs
    await auditLog_model_js_1.AuditLog.create([
        {
            userId: userAdmin._id,
            userEmail: userAdmin.email,
            userName: `${userAdmin.firstName} ${userAdmin.lastName}`,
            userRole: "SUPER_ADMIN",
            action: "SYSTEM_INITIALIZED",
            entityType: "System",
            entityId: "AEF-CORE",
            reason: "Adele OS Enterprise Platform Initialized & Configured",
            ipAddress: "127.0.0.1",
            userAgent: "AdeleCoreAdmin/2.0",
            timestamp: new Date(),
        },
        {
            userId: userManager._id,
            userEmail: userManager.email,
            userName: `${userManager.firstName} ${userManager.lastName}`,
            userRole: "CENTRE_MANAGER",
            action: "BIOMETRIC_DEVICE_ONLINE",
            entityType: "BiometricDevice",
            entityId: dev1.deviceSerial,
            centreId: centre1._id,
            reason: "Port Harcourt Main Entrance Biometric Terminal synchronized successfully",
            ipAddress: "192.168.1.50",
            userAgent: "AEF-OptiScan/5000",
            timestamp: new Date(),
        },
    ]);
    // 25. Org Settings
    await auditLog_model_js_1.OrgSettings.create([
        {
            key: "PLATFORM_NAME",
            value: "Adele Empowerment Foundation Digital OS",
            description: "Official organization platform title",
            category: "General",
            lastUpdatedBy: userAdmin._id,
        },
        {
            key: "MIN_ATTENDANCE_PERCENTAGE",
            value: 80,
            description: "Minimum required attendance rate for graduation & certification",
            category: "Attendance",
            lastUpdatedBy: userAdmin._id,
        },
        {
            key: "BIOMETRIC_GRACE_PERIOD_MINUTES",
            value: 15,
            description: "Minutes after session start time before marked as late",
            category: "Biometrics",
            lastUpdatedBy: userAdmin._id,
        },
        {
            key: "ENABLE_EMAIL_NOTIFICATIONS",
            value: true,
            description: "Toggle transactional Brevo email delivery",
            category: "Notifications",
            lastUpdatedBy: userAdmin._id,
        },
    ]);
    console.log("[Seed] Database successfully populated with realistic AEF operating system seed data!");
    console.log("===============================================================");
    console.log(" SEED CREDENTIALS SUMMARY:");
    console.log(" - Super Admin:    admin@adelefoundation.org    / Admin@2026");
    console.log(" - Centre Manager: manager@adelefoundation.org  / Manager@2026");
    console.log(" - Trainer:        trainer@adelefoundation.org  / Trainer@2026");
    console.log(" - Trainee 1:      trainee@adelefoundation.org  / Trainee@2026");
    console.log(" - Trainee 2:      chinedu@gmail.com            / Chinedu@2026");
    console.log(" - Candidate:      preye@gmail.com              / Preye@2026");
    console.log(" - Alumni:         blessing@gmail.com           / Blessing@2026");
    console.log(" - Verification:   /verify/aef-verify-7c9e12bf4089a8c");
    console.log("===============================================================");
}
if (process.argv[1]?.endsWith("seed.ts") ||
    process.argv[1]?.endsWith("seed.js")) {
    seedDatabase()
        .then(() => {
        console.log("[Seed] Seeding completed.");
        process.exit(0);
    })
        .catch((err) => {
        console.error("[Seed Error] Failed to seed database:", err);
        process.exit(1);
    });
}
//# sourceMappingURL=seed.js.map