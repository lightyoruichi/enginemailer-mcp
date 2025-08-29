Logo
Return to Enginemailer | Logout
Search documentation...
Enginemailer  Campaign  REST API
Campaign REST API - GETTING STARTED
Avatar Written by Enginemailer Support
Updated 7 years ago
Campaign can be inserted via invoking Enginemailer Campaign Management API.

Please note of the following before starting use this API

The campaign API only allow the PAID user to use the service.
The campaign content is not editable in the portal, but others parameter like Campaign name, Sender name and others are editable in the portal.
Authentication

Our REST API using the API key to authenticate user, it can be found in the following url: 

https://portal.enginemailer.com/Account/UserProfile

Warning: Please note that we do not recommend the user to use API key in the javascript, it will expose the API key to the user. We will advise to use the backend to trigger the API for security purpose. If you lose the key or the key is being stolen, please regenerate the key in the user profile page.
The user is required to insert the key as ‘APIKey’ parameter to the request header.

 

Method

CreateCampaign
UpdateCampaign
DeleteCampaign
AssignRecipientList
DeleteRecipientList
PauseCampaign
SendCampaign
ScheduleCampaign
GetCategoryList
GetSubCategoryList
ListCampaign
Error for Campaign API

Error code
Facebook Twitter LinkedIn
Print Friendly and PDF
Was this article helpful?
 
0 out of 0 found this helpful
Have more questions? Submit a request
Articles in this section
Campaign REST API - GETTING STARTED
Create Campaign
Update Campaign
Delete Campaign
Assign Recipient List
Delete Recipient List
Pause Campaign
Send Campaign
Schedule Campaign
Get Category List
See more
Related articles
Create Campaign
Errors for Campaign API
Assign Recipient List
How to create an autoresponder?
Why are my email subscribers not receiving my campaigns?
Recently viewed articles
Subscriber REST API - GETTING STARTED
Introduction to Webhooks
How can I track all activities performed by my team members?
Managing Multiple Users
Can't find your answer here?
Submit ticket here
Want to sign in to Zendesk?
Login to view Your Tickets
Find us on Facebook
Get to know the community
© 2017 All Rights Reserved. Enginemailer™ is a registered trademark of Teneo Technologies Sdn Bhd.Logo
Return to Enginemailer | Logout
Search documentation...
Enginemailer  Campaign  REST API
Delete Campaign
Avatar Written by Enginemailer Support
Updated 7 years ago
DeleteCampaign

Deleting undelivered campaign.

URL	https://api.enginemailer.com/restapi/campaign/emcampaign/deletecampaign
Method	HTTP GET with Query String
 

Please note of the following before starting use this function

Scheduled, delivering, delivered campaign is not able to perform the deleting.
This function will not work when the campaign is inserting / deleting the recipient list.
Table: Parameter

Parameter name	Description	Column Type
CampaignID	Targeted Campaign ID.	Integer
 

Request Example

Header

<APIKEY> - Value
Response

Success Response

{
    "Result":{
        "Status":"OK",
        "StatusCode":"200"
    }
}
Failed Response

{
    "Result":{
        "StatusCode":"500",
        "Status":"InternalServerError",
        "ErrorMessage":"Authentication Failed!"
    }
}
 

Code Example (.NET)

Using REST SHARP library , please download from Nuget Package

var client = new RestClient("https://api.enginemailer.com/restapi/campaign/emcampaign/deletecampaign?campaignid=1");

var request = new RestRequest(Method.GET);
request.AddHeader("APIKey", "YOUR API KEY");
var response = client.Execute(request).Content; 
var response2 = JObject.Parse(response); 
Facebook Twitter LinkedIn
Print Friendly and PDF
Was this article helpful?
 
0 out of 0 found this helpful
Have more questions? Submit a request
Articles in this section
Campaign REST API - GETTING STARTED
Create Campaign
Update Campaign
Delete Campaign
Assign Recipient List
Delete Recipient List
Pause Campaign
Send Campaign
Schedule Campaign
Get Category List
See more
Related articles
Pause Campaign
Update Campaign
Assign Recipient List
Manage Custom Fields
How to set up and check your domain reputation
Recently viewed articles
Update Campaign
Create Campaign
Submitting Transactional Emails via REST-API (Deprecated)
Submitting Transactional Emails via REST-API Version 2
Insert Subscriber - Example of the code (PHP)
Can't find your answer here?
Submit ticket here
Want to sign in to Zendesk?
Login to view Your Tickets
Find us on Facebook
Get to know the community
© 2017 All Rights Reserved. Enginemailer™ is a registered trademark of Teneo Technologies Sdn Bhd.Logo
Return to Enginemailer | Logout
Search documentation...
Enginemailer  Campaign  REST API
Create Campaign
Avatar Written by Enginemailer Support
Updated 7 years ago
CreateCampaign

Creation of the campaign.

URL	https://api.enginemailer.com/restapi/Campaign/EMCampaign/CreateCampaign
Method	HTTP POST
Note: The user can only create campaign with the maximum number of 200. If intend to create more campaign, you are required to delete older campaigns.
 

Table: Parameter

Parameter name	Description	Column Type
Data	A list of data to create the campaign.	JSON String
 

Table: Data Definition for JSON

Parameter name	Description	Column Type	Maximum Length	Required?
CampaignName	List of sub categories id of the subscriber. It is pre-defined in the portal and it can be retrieved by invoking getSubCategory method.	JArray (Int)	 128	Yes
SenderName	The custom field value of the subscriber. All the custom field value must be in correct format based on their field type.	Jarray (JObject)	 128	Yes
SenderEmail	Email of the sender. The email domain must be verified in the account.	String	128	Yes
Subject	Subject	String	256	Yes
Content	HTML content of the Campaign	String	256(KB)	Yes
 

 

Request Example

Header

<APIKEY> - Value
Body

{
   "CampaignName": "hello world",
   "SenderName": "support",
   "SenderEmail": "support@enginemailer.com",
   "Subject": "Promotion 1",
   "Content": "This is my content"
}
 

Response

Success Response

{
    "Result":{
        "Status":"OK",
        "StatusCode":"200",
        "CampaignID": "2200"
    }
}
Failed Response

{
    "Result":{
        "StatusCode":"500",
        "Status":"InternalServerError",
        "ErrorMessage":"Authentication Failed!"
    }
}
 

Code Example (.NET)

Using REST SHARP library , please download from Nuget Package

JObject jb = new JObject();
jb.Add("campaignname", "camp name");
jb.Add("sendername", "sender");
jb.Add("senderemail", "sender@enginemailer.com");
jb.Add("subject", "subject");
jb.Add("Content", "content");

var client = new RestClient("https://api.enginemailer.com/restapi/Campaign/EMCampaign/CreateCampaign");

var request = new RestRequest(Method.POST);
request.AddHeader("APIKey", "YOUR API KEY");
request.AddParameter("email", jb.ToString(), ParameterType.RequestBody);
var response = client.Execute(request).Content; 

Facebook Twitter LinkedIn
Print Friendly and PDF
Was this article helpful?
 
0 out of 0 found this helpful
Have more questions? Submit a request
Articles in this section
Campaign REST API - GETTING STARTED
Create Campaign
Update Campaign
Delete Campaign
Assign Recipient List
Delete Recipient List
Pause Campaign
Send Campaign
Schedule Campaign
Get Category List
See more
Related articles
Assign Recipient List
Campaign REST API - GETTING STARTED
Send Campaign
Update Campaign
Submitting Transactional Emails via REST-API Version 2
Recently viewed articles
Delete Campaign
Update Campaign
Submitting Transactional Emails via REST-API (Deprecated)
Submitting Transactional Emails via REST-API Version 2
Insert Subscriber - Example of the code (PHP)
Can't find your answer here?
Submit ticket here
Want to sign in to Zendesk?
Login to view Your Tickets
Find us on Facebook
Get to know the community
© 2017 All Rights Reserved. Enginemailer™ is a registered trademark of Teneo Technologies Sdn Bhd.Logo
Return to Enginemailer | Logout
Search documentation...
Enginemailer  Campaign  REST API
Update Campaign
Avatar Written by Enginemailer Support
Updated 7 years ago
UpdateCampaign

Update data for existing campaign.

URL	https://api.enginemailer.com/restapi/Campaign/EMCampaign/UpdateCampaign
Method	HTTP POST
 

Table: Parameter

Parameter name	Description	Column Type
Data	A list of data to create the campaign.	JSON String
 

Table: Data Definition for JSON

Parameter name	Description	Column Type	Maximum Length	Required?
CampaignID	Target Campaign ID	Integer	-	Yes
CampaignName	List of sub categories id of the subscriber. It is pre-defined in the portal and it can be retrieved by invoking getSubCategory method.	JArray (Int)	 128	Yes
SenderName	The custom field value of the subscriber. All the custom field value must be in correct format based on their field type.	Jarray (JObject)	 128	Yes
SenderEmail	Email of the sender. The email domain must be verified in the account.	String	128	Yes
Subject	Subject	String	256	Yes
Content	HTML content of the Campaign	String	256(KB)	Yes
 

 

Request Example

Header

<APIKEY> - Value
Body

{
   "CampaignID": "1",
   "CampaignName": "hello world",
   "SenderName": "support",
   "SenderEmail": "support@enginemailer.com",
   "Subject": "Promotion 1",
   "Content": "This is my content"
}
 

Response

Success Response

{
    "Result":{
        "Status":"OK",
        "StatusCode":"200"
    }
}
Failed Response

{
    "Result":{
        "StatusCode":"500",
        "Status":"InternalServerError",
        "ErrorMessage":"Authentication Failed!"
    }
}
 

Code Example (.NET)

Using REST SHARP library , please download from Nuget Package

JObject jb = new JObject();
jb.Add("campaignid", "1");
jb.Add("campaignname", "camp name");
jb.Add("sendername", "sender");
jb.Add("senderemail", "sender@enginemailer.com");
jb.Add("subject", "subject");
jb.Add("Content", "content");

var client = new RestClient("https://api.enginemailer.com/restapi/Campaign/EMCampaign/UpdateCampaign");

var request = new RestRequest(Method.POST);
request.AddHeader("APIKey", "YOUR API KEY");
request.AddParameter("email", jb.ToString(), ParameterType.RequestBody);
var response = client.Execute(request).Content; 

Facebook Twitter LinkedIn
Print Friendly and PDF
Was this article helpful?
 
0 out of 0 found this helpful
Have more questions? Submit a request
Articles in this section
Campaign REST API - GETTING STARTED
Create Campaign
Update Campaign
Delete Campaign
Assign Recipient List
Delete Recipient List
Pause Campaign
Send Campaign
Schedule Campaign
Get Category List
See more
Related articles
Create Campaign
Send Campaign
Assign Recipient List
Delete Campaign
Schedule Campaign
Recently viewed articles
Create Campaign
Delete Campaign
Submitting Transactional Emails via REST-API (Deprecated)
Submitting Transactional Emails via REST-API Version 2
Insert Subscriber - Example of the code (PHP)
Can't find your answer here?
Submit ticket here
Want to sign in to Zendesk?
Login to view Your Tickets
Find us on Facebook
Get to know the community
© 2017 All Rights Reserved. Enginemailer™ is a registered trademark of Teneo Technologies Sdn Bhd.Logo
Return to Enginemailer | Logout
Search documentation...
Enginemailer  Campaign  REST API
Assign Recipient List
Avatar Written by Enginemailer Support
Updated 7 years ago
AssignRecipientList

Assign recipient list to the targeted campaign.

URL	https://api.enginemailer.com/restapi/campaign/emcampaign/AssignRecipientList
Method	HTTP POST
  

Please note of the following before starting use this function

Scheduled, delivering, delivered campaign is not able to perform the assigning.
This function will not work when the campaign is inserting / deleting the recipient list.
The subcategoryid please get from the function which named as getSubCategoryList.
Table: Parameter(JSON)

Parameter name	Description	Column Type
CampaignID	Targeted Campaign ID.	Integer
Data	
A list of data to assign the recipient list. This field is only required when filter by is 2.

JSON String
FilterBy	
Filter by category or assign all subscriber to the campaign.

1 – Assign All Subscriber

2 – Filter by Category

Integer
 

Table: Data Definition for JSON

Parameter name	Description	Column Type	Maximum Length	Required?
CategoryList	The list of sub category id	JArray (Int)	 -	Yes
FilterType	Filter type. The value only can be AND / OR. Others value will throw the error. This is using to filter out all the subscriber which contains all the sub category listed, or any subscriber which contain one of sub category listed in the category list.	String	 128	Yes
 

 

Request Example

Header

<APIKEY> - Value
Body

{
   "CategoryList": [1,2,3,4],
   "FilterType": "OR"
}
 

Response

Success Response

{
    "Result":{
        "Status":"OK",
        "StatusCode":"200"
    }
}
Failed Response

{
    "Result":{
        "StatusCode":"500",
        "Status":"InternalServerError",
        "ErrorMessage":"Authentication Failed!"
    }
}
 

Code Example (.NET)

Using REST SHARP library , please download from Nuget Package

JObject jb = new JObject();
JArray array = new JArray();
array.Add(1);
array.Add(2);
array.Add(3);
array.Add(4);

jb.Add("categorylist",array);
jb.Add("filtertype","OR");

JObject submitContent = new JObject();
submitContent.Add("data", jb);
submitContent.Add("campaignid", 1);
submitContent.Add("FilterBy", 2);

var client = new RestClient("https://api.enginemailer.com/restapi/campaign/emcampaign/AssignRecipientList");

var request = new RestRequest(Method.POST);
request.AddHeader("APIKey", "YOUR API KEY");
request.AddParameter("email", submitContent.ToString(), ParameterType.RequestBody);
var response = client.Execute(request).Content; 
Facebook Twitter LinkedIn
Print Friendly and PDF
Was this article helpful?
 
0 out of 0 found this helpful
Have more questions? Submit a request
Articles in this section
Campaign REST API - GETTING STARTED
Create Campaign
Update Campaign
Delete Campaign
Assign Recipient List
Delete Recipient List
Pause Campaign
Send Campaign
Schedule Campaign
Get Category List
See more
Related articles
Send Campaign
Schedule Campaign
Create Campaign
List Campaign
Delete Recipient List
Recently viewed articles
Update Campaign
Create Campaign
Delete Campaign
Submitting Transactional Emails via REST-API (Deprecated)
Submitting Transactional Emails via REST-API Version 2
Can't find your answer here?
Submit ticket here
Want to sign in to Zendesk?
Login to view Your Tickets
Find us on Facebook
Get to know the community
© 2017 All Rights Reserved. Enginemailer™ is a registered trademark of Teneo Technologies Sdn Bhd.Logo
Return to Enginemailer | Logout
Search documentation...
Enginemailer  Campaign  REST API
Delete Recipient List
Avatar Written by Enginemailer Support
Updated 7 years ago
DeleteRecipientList

Delete existing recipient list from the targeted campaign.

 

URL	https://api.enginemailer.com/restapi/campaign/emcampaign/deleteRecipientList
Method	HTTP GET with Query String
  

Please note of the following before starting use this function

Scheduled, delivering, delivered campaign is not able to perform the deleting.
This function will not work when the campaign is inserting / deleting the recipient list.
 

Table: Parameter

Parameter name	Description	Column Type
CampaignID	Targeted Campaign ID.	Integer
 

 

Request Example

Header

<APIKEY> - Value
Response

Success Response

{
    "Result":{
        "Status":"OK",
        "StatusCode":"200"
    }
}
Failed Response

{
    "Result":{
        "StatusCode":"500",
        "Status":"InternalServerError",
        "ErrorMessage":"Authentication Failed!"
    }
}
 

Code Example (.NET)

Using REST SHARP library , please download from Nuget Package

var client = new RestClient("https://api.enginemailer.com/restapi/campaign/emcampaign/deleteRecipientList?campaignid=1");

var request = new RestRequest(Method.GET);
request.AddHeader("APIKey", "YOUR API KEY");
var response = client.Execute(request).Content; 
var response2 = JObject.Parse(response); 

Facebook Twitter LinkedIn
Print Friendly and PDF
Was this article helpful?
 
0 out of 0 found this helpful
Have more questions? Submit a request
Articles in this section
Campaign REST API - GETTING STARTED
Create Campaign
Update Campaign
Delete Campaign
Assign Recipient List
Delete Recipient List
Pause Campaign
Send Campaign
Schedule Campaign
Get Category List
See more
Related articles
Pause Campaign
Assign Recipient List
List Campaign
Send Campaign
Recently viewed articles
Assign Recipient List
Update Campaign
Create Campaign
Delete Campaign
Submitting Transactional Emails via REST-API (Deprecated)
Can't find your answer here?
Submit ticket here
Want to sign in to Zendesk?
Login to view Your Tickets
Find us on Facebook
Get to know the community
© 2017 All Rights Reserved. Enginemailer™ is a registered trademark of Teneo Technologies Sdn Bhd.Logo
Return to Enginemailer | Logout
Search documentation...
Enginemailer  Campaign  REST API
Pause Campaign
Avatar Written by Enginemailer Support
Updated 7 years ago
PauseCampaign

Pause the campaign from a scheduled campaign.

URL	https://api.enginemailer.com/restapi/campaign/emcampaign/PauseCampaign
Method	HTTP GET with Query String
 

Please note of the following before starting use this function

Only scheduled without delivering campaign is able to perform the pause for the campaign
 

Table: Parameter

Parameter name	Description	Column Type
CampaignID	Targeted Campaign ID.	Integer
 

 

Request Example

Header

<APIKEY> - Value
Response

Success Response

{
    "Result":{
        "Status":"OK",
        "StatusCode":"200"
    }
}
Failed Response

{
    "Result":{
        "StatusCode":"500",
        "Status":"InternalServerError",
        "ErrorMessage":"Authentication Failed!"
    }
}
 

Code Example (.NET)

Using REST SHARP library , please download from Nuget Package

var client = new RestClient("https://api.enginemailer.com/restapi/campaign/emcampaign/PauseCampaign?campaignid=1");

var request = new RestRequest(Method.GET);
request.AddHeader("APIKey", "YOUR API KEY");
var response = client.Execute(request).Content; 
var response2 = JObject.Parse(response); 

Facebook Twitter LinkedIn
Print Friendly and PDF
Was this article helpful?
 
0 out of 0 found this helpful
Have more questions? Submit a request
Articles in this section
Campaign REST API - GETTING STARTED
Create Campaign
Update Campaign
Delete Campaign
Assign Recipient List
Delete Recipient List
Pause Campaign
Send Campaign
Schedule Campaign
Get Category List
See more
Related articles
Send Campaign
How to pause a campaign?
Delete Campaign
Spam-Complaint
A/B Testing your campaign
Recently viewed articles
Delete Recipient List
Assign Recipient List
Update Campaign
Create Campaign
Delete Campaign
Can't find your answer here?
Submit ticket here
Want to sign in to Zendesk?
Login to view Your Tickets
Find us on Facebook
Get to know the community
© 2017 All Rights Reserved. Enginemailer™ is a registered trademark of Teneo Technologies Sdn Bhd.Logo
Return to Enginemailer | Logout
Search documentation...
Enginemailer  Campaign  REST API
Send Campaign
Avatar Written by Enginemailer Support
Updated 7 years ago
SendCampaign

Send the campaign.

URL	https://api.enginemailer.com/restapi/campaign/emcampaign/SendCampaign
Method	HTTP GET with Query String
 

Please note of the following before starting use this function

Scheduled, delivering, delivered campaign is not able to perform the sending.
This function will not work when the campaign is deleting the recipient list.
The campaign must at least have one recipient to deliver the campaign.
 

Table: Parameter

Parameter name	Description	Column Type
CampaignID	Targeted Campaign ID.	Integer
 

 

Request Example

Header

<APIKEY> - Value
Response

Success Response

{
    "Result":{
        "Status":"OK",
        "StatusCode":"200"
    }
}
Failed Response

{
    "Result":{
        "StatusCode":"500",
        "Status":"InternalServerError",
        "ErrorMessage":"Authentication Failed!"
    }
}
 

Code Example (.NET)

Using REST SHARP library , please download from Nuget Package

var client = new RestClient("https://api.enginemailer.com/restapi/campaign/emcampaign/SendCampaign?campaignid=1");

var request = new RestRequest(Method.GET);
request.AddHeader("APIKey", "YOUR API KEY");
var response = client.Execute(request).Content; 
var response2 = JObject.Parse(response); 

Facebook Twitter LinkedIn
Print Friendly and PDF
Was this article helpful?
 
0 out of 0 found this helpful
Have more questions? Submit a request
Articles in this section
Campaign REST API - GETTING STARTED
Create Campaign
Update Campaign
Delete Campaign
Assign Recipient List
Delete Recipient List
Pause Campaign
Send Campaign
Schedule Campaign
Get Category List
See more
Related articles
Create Campaign
Schedule Campaign
Assign Recipient List
List Campaign
Add and verify email domain
Recently viewed articles
Pause Campaign
Delete Recipient List
Assign Recipient List
Update Campaign
Create Campaign
Can't find your answer here?
Submit ticket here
Want to sign in to Zendesk?
Login to view Your Tickets
Find us on Facebook
Get to know the community
© 2017 All Rights Reserved. Enginemailer™ is a registered trademark of Teneo Technologies Sdn Bhd.Logo
Return to Enginemailer | Logout
Search documentation...
Enginemailer  Campaign  REST API
Schedule Campaign
Avatar Written by Enginemailer Support
Updated 7 years ago
ScheduleCampaign

Schedule the campaign.

URL	https://api.enginemailer.com/restapi/campaign/emcampaign/ScheduleCampaign
Method	HTTP GET with Query String
 

Please note of the following before starting use this function

Scheduled, delivering, delivered campaign is not able to perform the scheduling.
This function will not work when the campaign is deleting the recipient list.
The campaign must at least have one recipient to deliver the campaign.
Schedule Date must not be a passed date.
Schedule Date must follow the standard of scheduling in the portal. It must be in the interval of 15 minutes. For g., 12:00, 12:15, 12:30, 12:45, others format of the schedule time will be rejected.
Insufficient credit will flag the scheduled campaign as “failed” and campaign will not send at the scheduled time. Failed campaign can be edited and resend from the portal.
Table: Parameter

Parameter name	Description	Column Type
CampaignID	Targeted Campaign ID.	Integer
ScheduleTime	
Schedule Time. Format: ddMMyyyy hh:mmtt

For example, 01122018 12:15PM	String
 

 

Request Example

Header

<APIKEY> - Value
Response

Success Response

{
    "Result":{
        "Status":"OK",
        "StatusCode":"200"
    }
}
Failed Response

{
    "Result":{
        "StatusCode":"500",
        "Status":"InternalServerError",
        "ErrorMessage":"Authentication Failed!"
    }
}
 

Code Example (.NET)

Using REST SHARP library , please download from Nuget Package

var client = new RestClient("https://api.enginemailer.com/restapi/campaign/emcampaign/ScheduleCampaign?campaignid=1&scheduletime=30042018 03:00PM");

var request = new RestRequest(Method.GET);
request.AddHeader("APIKey", "YOUR API KEY");
var response = client.Execute(request).Content; 
var response2 = JObject.Parse(response); 

Facebook Twitter LinkedIn
Print Friendly and PDF
Was this article helpful?
 
0 out of 0 found this helpful
Have more questions? Submit a request
Articles in this section
Campaign REST API - GETTING STARTED
Create Campaign
Update Campaign
Delete Campaign
Assign Recipient List
Delete Recipient List
Pause Campaign
Send Campaign
Schedule Campaign
Get Category List
See more
Related articles
Create Campaign
Get Category List
Send Campaign
Pause Campaign
Getting started with autoresponder
Recently viewed articles
Send Campaign
Pause Campaign
Delete Recipient List
Assign Recipient List
Update Campaign
Can't find your answer here?
Submit ticket here
Want to sign in to Zendesk?
Login to view Your Tickets
Find us on Facebook
Get to know the community
© 2017 All Rights Reserved. Enginemailer™ is a registered trademark of Teneo Technologies Sdn Bhd.Logo
Return to Enginemailer | Logout
Search documentation...
Enginemailer  Campaign  REST API
Get Category List
Avatar Written by Enginemailer Support
Updated 7 years ago
GetCategoryList

Get a list of category. No parameter is required

URL	https://api.enginemailer.com/restapi/campaign/emcampaign/GetCategoryList
Method	HTTP GET
  

Request Example

Header

<APIKEY> - Value
Response

Success Response

{
    "Result": {
	"Status": "OK",
	"StatusCode": "200",
	"Data": [{
		"category_id": "1",
		"name": "Gender",
		"description": "Gender"
	}, {
		"category_id": "2",
		"name": "Hobbies",
		"description": "Activties during leisure time"
	}, {
		"category_id": "3",
		"name": "Qualification",
		"description": "academic"
	}]
    }
}
Failed Response

{
    "Result":{
        "StatusCode":"500",
        "Status":"InternalServerError",
        "ErrorMessage":"Authentication Failed!"
    }
}
 

Code Example (.NET)

Using REST SHARP library , please download from Nuget Package

var client = new RestClient("https://api.enginemailer.com/restapi/campaign/emcampaign/GetCategoryList");

var request = new RestRequest(Method.GET);
request.AddHeader("APIKey", "YOUR API KEY");
var response = client.Execute(request).Content; 
var response2 = JObject.Parse(response); 

Facebook Twitter LinkedIn
Print Friendly and PDF
Was this article helpful?
 
0 out of 0 found this helpful
Have more questions? Submit a request
Articles in this section
Campaign REST API - GETTING STARTED
Create Campaign
Update Campaign
Delete Campaign
Assign Recipient List
Delete Recipient List
Pause Campaign
Send Campaign
Schedule Campaign
Get Category List
See more
Related articles
Assign Recipient List
Recently viewed articles
Schedule Campaign
Send Campaign
Pause Campaign
Delete Recipient List
Assign Recipient List
Can't find your answer here?
Submit ticket here
Want to sign in to Zendesk?
Login to view Your Tickets
Find us on Facebook
Get to know the community
© 2017 All Rights Reserved. Enginemailer™ is a registered trademark of Teneo Technologies Sdn Bhd.