<script lang="ts">
    import type { Snippet } from "svelte";
    import { onDestroy } from "svelte";
    import XIcon from "./icons/XIcon.svelte";

    interface Props {
        open?: boolean;
        header?: Snippet;
        children?: Snippet;
        uiColor?: string;
    }

    let {
        open = $bindable(false),
        header,
        children,
        uiColor,
    }: Props = $props();

    let scrollY = 0;

    function close() {
        open = false;
    }

    // lock/unlock scroll
    $effect(() => {
        if (open) {
            scrollY = window.scrollY;

            document.documentElement.style.overflow = "hidden";
            document.body.style.overflow = "hidden";

            // mobile-safe locking
            document.body.style.position = "fixed";
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = "100%";
        } else {
            document.documentElement.style.overflow = "";
            document.body.style.overflow = "";
            document.body.style.position = "";
            document.body.style.top = "";
            document.body.style.width = "";

            window.scrollTo(0, scrollY);
        }
    });

    onDestroy(() => {
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
    });

    const defaultColor = "background: rgb(5, 51, 69);";

    const backgroundColor = $derived(uiColor ?? defaultColor);
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
{#if open}
    <!-- backdrop -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div class="backdrop" onclick={close}></div>

    <!-- modal -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div
        class="popup"
        onclick={(e) => e.stopPropagation()}
        style="background-color:{backgroundColor}"
    >
        <div class="header">
            {#if header}
                {@render header()}
            {:else}
                <div class="flex-1"></div>
            {/if}

            <button onclick={close} class="close">
                <XIcon color={"rgb(156, 163, 175)"} size={16} />
            </button>
        </div>

        <div class="content">
            {#if children}
                {@render children()}
            {/if}
        </div>
    </div>
{/if}

<style>
    .backdrop {
        position: fixed;
        inset: 0;
        backdrop-filter: blur(5px);
        z-index: 10;
    }

    .popup {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        min-height: 50%;
        padding: 12px;
        /* opacity: 0.6; */
        backdrop-filter: blur(100px);
        border-radius: 8px 8px 0 0;
        box-shadow: 0 4px 30px rgba(12, 0, 244, 0.1);

        z-index: 20;

        margin-bottom: 0;
    }

    @media (min-width: 1024px) {
        .popup {
            left: 12.5%;
            width: 75%;
        }
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
    }

    .content {
        width: 100%;
    }

    .close {
        background: none;
        border: none;
        cursor: pointer;
    }
</style>
