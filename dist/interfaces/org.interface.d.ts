export interface IOrganization {
    _id: any;
    name: string;
    code: string;
    tagline?: string;
    description?: string;
    email: string;
    phone: string;
    address: string;
    state: string;
    lga: string;
    country: string;
    website?: string;
    logoUrl?: string;
    primaryColor?: string;
    secondaryColor?: string;
    establishedDate?: Date;
    registrationNumber?: string;
    taxId?: string;
}
export interface IStaff {
    _id: any;
    staffCode: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    gender: 'male' | 'female' | 'other' | string;
    dateOfBirth?: Date;
    email: string;
    phone: string;
    address?: string;
    state?: string;
    lga?: string;
    position: string;
    employmentStatus: 'active' | 'on leave' | 'suspended' | 'terminated' | 'resigned' | string;
    employmentType: 'full-time' | 'part-time' | 'contract' | 'volunteer' | string;
    assignedCentreId?: any;
    managerId?: any;
    dateJoined: Date;
    dateExited?: Date;
    emergencyContact?: {
        name: string;
        relationship: string;
        phone: string;
    };
    hasSystemAccount: boolean;
    userId?: any;
    salaryInfo?: {
        accountNumber?: string;
        bankName?: string;
        baseSalary?: number;
    };
    documents?: {
        name: string;
        url: string;
        type: string;
        uploadedAt: Date;
    }[];
    notes?: string;
}
export interface IVolunteer {
    _id: any;
    volunteerCode: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender: string;
    skills: string[];
    departmentId?: any;
    assignedCentreId?: any;
    responsibilities?: string;
    startDate: Date;
    endDate?: Date;
    status: 'active' | 'inactive' | 'completed' | string;
    hasSystemAccount: boolean;
    userId?: any;
    emergencyContact?: {
        name: string;
        relationship: string;
        phone: string;
    };
    notes?: string;
}
export interface IPartner {
    _id: any;
    name: string;
    code: string;
    type: 'government' | 'ngo' | 'corporate' | 'sponsor' | 'training organization' | 'funding agency' | 'employer' | 'other' | string;
    contactPerson: {
        name: string;
        title: string;
        email: string;
        phone: string;
    };
    email: string;
    phone?: string;
    website?: string;
    address?: string;
    state?: string;
    country?: string;
    status: 'active' | 'prospective' | 'inactive' | 'archived' | string;
    programsSponsored?: any[];
    notes?: string;
    documents?: {
        name: string;
        url: string;
        uploadedAt: Date;
    }[];
}
export interface ITrainingCentre {
    _id: any;
    name: string;
    centreCode: string;
    address: string;
    state: string;
    lga: string;
    contactEmail: string;
    contactPhone: string;
    centreManagerId?: any;
    capacity: number;
    status: 'active' | 'under maintenance' | 'closed' | 'planned' | string;
    accreditationDetails?: {
        accreditedBy: string;
        accreditationNumber: string;
        validUntil: Date;
    };
    geoCoordinates?: {
        latitude: number;
        longitude: number;
    };
    notes?: string;
}
export interface IRoomFacility {
    _id: any;
    centreId: any;
    name: string;
    roomNumber?: string;
    type: 'classroom' | 'workshop' | 'computer lab' | 'practical bay' | 'conference room' | 'other' | string;
    capacity: number;
    equipment: string[];
    isAvailable: boolean;
    status: 'operational' | 'maintenance' | 'decommissioned' | string;
    notes?: string;
}
export interface IAsset {
    _id: any;
    assetTag: string;
    name: string;
    category: 'it equipment' | 'solar hardware' | 'welding & machinery' | 'plumbing tools' | 'vehicle' | 'furniture' | 'biometric scanner' | 'other' | string;
    centreId?: any;
    roomId?: any;
    assignedStaffId?: any;
    condition: 'excellent' | 'good' | 'fair' | 'needs repair' | 'damaged' | 'disposed' | string;
    status: 'in use' | 'in storage' | 'under repair' | 'retired' | string;
    purchaseDate?: Date;
    purchaseCost?: number;
    serialNumber?: string;
    supplier?: string;
    maintenanceHistory?: {
        date: Date;
        description: string;
        cost?: number;
        performedBy: string;
    }[];
}
export interface IDocumentRecord {
    _id: any;
    title: string;
    category: 'accreditation' | 'policy' | 'partner agreement' | 'staff document' | 'centre document' | 'program curriculum' | 'general' | string;
    fileUrl: string;
    fileType: string;
    fileSize?: number;
    isPublic: boolean;
    requiredPermission?: string;
    relatedCentreId?: any;
    relatedProgramId?: any;
    uploadedBy: any;
    createdAt: Date;
}
