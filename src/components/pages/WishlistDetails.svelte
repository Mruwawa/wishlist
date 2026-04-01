<script lang="ts">
    import { onMount } from "svelte";
    import type {
        WishlistProps,
        WishlistItemProps,
    } from "../../models/wishlist";
    import { getWishlistById } from "../../services/wishlists";
    import AddItem from "../AddItem.svelte";
    import Popup from "../Popup.svelte";
    import Navbar from "../Navbar/Navbar.svelte";
    import NavbarButton from "../Navbar/NavbarButton.svelte";
    import AddIcon from "../icons/AddIcon.svelte";
    import WishlistItem from "../WishlistItem.svelte";
    import { Vibrant } from "node-vibrant/browser";
    import { getTextColorFromHex } from "../../utils/colors";
    import StarIcon from "../icons/StarIcon.svelte";
    import LoadingIcon from "../icons/LoadingIcon.svelte";

    let { params } = $props();

    let uiColor = $state("");

    let wishlistId = $derived(params.id);

    let addingItems = $state(false);

    let items: WishlistItemProps[] = $state([]);
    let isLoading = $state(true);

    let wishlist: WishlistProps | null = $state(null);

    onMount(async () => {
        document.documentElement.style.removeProperty("--bg-img");

        try {
            wishlist = await getWishlistById(wishlistId);
            if (wishlist) {
                items = wishlist.items || [];
                if (wishlist.backgroundImageUrl) {
                    const img = document.createElement("img");
                    img.src = wishlist.backgroundImageUrl;
                    img.crossOrigin = "anonymous";
                    img?.addEventListener("load", () => {
                        Vibrant.from(img)
                            .getPalette()
                            .then((palette) => {
                                uiColor = palette.Vibrant?.hex ?? "";
                            });
                    });

                    document.documentElement.style.setProperty(
                        "--bg-img",
                        `url(${wishlist.backgroundImageUrl})`,
                    );
                }
            }
        } catch (e) {
            console.error(e);
        } finally {
            isLoading = false;
        }
    });

    const textColor = $derived(getTextColorFromHex(uiColor));
</script>

<Navbar bind:bgColor={uiColor}>
    <div class="h-full flex items-start">
        <NavbarButton text="Wishlists" href="#/all-wishlists">
            {#snippet icon()}
                <StarIcon size="30" color={textColor} />
            {/snippet}
        </NavbarButton>
    </div>
    <div class="w-full flex justify-center">
        <NavbarButton text="Add Item" onClick={() => (addingItems = true)}>
            {#snippet icon()}
                <AddIcon size="30" color={textColor}></AddIcon>
            {/snippet}
        </NavbarButton>
    </div>
</Navbar>

<div class="background">
    {#if wishlist}
        <h1
            style="font-size: 75px; color: rgba(255,255,255,0.7);"
            class="font-bold text-left align-text-top pl-4 pt-4 pb-4"
        >
            {wishlist.name}
        </h1>
        <Popup bind:open={addingItems}>
            {#snippet header()}
                <h2>Add New Item</h2>
            {/snippet}

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
            />
        </Popup>
        <div class="columns-2 space-y-4 p-4 lg:columns-4">
            {#each items as item}
                <WishlistItem {item}></WishlistItem>
            {/each}
        </div>
    {:else}
        <div
            class="size-full h-screen flex flex-col items-center justify-center"
        >
            <LoadingIcon />
            <p>Loading</p>
        </div>
    {/if}
</div>

<style>
    .background::before {
        content: "";
        position: fixed;
        inset: 0;
        background-image: var(--bg-img);
        background-size: cover;
        background-position: center;
        filter: brightness(0.7);
        z-index: -1;
    }
</style>
