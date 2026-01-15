export interface NavbarOption {
    label: string;
    path?: string;
    action?: () => void;
    type?: 'link' | 'button' | 'icon'; // added icon for logout maybe? or specific type
    icon?: string; // for logout icon
}

export type NavbarMode = 'white' | 'blue';
