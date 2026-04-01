import type { User } from "firebase/auth";

export async function getData(user: User, url: string) {
    if (!user) {
        return;
    }
    const idToken = await user.getIdToken();

    let res = await fetch("https://project-o3cj1.vercel.app/api/itemFromURL", {
        method: "POST",
        body: JSON.stringify({
            url: url,
        }),
        headers: {
            Authorization: `Bearer ${idToken}`,
        },
    });
    return res.json();
}