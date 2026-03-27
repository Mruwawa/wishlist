<script lang="ts">
    import { user } from "../services/auth";

    let res: Response | null = $state(null);

    let status = $state("DUPA");
    console.log(status)

    async function getData() {
        if (!user) {
            return;
        }
        const idToken = await $user!.getIdToken();

        res = await fetch("https://project-o3cj1.vercel.app/api/hello", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${idToken}`,
            },
        });
        console.log(res);
        // status = res.status;
    }
</script>

<div>
    <h1 class="text-3xl font-bold underline">TEST</h1>
    <button onclick={getData}>Click me</button>
    <p>Response:</p>
    <p>status: {{ status }}</p>
</div>
