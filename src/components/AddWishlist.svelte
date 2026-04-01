<script lang="ts">
    import { user } from "../services/auth";
    import { addNewWishlist } from "../services/wishlists";
    import Form from "./form/Form.svelte";
    import type { FieldProps, FormValues } from "./form/Form.types";
    import { validateURL } from "./form/helpers/validation";

    const { onWishlistCreated } = $props();

    let formFields: FieldProps[] = [
        {
            name: "Name",
            type: "text",
            defaultValue: "",
            required: true,
        },
        {
            name: "Image URL",
            type: "text",
            defaultValue: "",
            required: true,
            validate: validateURL,
        },
        {
            name: "Background Image URL",
            type: "text",
            defaultValue: "",
            required: true,
            validate: validateURL,
        },
    ];

    async function handleSubmit(values: FormValues) {
        let name = values["Name"] as string;
        let imageUrl = values["Image URL"] as string;
        let backgroundImageUrl = values["Background Image URL"] as string;

        try {
            await addNewWishlist(name, imageUrl, backgroundImageUrl);
        } catch (e) {
            console.error(e);
        } finally {
            onWishlistCreated();
        }
    }
</script>

{#if $user}
    <Form fields={formFields} onSubmit={handleSubmit} />
{:else}
    <p>Please sign in to create a wishlist.</p>
{/if}
