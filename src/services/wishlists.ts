import { updateDoc } from "firebase/firestore";
import type { Wishlist, WishlistItem } from "../models/wishlist";
import { addItem, getItemById, getItems, updateItem } from "./storage";

/**
 * @param name - The name of the new wishlist
 * @param imageUrl - The URL of the image for the new wishlist
 * @returns The ID of the newly created wishlist document in Firestore
 */
export async function addNewWishlist(name: string, imageUrl: string): Promise<string> {
    return addItem("wishlists", {
        name,
        userIds: [],
        imageUrl: imageUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
        itemCount: 0,
        id: crypto.randomUUID()
    });
}

export async function getAllWishlists(): Promise<Wishlist[]> {
    const wishlists: Wishlist[] = await getItems<Wishlist>("wishlists");
    return wishlists;
}

export async function getWishlistById(id: string): Promise<Wishlist | null> {
    const wishList = await getItemById<Wishlist>("wishlists", id);
    return wishList;
}

export async function addItemToWishlist(wishlistId: string, item: WishlistItem): Promise<void> {
    const wishList = await getWishlistById(wishlistId);
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