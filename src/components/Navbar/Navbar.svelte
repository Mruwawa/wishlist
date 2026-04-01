<script lang="ts">
    import type { Snippet } from "svelte";
    import { authReady, logout, user } from "../../services/auth";
    import HomeIcon from "../icons/HomeIcon.svelte";
    import { router as routerState } from "svelte-spa-router";
    import NavbarButton from "./NavbarButton.svelte";
    import { getTextColorFromHex } from "../../utils/colors";

    let {
        children,
        bgColor = $bindable(),
    }: { children?: Snippet; bgColor?: string } = $props();

    let userMenuOpen = $state(false);

    document.addEventListener("click", (event) => {
        const target = event.target as Node | null;
        if (document.getElementById("userMenu")?.contains(target)) {
            return;
        }
        userMenuOpen = false;
    });

    let finalColorClass = $derived(!!bgColor ? bgColor : "#053345");

    const textColor = $derived(getTextColorFromHex(finalColorClass));
</script>

{#if $user}
    <div
        style={`background-color: ${finalColorClass}; color: ${textColor}`}
        class={`flex flex-row z-10 shadow-2xs justify-center  items-center w-full px-2 h-15 gap-4 fixed bottom-0 left-0 lg:top-0`}
    >
        <NavbarButton text="Home" href="#/">
            {#snippet icon()}
                <HomeIcon color={textColor} size="30"></HomeIcon>
            {/snippet}
        </NavbarButton>
        <div class="flex-1 h-full items-center flex">
            {@render children?.()}
        </div>
        {#if $user && $authReady}
            <div class="relative" id="userMenu">
                <button
                    class="cursor-pointer"
                    onclick={() => {
                        userMenuOpen = !userMenuOpen;
                    }}
                >
                    <img
                        class="w-12 h-12 rounded-full"
                        src={$user.photoURL}
                        alt=""
                    />
                </button>
                {#if userMenuOpen}
                    <div
                        class="absolute bottom-15 -right-1 bg-[#2e303a] px-4 py-1 hover:bg-[#383a41] lg:top-15 lg:-bottom-14"
                    >
                        <button
                            class="cursor-pointer text-white p-2 w-20"
                            onclick={logout}>Sign out</button
                        >
                    </div>
                {/if}
            </div>
        {/if}
    </div>
{/if}
