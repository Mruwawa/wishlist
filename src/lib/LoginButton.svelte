<script lang="ts">
    import { authReady, loginWithGoogle, logout, user } from "./auth";

</script>

{#if !$authReady}
  <p>Loading auth...</p>
{:else if $user}
  <p>Signed in as {$user.displayName} ({$user.email})</p>
  <button on:click={logout}>Sign out</button>
{:else}
  <button on:click={loginWithGoogle}>Sign in with Google</button>
{/if}