<script lang="ts">
    import type { Snippet } from "svelte";

    interface Props {
        name: string;
        description?: string;
        error?: string;
        required?: boolean;
        children: Snippet;
    }

    let {
        name,
        description,
        error,
        required = false,
        children,
    }: Props = $props();
</script>

<div class="w-full flex flex-col gap-1 relative">
    <div>
        {@render children()}
        <label for={name}>
            {name}
            {#if required}
                <span class="-ml-1 text-red-500">*</span>
            {/if}
        </label>
    </div>

    {#if description}
        <div class="flex">
            <p class="text-sm text-neutral-500">
                {description}
            </p>
        </div>
    {/if}

    {#if error}
        <div class="flex">
            <p class="text-sm text-red-600">
                {error}
            </p>
        </div>
    {/if}
</div>

<style>
    @import "./field-styles.css";
</style>
