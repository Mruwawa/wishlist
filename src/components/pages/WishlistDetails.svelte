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
            await update();
            if (wishlist) {
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

    async function update() {
        wishlist = await getWishlistById(wishlistId);
        if (wishlist) {
            items = wishlist.items || [];
        }
    }

    const textColor = $derived(getTextColorFromHex(uiColor));

    type Mode = "all" | "bought" | "not-bought";

    let mode: Mode = $state<Mode>("all");

    let filteredItems = $derived(filterItems(items));

    function filterItems(items: WishlistItemProps[]): WishlistItemProps[] {
        switch (mode) {
            case "all":
                return items;
            case "bought":
                return items.filter((x) => x.bought);
            case "not-bought":
                return items.filter((x) => !x.bought);
        }
    }
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
        <div class="flex items-end px-4">
            <div
                class="glass flex rounded border-2 border-[rgba(255,255,255,0.5)] text-[rgba(255,255,255,0.5)]"
            >
                <button
                    class={`border-r-2 p-2 ${
                        mode === "all" ? "bg-[rgba(255,255,255,0.3)]" : ""
                    } hover:bg-[rgba(255,255,255,0.3)] active:bg-[rgba(255,255,255,0.3)]`}
                    onclick={() => (mode = "all")}
                >
                    <p class={mode == "all" ? "text-white" : ""}>ALL</p>
                </button>
                <button
                    onclick={() => (mode = "bought")}
                    class={`border-r-2 p-2 ${
                        mode === "bought" ? "bg-[rgba(255,255,255,0.3)]" : ""
                    } hover:bg-[rgba(255,255,255,0.3)] active:bg-[rgba(255,255,255,0.3)]`}
                >
                    <p class={mode == "bought" ? "text-white" : ""}>BOUGHT</p>
                </button>
                <button
                    onclick={() => (mode = "not-bought")}
                    class={`p-2 ${
                        mode === "not-bought"
                            ? "bg-[rgba(255,255,255,0.3)]"
                            : ""
                    } hover:bg-[rgba(255,255,255,0.3)] active:bg-[rgba(255,255,255,0.3)]`}
                >
                    <p class={mode == "not-bought" ? "text-white" : ""}>
                        NOT BOUGHT
                    </p>
                </button>
            </div>
            <div class="flex-1"></div>
        </div>
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
            {#each filteredItems as item}
                <WishlistItem
                    {item}
                    wishlistId={wishlist.id}
                    onDeleted={() => {
                        getWishlistById(wishlistId).then((updated) => {
                            if (updated) {
                                console.log(updated);
                                items = updated.items || [];
                            }
                        });
                    }}
                    onUpdated={() => {
                        getWishlistById(wishlistId).then((updated) => {
                            if (updated) {
                                console.log(updated);
                                items = updated.items || [];
                            }
                        });
                    }}
                ></WishlistItem>
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

    .glass {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(7.5px);
        color: rgba(255, 255, 255, 0.7);
    }
</style>
