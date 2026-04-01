<script lang="ts">
    import FieldWrapper from "./FieldWrapper.svelte";

    interface Props {
        name: string;
        description?: string;
        error?: string;
        value?: string;
        required?: boolean;
    }

    let {
        name,
        description,
        error,
        value = $bindable(""),
        required = false,
    }: Props = $props();
</script>

<FieldWrapper {name} {description} {required} {error}>
    <input bind:value type="text" {name} placeholder={name} />
</FieldWrapper>

<style>
    @import "./field-styles.css";
</style>
