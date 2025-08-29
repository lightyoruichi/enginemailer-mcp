# Enginemailer MCP Server (TypeScript)

An MCP server that exposes Enginemailer tools to clients like Claude for Desktop.

## Tools
- `health`: Returns server name/version and Node version.
- `verify_connection`: Checks reachability of your Enginemailer API base and API key.
- `send_email` (Transactional V2): Sends a transactional email via V2 endpoint.
- `tx_export_report_v2`: Starts a transactional report export job.
- `tx_check_export_status_v2`: Checks status/URL for a report export job.
- `batch_update_subscribers`: Batch insert/update subscribers.
- `batch_update_status`: Check status for a subscribers batch job.
- `campaign_create`, `campaign_update`, `campaign_delete`, `campaign_assign_recipients`, `campaign_delete_recipient_list`, `campaign_pause`, `campaign_send`, `campaign_schedule`, `campaign_list`
- `campaign_analytics_summary`, `campaign_analytics_delivery` (paths must be configured via env)
- `subscriber_get`, `subscriber_insert`, `subscriber_update`, `subscriber_unsub`, `subscriber_activate`, `subscriber_get_custom_field`, `subscriber_get_subcategory`, `subscriber_update_category`

## Requirements
- Node.js 18+
- Enginemailer API key

## Setup
```bash
cd /Users/lightyoruichi/Dev/enginemailer-mcp
npm install
npm run build
```

Set environment variables in your host configuration:
- `ENGINEMAILER_API_KEY` (required)
- `ENGINEMAILER_API_BASE` (default: `https://api.enginemailer.com/restapi`)
- `ENGINEMAILER_HOST` (default: `https://api.enginemailer.com`)
- `ENGINEMAILER_TX_SEND_PATH` (default: `/RESTAPI/V2/Submission/SendEmail`)
- `ENGINEMAILER_TX_EXPORT_PATH` (default: `/RESTAPI/V2/Submission/Report/Export`)
- `ENGINEMAILER_TX_CHECK_EXPORT_PATH` (default: `/RESTAPI/V2/Submission/Report/CheckExport`)
- `ENGINEMAILER_BATCH_UPDATE_PATH` (default: `/subscriber/emsubscriber/batchUpdateSubscribers`)
- `ENGINEMAILER_BATCH_STATUS_PATH` (default: `/subscriber/emsubscriber/batchUpdateStatus`)
- `HTTP_TIMEOUT_MS` (default: `30000`)
- Campaign envs: `ENGINEMAILER_CAMPAIGN_CREATE_PATH`, `ENGINEMAILER_CAMPAIGN_UPDATE_PATH`, `ENGINEMAILER_CAMPAIGN_DELETE_PATH`, `ENGINEMAILER_CAMPAIGN_ASSIGN_RECIPIENTS_PATH`, `ENGINEMAILER_CAMPAIGN_DELETE_RECIPIENTS_PATH`, `ENGINEMAILER_CAMPAIGN_PAUSE_PATH`, `ENGINEMAILER_CAMPAIGN_SEND_PATH`, `ENGINEMAILER_CAMPAIGN_SCHEDULE_PATH`, `ENGINEMAILER_CAMPAIGN_LIST_PATH`
- Analytics envs: `ENGINEMAILER_CAMPAIGN_ANALYTICS_SUMMARY_PATH`, `ENGINEMAILER_CAMPAIGN_ANALYTICS_DELIVERY_PATH`
- Subscriber envs: `ENGINEMAILER_SUBSCRIBER_GET_PATH`, `ENGINEMAILER_SUBSCRIBER_INSERT_PATH`, `ENGINEMAILER_SUBSCRIBER_UPDATE_PATH`, `ENGINEMAILER_SUBSCRIBER_UNSUB_PATH`, `ENGINEMAILER_SUBSCRIBER_ACTIVATE_PATH`, `ENGINEMAILER_SUBSCRIBER_GET_CUSTOM_FIELD_PATH`, `ENGINEMAILER_SUBSCRIBER_GET_SUBCATEGORY_PATH`, `ENGINEMAILER_SUBSCRIBER_UPDATE_CATEGORY_PATH`
- `campaign_create` example:
```json
{
  "campaignName": "hello world",
  "senderName": "support",
  "senderEmail": "support@enginemailer.com",
  "subject": "Promotion 1",
  "content": "<b>This is my content</b>"
}
```

- `campaign_assign_recipients` example:
```json
{
  "campaignID": 2200,
  "filterBy": 2,
  "categoryList": [1,2,3],
  "filterType": "OR"
}
```

- `campaign_schedule` example:
```json
{
  "campaignID": 2200,
  "scheduleTime": "01122018 12:15PM"
}
```

- `subscriber_insert` example:
```json
{
  "email": "example@enginemailer.com",
  "subcategories": [1, 2],
  "customfields": [
    { "customfield_key": "branch", "customfield_value": "KL" },
    { "customfield_key": "mobile", "customfield_value": "+60123456789" }
  ],
  "sourceType": "Signup from website"
}
```

## Claude for Desktop config
Create or edit `~/Library/Application Support/Claude/claude_desktop_config.json` and add:
```json
{
  "mcpServers": {
    "enginemailer": {
      "command": "node",
      "env": {
        "ENGINEMAILER_API_KEY": "YOUR_API_KEY",
        "ENGINEMAILER_API_BASE": "https://api.enginemailer.com"
      },
      "args": [
        "/Users/lightyoruichi/Dev/enginemailer-mcp/build/index.js"
      ]
    }
  }
}
```
Restart Claude for Desktop.

## Usage
In Claude, open Tools and run:
- `health`
- `verify_connection`
- `send_email` with inputs:
  - `toEmail`: example@example.com
  - `senderEmail`: your@verified-domain.com
  - `submittedContent`: "Hello from MCP"
  - Optional: `subject`, `senderName`, `campaignName`, `templateId`
  - Optional arrays: `substitutionTags` (objects `{ Key, Value }`), `attachments` (objects `{ Filename, Content(base64) }`), `ccEmails`, `bccEmails`

Example payload for `send_email`:
```json
{
  "toEmail": "recipient@example.com",
  "senderEmail": "you@yourdomain.com",
  "submittedContent": "Hi there",
  "subject": "Remember us?",
  "senderName": "Your Name",
  "substitutionTags": [{ "Key": "Name", "Value": "Alice" }],
  "attachments": [{ "Filename": "hello.txt", "Content": "SGVsbG8gd29ybGQ=" }],
  "ccEmails": ["cc1@example.com"],
  "bccEmails": ["bcc1@example.com"]
}
```

- `tx_export_report_v2` with inputs:
  - `period`: e.g. `"1 Sep 2021 - 16 Sep 2021"`
  - Optional: `emailToFilter`, `domainFilter`

Example:
```json
{
  "period": "1 Sep 2021 - 16 Sep 2021",
  "emailToFilter": "recipient@example.com"
}
```

- `tx_check_export_status_v2` with input:
  - `id`: ExportID returned by export

- `batch_update_subscribers` with inputs:
  - `subscribers`: array of `{ email, customfields[] }`
  - Optional: `subcategories`: number[]

Example:
```json
{
  "subscribers": [
    {
      "email": "user@example.com",
      "customfields": [
        { "customfield_key": "first_name", "customfield_value": "Jane" },
        { "customfield_key": "country", "customfield_value": "US" }
      ]
    }
  ],
  "subcategories": [1, 13546]
}
```

- `batch_update_status` with input:
  - `id`: Job ID from `batch_update_subscribers`

## Notes
- This server uses `fetch` and expects Node 18+.
- Timeouts default to 30s via `HTTP_TIMEOUT_MS`.
- Errors mask raw response bodies; see stderr logs for details.

## Development
```bash
npm run build
npm start  # runs stdio server for hosts
```
