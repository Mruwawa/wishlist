<script lang="ts">
    import { onMount } from "svelte";
    import type { Wishlist, WishlistItem } from "../models/wishlist";
    import { getWishlistById } from "../services/wishlists";
    import AddItem from "./AddItem.svelte";

    export let params: { id: string };

    $: wishlistId = params.id;

    let addingItems = false;

    let items: WishlistItem[] = [];
    let loading = true;

    let wishlist: Wishlist | null = null;

    onMount(async () => {
        try {
            wishlist = await getWishlistById(wishlistId);
            console.log(wishlist);
            if (wishlist) {
                items = wishlist.items || [];
            }
        } catch (e) {
            console.error(e);
        } finally {
            loading = false;
        }
    });
</script>

{#if wishlist}
    <h1>{wishlist.name}</h1>
    <h2>
        Add Item <button on:click={() => (addingItems = !addingItems)}>+</button
        >
    </h2>
    {#if addingItems}
        <AddItem
            {wishlistId}
            onItemCreated={() => {
                getWishlistById(wishlistId).then((updated) => {
                    if (updated) {
                        items = updated.items || [];
                    }
                });
                addingItems = false;
            }}
            onClose={(addingItems = false)}
        />
    {/if}
    <hr />
    <div class="columns-2 space-y-4 p-4 lg:columns-4">
        {#each items as item}
            <div class="p-4 break-inside-avoid glass">
                <!-- <a href={`#/wishlist/${wishlist.id}`}> -->
                <div>
                    <img
                        class="rounded-lg"
                        src={item.imageUrl}
                        alt={item.name}
                    />
                    <h3 class="text-lg font-semibold">
                        {item.name}
                    </h3>
                </div>
                <!-- </a> -->
            </div>
        {/each}
    </div>
{:else}
    <p>Loading...</p>
{/if}

<style>
    .glass {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(7.5px);
    }
</style>
