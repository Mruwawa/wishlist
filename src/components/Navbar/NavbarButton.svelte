<script lang="ts">
    import type { Snippet } from "svelte";

    let {
        text,
        href,
        icon,
        onClick
    }: { text: string; href?: string; onClick?: () => void; icon: Snippet } =
        $props();
</script>

<div class="h-full flex items-center">
    {#if href}
        <a {href}
            ><span class="flex flex-col gap-1 items-center">
                {@render icon()}
                <p class="text-xs">{text}</p>
            </span>
        </a>
    {:else if onClick}
        <button onclick={onClick}
            ><span class="flex flex-col gap-1 items-center">
                {@render icon()}
                <p class="text-xs">{text}</p>
            </span>
        </button>
    {/if}
</div>
