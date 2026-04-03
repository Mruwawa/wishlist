import { updateDoc } from "firebase/firestore";
import type { WishlistProps, WishlistItemProps } from "../models/wishlist";
import { addItem, getItemById, getItems, removeItem, updateItem } from "./storage";

/**
 * @param name - The name of the new wishlist
 * @param imageUrl - The URL of the image for the new wishlist
 * @returns The ID of the newly created wishlist document in Firestore
 */
export async function addNewWishlist(name: string, imageUrl: string, backgroundImageUrl: string): Promise<string> {
    return addItem("wishlists", {
        name,
        userIds: [],
        imageUrl: imageUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
        itemCount: 0,
        backgroundImageUrl
    });
}



export async function removeWishlist(id: string) {
    await removeItem("wishlists", id);
}

export async function getAllWishlists(): Promise<WishlistProps[]> {
    const wishlists: WishlistProps[] = await getItems<WishlistProps>("wishlists");
    console.log(wishlists);
    return wishlists;
}

export async function getWishlistById(id: string): Promise<WishlistProps | null> {
    const wishList = await getItemById<WishlistProps>("wishlists", id);
    return wishList;
}

export async function addItemToWishlist(wishlistId: string, item: WishlistItemProps): Promise<void> {
    const wishList = await getWishlistById(wishlistId);
    console.log(wishlistId)
    if (!wishList) {
        throw new Error("Wishlist not found");
    }

    const newItems = wishList.items ? [...wishList.items, item] : [item];

    await updateItem("wishlists", wishList.id, {
        items: newItems,
        itemCount: wishList.itemCount + 1,
        updatedAt: new Date()
    });

}

export async function removeItemFromWishlist(wishlistId: string, itemId: string): Promise<void> {
    const wishList = await getWishlistById(wishlistId);
    console.log(wishlistId)
    if (!wishList) {
        throw new Error("Wishlist not found");
    }

    const updatedItems = wishList.items?.filter(x => x.id != itemId);

    await updateItem("wishlists", wishList.id, {
        items: updatedItems,
        itemCount: wishList.itemCount - 1,
        updatedAt: new Date()
    });

}


export async function updateWishlistItem(wishlistId: string, item: WishlistItemProps) {
    const wishList = await getWishlistById(wishlistId);
    console.log(wishlistId)
    if (!wishList) {
        throw new Error("Wishlist not found");
    }

    let updatedItems = wishList.items?.filter(x => x.id != item.id);
    updatedItems = [...updatedItems ?? [], item]

    await updateItem("wishlists", wishList.id, {
        items: updatedItems,
        itemCount: wishList.itemCount + 1,
        updatedAt: new Date()
    });

}