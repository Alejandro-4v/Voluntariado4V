export interface NavbarOption {
    label: string;
    path?: string;
    action?: () => void;
    type?: 'link' | 'button' | 'icon'; 
    icon?: string; 
}

export type NavbarMode = 'white' | 'blue';
