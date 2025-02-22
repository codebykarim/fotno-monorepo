## Use packages with Express

change src to api

change server.ts to index.ts

add this vercel.json

```json
{
  "version": 2,
  "rewrites": [{ "source": "/(.*)", "destination": "/api" }]
}
```

remove build step from package.json

and only add start script

```json
"start": "node src/index.ts"
```
