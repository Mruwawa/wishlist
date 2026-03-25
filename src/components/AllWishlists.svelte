<script lang="ts">
    import { onMount } from "svelte";
    import type { Wishlist } from "../models/wishlist";
    import { getAllWishlists } from "../services/wishlists";
    import { user } from "../services/auth";

    let wishlists: Wishlist[] = [];
    let loading = true;
    let error: string | null = null;

    onMount(async () => {
        try {
            wishlists = await getAllWishlists();
        } catch (e) {
            console.error(e);
            error = "Failed to load wishlists";
        } finally {
            loading = false;
        }
    });
</script>

{#if $user}
    {#if loading}
        <p>Loading wishlists...</p>
    {:else if error}
        <p class="text-red-500">{error}</p>
    {:else if wishlists.length === 0}
        <p>No wishlists found.</p>
    {:else}
        <div class="columns-2 space-y-4 p-4 lg:columns-4">
            {#each wishlists as wishlist}
                <div class="p-4 break-inside-avoid glass">
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
                </div>
            {/each}
        </div>
    {/if}
{:else}
    <p>Please sign in to view your wishlists.</p>
{/if}

<style>
    .glass {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(7.5px);
    }
</style>
