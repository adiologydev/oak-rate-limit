<div align="center">

# oak-rate-limit
Rate limiter for Oak Server on Deno

</div>

## Description
A Simple Rate Limiter for Oak Server on Deno. It's currently under development and if you'd like to contribute, feel free to make a PR!

## Features
- Support for stores such as Map, Redis, Memcached, etc. (Only Map is implemented for now)

## Installation
```ts
import { RateLimiter } from "https://deno.land/x/oak_rate_limit/mod.ts";

const rateLimit = RateLimiter({
  store: STORE, // Using MapStore by default.
  windowMs: 1000, // Window for the requests that can be made in miliseconds.
  max: 10, // Max requests within the predefined window.
});

app.use(rateLimit);
```

## Liked The Project?
[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/W7W31Z2B3)

## License
[Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0)