<script lang="ts">
    import { user } from "../services/auth";

    let res: Response | null = $state(null);

    let status = $state("DUPA");
    console.log(status);

    async function getData() {
        if (!user) {
            return;
        }
        const idToken = await $user!.getIdToken();

        res = await fetch("https://project-o3cj1.vercel.app/api/itemFromURL", {
            method: "POST",
            body: JSON.stringify({
                url: "https://allegro.pl/oferta/konwerter-cinch-2xrca-na-toslink-spdif-przejsciowka-aux-analog-cyfrowy-11658267640?reco_id=16b61aad-2ae0-11f1-8ee5-26c2cee41455&sid=20a6804f01e7d1f64afeac35f007864ab921be53f1b8407836750f88b0e636a1",
            }),
            headers: {
                Authorization: `Bearer ${idToken}`,
            },
        });
        console.log(await res.json());
        // status = res.status;
    }
</script>

<div>
    <h1 class="text-3xl font-bold underline">TEST</h1>
    <button onclick={getData}>Click me</button>
    <p>Response:</p>
    <p>status: {{ status }}</p>
</div>
