Logo
Return to Enginemailer | Logout
Search documentation...
Enginemailer  Transactional  REST API
Submitting Transactional Emails via REST-API Version 2
Avatar Written by Enginemailer Support
Updated 1 year ago
We recommend that you use this version as the previous version will no longer be updated for new enhancements. 

How to submit

You can submit emails by invoking the Enginemailer Email Service at https://api.enginemailer.com/RESTAPI/V2/Submission/SendEmail  

Please use the method name: SendEmail.

Please note that our REST API only accepts JSON object as a parameter list. To ensure proper authentication, you should include only one authentication parameter (APIKey) within the header.

Templates

We allow users to send emails with or without templates. To create a template, please visit here.

Sample

Below is an example of the Request JSON object to deliver the email.


	{
   
   "CampaignName":"Marketing Campaign for Customer Group A",
   "ToEmail":"put_recipient _email_here@gmail.com",
   "Subject":"Remember us?",
   "SenderEmail":"your_email@domainRegistered.com",
   "SubmittedContent":"Hi there, remember us?",
   "SenderName":"Your name",
   "SubstitutionTags":[
      {
         "Key":"Key0",
         "Value":"Value0"
      },
      {
         "Key":"Key1",
         "Value":"Value1"
      },
      {
         "Key":"Key2",
         "Value":"Value2"
      }
   ],
   "Attachments":[
      {
         "Filename":"Test1.pdf",
         "Content":"SG93IHRvIGRlYnVnIFNRTCBTdG9yZWQgUHJvY2VkdXJlDQoNCjEuIExvY2FsIG9ubHkgLSBBenVyZSAoTm8pDQoyLiBQdXQgYnJlYWtwb2ludCBhdCBFWEVDIHN0YXRlbWVudA0KMy4gQ2xpY2sgRGVidWcNCjQuIE9uY2UgaGl0IGJyZWFrcG9pbnQsIHByZXNzIEYxMSB0byBzdGVwIGludG8gdGhlIHN0b3JlZCBwcm9jZWR1cmUu"
      },
      {
         "Filename":"Test2.pdf",
         "Content":"SG93IHRvIGRlYnVnIFNRTCBTdG9yZWQgUHJvY2VkdXJlDQoNCjEuIExvY2FsIG9ubHkgLSBBenVyZSAoTm8pDQoyLiBQdXQgYnJlYWtwb2ludCBhdCBFWEVDIHN0YXRlbWVudA0KMy4gQ2xpY2sgRGVidWcNCjQuIE9uY2UgaGl0IGJyZWFrcG9pbnQsIHByZXNzIEYxMSB0byBzdGVwIGludG8gdGhlIHN0b3JlZCBwcm9jZWR1cmUu"
      }
   ],
   "CCEmails":[
      "put_cc_email_here_1@gmail.com",
      "put_cc_email_here_2@gmail.com"
   ],
   "BCCEmails":[
      "put_bcc_email_here_1@gmail.com",
      "put_bcc_email_here_2@gmail.com"
   ]
}
Parameter name (Case-sensitive)

Description

Nullable?

CampaignName

Name of the mailing campaign.

Yes

ToEmail

Intended recipient email address.

No

Subject

The subject of the email.

Yes

SenderEmail

Email address from the sender. (The email domain will validate against the verified sending domain)

No

SenderName

Name of the sender.

Yes

SubmittedContent

Email content of the email.

Yes

TemplateId

Template ID of the template which created on the Enginemailer system. If you use TemplateId, Subject and Sender Name will follow your template. No need to specify again. Sender Email must be specified in the JSON Object and must be the same with the one in template.

Yes

SubstitutionTags

A list of dynamic variables with values to be substituted within the template content(Multiple). Please note that the value inside cannot have the following characters: { } [ ]

Yes

Attachments

A list of files to be attached to the email. The maximum total attachment size is 5MB. The “Filename” must have extension (.docx, .txt, etc) and “Content” is the Base64 encoded content of the attachment.

Yes

CCEmails

A list of emails. The maximum number of CC emails allowed is 10.

Yes

BCCEmails

A list of emails. The maximum number of BCC emails allowed is 3.

Yes

 

Facebook Twitter LinkedIn
Print Friendly and PDF
Was this article helpful?
 
0 out of 1 found this helpful
Have more questions? Submit a request
Articles in this section
Check Export Status Version 2
Export CSV Report Version 2
Submitting Transactional Emails via REST-API Version 2
Check Export Status (Deprecated)
Export CSV Report (Deprecated)
Submitting Transactional Emails via REST-API (Deprecated)
SendEmail - Successful Response
SendEmail - Failed Response
SendEmail - Example of the code submission (JQuery)
SendEmail - Example of the code submission (PHP)
See more
Related articles
Submitting Transactional Emails via REST-API (Deprecated)
Subscriber REST API - GETTING STARTED
SendEmail - Failed Response
What is Domain Authentication and why it is important?
Get Subscriber
Recently viewed articles
Errors for Subscribers API
Errors for Campaign API
Subscriber REST API - GETTING STARTED
Manage API keys for your account
Get Category List
Can't find your answer here?
Submit ticket here
Want to sign in to Zendesk?
Login to view Your Tickets
Find us on Facebook
Get to know the community
© 2017 All Rights Reserved. Enginemailer™ is a registered trademark of Teneo Technologies Sdn Bhd.Logo
Return to Enginemailer | Logout
Search documentation...
Enginemailer  Transactional  REST API
Check Export Status Version 2
Avatar Written by Enginemailer Support
Updated 1 year ago
You can export transactional email reports using API. Once you've initiated the export using this method, it will undergo a processing phase which may take some time to complete. 

Check Export Status 

Go to https://api.enginemailer.com/RESTAPI/V2/Submission/Report/CheckExport and use the ExportID that you received from the Export method to check the status. 

Please note that our REST API only accepts JSON object as a parameter list. To ensure proper authentication, you should include only one authentication parameter (APIKey) within the header.

Sample Request and Response 

Below is an example of the Request JSON object to deliver the email.


{
	"ID": 9
}
	
Parameter name (Case-sensitive)

Description

Nullable?

ID

The Export ID resulted from export method.

No

Below is an example of the response. If the export is still processing, it will display a "Processing" status.


{
  "Result": {
    "StatusCode": "200",
    "Status": "OK",
    "Message": "Success",
    "Data": {
      "ExportID": 9,
      "Status": "Processing"
    }
  }
}
	
If the export is complete, it will display a "Complete" status and the URL to download the file.


{
  "Result": {
    "StatusCode": "200",
    "Status": "OK",
    "Message": "Success",
    "Data": {
      "ExportID": 9,
      "Status": "Complete",
      "URL": "https://enginemailerblob.blob.core.windows.net/files/XXXXXXXXXXXXXXXXX/21_10_2021_11_00_48.csv"
    }
  }
}
	
 

Facebook Twitter LinkedIn
Print Friendly and PDF
Was this article helpful?
 
0 out of 0 found this helpful
Have more questions? Submit a request
Articles in this section
Check Export Status Version 2
Export CSV Report Version 2
Submitting Transactional Emails via REST-API Version 2
Check Export Status (Deprecated)
Export CSV Report (Deprecated)
Submitting Transactional Emails via REST-API (Deprecated)
SendEmail - Successful Response
SendEmail - Failed Response
SendEmail - Example of the code submission (JQuery)
SendEmail - Example of the code submission (PHP)
See more
Related articles
Submitting Transactional Emails via REST-API Version 2
Export CSV Report Version 2
SendEmail - Example of the code submission (PHP)
Manage API keys for your account
Get Subscriber
Recently viewed articles
Batch Update Subscribers
Get Custom Field
Create Update Category
UnSub Subscriber
Update Subscriber
Can't find your answer here?
Submit ticket here
Want to sign in to Zendesk?
Login to view Your Tickets
Find us on Facebook
Get to know the community
© 2017 All Rights Reserved. Enginemailer™ is a registered trademark of Teneo Technologies Sdn Bhd.Logo
Return to Enginemailer | Logout
Search documentation...
Enginemailer  Transactional  REST API
Export CSV Report Version 2
Avatar Written by Enginemailer Support
Updated 1 year ago
You can export transactional email reports using API at this link:

https://api.enginemailer.com/RESTAPI/V2/Submission/Report/Export

Please note that our REST API only accepts JSON object as a parameter list. To ensure proper authentication, you should include only one authentication parameter (APIKey) within the header. 

Sample Request and Response 

Below is an example of the Request JSON object to deliver the email.


{
	"Period": "1 Sep 2021 - 16 Sep 2021",
        "EmailToFilter": "test@test.com",
        "DomainFilter":"enginemailer.com"
}
	
Parameter name (Case-sensitive)

Description

Nullable?

Period

The date range of the report. Start date can be as maximum as past 60 days.

No

EmailToFilter

To filter the export result by email address.

Yes

DomainFilter

To filter the export result by sender domain.

Yes

Below is an example of the response. Use the ExportID to check for the export status in here


{
  "Result": {
    "StatusCode": "200",
    "Status": "OK",
    "Message": "Success",
    "Data": {
      "ExportID": 9,
      "Status": "Processing"
    }
  }
}
	
 

Facebook Twitter LinkedIn
Print Friendly and PDF
Was this article helpful?
 
0 out of 0 found this helpful
Have more questions? Submit a request
Articles in this section
Check Export Status Version 2
Export CSV Report Version 2
Submitting Transactional Emails via REST-API Version 2
Check Export Status (Deprecated)
Export CSV Report (Deprecated)
Submitting Transactional Emails via REST-API (Deprecated)
SendEmail - Successful Response
SendEmail - Failed Response
SendEmail - Example of the code submission (JQuery)
SendEmail - Example of the code submission (PHP)
See more
Related articles
Submitting Transactional Emails via REST-API Version 2
Check Export Status Version 2
Export CSV Report (Deprecated)
About Survey Reports
Whitelist Enginemailer's IPs
Recently viewed articles
Check Export Status Version 2
Batch Update Subscribers
Get Custom Field
Create Update Category
UnSub Subscriber
Can't find your answer here?
Submit ticket here
Want to sign in to Zendesk?
Login to view Your Tickets
Find us on Facebook
Get to know the community
© 2017 All Rights Reserved. Enginemailer™ is a registered trademark of Teneo Technologies Sdn Bhd.