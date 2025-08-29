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

// Campaign paths (REST API)
const ENGINEMAILER_CAMPAIGN_CREATE_PATH = process.env.ENGINEMAILER_CAMPAIGN_CREATE_PATH || "/Campaign/EMCampaign/CreateCampaign";
const ENGINEMAILER_CAMPAIGN_UPDATE_PATH = process.env.ENGINEMAILER_CAMPAIGN_UPDATE_PATH || "/Campaign/EMCampaign/UpdateCampaign";
const ENGINEMAILER_CAMPAIGN_DELETE_PATH = process.env.ENGINEMAILER_CAMPAIGN_DELETE_PATH || "/campaign/emcampaign/deletecampaign";
const ENGINEMAILER_CAMPAIGN_ASSIGN_RECIPIENTS_PATH = process.env.ENGINEMAILER_CAMPAIGN_ASSIGN_RECIPIENTS_PATH || "/campaign/emcampaign/AssignRecipientList";
const ENGINEMAILER_CAMPAIGN_DELETE_RECIPIENTS_PATH = process.env.ENGINEMAILER_CAMPAIGN_DELETE_RECIPIENTS_PATH || "/campaign/emcampaign/deleteRecipientList";
const ENGINEMAILER_CAMPAIGN_PAUSE_PATH = process.env.ENGINEMAILER_CAMPAIGN_PAUSE_PATH || "/campaign/emcampaign/PauseCampaign";
const ENGINEMAILER_CAMPAIGN_SEND_PATH = process.env.ENGINEMAILER_CAMPAIGN_SEND_PATH || "/campaign/emcampaign/SendCampaign";
const ENGINEMAILER_CAMPAIGN_SCHEDULE_PATH = process.env.ENGINEMAILER_CAMPAIGN_SCHEDULE_PATH || "/campaign/emcampaign/ScheduleCampaign";
const ENGINEMAILER_CAMPAIGN_LIST_PATH = process.env.ENGINEMAILER_CAMPAIGN_LIST_PATH || "/campaign/emcampaign/ListCampaign";

// Campaign analytics (env-configurable, no defaults in docs)
const ENGINEMAILER_CAMPAIGN_ANALYTICS_SUMMARY_PATH = process.env.ENGINEMAILER_CAMPAIGN_ANALYTICS_SUMMARY_PATH || "";
const ENGINEMAILER_CAMPAIGN_ANALYTICS_DELIVERY_PATH = process.env.ENGINEMAILER_CAMPAIGN_ANALYTICS_DELIVERY_PATH || "";

// Subscriber paths
const ENGINEMAILER_SUBSCRIBER_GET_PATH = process.env.ENGINEMAILER_SUBSCRIBER_GET_PATH || "/subscriber/emsubscriber/getSubscriber";
const ENGINEMAILER_SUBSCRIBER_INSERT_PATH = process.env.ENGINEMAILER_SUBSCRIBER_INSERT_PATH || "/subscriber/emsubscriber/insertSubscriber";
const ENGINEMAILER_SUBSCRIBER_UPDATE_PATH = process.env.ENGINEMAILER_SUBSCRIBER_UPDATE_PATH || "/subscriber/emsubscriber/updateSubscriber";
const ENGINEMAILER_SUBSCRIBER_UNSUB_PATH = process.env.ENGINEMAILER_SUBSCRIBER_UNSUB_PATH || "/subscriber/emsubscriber/unSubSubscriber";
const ENGINEMAILER_SUBSCRIBER_ACTIVATE_PATH = process.env.ENGINEMAILER_SUBSCRIBER_ACTIVATE_PATH || "/subscriber/emsubscriber/activateSubscriber";
const ENGINEMAILER_SUBSCRIBER_GET_CUSTOM_FIELD_PATH = process.env.ENGINEMAILER_SUBSCRIBER_GET_CUSTOM_FIELD_PATH || "/subscriber/emsubscriber/getCustomField";
const ENGINEMAILER_SUBSCRIBER_GET_SUBCATEGORY_PATH = process.env.ENGINEMAILER_SUBSCRIBER_GET_SUBCATEGORY_PATH || "/subscriber/emsubscriber/getSubcategory";
const ENGINEMAILER_SUBSCRIBER_UPDATE_CATEGORY_PATH = process.env.ENGINEMAILER_SUBSCRIBER_UPDATE_CATEGORY_PATH || "/subscriber/emsubscriber/updateCategory";

// Basic HTTP wrapper using fetch (Node18+)
async function httpPostJson<TReq extends Record<string, unknown>, TRes>(
	url: string,
	body: TReq,
	extraHeaders?: Record<string, string>,
	timeoutMs: number = DEFAULT_TIMEOUT_MS,
): Promise<{ ok: boolean; status: number; data?: TRes; errorText?: string }> {
	const headers: Record<string, string> = {
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
		const data = (await res.json()) as TRes;
		return { ok: true, status: res.status, data };
	} catch (err: unknown) {
		return { ok: false, status: 0, errorText: (err as Error).message };
	}
}

function buildUrl(pathOrUrl: string): string {
    if (pathOrUrl.startsWith("http")) return pathOrUrl;
    if (pathOrUrl.startsWith("/RESTAPI")) return `${ENGINEMAILER_HOST}${pathOrUrl}`;
    if (pathOrUrl.startsWith("/")) return `${ENGINEMAILER_API_BASE}${pathOrUrl}`;
    return `${ENGINEMAILER_API_BASE}/${pathOrUrl}`;
}

// Basic HTTP GET wrapper returning JSON
async function httpGetJson<TRes>(
    url: string,
    extraHeaders?: Record<string, string>,
    timeoutMs: number = DEFAULT_TIMEOUT_MS,
): Promise<{ ok: boolean; status: number; data?: TRes; errorText?: string }> {
    const headers: Record<string, string> = {
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
        const data = (await res.json()) as TRes;
        return { ok: true, status: res.status, data };
    } catch (err: unknown) {
        return { ok: false, status: 0, errorText: (err as Error).message };
    }
}

const server = new McpServer({
	name: "enginemailer",
	version: "1.0.0",
});

// Tool: verify_connection
server.tool(
	"verify_connection",
	"Verify Enginemailer API connectivity and API key",
	{},
	async () => {
		if (!ENGINEMAILER_API_KEY) {
			return { content: [{ type: "text", text: "ENGINEMAILER_API_KEY is not set." }] };
		}

		// Use a documented lightweight GET endpoint that requires APIKey auth
		const verifyUrl = buildUrl(ENGINEMAILER_VERIFY_PATH);
		type VerifyResponse = { Result?: { Status?: string; StatusCode?: string } };
		const result = await httpGetJson<VerifyResponse>(verifyUrl, { APIKey: ENGINEMAILER_API_KEY });
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
	},
);

// Tool: send_email (Transactional V2)
server.tool(
	"send_email",
	"Send a transactional email via Enginemailer (Transactional V2)",
	{
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
	},
	async ({
		toEmail,
		senderEmail,
		submittedContent,
		subject,
		senderName,
		campaignName,
		substitutionTags,
		attachments,
		ccEmails,
		bccEmails,
		templateId,
	}) => {
		if (!ENGINEMAILER_API_KEY) {
			return { content: [{ type: "text", text: "ENGINEMAILER_API_KEY is not set." }] };
		}

		type TxSendRequest = {
			CampaignName?: string;
			ToEmail: string;
			Subject?: string;
			SenderEmail: string;
			SubmittedContent: string;
			SenderName?: string;
			SubstitutionTags?: Array<{ Key: string; Value: string }>;
			Attachments?: Array<{ Filename: string; Content: string }>;
			CCEmails?: string[];
			BCCEmails?: string[];
			TemplateId?: number;
		};
		type TxSendResponse = { Result?: { StatusCode?: string; Status?: string; Message?: string } };

		const payload: TxSendRequest = {
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
		const result = await httpPostJson<TxSendRequest, TxSendResponse>(url, payload, { APIKey: ENGINEMAILER_API_KEY });
		if (!result.ok) {
			console.error("send_email error", { status: result.status, err: result.errorText });
			return { content: [{ type: "text", text: `Send failed (status ${result.status}). See logs for details.` }] };
		}
		const status = result.data?.Result?.Status || "";
		const statusCode = result.data?.Result?.StatusCode || "";
		const message = result.data?.Result?.Message || "";
		return { content: [{ type: "text", text: `StatusCode=${statusCode} Status=${status}${message ? ` Message=${message}` : ""}` }] };
	},
);

// Tool: batch_update_subscribers
server.tool(
	"batch_update_subscribers",
	"Batch insert/update subscribers with custom fields and optional subcategories",
	{
		subscribers: z
			.array(
				z.object({
					email: z.string().email().describe("Subscriber email"),
					customfields: z
						.array(
							z.object({
								customfield_key: z.string().min(1),
								customfield_value: z.string().min(1),
							}),
						)
						.describe("Custom fields for the subscriber"),
				}),
			)
			.nonempty()
			.describe("List of subscribers to insert/update"),
		subcategories: z.array(z.number().int()).optional().describe("List of subcategory IDs to assign"),
	},
	async ({ subscribers, subcategories }) => {
		if (!ENGINEMAILER_API_KEY) {
			return { content: [{ type: "text", text: "ENGINEMAILER_API_KEY is not set." }] };
		}

		type BatchUpdateRequest = {
			subscribers: Array<{
				email: string;
				customfields: Array<{ customfield_key: string; customfield_value: string }>;
			}>;
			subcategories?: number[];
		};
		type BatchUpdateResponse = {
			Result?: { StatusCode?: string; Status?: string; ID?: number | string; ErrorMessage?: string };
		};

		const payload: BatchUpdateRequest = {
			subscribers,
			...(subcategories ? { subcategories } : {}),
		};

		const url = ENGINEMAILER_BATCH_UPDATE_PATH.startsWith("http")
			? ENGINEMAILER_BATCH_UPDATE_PATH
			: `${ENGINEMAILER_API_BASE}${ENGINEMAILER_BATCH_UPDATE_PATH}`;
		const result = await httpPostJson<BatchUpdateRequest, BatchUpdateResponse>(
			url,
			payload,
			{ APIKey: ENGINEMAILER_API_KEY },
		);

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
	},
);

// Tool: tx_export_report_v2
server.tool(
	"tx_export_report_v2",
	"Export transactional email report (V2)",
	{
		period: z.string().min(1).describe("Date range, e.g. '1 Sep 2021 - 16 Sep 2021'"),
		emailToFilter: z.string().email().optional().describe("Filter by recipient email"),
		domainFilter: z.string().optional().describe("Filter by sender domain"),
	},
	async ({ period, emailToFilter, domainFilter }) => {
		if (!ENGINEMAILER_API_KEY) {
			return { content: [{ type: "text", text: "ENGINEMAILER_API_KEY is not set." }] };
		}
		type ExportRequest = { Period: string; EmailToFilter?: string; DomainFilter?: string };
		type ExportResponse = { Result?: { StatusCode?: string; Status?: string; Message?: string; Data?: { ExportID?: number | string; Status?: string } } };
		const payload: ExportRequest = {
			Period: period,
			...(emailToFilter ? { EmailToFilter: emailToFilter } : {}),
			...(domainFilter ? { DomainFilter: domainFilter } : {}),
		};
		const url = buildUrl(ENGINEMAILER_TX_EXPORT_PATH);
		const result = await httpPostJson<ExportRequest, ExportResponse>(url, payload, { APIKey: ENGINEMAILER_API_KEY });
		if (!result.ok) {
			return { content: [{ type: "text", text: `Export failed (status ${result.status}): ${result.errorText || "unknown error"}` }] };
		}
		const data = result.data?.Result?.Data;
		const exportId = data?.ExportID;
		const status = data?.Status || result.data?.Result?.Status || "";
		return { content: [{ type: "text", text: `Export started. ExportID=${exportId ?? "unknown"} Status=${status}` }] };
	},
);

// Tool: tx_check_export_status_v2
server.tool(
	"tx_check_export_status_v2",
	"Check transactional export status (V2)",
	{
		id: z.number().describe("Export ID returned by export call"),
	},
	async ({ id }) => {
		if (!ENGINEMAILER_API_KEY) {
			return { content: [{ type: "text", text: "ENGINEMAILER_API_KEY is not set." }] };
		}
		type CheckRequest = { ID: number };
		type CheckResponse = { Result?: { StatusCode?: string; Status?: string; Message?: string; Data?: { ExportID?: number | string; Status?: string; URL?: string } } };
		const url = buildUrl(ENGINEMAILER_TX_CHECK_EXPORT_PATH);
		const result = await httpPostJson<CheckRequest, CheckResponse>(url, { ID: id }, { APIKey: ENGINEMAILER_API_KEY });
		if (!result.ok) {
			console.error("tx_check_export_status_v2 error", { status: result.status, err: result.errorText });
			return { content: [{ type: "text", text: `Check failed (status ${result.status}). See logs for details.` }] };
		}
		const r = result.data?.Result;
		const data = r?.Data;
		const status = data?.Status || r?.Status || "";
		const urlOut = data?.URL;
		return { content: [{ type: "text", text: `Status=${status}${urlOut ? ` URL=${urlOut}` : ""}` }] };
	},
);

// Campaign CRUD tools
server.tool(
	"campaign_create",
	"Create campaign",
	{
		campaignName: z.string().min(1),
		senderName: z.string().min(1),
		senderEmail: z.string().email(),
		subject: z.string().min(1),
		content: z.string().min(1),
	},
	async ({ campaignName, senderName, senderEmail, subject, content }) => {
		if (!ENGINEMAILER_API_KEY) return { content: [{ type: "text", text: "ENGINEMAILER_API_KEY is not set." }] };
		const url = buildUrl(ENGINEMAILER_CAMPAIGN_CREATE_PATH);
		type Req = { CampaignName: string; SenderName: string; SenderEmail: string; Subject: string; Content: string };
		type Res = { Result?: { Status?: string; StatusCode?: string; CampaignID?: number | string; ErrorMessage?: string } };
		const res = await httpPostJson<Req, Res>(url, { CampaignName: campaignName, SenderName: senderName, SenderEmail: senderEmail, Subject: subject, Content: content }, { APIKey: ENGINEMAILER_API_KEY });
		if (!res.ok) { console.error("campaign_create error", res); return { content: [{ type: "text", text: `Create failed (status ${res.status}). See logs.` }] }; }
		const r = res.data?.Result; return { content: [{ type: "text", text: `Status=${r?.Status} Code=${r?.StatusCode} CampaignID=${r?.CampaignID ?? ""}` }] };
	},
);

server.tool(
	"campaign_update",
	"Update campaign",
	{
		campaignID: z.union([z.number(), z.string()]),
		campaignName: z.string().min(1),
		senderName: z.string().min(1),
		senderEmail: z.string().email(),
		subject: z.string().min(1),
		content: z.string().min(1),
	},
	async ({ campaignID, campaignName, senderName, senderEmail, subject, content }) => {
		if (!ENGINEMAILER_API_KEY) return { content: [{ type: "text", text: "ENGINEMAILER_API_KEY is not set." }] };
		const url = buildUrl(ENGINEMAILER_CAMPAIGN_UPDATE_PATH);
		type Req = { CampaignID: number | string; CampaignName: string; SenderName: string; SenderEmail: string; Subject: string; Content: string };
		type Res = { Result?: { Status?: string; StatusCode?: string; ErrorMessage?: string } };
		const res = await httpPostJson<Req, Res>(url, { CampaignID: campaignID, CampaignName: campaignName, SenderName: senderName, SenderEmail: senderEmail, Subject: subject, Content: content }, { APIKey: ENGINEMAILER_API_KEY });
		if (!res.ok) { console.error("campaign_update error", res); return { content: [{ type: "text", text: `Update failed (status ${res.status}). See logs.` }] }; }
		const r = res.data?.Result; return { content: [{ type: "text", text: `Status=${r?.Status} Code=${r?.StatusCode}` }] };
	},
);

server.tool(
	"campaign_delete",
	"Delete campaign",
	{ campaignID: z.union([z.number(), z.string()]) },
	async ({ campaignID }) => {
		if (!ENGINEMAILER_API_KEY) return { content: [{ type: "text", text: "ENGINEMAILER_API_KEY is not set." }] };
		const base = buildUrl(ENGINEMAILER_CAMPAIGN_DELETE_PATH);
		const url = base.includes("?") ? `${base}&campaignid=${campaignID}` : `${base}?campaignid=${campaignID}`;
		type Res = { Result?: { Status?: string; StatusCode?: string; ErrorMessage?: string } };
		const res = await httpGetJson<Res>(url, { APIKey: ENGINEMAILER_API_KEY });
		if (!res.ok) { console.error("campaign_delete error", res); return { content: [{ type: "text", text: `Delete failed (status ${res.status}). See logs.` }] }; }
		const r = res.data?.Result; return { content: [{ type: "text", text: `Status=${r?.Status} Code=${r?.StatusCode}` }] };
	},
);

server.tool(
	"campaign_assign_recipients",
	"Assign recipient list to campaign",
	{
		campaignID: z.union([z.string(), z.number()]),
		filterBy: z.number().int().describe("1=All, 2=Filter by Category"),
		categoryList: z.array(z.number().int()).optional(),
		filterType: z.string().optional().describe("AND/OR when filterBy=2"),
	},
	async ({ campaignID, filterBy, categoryList, filterType }) => {
		if (!ENGINEMAILER_API_KEY) return { content: [{ type: "text", text: "ENGINEMAILER_API_KEY is not set." }] };
		const url = buildUrl(ENGINEMAILER_CAMPAIGN_ASSIGN_RECIPIENTS_PATH);
		type Req = { campaignid: number | string; FilterBy: number; data?: { CategoryList: number[]; FilterType: string } };
		type Res = { Result?: { Status?: string; StatusCode?: string; ErrorMessage?: string } };
		const data = filterBy === 2 && categoryList?.length ? { CategoryList: categoryList, FilterType: filterType || "OR" } : undefined;
		const res = await httpPostJson<Req, Res>(url, { campaignid: campaignID, FilterBy: filterBy, ...(data ? { data } : {}) }, { APIKey: ENGINEMAILER_API_KEY });
		if (!res.ok) { console.error("campaign_assign_recipients error", res); return { content: [{ type: "text", text: `Assign failed (status ${res.status}). See logs.` }] }; }
		const r = res.data?.Result; return { content: [{ type: "text", text: `Status=${r?.Status} Code=${r?.StatusCode}` }] };
	},
);

server.tool(
	"campaign_delete_recipient_list",
	"Delete recipient list from campaign",
	{ campaignID: z.union([z.string(), z.number()]) },
	async ({ campaignID }) => {
		if (!ENGINEMAILER_API_KEY) return { content: [{ type: "text", text: "ENGINEMAILER_API_KEY is not set." }] };
		const base = buildUrl(ENGINEMAILER_CAMPAIGN_DELETE_RECIPIENTS_PATH);
		const url = base.includes("?") ? `${base}&campaignid=${campaignID}` : `${base}?campaignid=${campaignID}`;
		type Res = { Result?: { Status?: string; StatusCode?: string; ErrorMessage?: string } };
		const res = await httpGetJson<Res>(url, { APIKey: ENGINEMAILER_API_KEY });
		if (!res.ok) { console.error("campaign_delete_recipient_list error", res); return { content: [{ type: "text", text: `Delete failed (status ${res.status}). See logs.` }] }; }
		const r = res.data?.Result; return { content: [{ type: "text", text: `Status=${r?.Status} Code=${r?.StatusCode}` }] };
	},
);

server.tool(
	"campaign_pause",
	"Pause campaign",
	{ campaignID: z.union([z.string(), z.number()]) },
	async ({ campaignID }) => {
		if (!ENGINEMAILER_API_KEY) return { content: [{ type: "text", text: "ENGINEMAILER_API_KEY is not set." }] };
		const base = buildUrl(ENGINEMAILER_CAMPAIGN_PAUSE_PATH);
		const url = base.includes("?") ? `${base}&campaignid=${campaignID}` : `${base}?campaignid=${campaignID}`;
		type Res = { Result?: { Status?: string; StatusCode?: string; ErrorMessage?: string } };
		const res = await httpGetJson<Res>(url, { APIKey: ENGINEMAILER_API_KEY });
		if (!res.ok) { console.error("campaign_pause error", res); return { content: [{ type: "text", text: `Pause failed (status ${res.status}). See logs.` }] }; }
		const r = res.data?.Result; return { content: [{ type: "text", text: `Status=${r?.Status} Code=${r?.StatusCode}` }] };
	},
);

server.tool(
	"campaign_send",
	"Send campaign",
	{ campaignID: z.union([z.string(), z.number()]) },
	async ({ campaignID }) => {
		if (!ENGINEMAILER_API_KEY) return { content: [{ type: "text", text: "ENGINEMAILER_API_KEY is not set." }] };
		const base = buildUrl(ENGINEMAILER_CAMPAIGN_SEND_PATH);
		const url = base.includes("?") ? `${base}&campaignid=${campaignID}` : `${base}?campaignid=${campaignID}`;
		type Res = { Result?: { Status?: string; StatusCode?: string; ErrorMessage?: string } };
		const res = await httpGetJson<Res>(url, { APIKey: ENGINEMAILER_API_KEY });
		if (!res.ok) { console.error("campaign_send error", res); return { content: [{ type: "text", text: `Send failed (status ${res.status}). See logs.` }] }; }
		const r = res.data?.Result; return { content: [{ type: "text", text: `Status=${r?.Status} Code=${r?.StatusCode}` }] };
	},
);

server.tool(
	"campaign_schedule",
	"Schedule campaign",
	{ campaignID: z.union([z.string(), z.number()]), scheduleTime: z.string().min(1).describe("Format ddMMyyyy hh:mmtt e.g. 01122018 12:15PM") },
	async ({ campaignID, scheduleTime }) => {
		if (!ENGINEMAILER_API_KEY) return { content: [{ type: "text", text: "ENGINEMAILER_API_KEY is not set." }] };
		const base = buildUrl(ENGINEMAILER_CAMPAIGN_SCHEDULE_PATH);
		const url = `${base}?campaignid=${campaignID}&scheduletime=${encodeURIComponent(scheduleTime)}`;
		type Res = { Result?: { Status?: string; StatusCode?: string; ErrorMessage?: string } };
		const res = await httpGetJson<Res>(url, { APIKey: ENGINEMAILER_API_KEY });
		if (!res.ok) { console.error("campaign_schedule error", res); return { content: [{ type: "text", text: `Schedule failed (status ${res.status}). See logs.` }] }; }
		const r = res.data?.Result; return { content: [{ type: "text", text: `Status=${r?.Status} Code=${r?.StatusCode}` }] };
	},
);

server.tool(
	"campaign_list",
	"List campaigns (env path)",
	{ page: z.number().int().optional(), pageSize: z.number().int().optional() },
	async ({ page, pageSize }) => {
		if (!ENGINEMAILER_API_KEY) return { content: [{ type: "text", text: "ENGINEMAILER_API_KEY is not set." }] };
		const base = buildUrl(ENGINEMAILER_CAMPAIGN_LIST_PATH);
		const url = `${base}${page ? `?page=${page}` : ""}${pageSize ? `${page ? "&" : "?"}pageSize=${pageSize}` : ""}`;
		type Res = unknown;
		const res = await httpGetJson<Res>(url, { APIKey: ENGINEMAILER_API_KEY });
		if (!res.ok) { console.error("campaign_list error", res); return { content: [{ type: "text", text: `List failed (status ${res.status}). See logs.` }] }; }
		return { content: [{ type: "text", text: JSON.stringify(res.data) }] };
	},
);

// Campaign analytics (env paths only)
server.tool(
	"campaign_analytics_summary",
	"Campaign analytics summary (env path)",
	{ campaignID: z.union([z.string(), z.number()]) },
	async ({ campaignID }) => {
		if (!ENGINEMAILER_API_KEY) return { content: [{ type: "text", text: "ENGINEMAILER_API_KEY is not set." }] };
		if (!ENGINEMAILER_CAMPAIGN_ANALYTICS_SUMMARY_PATH) return { content: [{ type: "text", text: "Analytics summary path not configured." }] };
		const base = buildUrl(ENGINEMAILER_CAMPAIGN_ANALYTICS_SUMMARY_PATH);
		const url = base.includes("?") ? `${base}&campaignid=${campaignID}` : `${base}?campaignid=${campaignID}`;
		type Res = unknown;
		const res = await httpGetJson<Res>(url, { APIKey: ENGINEMAILER_API_KEY });
		if (!res.ok) { console.error("campaign_analytics_summary error", res); return { content: [{ type: "text", text: `Analytics failed (status ${res.status}). See logs.` }] }; }
		return { content: [{ type: "text", text: JSON.stringify(res.data) }] };
	},
);

server.tool(
	"campaign_analytics_delivery",
	"Campaign delivery stats (env path)",
	{ campaignID: z.union([z.string(), z.number()]) },
	async ({ campaignID }) => {
		if (!ENGINEMAILER_API_KEY) return { content: [{ type: "text", text: "ENGINEMAILER_API_KEY is not set." }] };
		if (!ENGINEMAILER_CAMPAIGN_ANALYTICS_DELIVERY_PATH) return { content: [{ type: "text", text: "Analytics delivery path not configured." }] };
		const base = buildUrl(ENGINEMAILER_CAMPAIGN_ANALYTICS_DELIVERY_PATH);
		const url = base.includes("?") ? `${base}&campaignid=${campaignID}` : `${base}?campaignid=${campaignID}`;
		type Res = unknown;
		const res = await httpGetJson<Res>(url, { APIKey: ENGINEMAILER_API_KEY });
		if (!res.ok) { console.error("campaign_analytics_delivery error", res); return { content: [{ type: "text", text: `Analytics failed (status ${res.status}). See logs.` }] }; }
		return { content: [{ type: "text", text: JSON.stringify(res.data) }] };
	},
);

// Subscriber management tools
server.tool(
	"subscriber_get",
	"Get subscriber",
	{ email: z.string().email() },
	async ({ email }) => {
		if (!ENGINEMAILER_API_KEY) return { content: [{ type: "text", text: "ENGINEMAILER_API_KEY is not set." }] };
		const base = buildUrl(ENGINEMAILER_SUBSCRIBER_GET_PATH);
		const url = base.includes("?") ? `${base}&email=${encodeURIComponent(email)}` : `${base}?email=${encodeURIComponent(email)}`;
		type Res = unknown;
		const res = await httpGetJson<Res>(url, { APIKey: ENGINEMAILER_API_KEY });
		if (!res.ok) { console.error("subscriber_get error", res); return { content: [{ type: "text", text: `Get failed (status ${res.status}). See logs.` }] }; }
		return { content: [{ type: "text", text: JSON.stringify(res.data) }] };
	},
);

server.tool(
	"subscriber_insert",
	"Insert subscriber",
	{ email: z.string().email(), subcategories: z.array(z.number().int()).optional(), customfields: z.array(z.object({ customfield_key: z.string(), customfield_value: z.string() })).optional(), sourceType: z.string().optional() },
	async ({ email, subcategories, customfields, sourceType }) => {
		if (!ENGINEMAILER_API_KEY) return { content: [{ type: "text", text: "ENGINEMAILER_API_KEY is not set." }] };
		const url = buildUrl(ENGINEMAILER_SUBSCRIBER_INSERT_PATH);
		type Req = { email: string; subcategories?: number[]; customfields?: Array<{ customfield_key: string; customfield_value: string }>; sourcetype?: string };
		type Res = { Result?: { Status?: string; StatusCode?: string } };
		const res = await httpPostJson<Req, Res>(url, { email, ...(subcategories ? { subcategories } : {}), ...(customfields ? { customfields } : {}), ...(sourceType ? { sourcetype: sourceType } : {}) }, { APIKey: ENGINEMAILER_API_KEY });
		if (!res.ok) { console.error("subscriber_insert error", res); return { content: [{ type: "text", text: `Insert failed (status ${res.status}). See logs.` }] }; }
		const r = res.data?.Result; return { content: [{ type: "text", text: `Status=${r?.Status} Code=${r?.StatusCode}` }] };
	},
);

server.tool(
	"subscriber_update",
	"Update subscriber",
	{ email: z.string().email(), subcategories: z.array(z.number().int()).optional(), subcategories_type: z.number().int().optional(), customfields: z.array(z.object({ customfield_key: z.string(), customfield_value: z.string() })).optional(), customfield_type: z.number().int().optional() },
	async ({ email, subcategories, subcategories_type, customfields, customfield_type }) => {
		if (!ENGINEMAILER_API_KEY) return { content: [{ type: "text", text: "ENGINEMAILER_API_KEY is not set." }] };
		const url = buildUrl(ENGINEMAILER_SUBSCRIBER_UPDATE_PATH);
		type Req = { email: string; subcategories?: number[]; subcategories_type?: number; customfields?: Array<{ customfield_key: string; customfield_value: string }>; customfield_type?: number };
		type Res = { Result?: { Status?: string; StatusCode?: string } };
		const res = await httpPostJson<Req, Res>(url, { email, ...(subcategories ? { subcategories } : {}), ...(typeof subcategories_type === "number" ? { subcategories_type } : {}), ...(customfields ? { customfields } : {}), ...(typeof customfield_type === "number" ? { customfield_type } : {}), }, { APIKey: ENGINEMAILER_API_KEY });
		if (!res.ok) { console.error("subscriber_update error", res); return { content: [{ type: "text", text: `Update failed (status ${res.status}). See logs.` }] }; }
		const r = res.data?.Result; return { content: [{ type: "text", text: `Status=${r?.Status} Code=${r?.StatusCode}` }] };
	},
);

server.tool(
	"subscriber_unsub",
	"Unsubscribe subscriber",
	{ email: z.string().email() },
	async ({ email }) => {
		if (!ENGINEMAILER_API_KEY) return { content: [{ type: "text", text: "ENGINEMAILER_API_KEY is not set." }] };
		const base = buildUrl(ENGINEMAILER_SUBSCRIBER_UNSUB_PATH);
		const url = base.includes("?") ? `${base}&email=${encodeURIComponent(email)}` : `${base}?email=${encodeURIComponent(email)}`;
		type Res = { Result?: { Status?: string; StatusCode?: string } };
		const res = await httpGetJson<Res>(url, { APIKey: ENGINEMAILER_API_KEY });
		if (!res.ok) { console.error("subscriber_unsub error", res); return { content: [{ type: "text", text: `Unsub failed (status ${res.status}). See logs.` }] }; }
		const r = res.data?.Result; return { content: [{ type: "text", text: `Status=${r?.Status} Code=${r?.StatusCode}` }] };
	},
);

server.tool(
	"subscriber_activate",
	"Activate subscriber",
	{ email: z.string().email() },
	async ({ email }) => {
		if (!ENGINEMAILER_API_KEY) return { content: [{ type: "text", text: "ENGINEMAILER_API_KEY is not set." }] };
		const base = buildUrl(ENGINEMAILER_SUBSCRIBER_ACTIVATE_PATH);
		const url = base.includes("?") ? `${base}&email=${encodeURIComponent(email)}` : `${base}?email=${encodeURIComponent(email)}`;
		type Res = { Result?: { Status?: string; StatusCode?: string } };
		const res = await httpPostJson<{ } , Res>(url, {}, { APIKey: ENGINEMAILER_API_KEY });
		if (!res.ok) { console.error("subscriber_activate error", res); return { content: [{ type: "text", text: `Activate failed (status ${res.status}). See logs.` }] }; }
		const r = res.data?.Result; return { content: [{ type: "text", text: `Status=${r?.Status} Code=${r?.StatusCode}` }] };
	},
);

server.tool(
	"subscriber_get_custom_field",
	"Get custom fields",
	{},
	async () => {
		if (!ENGINEMAILER_API_KEY) return { content: [{ type: "text", text: "ENGINEMAILER_API_KEY is not set." }] };
		const url = buildUrl(ENGINEMAILER_SUBSCRIBER_GET_CUSTOM_FIELD_PATH);
		type Res = unknown;
		const res = await httpGetJson<Res>(url, { APIKey: ENGINEMAILER_API_KEY });
		if (!res.ok) { console.error("subscriber_get_custom_field error", res); return { content: [{ type: "text", text: `Get failed (status ${res.status}). See logs.` }] }; }
		return { content: [{ type: "text", text: JSON.stringify(res.data) }] };
	},
);

server.tool(
	"subscriber_get_subcategory",
	"Get subcategory list",
	{},
	async () => {
		if (!ENGINEMAILER_API_KEY) return { content: [{ type: "text", text: "ENGINEMAILER_API_KEY is not set." }] };
		const url = buildUrl(ENGINEMAILER_SUBSCRIBER_GET_SUBCATEGORY_PATH);
		type Res = unknown;
		const res = await httpGetJson<Res>(url, { APIKey: ENGINEMAILER_API_KEY });
		if (!res.ok) { console.error("subscriber_get_subcategory error", res); return { content: [{ type: "text", text: `Get failed (status ${res.status}). See logs.` }] }; }
		return { content: [{ type: "text", text: JSON.stringify(res.data) }] };
	},
);

server.tool(
	"subscriber_update_category",
	"Create/update category and subcategories",
	{ categoryID: z.number().int().default(0), categoryName: z.string().min(1), description: z.string().optional(), isvisible: z.boolean().optional(), subcategories: z.array(z.object({ subcategoryID: z.number().int().default(0), subcategoryName: z.string().min(1), description: z.string().optional() })).optional() },
	async ({ categoryID, categoryName, description, isvisible, subcategories }) => {
		if (!ENGINEMAILER_API_KEY) return { content: [{ type: "text", text: "ENGINEMAILER_API_KEY is not set." }] };
		const url = buildUrl(ENGINEMAILER_SUBSCRIBER_UPDATE_CATEGORY_PATH);
		type Req = { categoryID: number; categoryname: string; description?: string; isvisible?: boolean; subcategories?: Array<{ subcategoryid: number; subcategoryname: string; description?: string }> };
		type Res = unknown;
		const payload: Req = { categoryID, categoryname: categoryName, ...(description ? { description } : {}), ...(typeof isvisible === "boolean" ? { isvisible } : {}), ...(subcategories ? { subcategories: subcategories.map(s => ({ subcategoryid: s.subcategoryID, subcategoryname: s.subcategoryName, ...(s.description ? { description: s.description } : {}) })) } : {}) };
		const res = await httpPostJson<Req, Res>(url, payload, { APIKey: ENGINEMAILER_API_KEY });
		if (!res.ok) { console.error("subscriber_update_category error", res); return { content: [{ type: "text", text: `Update failed (status ${res.status}). See logs.` }] }; }
		return { content: [{ type: "text", text: JSON.stringify(res.data) }] };
	},
);

// Tool: batch_update_status
server.tool(
	"batch_update_status",
	"Check batch update subscribers job status",
	{
		id: z.union([z.string(), z.number()]).describe("Batch job ID returned by batch_update_subscribers"),
	},
	async ({ id }) => {
		if (!ENGINEMAILER_API_KEY) {
			return { content: [{ type: "text", text: "ENGINEMAILER_API_KEY is not set." }] };
		}
		const base = buildUrl(ENGINEMAILER_BATCH_STATUS_PATH);
		const getUrl = base.includes("?") ? `${base}&id=${id}` : `${base}?id=${id}`;
		type StatusResponse = { Result?: { StatusCode?: string; Status?: string; Message?: string; Data?: unknown } };
		let result = await httpGetJson<StatusResponse>(getUrl, { APIKey: ENGINEMAILER_API_KEY });
		if (!result.ok) {
			result = await httpPostJson<{ ID: number | string }, StatusResponse>(base, { ID: id }, { APIKey: ENGINEMAILER_API_KEY });
			if (!result.ok) {
				console.error("batch_update_status error", { status: result.status, err: result.errorText });
				return { content: [{ type: "text", text: `Status check failed (status ${result.status}). See logs for details.` }] };
			}
		}
		const r = result.data?.Result;
		return { content: [{ type: "text", text: `StatusCode=${r?.StatusCode || ""} Status=${r?.Status || ""}${r?.Message ? ` Message=${r.Message}` : ""}` }] };
	},
);

// Tool: health
server.tool(
	"health",
	"Return server health and versions",
	{},
	async () => {
		const name = "enginemailer";
		const version = "1.0.0";
		const node = process.versions.node;
		return { content: [{ type: "text", text: `name=${name} version=${version} node=${node}` }] };
	},
);

async function main() {
	const transport = new StdioServerTransport();
	await server.connect(transport);
	console.error("Enginemailer MCP server running on stdio");
}

main().catch((err) => {
	console.error("Fatal error:", err);
	process.exit(1);
});
