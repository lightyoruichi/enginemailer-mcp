# Enginemailer MCP Server

An MCP server that provides access to Enginemailer's email marketing and transactional email capabilities.

## Tools Available

### 📧 Transactional Emails
- `send_email` - Send transactional emails with attachments, CC/BCC, and substitution tags
- `tx_export_report_v2` - Export delivery reports
- `tx_check_export_status_v2` - Check export status

### 👥 Subscriber Management
- `subscriber_get` - Get subscriber details
- `subscriber_insert` - Add new subscriber
- `subscriber_update` - Update subscriber info
- `subscriber_unsub` - Unsubscribe
- `subscriber_activate` - Reactivate
- `subscriber_get_custom_field` - Get available custom fields
- `subscriber_get_subcategory` - Get categories/subcategories
- `subscriber_update_category` - Create/update categories

### 📊 Batch Operations
- `batch_update_subscribers` - Batch insert/update subscribers
- `batch_update_status` - Check batch job status

### 📈 Campaign Management
- `campaign_create` - Create email campaign
- `campaign_update` - Update campaign
- `campaign_delete` - Delete campaign
- `campaign_assign_recipients` - Assign recipients
- `campaign_delete_recipient_list` - Remove recipients
- `campaign_pause` - Pause campaign
- `campaign_send` - Send campaign
- `campaign_schedule` - Schedule campaign
- `campaign_list` - List campaigns
- `campaign_analytics_summary` - Get campaign analytics
- `campaign_analytics_delivery` - Get delivery stats

### 🔧 System
- `health` - Server health check
- `verify_connection` - Test API connectivity

## Example Queries

- "Send a welcome email to john@example.com"
- "Add a new subscriber with email jane@example.com and first name Jane"
- "Create a welcome campaign for new subscribers"
- "Get all subscribers in the growth operator category"
- "Send a transactional email with attachment"
- "Export delivery reports for last month"
- "Update subscriber categories for marketing team"
- "Schedule a campaign for next week"
- "Get campaign analytics for campaign ID 123"

## Setup

1. Clone this repo
2. `npm install && npm run build`
3. Add to your MCP config with your Enginemailer API key

## MCP Configuration

Add this to your MCP client configuration (e.g., `~/.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "enginemailer": {
      "command": "node",
      "args": [
        "/path/to/your/enginemailer-mcp/build/index.js"
      ],
      "env": {
        "ENGINEMAILER_API_KEY": "your-api-key-here",
        "ENGINEMAILER_API_BASE": "https://api.enginemailer.com/restapi",
        "ENGINEMAILER_HOST": "https://api.enginemailer.com",
        "ENGINEMAILER_TX_SEND_PATH": "/RESTAPI/V2/Submission/SendEmail",
        "ENGINEMAILER_TX_EXPORT_PATH": "/RESTAPI/V2/Submission/Report/Export",
        "ENGINEMAILER_TX_CHECK_EXPORT_PATH": "/RESTAPI/V2/Submission/Report/CheckExport",
        "ENGINEMAILER_BATCH_UPDATE_PATH": "/subscriber/emsubscriber/batchUpdateSubscribers",
        "ENGINEMAILER_BATCH_STATUS_PATH": "/subscriber/emsubscriber/batchUpdateStatus",
        "HTTP_TIMEOUT_MS": "30000"
      }
    }
  }
}
```

**Important**: Replace `/path/to/your/enginemailer-mcp` with the actual path to your cloned repository, and replace `your-api-key-here` with your actual Enginemailer API key.

## Get Your API Key

Get your API key from: https://portal.enginemailer.com/Account/UserProfile

⚠️ **Security Warning**: Never expose your API key in client-side code. Use backend services for security. If your key is compromised, regenerate it immediately.

## Requirements
- Node.js 18+
- Enginemailer API key
- Verified sender domain for transactional emails
- **Paid account** required for campaign features
