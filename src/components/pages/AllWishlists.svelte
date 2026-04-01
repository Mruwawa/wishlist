<script lang="ts">
    import { onMount } from "svelte";
    import type { WishlistProps } from "../../models/wishlist";
    import { getAllWishlists } from "../../services/wishlists";
    import AddWishlist from "../AddWishlist.svelte";
    import Popup from "../Popup.svelte";
    import Navbar from "../Navbar/Navbar.svelte";
    import AddIcon from "../icons/AddIcon.svelte";
    import NavbarButton from "../Navbar/NavbarButton.svelte";
    import LoadingIcon from "../icons/LoadingIcon.svelte";
    import Wishlist from "../Wishlist.svelte";

    let wishlists: WishlistProps[] = $state([]);
    let loading = $state(true);
    let error: string | null = $state(null);

    onMount(async () => {
        try {
            // wishlists = [];
            wishlists = await getAllWishlists();
            // throw new Error("Test error");
        } catch (e) {
            console.error(e);
            error = "There was an error";
        } finally {
            loading = false;
        }
    });

    let popupOpen = $state(false);
</script>

<Navbar>
    <div class="w-full flex justify-center">
        <NavbarButton
            text="Add Wishlist"
            onClick={() => {
                popupOpen = true;
                console.log("opening popup");
            }}
        >
            {#snippet icon()}
                <AddIcon size="30" color="white"></AddIcon>
            {/snippet}
        </NavbarButton>
    </div>
</Navbar>
<div class="lg:mt-20 h-screen">
    <div class="w-full h-20 overflow-hidden">
        <h1
            style="font-size: 75px; color: rgba(255,255,255,0.7);"
            class="font-bold text-left align-text-top pl-4 pt-4 pb-4"
        >
            Wishlists
        </h1>
        <hr />
    </div>
    {#if loading || error || wishlists.length === 0}
        <div
            class="w-full h-[calc(100vh-8rem)] flex items-center justify-center flex-col"
        >
            {#if loading}
                <LoadingIcon />
                <p>Loading wishlists...</p>
            {:else if error}
                <div class="flex flex-col gap-4">
                    <img src="anya-forger.gif" alt="" />
                    <p>{error}</p>
                </div>
            {:else if wishlists.length === 0}
                <div class="flex flex-col gap-4">
                    <img src="sad-cat.jpg" alt="" />
                    <p>No wishlists found.</p>
                </div>
            {/if}
        </div>
    {:else}
        <div class="columns-2 space-y-4 p-4 lg:columns-4">
            {#each wishlists as wishlist}
                <Wishlist
                    {wishlist}
                    onDelete={async () => {
                        wishlists = await getAllWishlists();
                        popupOpen = false;
                    }}
                />
            {/each}
        </div>
    {/if}
</div>

<Popup bind:open={popupOpen}>
    {#snippet header()}
        <h2>Add New Wishlist</h2>
    {/snippet}
    <AddWishlist
        onWishlistCreated={async () => {
            wishlists = await getAllWishlists();
            popupOpen = false;
        }}
    />
</Popup>
