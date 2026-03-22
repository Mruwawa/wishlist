<script>
  import Home from "./components/Home.svelte";
  import Router from "svelte-spa-router";
  import AddWishlist from "./components/AddWishlist.svelte";
  import AllWishlists from "./components/AllWishlists.svelte";
  import Wishlist from "./components/Wishlist.svelte";

  const routes = {
    "/": Home,
    "/all-wishlists": AllWishlists,
    "/add-wishlist": AddWishlist,
    "/wishlist/:id": Wishlist,
  };
</script>

<a href="#/add-wishlist" class="text-blue-500 underline"
  >Go to add wishlist page</a
>
<a href="#/all-wishlists" class="text-blue-500 underline"
  >Go to all wishlists page</a
>
<a href="#/" class="text-blue-500 underline">HOME</a>
<Router {routes} />
