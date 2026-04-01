<script lang="ts">
  import { getContext, onMount } from 'svelte';

  let { title, children } = $props();

  type TabsContext = {
    readonly tabs: { id: string; title: string }[];
    readonly activeIndex: number;
    registerTab: (tab: { id: string; title: string }) => () => void;
    selectTab: (index: number) => void;
  };

  const tabsContext = getContext<TabsContext>('tabs');

  const id = crypto.randomUUID();

  let unregister: (() => void) | null = null;

  onMount(() => {
    unregister = tabsContext.registerTab({ id, title });

    return () => {
      unregister?.();
    };
  });

  const myIndex = $derived(
    tabsContext.tabs.findIndex((tab) => tab.id === id)
  );

  const isActive = $derived(myIndex === tabsContext.activeIndex);
</script>

{#if isActive}
  <div role="tabpanel">
    {@render children()}
  </div>
{/if}