<script lang="ts">
    import type { WishlistItemProps } from "../models/wishlist";
    import {
        removeItemFromWishlist,
        updateWishlistItem,
    } from "../services/wishlists";
    import BoughtIcon from "./icons/BoughtIcon.svelte";
    import CheckIcon from "./icons/CheckIcon.svelte";
    import LinkIcon from "./icons/LinkIcon.svelte";
    import TrashIcon from "./icons/TrashIcon.svelte";
    import Popup from "./Popup.svelte";

    const {
        item,
        wishlistId,
        onDeleted,
        onUpdated,
    }: {
        item: WishlistItemProps;
        wishlistId: string;
        onDeleted: (name: string) => void;
        onUpdated: () => void;
    } = $props();

    let deletePopupOpen = $state(false);
    let detailsPopupOpen = $state(false);

    async function deleteItem() {
        await removeItemFromWishlist(wishlistId, item.id);
        onDeleted(item.name);
        deletePopupOpen = false;
    }

    async function markAsBought() {
        const updatedItem = {
            ...item,
            bought: true,
        };
        await updateWishlistItem(wishlistId, updatedItem);
        onUpdated();
    }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
    class="p-4 pb-2 break-inside-avoid glass"
    onclick={() => {
        detailsPopupOpen = true;
    }}
>
    <!-- <a href={`#/wishlist/${wishlist.id}`}> -->
    <div></div>
    <div>
        <img class="rounded-lg" src={item.imageUrl} alt={item.name} />
        <h3 class="text-lg font-semibold">
            {item.name}
        </h3>
    </div>
    <!-- </a> -->
    <div class="w-full flex items-center justify-center mt-2">
        <!-- <div class="flex-1"></div> -->
        <h3 class="flex flex-1 justify-start items-center gap-1">
            Bought
            <CheckIcon size={24} color="rgba(255, 255, 255, 0.4)" />
        </h3>
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
        <h2>Are you sure you want to delete "{item.name}"?</h2>
    {/snippet}
    <div class="flex gap-4 flex-col">
        <div class="flex gap-4 justify-center">
            <button
                onclick={() => (deletePopupOpen = false)}
                class="w-25 rounded border px-4 py-2 hover:bg-[rgba(255,255,255,0.05)] active:bg-[rgba(255,255,255,0.1)]"
                >No</button
            >
            <button
                onclick={deleteItem}
                class="w-25 rounded border px-4 py-2 hover:bg-[rgba(255,255,255,0.05)] active:bg-[rgba(255,255,255,0.1)]"
                >Yes</button
            >
        </div>
    </div>
</Popup>

<Popup bind:open={detailsPopupOpen}>
    {#snippet header()}
        <div>
            <h2
                class="flex flex-1 justify-start items-center gap-2 text-xl text-white"
                style="margin:0 !important"
            >
                {item.name}
            </h2>
            {#if item.bought}
                <h3 class="flex flex-1 justify-start items-center gap-1">
                    Bought
                    <CheckIcon size={24} color="rgba(255, 255, 255, 0.4)" />
                </h3>
            {/if}
        </div>
    {/snippet}
    <div class="flex gap-4 flex-col min-h-[70vh]">
        <div class="w-full">
            <img class="rounded-xl" src={item.imageUrl} alt={item.name} />
        </div>
        <div>
            <p class="text-lg text-white">Description</p>
            <p class="">{item.description}</p>
        </div>

        <div class="flex gap-2">
            <a
                href={item.link}
                class="rounded border px-2 py-2 hover:bg-[rgba(255,255,255,0.05)] active:bg-[rgba(255,255,255,0.1)]"
            >
                <span class="flex gap-1 items-center">
                    <LinkIcon size={20} color="rgba(255, 255, 255, 0.7)" />
                    <span> Go to shop </span>
                </span>
            </a>
            {#if !item.bought}
                <button
                    class="rounded border px-2 py-2 hover:bg-[rgba(255,255,255,0.05)] active:bg-[rgba(255,255,255,0.1)] flex gap-1"
                    onclick={markAsBought}
                >
                    <BoughtIcon size={20} color="rgba(255, 255, 255, 0.7)" />
                    Mark as bought</button
                >
            {/if}
        </div>
    </div>
</Popup>

<style>
    .glass {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(7.5px);
        color: rgba(255, 255, 255, 0.7);
    }
    * {
        box-sizing: border-box;
    }
</style>
