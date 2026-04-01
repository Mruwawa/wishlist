import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import process from "process";
import { scrapeItem } from "../scraper";
import { error } from "console";
import axios from "axios";

if (!getApps().length) {
    initializeApp({
        credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID!,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
            privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
        }),
    });
}

export default {
    async fetch(request: Request) {

        const origin = request.headers.get("origin");

        const allowedOrigins = [
            "http://localhost:5173",
            "https://project-o3cj1.vercel.app/",
        ];

        const isAllowed = origin && allowedOrigins.includes(origin);

        // CORS headers
        const corsHeaders = {
            "Access-Control-Allow-Origin": isAllowed ? origin : "",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        };

        const authHeader = request.headers.get("authorization");
        const token = authHeader?.startsWith("Bearer ")
            ? authHeader.slice(7)
            : null;

        // 🔁 Handle preflight request
        if (request.method === "OPTIONS") {
            return new Response(null, {
                status: 204,
                headers: corsHeaders,
            });
        }

        if (!token) {
            return new Response("Missing token", {
                status: 401, headers: {
                    "Content-Type": "application/json",
                    ...corsHeaders,
                }
            });
        }

        try {
            await getAuth().verifyIdToken(token);

            const data = await request.json();
            const url = data.url;
            const scrapedItem = await scrapeItem(url);

            return new Response(JSON.stringify({ ok: true, item: scrapedItem }), {
                headers: {
                    "Content-Type": "application/json",
                    ...corsHeaders,
                },
            });
        } catch (e) {
            return new Response(JSON.stringify({ ok: false, error: (e as Error).message }), {
                status: 401,
                headers: {
                    "Content-Type": "application/json",
                    ...corsHeaders,
                },
            });
        }
    },
};