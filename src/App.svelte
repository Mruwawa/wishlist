<script lang="ts">
  import Home from "./components/Home.svelte";
  import Router from "svelte-spa-router";
  import AllWishlists from "./components/pages/AllWishlists.svelte";
  import Wishlist from "./components/pages/WishlistDetails.svelte";
  import { authReady, user } from "./services/auth";
  import wrap from "svelte-spa-router/wrap";
  import type { Component } from "svelte";
  import TEST from "./components/TEST.svelte";
  import Loading from "./components/icons/LoadingIcon.svelte";

  const waitForAuthReady = () =>
    new Promise<void>((resolve) => {
      if ($authReady) return resolve();

      const unsub = authReady.subscribe((ready) => {
        if (ready) {
          unsub();
          resolve();
        }
      });
    });

  const loggedInOnly = (component: Component<any, {}, string>) =>
    wrap({
      component,
      conditions: [
        async () => {
          await waitForAuthReady();
          return $user !== null;
        },
      ],
    });

  const routes = {
    "/": Home,
    "/all-wishlists": loggedInOnly(AllWishlists),
    "/wishlist/:id": loggedInOnly(Wishlist),
    "/big-test": loggedInOnly(TEST),
  };
</script>

{#if $authReady}
  <Router {routes} />
{:else}
  <div class="size-full h-screen flex flex-col items-center justify-center">
    <Loading />
    <p>Loading</p>
  </div>
{/if}
