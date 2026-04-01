<script lang="ts">
    import TextField from "./fields/TextField.svelte";
    import NumberField from "./fields/NumberField.svelte";

    import type {
        FormProps,
        FormValues,
        FormErrors,
        FieldProps,
    } from "./Form.types";

    let { fields, onSubmit }: FormProps = $props();

    let currentValues = $state<FormValues>({});
    let errors = $state<FormErrors>({});

    // initialize values once from config
    // svelte-ignore state_referenced_locally
    for (const field of fields) {
        if (!(field.name in currentValues)) {
            currentValues[field.name] =
                field.defaultValue ?? (field.type === "number" ? 0 : "");
        }

        if (!(field.name in errors)) {
            errors[field.name] = null;
        }
    }

    function validateField(field: FieldProps): boolean {
        const value = currentValues[field.name];

        if (field.required) {
            if (field.type === "text" && String(value).trim() === "") {
                errors[field.name] = "This field is required";
                return false;
            }

            if (field.type === "number" && Number.isNaN(Number(value))) {
                errors[field.name] = "Please enter a valid number";
                return false;
            }
        }

        if (field.validate) {
            const { valid, error } =
                field.type === "text"
                    ? field.validate(String(value))
                    : field.validate(Number(value));

            if (!valid) {
                errors[field.name] = error ?? "Invalid value";
                return false;
            }
        }

        errors[field.name] = null;
        return true;
    }

    function handleSubmit(event: SubmitEvent) {
        event.preventDefault();
        let valid = true;

        for (const field of fields) {
            if (!validateField(field)) {
                valid = false;
                console.log("invalid");
            }
        }

        if (valid) {
            onSubmit?.({ ...currentValues });
        }
    }
</script>

<form onsubmit={handleSubmit} class="flex flex-col gap-4">
    {#each fields as field (field.name)}
        {#if field.type === "text"}
            <TextField
                name={field.name}
                description={field.description}
                required={field.required}
                error={errors[field.name] ?? undefined}
                bind:value={currentValues[field.name] as string}
            />
        {:else if field.type === "number"}
            <NumberField
                name={field.name}
                description={field.description}
                required={field.required}
                error={errors[field.name] ?? undefined}
                bind:value={currentValues[field.name] as number}
            />
        {/if}
    {/each}

    <button type="submit" class="rounded border px-4 py-2 hover:bg-[rgba(255,255,255,0.05)] active:bg-[rgba(255,255,255,0.1)]"> Submit </button>
</form>
