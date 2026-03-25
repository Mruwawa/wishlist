<script>
    import { authReady, loginWithGoogle, user } from "../services/auth";
    import AllWishlists from "./AllWishlists.svelte";
</script>

<section>
    <div class="flex flex-col items-center gap-4">
        {#if !$authReady}
            <p>Loading auth...</p>
        {:else if $user}
            <h1>Welcome, {$user.displayName}!</h1>
            <AllWishlists />
        {:else}
            <h1>Hello, please log in</h1>
            <button
                class="cursor-pointer text-white p-2 bg-blue-600 border-2 border-blue-600 rounded"
                on:click={loginWithGoogle}>Sign in with Google</button
            >
        {/if}
    </div>
</section>
