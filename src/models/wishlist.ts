export interface Wishlist {
    name: string;
    userIds: string[];
    imageUrl: string;
    createdAt: Date;
    updatedAt: Date;
    itemCount: number;
    updatedBy?: string;
    id: string;
    items?: WishlistItem[];
}

export interface WishlistItem {
    name: string;
    description: string;
    imageUrl: string;
    link: string;
    createdAt: Date;
    updatedAt: Date;
    updatedBy?: string;
    id: string;
}