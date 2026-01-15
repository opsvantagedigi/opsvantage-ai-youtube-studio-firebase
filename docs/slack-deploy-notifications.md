# Slack Deploy Notifications

To enable Slack notifications for deploys:

1. In Slack, create an Incoming Webhook (or use an existing one).
2. In Netlify, go to:
   Site Settings → Build & Deploy → Notifications → Outgoing Webhooks.
3. Add a new notification:
   - Event: Deploy succeeded
   - URL: Your Slack webhook URL
4. Optionally add another for:
   - Event: Deploy failed

This will send messages to Slack whenever:

- Production deploys succeed or fail
- Deploy previews complete

We intentionally keep this configuration in Netlify UI (not code) for security.
