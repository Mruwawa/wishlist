<script>
    import { loginWithGoogle, user } from "../services/auth";
    import StarIcon from "./icons/StarIcon.svelte";
    import Navbar from "./Navbar/Navbar.svelte";
    import NavbarButton from "./Navbar/NavbarButton.svelte";
</script>

<Navbar>
    <div class="h-full flex items-start">
        <NavbarButton text="Wishlists" href="#/all-wishlists">
            {#snippet icon()}
                <StarIcon size="30" color="white" />
            {/snippet}
        </NavbarButton>
    </div>
</Navbar>
<section class="mt-16">
    <div class="flex flex-col items-center gap-4">
        {#if $user}
            <h1>Welcome, {$user.displayName}!</h1>
            <a href="#/all-wishlists">All wishlists</a>
        {:else}
            <h1>Hello, please log in</h1>
            <button
                class="cursor-pointer text-white p-2 bg-blue-600 border-2 border-blue-600 rounded"
                on:click={loginWithGoogle}>Sign in with Google</button
            >
        {/if}
    </div>
</section>
