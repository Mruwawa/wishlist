<script lang="ts">
  import Home from "./components/Home.svelte";
  import Router from "svelte-spa-router";
  import AddWishlist from "./components/AddWishlist.svelte";
  import AllWishlists from "./components/AllWishlists.svelte";
  import Wishlist from "./components/Wishlist.svelte";
  import { authReady, logout, user } from "./services/auth";
  import HomeIcon from "./components/icons/HomeIcon.svelte";
  import wrap from "svelte-spa-router/wrap";
  import type { Component } from "svelte";
    import TEST from "./components/TEST.svelte";

  const loggedInOnly = (component: Component<any, {}, string>) =>
    wrap({
      component,
      conditions: [() => $user !== null],
    });

  const routes = {
    "/": Home,
    "/all-wishlists": loggedInOnly(AllWishlists),
    "/wishlist/:id": loggedInOnly(Wishlist),
    "/big-test": loggedInOnly(TEST),
  };

  let userMenuOpen = false;

  document.addEventListener("click", (event) => {
    const target = event.target as Node | null;
    if (document.getElementById("userMenu")?.contains(target)) {
      return;
    }
    userMenuOpen = false;
  });
</script>

<div>
  <Router {routes} />

  {#if $user}
    <div
      class="flex flex-row shadow-2xs bg-cyan-950 justify-center items-center w-full px-2 h-15 gap-4 fixed bottom-0"
    >
      <a class="flex items-center gap-2" href="#/">
        <HomeIcon color="white" size="30"></HomeIcon>
      </a>
      <div class="flex-1"></div>
      {#if $user && $authReady}
        <div class="relative" id="userMenu">
          <button
            class="cursor-pointer"
            on:click={() => {
              userMenuOpen = !userMenuOpen;
            }}
          >
            <img class="w-12 h-12 rounded-full" src={$user.photoURL} alt="" />
          </button>
          {#if userMenuOpen}
            <div
              class="absolute bottom-15 -right-1 bg-[#2e303a] px-4 py-1 hover:bg-[#383a41]"
            >
              <button
                class="cursor-pointer text-white p-2 w-20"
                on:click={logout}>Sign out</button
              >
            </div>
          {/if}
        </div>
      {/if}
    </div>
  {/if}
</div>
