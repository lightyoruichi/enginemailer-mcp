import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
// Simple Enginemailer MCP Server
// Exposes tools: send_email, verify_connection
const ENGINEMAILER_API_BASE = process.env.ENGINEMAILER_API_BASE || "https://api.enginemailer.com/restapi";
const ENGINEMAILER_API_KEY = process.env.ENGINEMAILER_API_KEY || "";
const ENGINEMAILER_SEND_PATH = process.env.ENGINEMAILER_SEND_PATH || "/v2/Transactional/SendEmail";
const ENGINEMAILER_VERIFY_PATH = process.env.ENGINEMAILER_VERIFY_PATH || "/campaign/emcampaign/GetCategoryList"; // lightweight GET requiring APIKey
const ENGINEMAILER_BATCH_UPDATE_PATH = process.env.ENGINEMAILER_BATCH_UPDATE_PATH || "/subscriber/emsubscriber/batchUpdateSubscribers";
const ENGINEMAILER_HOST = process.env.ENGINEMAILER_HOST || "https://api.enginemailer.com";
const ENGINEMAILER_TX_SEND_PATH = process.env.ENGINEMAILER_TX_SEND_PATH || "/RESTAPI/V2/Submission/SendEmail";
const ENGINEMAILER_TX_EXPORT_PATH = process.env.ENGINEMAILER_TX_EXPORT_PATH || "/RESTAPI/V2/Submission/Report/Export";
const ENGINEMAILER_TX_CHECK_EXPORT_PATH = process.env.ENGINEMAILER_TX_CHECK_EXPORT_PATH || "/RESTAPI/V2/Submission/Report/CheckExport";
const ENGINEMAILER_BATCH_STATUS_PATH = process.env.ENGINEMAILER_BATCH_STATUS_PATH || "/subscriber/emsubscriber/batchUpdateStatus";
const DEFAULT_TIMEOUT_MS = Number(process.env.HTTP_TIMEOUT_MS || 30000);
// Basic HTTP wrapper using fetch (Node18+)
async function httpPostJson(url, body, extraHeaders, timeoutMs = DEFAULT_TIMEOUT_MS) {
    const headers = {
        "Content-Type": "application/json",
        ...extraHeaders,
    };
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), timeoutMs);
        const res = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(body),
            signal: controller.signal,
        });
        clearTimeout(timeout);
        if (!res.ok) {
            return { ok: false, status: res.status, errorText: `HTTP ${res.status}` };
        }
        const data = (await res.json());
        return { ok: true, status: res.status, data };
    }
    catch (err) {
        return { ok: false, status: 0, errorText: err.message };
    }
}
function buildUrl(pathOrUrl) {
    if (pathOrUrl.startsWith("http"))
        return pathOrUrl;
    if (pathOrUrl.startsWith("/RESTAPI"))
        return `${ENGINEMAILER_HOST}${pathOrUrl}`;
    if (pathOrUrl.startsWith("/"))
        return `${ENGINEMAILER_API_BASE}${pathOrUrl}`;
    return `${ENGINEMAILER_API_BASE}/${pathOrUrl}`;
}
// Basic HTTP GET wrapper returning JSON
async function httpGetJson(url, extraHeaders, timeoutMs = DEFAULT_TIMEOUT_MS) {
    const headers = {
        ...extraHeaders,
    };
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), timeoutMs);
        const res = await fetch(url, {
            method: "GET",
            headers,
            signal: controller.signal,
        });
        clearTimeout(timeout);
        if (!res.ok) {
            return { ok: false, status: res.status, errorText: `HTTP ${res.status}` };
        }
        const data = (await res.json());
        return { ok: true, status: res.status, data };
    }
    catch (err) {
        return { ok: false, status: 0, errorText: err.message };
    }
}
const server = new McpServer({
    name: "enginemailer",
    version: "1.0.0",
});
// Tool: verify_connection
server.tool("verify_connection", "Verify Enginemailer API connectivity and API key", {}, async () => {
    if (!ENGINEMAILER_API_KEY) {
        return { content: [{ type: "text", text: "ENGINEMAILER_API_KEY is not set." }] };
    }
    // Use a documented lightweight GET endpoint that requires APIKey auth
    const verifyUrl = buildUrl(ENGINEMAILER_VERIFY_PATH);
    const result = await httpGetJson(verifyUrl, { APIKey: ENGINEMAILER_API_KEY });
    if (!result.ok) {
        console.error("verify_connection error", { status: result.status, err: result.errorText });
        return { content: [{ type: "text", text: `Verify failed (status ${result.status}). See logs for details.` }] };
    }
    const status = result.data?.Result?.Status || "";
    const statusCode = result.data?.Result?.StatusCode || "";
    if (status === "OK" || statusCode === "200") {
        return { content: [{ type: "text", text: "Connection verified (GetCategoryList)." }] };
    }
    return { content: [{ type: "text", text: `Verify response unexpected: Status=${status} StatusCode=${statusCode}` }] };
});
// Tool: send_email (Transactional V2)
server.tool("send_email", "Send a transactional email via Enginemailer (Transactional V2)", {
    toEmail: z.string().email().describe("Recipient email address"),
    senderEmail: z.string().email().describe("Sender email (verified domain)"),
    submittedContent: z.string().min(1).describe("Email content"),
    subject: z.string().optional().describe("Subject (omit if using template)"),
    senderName: z.string().optional().describe("Sender name (omit if using template)"),
    campaignName: z.string().optional().describe("Campaign name"),
    substitutionTags: z.array(z.object({ Key: z.string(), Value: z.string() })).optional(),
    attachments: z.array(z.object({ Filename: z.string(), Content: z.string() })).optional(),
    ccEmails: z.array(z.string().email()).optional(),
    bccEmails: z.array(z.string().email()).optional(),
    templateId: z.number().optional(),
}, async ({ toEmail, senderEmail, submittedContent, subject, senderName, campaignName, substitutionTags, attachments, ccEmails, bccEmails, templateId, }) => {
    if (!ENGINEMAILER_API_KEY) {
        return { content: [{ type: "text", text: "ENGINEMAILER_API_KEY is not set." }] };
    }
    const payload = {
        CampaignName: campaignName,
        ToEmail: toEmail,
        Subject: subject,
        SenderEmail: senderEmail,
        SubmittedContent: submittedContent,
        SenderName: senderName,
        ...(substitutionTags ? { SubstitutionTags: substitutionTags } : {}),
        ...(attachments ? { Attachments: attachments } : {}),
        ...(ccEmails ? { CCEmails: ccEmails } : {}),
        ...(bccEmails ? { BCCEmails: bccEmails } : {}),
        ...(templateId ? { TemplateId: templateId } : {}),
    };
    const url = buildUrl(ENGINEMAILER_TX_SEND_PATH);
    const result = await httpPostJson(url, payload, { APIKey: ENGINEMAILER_API_KEY });
    if (!result.ok) {
        console.error("send_email error", { status: result.status, err: result.errorText });
        return { content: [{ type: "text", text: `Send failed (status ${result.status}). See logs for details.` }] };
    }
    const status = result.data?.Result?.Status || "";
    const statusCode = result.data?.Result?.StatusCode || "";
    const message = result.data?.Result?.Message || "";
    return { content: [{ type: "text", text: `StatusCode=${statusCode} Status=${status}${message ? ` Message=${message}` : ""}` }] };
});
// Tool: batch_update_subscribers
server.tool("batch_update_subscribers", "Batch insert/update subscribers with custom fields and optional subcategories", {
    subscribers: z
        .array(z.object({
        email: z.string().email().describe("Subscriber email"),
        customfields: z
            .array(z.object({
            customfield_key: z.string().min(1),
            customfield_value: z.string().min(1),
        }))
            .describe("Custom fields for the subscriber"),
    }))
        .nonempty()
        .describe("List of subscribers to insert/update"),
    subcategories: z.array(z.number().int()).optional().describe("List of subcategory IDs to assign"),
}, async ({ subscribers, subcategories }) => {
    if (!ENGINEMAILER_API_KEY) {
        return { content: [{ type: "text", text: "ENGINEMAILER_API_KEY is not set." }] };
    }
    const payload = {
        subscribers,
        ...(subcategories ? { subcategories } : {}),
    };
    const url = ENGINEMAILER_BATCH_UPDATE_PATH.startsWith("http")
        ? ENGINEMAILER_BATCH_UPDATE_PATH
        : `${ENGINEMAILER_API_BASE}${ENGINEMAILER_BATCH_UPDATE_PATH}`;
    const result = await httpPostJson(url, payload, { APIKey: ENGINEMAILER_API_KEY });
    if (!result.ok) {
        console.error("batch_update_subscribers error", { status: result.status, err: result.errorText });
        return { content: [{ type: "text", text: `Batch update failed (status ${result.status}). See logs for details.` }] };
    }
    const status = result.data?.Result?.Status || "";
    const statusCode = result.data?.Result?.StatusCode || "";
    const id = result.data?.Result?.ID;
    if (statusCode === "201" || status.toLowerCase() === "processing") {
        return {
            content: [
                { type: "text", text: `Batch accepted. Status=${status} StatusCode=${statusCode}${id ? ` ID=${id}` : ""}` },
            ],
        };
    }
    return {
        content: [
            { type: "text", text: `Batch update response: Status=${status} StatusCode=${statusCode}${id ? ` ID=${id}` : ""}` },
        ],
    };
});
// Tool: tx_export_report_v2
server.tool("tx_export_report_v2", "Export transactional email report (V2)", {
    period: z.string().min(1).describe("Date range, e.g. '1 Sep 2021 - 16 Sep 2021'"),
    emailToFilter: z.string().email().optional().describe("Filter by recipient email"),
    domainFilter: z.string().optional().describe("Filter by sender domain"),
}, async ({ period, emailToFilter, domainFilter }) => {
    if (!ENGINEMAILER_API_KEY) {
        return { content: [{ type: "text", text: "ENGINEMAILER_API_KEY is not set." }] };
    }
    const payload = {
        Period: period,
        ...(emailToFilter ? { EmailToFilter: emailToFilter } : {}),
        ...(domainFilter ? { DomainFilter: domainFilter } : {}),
    };
    const url = buildUrl(ENGINEMAILER_TX_EXPORT_PATH);
    const result = await httpPostJson(url, payload, { APIKey: ENGINEMAILER_API_KEY });
    if (!result.ok) {
        return { content: [{ type: "text", text: `Export failed (status ${result.status}): ${result.errorText || "unknown error"}` }] };
    }
    const data = result.data?.Result?.Data;
    const exportId = data?.ExportID;
    const status = data?.Status || result.data?.Result?.Status || "";
    return { content: [{ type: "text", text: `Export started. ExportID=${exportId ?? "unknown"} Status=${status}` }] };
});
// Tool: tx_check_export_status_v2
server.tool("tx_check_export_status_v2", "Check transactional export status (V2)", {
    id: z.number().describe("Export ID returned by export call"),
}, async ({ id }) => {
    if (!ENGINEMAILER_API_KEY) {
        return { content: [{ type: "text", text: "ENGINEMAILER_API_KEY is not set." }] };
    }
    const url = buildUrl(ENGINEMAILER_TX_CHECK_EXPORT_PATH);
    const result = await httpPostJson(url, { ID: id }, { APIKey: ENGINEMAILER_API_KEY });
    if (!result.ok) {
        console.error("tx_check_export_status_v2 error", { status: result.status, err: result.errorText });
        return { content: [{ type: "text", text: `Check failed (status ${result.status}). See logs for details.` }] };
    }
    const r = result.data?.Result;
    const data = r?.Data;
    const status = data?.Status || r?.Status || "";
    const urlOut = data?.URL;
    return { content: [{ type: "text", text: `Status=${status}${urlOut ? ` URL=${urlOut}` : ""}` }] };
});
// Tool: batch_update_status
server.tool("batch_update_status", "Check batch update subscribers job status", {
    id: z.union([z.string(), z.number()]).describe("Batch job ID returned by batch_update_subscribers"),
}, async ({ id }) => {
    if (!ENGINEMAILER_API_KEY) {
        return { content: [{ type: "text", text: "ENGINEMAILER_API_KEY is not set." }] };
    }
    const base = buildUrl(ENGINEMAILER_BATCH_STATUS_PATH);
    const getUrl = base.includes("?") ? `${base}&id=${id}` : `${base}?id=${id}`;
    let result = await httpGetJson(getUrl, { APIKey: ENGINEMAILER_API_KEY });
    if (!result.ok) {
        result = await httpPostJson(base, { ID: id }, { APIKey: ENGINEMAILER_API_KEY });
        if (!result.ok) {
            console.error("batch_update_status error", { status: result.status, err: result.errorText });
            return { content: [{ type: "text", text: `Status check failed (status ${result.status}). See logs for details.` }] };
        }
    }
    const r = result.data?.Result;
    return { content: [{ type: "text", text: `StatusCode=${r?.StatusCode || ""} Status=${r?.Status || ""}${r?.Message ? ` Message=${r.Message}` : ""}` }] };
});
// Tool: health
server.tool("health", "Return server health and versions", {}, async () => {
    const name = "enginemailer";
    const version = "1.0.0";
    const node = process.versions.node;
    return { content: [{ type: "text", text: `name=${name} version=${version} node=${node}` }] };
});
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Enginemailer MCP server running on stdio");
}
main().catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
});
