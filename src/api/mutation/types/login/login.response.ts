export interface LoginResponse {
    data: Data;
    statusCode: number;
    message: string;
    metadata: string;
}

export interface Data {
    accessToken: string;
    refreshToken: string;
    userId: null; // User ID is not available in the customer portal login response
    roleId: null; // Role ID is not available in the customer portal login response
    user: User;
    documents: null; // Documents are not available in the customer portal login response
    menu: null; // Menu is not available in the customer portal login response
}

// Document type is not available in the customer portal login response
export interface Document {
    docType: string;
    docNo: string;
    formName: string;
    formPage: string;
    approve: boolean;
    prevDocType: string;
    nextDocType: string;
    isFollowUp: boolean | null;
    permissions: Permissions;
    listTab: null;
}

// Permissions type is not available in the customer portal login response
export interface Permissions {
    view: boolean;
    add: boolean;
    edit: boolean;
    delete: boolean;
    approve: boolean;
    isDiscount: boolean;
    isMarkup: boolean;
    disMaxAmount: number;
    disMaxPercentage: number;
}

// Menu type is not available in the customer portal login response
export interface Menu {
    id: number;
    icon: null | string;
    label: string;
    url: string;
    subMenu: Menu[];
}

export interface User {
    userId: string;
    firstName: string;
    lastName: string;
    roleId: string;
    email: string;
    baseCurCode: string;
    baseCountryCode: string;
}
