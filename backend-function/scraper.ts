// scraper.ts
// npm i axios cheerio
// npm i -D typescript @types/node

import axios from "axios";
import * as cheerio from "cheerio";

export type ScrapeResult =
    | {
        status: "ok";
        source: "json+ld" | "allegro-fallback";
        imageURL: string | null;
        itemName: string | null;
        itemDescription: string | null;
        itemPrice: string | null;
    }
    | {
        status: "invalid";
        imageURL: null;
        itemName: null;
        itemDescription: null;
        itemPrice: null;
    };

async function fetchHtml(url: string): Promise<string> {
    const response = await axios.get<string>(url, {
        timeout: 15000,
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
            "Accept-Language": "pl-PL,pl;q=0.9,en;q=0.8",
        },
    });

    return response.data;
}

function cleanText(value: unknown): string | null {
    if (value == null) return null;
    const text = String(value).replace(/\s+/g, " ").trim();
    return text || null;
}

function absolutizeUrl(base: string, maybeUrl: unknown): string | null {
    if (!maybeUrl) return null;
    try {
        return new URL(String(maybeUrl), base).href;
    } catch {
        return String(maybeUrl);
    }
}

function normalizePrice(value: unknown): string | null {
    if (value == null) return null;
    const text = String(value).replace(/\s+/g, "").replace(",", ".");
    const match = text.match(/\d+(?:\.\d{1,2})?/);
    return match ? match[0] : null;
}

function tryParseJson(text: string): unknown | null {
    try {
        return JSON.parse(text);
    } catch {
        return null;
    }
}

function flattenJsonLd(node: unknown): Record<string, unknown>[] {
    if (!node) return [];

    if (Array.isArray(node)) {
        return node.flatMap(flattenJsonLd);
    }

    if (typeof node !== "object") {
        return [];
    }

    const obj = node as Record<string, unknown>;

    if (Array.isArray(obj["@graph"])) {
        return flattenJsonLd(obj["@graph"]);
    }

    return [obj];
}

function hasType(obj: Record<string, unknown>, wantedType: string): boolean {
    const type = obj["@type"];
    const types = Array.isArray(type) ? type : [type];
    return types.some((t) => String(t).toLowerCase() === wantedType.toLowerCase());
}

function findBestProductJsonLd(objects: Record<string, unknown>[]): {
    product: Record<string, unknown> | null;
    offer: Record<string, unknown> | null;
} {
    let product: Record<string, unknown> | null = null;
    let offer: Record<string, unknown> | null = null;

    for (const obj of objects) {
        if (!product && hasType(obj, "Product")) {
            product = obj;
        }

        if (!offer && hasType(obj, "Offer")) {
            offer = obj;
        }
    }

    return { product, offer };
}

function getImageFromProduct(product: Record<string, unknown> | null): string | null {
    if (!product) return null;

    const image = product.image;
    if (Array.isArray(image) && image.length > 0) {
        return cleanText(image[0]);
    }

    if (typeof image === "object" && image !== null) {
        const imageObj = image as Record<string, unknown>;
        return cleanText(imageObj.url);
    }

    if (image) {
        return cleanText(image);
    }

    const primaryImage = product.primaryImageOfPage;
    if (typeof primaryImage === "object" && primaryImage !== null) {
        return cleanText((primaryImage as Record<string, unknown>).contentUrl);
    }

    return null;
}

function getPriceFromOffers(
    product: Record<string, unknown> | null,
    offer: Record<string, unknown> | null
): string | null {
    const offers = (product?.offers as Record<string, unknown> | undefined) ?? offer;

    if (!offers) return null;

    return normalizePrice(
        offers.price ?? offers.lowPrice ?? offers.highPrice ?? null
    );
}

function extractFromJsonLd($: cheerio.CheerioAPI, url: string): ScrapeResult | null {
    const scripts = $('script[type="application/ld+json"]')
        .map((_, el) => $(el).contents().text())
        .get();

    const allObjects: Record<string, unknown>[] = [];

    for (const raw of scripts) {
        const parsed = tryParseJson(raw);
        if (!parsed) continue;
        allObjects.push(...flattenJsonLd(parsed));
    }

    if (allObjects.length === 0) return null;

    const { product, offer } = findBestProductJsonLd(allObjects);
    if (!product && !offer) return null;

    const result: ScrapeResult = {
        status: "ok",
        source: "json+ld",
        imageURL: absolutizeUrl(url, getImageFromProduct(product)),
        itemName: cleanText(product?.name),
        itemDescription: cleanText(product?.description),
        itemPrice: getPriceFromOffers(product, offer),
    };

    const hasAnyValue =
        result.imageURL || result.itemName || result.itemDescription || result.itemPrice;

    return hasAnyValue ? result : null;
}

function textFromNode($node: cheerio.Cheerio<any>): string | null {
    return cleanText($node.text());
}

function extractFirstMatchingText(
    $: cheerio.CheerioAPI,
    selectors: string[]
): string | null {
    for (const selector of selectors) {
        const text = textFromNode($(selector).first());
        if (text) return text;
    }
    return null;
}

function extractAllegroDescription($: cheerio.CheerioAPI): string | null {
    let description: string | null = null;
    const headings = $("h1, h2, h3, h4, h5, h6");

    headings.each((_, el) => {
        const headingText = cleanText($(el).text());
        if (!headingText || !/^opis$/i.test(headingText)) return;

        const parts: string[] = [];
        let current = $(el).next();

        while (current.length) {
            const tag = current.get(0)?.tagName?.toLowerCase() ?? "";
            const currentText = cleanText(current.text());

            if (/^h[1-6]$/.test(tag)) break;
            if (currentText) parts.push(currentText);

            current = current.next();
        }

        const joined = cleanText(parts.join(" "));
        if (joined) {
            description = joined;
            return false;
        }

        return;
    });

    if (description) return description;

    const bodyText = cleanText($("body").text()) ?? "";
    const match = bodyText.match(
        /Opis\s+(.+?)(?:Parametry|Opinie|O sprzedającym|Zobacz także|$)/i
    );

    return match ? cleanText(match[1]) : null;
}

function extractAllegroPrice($: cheerio.CheerioAPI): string | null {
    const metaPrice =
        $('meta[property="product:price:amount"]').attr("content") ??
        $('meta[itemprop="price"]').attr("content");

    if (metaPrice) return normalizePrice(metaPrice);

    const candidateSelectors = [
        '[data-testid*="price"]',
        '[class*="price"]',
        'span[aria-label*="zł"]',
    ];

    for (const selector of candidateSelectors) {
        const nodes = $(selector).toArray();

        for (const node of nodes) {
            const text = cleanText($(node).text());
            if (!text) continue;

            const match = text.match(/(\d[\d\s]*[.,]\d{2})\s*zł/i);
            if (match) return normalizePrice(match[1]);
        }
    }

    const bodyText = cleanText($("body").text()) ?? "";
    const fallbackMatch = bodyText.match(/(\d[\d\s]*[.,]\d{2})\s*zł/i);
    return fallbackMatch ? normalizePrice(fallbackMatch[1]) : null;
}

function extractAllegroImage($: cheerio.CheerioAPI, url: string): string | null {
    const og =
        $('meta[property="og:image"]').attr("content") ??
        $('meta[name="twitter:image"]').attr("content");

    if (og) return absolutizeUrl(url, og);

    const firstImg = $("img").first().attr("src");
    return absolutizeUrl(url, firstImg);
}

function extractAllegro($: cheerio.CheerioAPI, url: string): ScrapeResult | null {
    const itemName =
        extractFirstMatchingText($, ["h1", '[data-testid="offer-title"]']) ??
        cleanText($('meta[property="og:title"]').attr("content"));

    const itemDescription =
        extractAllegroDescription($) ??
        cleanText($('meta[name="description"]').attr("content")) ??
        cleanText($('meta[property="og:description"]').attr("content"));

    const itemPrice = extractAllegroPrice($);
    const imageURL = extractAllegroImage($, url);

    const hasAnyValue = imageURL || itemName || itemDescription || itemPrice;
    if (!hasAnyValue) return null;

    return {
        status: "ok",
        source: "allegro-fallback",
        imageURL,
        itemName,
        itemDescription,
        itemPrice,
    };
}

export async function scrapeItem(url: string): Promise<ScrapeResult> {
    const regex = /^https?:\/\/(?:www\.)?[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+(?:\/[^\s]*)?$/;

    if (!regex.test(url)) {
        return {
            status: "invalid",
            imageURL: null,
            itemName: null,
            itemDescription: null,
            itemPrice: null,
        };
    }


    const parsedUrl = new URL(url);
    const html = await fetchHtml(url);
    const $ = cheerio.load(html);

    const jsonLdResult = extractFromJsonLd($, url);
    if (jsonLdResult) {
        return jsonLdResult;
    }

    if (
        parsedUrl.hostname === "allegro.pl" ||
        parsedUrl.hostname.endsWith(".allegro.pl")
    ) {
        const allegroResult = extractAllegro($, url);
        if (allegroResult) {
            return allegroResult;
        }
    }

    return {
        status: "invalid",
        imageURL: null,
        itemName: null,
        itemDescription: null,
        itemPrice: null,
    };
}