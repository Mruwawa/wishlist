<script lang="ts">
  import { setContext } from "svelte";

  type TabRecord = {
    id: string;
    title: string;
  };

  let { children, initial = 0 } = $props();

  let tabs = $state<TabRecord[]>([]);
  let activeIndex = $derived(initial);

  function registerTab(tab: TabRecord) {
    tabs.push(tab);

    return () => {
      const index = tabs.findIndex((t) => t.id === tab.id);
      if (index !== -1) {
        tabs.splice(index, 1);

        if (activeIndex >= tabs.length) {
          activeIndex = Math.max(0, tabs.length - 1);
        }
      }
    };
  }

  function selectTab(index: number) {
    activeIndex = index;
  }

  setContext("tabs", {
    get tabs() {
      return tabs;
    },
    get activeIndex() {
      return activeIndex;
    },
    registerTab,
    selectTab,
  });
</script>

<div class="tabs">
  <div class="tab-list" role="tablist" aria-label="Tabs">
    {#each tabs as tab, index (tab.id)}
      <button
        type="button"
        role="tab"
        class:active={activeIndex === index}
        aria-selected={activeIndex === index}
        onclick={() => selectTab(index)}
      >
        {tab.title}
      </button>
    {/each}
  </div>

  <div class="tab-panels">
    {@render children()}
  </div>
</div>

<style>
  .tab-list {
    display: flex;
    gap: 0.5rem;
    border-bottom: 1px solid #ddd;
    margin-bottom: 1rem;
  }

  button {
    padding: 0.5rem 1rem;
    border: none;
    background: none;
    cursor: pointer;
  }

  button.active {
    font-weight: 700;
    border-bottom: 2px solid black;
  }
</style>
