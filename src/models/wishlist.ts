export interface WishlistProps {
    name: string;
    userIds: string[];
    imageUrl: string;
    backgroundImageUrl?: string;
    createdAt: Date;
    updatedAt: Date;
    itemCount: number;
    updatedBy?: string;
    id: string;
    items?: WishlistItemProps[];
}

export interface WishlistItemProps {
    name: string;
    description: string;
    imageUrl: string;
    link: string;
    createdAt: Date;
    updatedAt: Date;
    updatedBy?: string;
    id: string;
}