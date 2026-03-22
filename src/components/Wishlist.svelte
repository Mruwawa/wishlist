<script lang="ts">
    import { onMount } from "svelte";
    import type { Wishlist, WishlistItem } from "../models/wishlist";
    import { addItemToWishlist, getWishlistById } from "../services/wishlists";
    import { user } from "../services/auth";
    import { addItem } from "../services/storage";

    export let params: { id: string };

    $: wishlistId = params.id;

    let addingItems = false;

    let items: WishlistItem[] = [];
    let loading = true;
    let error: string | null = null;
    let wishlist: Wishlist | null = null;

    onMount(async () => {
        try {
            wishlist = await getWishlistById(wishlistId);
            console.log(wishlist);
            if (wishlist) {
                items = wishlist.items || [];
            } else {
                error = "Wishlist not found";
            }
        } catch (e) {
            console.error(e);
            error = "Failed to load wishlists";
        } finally {
            loading = false;
        }
    });

    let name = "";
    let description = "";
    let imageUrl = "";
    let link = "";
    let createdAt = new Date();
    let updatedAt = new Date();
    let id = crypto.randomUUID();

    async function handleSubmit() {
        loading = true;
        error = null;

        try {
            await addItemToWishlist(wishlistId, {
                name,
                description,
                imageUrl,
                link,
                createdAt,
                updatedAt,
                id,
            });

            // Reset form fields
            name = "";
            description = "";
            imageUrl = "";
            link = "";
        } catch (e) {
            console.error(e);
            error = "Failed to create wishlist item";
        } finally {
            loading = false;
        }
    }
</script>

{#if $user}
    <h1>Wishlist</h1>
    <p>Route param: {wishlistId}</p>
    {#if wishlist}
        <p>{wishlist.name}</p>
    {/if}
    <!-- <p>{wishlist.name}</p> -->
    <h2>
        Add Item <button on:click={() => (addingItems = !addingItems)}>+</button
        >
    </h2>
    {#if addingItems}
        <p>Show add item form here</p>
        <div>ADDING ITEMS HERE</div>
        <form
            on:submit|preventDefault={handleSubmit}
            class="space-y-4 max-w-md"
        >
            <div>
                <label class="block text-sm font-medium mb-1" for="name"
                    >Name</label
                >
                <input
                    type="text"
                    bind:value={name}
                    class="w-full border rounded px-3 py-2"
                    placeholder="Item name"
                    name="name"
                />
            </div>

            <div>
                <label class="block text-sm font-medium mb-1" for="description"
                    >Description</label
                >
                <input
                    type="text"
                    bind:value={description}
                    class="w-full border rounded px-3 py-2"
                    placeholder="Item description"
                    name="description"
                />
            </div>

            <div>
                <label class="block text-sm font-medium mb-1" for="imageUrl"
                    >Image URL</label
                >
                <input
                    type="text"
                    bind:value={imageUrl}
                    class="w-full border rounded px-3 py-2"
                    placeholder="https://..."
                    name="imageUrl"
                />
            </div>

            <div>
                <label class="block text-sm font-medium mb-1" for="link"
                    >Link</label
                >
                <input
                    type="text"
                    bind:value={link}
                    class="w-full border rounded px-3 py-2"
                    placeholder="https://..."
                    name="link"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                class="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
                {loading ? "Creating..." : "Create item"}
            </button>

            {#if error}
                <p class="text-red-500 text-sm">{error}</p>
            {/if}

        </form>
    {/if}

    <h1>Items:</h1>

    {#each items as item}
        <div class="border rounded p-4">
            <a href={`#/wishlist/${wishlistId}`}>
                <img
                    src={item.imageUrl || "https://via.placeholder.com/150"}
                    alt={item.name}
                    class="w-full h-32 object-cover mb-2 rounded"
                />
                <h3 class="text-lg font-semibold">{item.name}</h3>
            </a>
        </div>
    {/each}
{:else}
    <p>Please sign in to view this wishlist.</p>
{/if}
