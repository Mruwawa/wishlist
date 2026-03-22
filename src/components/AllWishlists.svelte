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
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {#each wishlists as wishlist}
                <div class="border rounded p-4">
                    <a href={`#/wishlist/${wishlist.id}`}>
                        <img
                            src={wishlist.imageUrl ||
                                "https://via.placeholder.com/150"}
                            alt={wishlist.name}
                            class="w-full h-32 object-cover mb-2 rounded"
                        />
                        <h3 class="text-lg font-semibold">{wishlist.name}</h3>
                        <p class="text-sm text-gray-600">
                            {wishlist.itemCount} items
                        </p>
                    </a>
                </div>
            {/each}
        </div>
    {/if}
{:else}
    <p>Please sign in to view your wishlists.</p>
{/if}
