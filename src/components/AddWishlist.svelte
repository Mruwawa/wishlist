<script lang="ts">
    import { user } from "../services/auth";
    import { addNewWishlist } from "../services/wishlists";

    let name = "";
    let imageUrl = "";

    let loading = false;
    let error: string | null = null;
    let success = false;

    async function handleSubmit() {
        error = null;
        success = false;

        if (!name.trim()) {
            error = "Name is required";
            return;
        }

        try {
            loading = true;

            const id = await addNewWishlist(name, imageUrl);

            console.log("Created wishlist with id:", id);

            // reset form
            name = "";
            imageUrl = "";
            success = true;
        } catch (e) {
            console.error(e);
            error = "Something went wrong";
        } finally {
            loading = false;
        }
    }
</script>

{#if $user}
    <form on:submit|preventDefault={handleSubmit} class="space-y-4 max-w-md">
        <div>
            <label class="block text-sm font-medium mb-1" for="name">Name</label
            >
            <input
                type="text"
                bind:value={name}
                class="w-full border rounded px-3 py-2"
                placeholder="Wishlist name"
                name="name"
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

        <button
            type="submit"
            disabled={loading}
            class="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
            {loading ? "Creating..." : "Create wishlist"}
        </button>

        {#if error}
            <p class="text-red-500 text-sm">{error}</p>
        {/if}

        {#if success}
            <p class="text-green-600 text-sm">Wishlist created ✅</p>
        {/if}
    </form>
{:else}
    <p>Please sign in to create a wishlist.</p>
{/if}
