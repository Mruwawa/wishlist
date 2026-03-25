<script lang="ts">
    import { addItemToWishlist } from "../services/wishlists";
    import XIcon from "./icons/XIcon.svelte";

    const { wishlistId, onItemCreated, onClose } = $props();

    let name = $state("");
    let description = $state("");
    let imageUrl = $state("");
    let link = $state("");
    let createdAt = new Date();
    let updatedAt = new Date();
    let id = crypto.randomUUID();
    let error: string | null = $state(null);

    async function handleSubmit(event: Event) {
        event.preventDefault();
        error = null;

        if (!name) {
            error = "Name is required";
        }

        // if(!imageUrl) {
        //     error = "Image URL is required"
        // }

        // if(!link) {
        //     error = "Link is required"
        // }

        if(error) {
            return;
        }

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

            onItemCreated();

            // Reset form fields
            name = "";
            description = "";
            imageUrl = "";
            link = "";
        } catch (e) {
            console.error(e);
            error = "Failed to create wishlist item";
        }
    }
</script>

<div
    class="absolute bottom-0 h-3/4 left-0 w-full glass z-10 lg:left-1/8 lg:w-3/4"
>
    <button class="absolute top-0 right-0 m-3" onclick={() => onClose()}>
        <XIcon color={"rgb(156, 163, 175)"} size={16}></XIcon>
    </button>
    <h2>Add new item</h2>
    <form onsubmit={handleSubmit}>
        <div
            class="flex justify-center items-center flex-col space-y-5 px-6 w-full"
        >
            <div class="w-full">
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

            <div class="w-full">
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

            <div class="w-full">
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

            <div class="w-full">
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
            {#if error}
                <div>
                    <p class="text-red-500 text-sm">{error}</p>
                </div>
            {/if}

            <button
                type="submit"
                class="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                title="Create wishlist item"
            >
                Add
            </button>
        </div>
    </form>
</div>

<style>
    .glass {
        background: rgba(255, 255, 255, 0.2);
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(5px);
    }
</style>
