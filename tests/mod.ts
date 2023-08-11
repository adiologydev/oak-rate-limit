import { Application } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { superoak } from "https://deno.land/x/superoak@4.7.0/mod.ts";
import { RateLimiter } from "../mod.ts";

const rateLimit = RateLimiter({
    windowMs: 1000, // Window for the requests that can be made in miliseconds.
    max: 2, // Max requests within the predefined window.
    headers: true, // Default true, it will add the headers X-RateLimit-Limit, X-RateLimit-Remaining.
    message: "Ratelimit", // Default message if rate limit reached.
    statusCode: 429, // Default status code if rate limit reached.
});

const app = new Application();
app.use(await rateLimit)

app.use((ctx) => {
    ctx.response.body = { message: "Ok" };
});

Deno.test("Testing Global Ratelimit...", async () => {
    const request = await superoak(app);
    await request.get("/").expect({ message: "Ok" });

    const request2 = await superoak(app);
    await request2.get("/").expect({ message: "Ok" });

    const request3 = await superoak(app);
    await request3.get("/").expect({ error: "Ratelimit" });
});

