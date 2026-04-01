<script lang="ts">
    import type { WishlistProps } from "../models/wishlist";
    import { removeWishlist } from "../services/wishlists";
    import TrashIcon from "./icons/TrashIcon.svelte";
    import Popup from "./Popup.svelte";

    let {
        wishlist,
        onDelete,
    }: { wishlist: WishlistProps; onDelete: (name: string) => void } = $props();

    let deletePopupOpen = $state(false);

    function deleteWishlist() {
        console.log("deleting", wishlist.name)
        removeWishlist(wishlist.id);
        onDelete(wishlist.name);
    }
</script>

<div class="p-4 break-inside-avoid glass flex flex-col">
    <a href={`#/wishlist/${wishlist.id}`}>
        <div>
            <img
                class="rounded-lg"
                src={wishlist.imageUrl}
                alt={wishlist.name}
            />
            <h3 class="text-lg font-semibold">
                {wishlist.name}
            </h3>
            <p class="text-sm text-gray-600">
                {wishlist.itemCount} items
            </p>
        </div>
    </a>
    <div class="w-full flex items-end">
        <div class="flex-1"></div>
        <button
            onclick={() => {
                deletePopupOpen = true;
            }}><TrashIcon size={16} color={"white"} /></button
        >
    </div>
</div>
<Popup bind:open={deletePopupOpen}>
    {#snippet header()}
        <h2>Are you sure you want to delete "{wishlist.name}"?</h2>
    {/snippet}
    <div class="flex gap-4 flex-col">
        <div class="flex gap-4 justify-center">
            <button
                onclick={() => (deletePopupOpen = false)}
                class="w-25 rounded border px-4 py-2 hover:bg-[rgba(255,255,255,0.05)] active:bg-[rgba(255,255,255,0.1)]"
                >No</button
            >
            <button
                onclick={deleteWishlist}
                class="w-25 rounded border px-4 py-2 hover:bg-[rgba(255,255,255,0.05)] active:bg-[rgba(255,255,255,0.1)]"
                >Yes</button
            >
        </div>
    </div>
</Popup>

<style>
    .glass {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(7.5px);
    }
</style>
