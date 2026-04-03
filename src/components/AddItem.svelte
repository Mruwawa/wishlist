<script lang="ts">
    import type { FieldValue } from "firebase/firestore";
    import { addItemToWishlist } from "../services/wishlists";
    import Form from "./form/Form.svelte";
    import type { FieldProps, FormValues } from "./form/Form.types";
    import { validateURL } from "./form/helpers/validation";
    import Tabs from "./tabs/Tabs.svelte";
    import Tab from "./tabs/Tab.svelte";
    import { getData } from "../services/scrapedApi";
    import { user } from "../services/auth";

    const { wishlistId, onItemCreated } = $props();

    const manualformProps: FieldProps[] = [
        {
            name: "Name",
            type: "text",
            defaultValue: "",
            required: true,
        },
        {
            name: "Description",
            type: "text",
            defaultValue: "",
        },
        {
            name: "Image URL",
            type: "text",
            defaultValue: "",
            required: true,
            validate: validateURL,
        },
        {
            name: "Link",
            type: "text",
            defaultValue: "",
            required: true,
            validate: validateURL,
        },
    ];

    async function handleManualSubmit(values: FormValues) {
        const name = values["Name"] as string;
        const description = values["Description"] as string;
        const imageUrl = values["Image URL"] as string;
        const link = values["Link"] as string;

        const createdAt = new Date();
        const updatedAt = new Date();
        const id = crypto.randomUUID();
        const bought = false;

        try {
            await addItemToWishlist(wishlistId, {
                name,
                description,
                imageUrl,
                link,
                createdAt,
                updatedAt,
                id,
                bought
            });

            onItemCreated();
        } catch (e) {
            console.error(e);
        }
    }

    const autoFormProps: FieldProps[] = [
        {
            name: "Link",
            type: "text",
            defaultValue: "",
            required: true,
            validate(value) {
                if (!validateURL(value)) {
                    return { valid: false, error: "Please enter a valid URL" };
                }

                return { valid: true };
            },
        },
    ];

    async function handleAutoSubmit(values: FormValues) {
        const link = values["Link"] as string;

        const createdAt = new Date();
        const updatedAt = new Date();
        const id = crypto.randomUUID();

        try {
            if (!$user) {
                throw new Error("User not authenticated");
            }
            const item = await getData($user, link);

            console.log("Scraped item:", item);

            // await addItemToWishlist(wishlistId, {
            //     name: "Loading...",
            //     description: "",
            //     imageUrl: "",
            //     link,
            //     createdAt,
            //     updatedAt,
            //     id,
            // });

            // onItemCreated();
        } catch (e) {
            console.error(e);
        }
    }
</script>

<Tabs>
    <Tab title="Manual Entry">
        <Form fields={manualformProps} onSubmit={handleManualSubmit} />
    </Tab>
    <Tab title="Read from URL">
        <div class="mb-4">
            <p>Only from supported websites (eg. Ceneo.pl)</p>
        </div>
        <Form fields={autoFormProps} onSubmit={handleAutoSubmit}></Form>
    </Tab>
</Tabs>
