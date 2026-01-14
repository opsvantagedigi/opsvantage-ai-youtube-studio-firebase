# Vercel Cron Configuration for OpsVantage AI Explainer Engine

## Example: Run upload-due-shorts every 15 minutes

Add this to your Vercel project settings (or vercel.json):

```
{
  "cron": [
    {
      "path": "/api/cron/upload-due-shorts",
      "schedule": "*/15 * * * *"
    }
  ]
}
```

- This will POST to /api/cron/upload-due-shorts every 15 minutes.
- You can configure this in the Vercel dashboard under "Cron Jobs".
- Ensure your API route handles authentication/authorization as needed.
