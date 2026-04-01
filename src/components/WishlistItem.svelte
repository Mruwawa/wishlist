<script lang="ts">
    import type { WishlistItemProps } from "../models/wishlist";

    let { item }: { item: WishlistItemProps } = $props();
</script>

<div class="p-4 break-inside-avoid glass">
    <!-- <a href={`#/wishlist/${wishlist.id}`}> -->
    <div>
        <img class="rounded-lg" src={item.imageUrl} alt={item.name} />
        <h3 class="text-lg font-semibold">
            {item.name}
        </h3>
    </div>
    <!-- </a> -->
</div>

<style>
    .glass {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(7.5px);
        color: rgba(255, 255, 255, 0.7);
    }
</style>
