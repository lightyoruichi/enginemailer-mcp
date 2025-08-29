Logo
Return to Enginemailer | Logout
Search documentation...
Enginemailer  Subscribers  REST API
Subscriber REST API - GETTING STARTED
Avatar Written by Enginemailer Support
Updated 1 year ago
Subscribers can be inserted via invoking the Enginemailer Subscriber Management API.

Our REST API uses the API key to authenticate users, and can be found on the following URL: 

https://portal.enginemailer.com/Account/UserProfile

Warning: Please note that we do not recommend users to use the API key in Javascript, as this will expose the API key to the user. We advise using the backend to trigger the API for security purposes. If you lose the key or the key is stolen, please regenerate the key in the user profile page.
Once the user obtains an API key, the user will be required to insert the key as ‘APIKey’ parameter to the request header.

 

Methods

InsertSubscriber
UpdateSubscriber
UnsubSubscriber
GetSubcategory
GetCustomField
Error for Subscriber API

Error code
Facebook Twitter LinkedIn
Print Friendly and PDF
Was this article helpful?
 
0 out of 0 found this helpful
Have more questions? Submit a request
Articles in this section
Get Subscriber
Activate Subscriber
Subscriber REST API - GETTING STARTED
Insert Subscriber
Update Subscriber
UnSub Subscriber
Get Sub Category
Create Update Category
Get Custom Field
Batch Update Subscribers
See more
Related articles
Insert Subscriber
Get Subscriber
Update Subscriber
Campaign REST API - GETTING STARTED
Activate Subscriber
Recently viewed articles
Manage API keys for your account
Get Category List
Schedule Campaign
Send Campaign
Pause Campaign
Can't find your answer here?
Submit ticket here
Want to sign in to Zendesk?
Login to view Your Tickets
Find us on Facebook
Get to know the community
© 2017 All Rights Reserved. Enginemailer™ is a registered trademark of Teneo Technologies Sdn Bhd.Logo
Return to Enginemailer | Logout
Search documentation...
Enginemailer  Subscribers  REST API
Get Subscriber
Avatar Written by Enginemailer Support
Updated 1 year ago
GetSubscriber

Get information about a subscriber.

URL	https://api.enginemailer.com/restapi/subscriber/emsubscriber/getSubscriber?{email}
Method	HTTP GET with Query String
 

Request Example

Header

<APIKEY> - Value
 

Response

Success Response

{
    "Result": {
        "Status": "OK",
        "StatusCode": "200",
        "Data": {
             "SubscriberID": 12345,
             "Email": "imported_test12345@test.com",
             "Status": "Active",
             "first_name": "Test",
             "last_name": "Test",
             "unique_id": "10",
             "description": "This is for test",
             "no_of_kids": "1",
             "birthday": "01 Oct 2020",
             "mobile_phone": "+60123456789",
             "home_address": "",
             "gender": "Female",
             "interest": [
                  "Cooking",
                  "Hiking",
                  "Reading"
                  ]
              }
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

var client = new RestClient("http://api.enginemailer.com/RESTAPI/subscriber/emsubscriber/getSubscriber?email=example@enginemailer.com");

var request = new RestRequest(Method.GET);
request.AddHeader("APIKey", "<>");
var response = client.Execute(request).Content;
var response2 = JObject.Parse(response);
Facebook Twitter LinkedIn
Print Friendly and PDF
Was this article helpful?
 
0 out of 1 found this helpful
Have more questions? Submit a request
Articles in this section
Get Subscriber
Activate Subscriber
Subscriber REST API - GETTING STARTED
Insert Subscriber
Update Subscriber
UnSub Subscriber
Get Sub Category
Create Update Category
Get Custom Field
Batch Update Subscribers
See more
Related articles
Subscriber REST API - GETTING STARTED
Activate Subscriber
Insert Subscriber
Update Subscriber
Connecting a Domain for Landing Pages
Recently viewed articles
Submitting Transactional Emails via REST-API Version 2
Errors for Subscribers API
Errors for Campaign API
Subscriber REST API - GETTING STARTED
Manage API keys for your account
Can't find your answer here?
Submit ticket here
Want to sign in to Zendesk?
Login to view Your Tickets
Find us on Facebook
Get to know the community
© 2017 All Rights Reserved. Enginemailer™ is a registered trademark of Teneo Technologies Sdn Bhd.Logo
Return to Enginemailer | Logout
Search documentation...
Enginemailer  Subscribers  REST API
Activate Subscriber
Avatar Written by Enginemailer Support
Updated 10 months ago
ActivateSubscriber

Activate an inactive subscriber. Only applicable to the subscriber that is deactivated either through the API or manually.

URL	https://api.enginemailer.com/restapi/subscriber/emsubscriber/activateSubscriber?{email}
Method	HTTP POST with Query String
 

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

var client = new RestClient("http://api.enginemailer.com/RESTAPI/subscriber/emsubscriber/activateSubscriber?email=example@enginemailer.com");

var request = new RestRequest(Method.POST); 
request.AddHeader("APIKey", "<>");
var response = client.Execute(request).Content;
var response2 = JObject.Parse(response);
Facebook Twitter LinkedIn
Print Friendly and PDF
Was this article helpful?
 
0 out of 0 found this helpful
Have more questions? Submit a request
Articles in this section
Get Subscriber
Activate Subscriber
Subscriber REST API - GETTING STARTED
Insert Subscriber
Update Subscriber
UnSub Subscriber
Get Sub Category
Create Update Category
Get Custom Field
Batch Update Subscribers
See more
Related articles
Subscriber REST API - GETTING STARTED
Insert Subscriber
Get Subscriber
List Campaign
Insert Subscriber - Example of the code (PHP)
Recently viewed articles
Get Subscriber
Submitting Transactional Emails via REST-API Version 2
Errors for Subscribers API
Errors for Campaign API
Subscriber REST API - GETTING STARTED
Can't find your answer here?
Submit ticket here
Want to sign in to Zendesk?
Login to view Your Tickets
Find us on Facebook
Get to know the community
© 2017 All Rights Reserved. Enginemailer™ is a registered trademark of Teneo Technologies Sdn Bhd.Logo
Return to Enginemailer | Logout
Search documentation...
Enginemailer  Subscribers  REST API
Insert Subscriber
Avatar Written by Enginemailer Support
Updated 1 year ago
InsertSubscriber

Insertion of a subscriber.

URL	https://api.enginemailer.com/restapi/subscriber/emsubscriber/insertSubscriber
Method	HTTP POST
Note: The user can only insert with the maximum number of 50/day with the free account and 10,000/day with the paid account.
 

Table: Parameter

Parameter name	Description	Column Type
SubscriberData	A list of subscriber data.	JSON String
 

Table: Data Definition for JSON

Parameter name	Description	Column Type	Maximum Length	Required?
Email	Subscriber Email	String	128	Yes
SubCategories	List of sub categories id of the subscriber. It is pre-defined in the portal and it can be retrieved by invoking getSubCategory method.	JArray (Int)	 	 No
CustomFields	The custom field value of the subscriber. All the custom field value must be in correct format based on their field type.	Jarray (JObject)	 	No
SourceType	User defined label to indicate the source of subscriber (e.g Website Sign Up).	String	256	No
 

Table: Custom Fields Data Type

Data Type	Expected Value Format	Maximum Length
Date (Not Date Range)	
dd MMM yyyy

eg. 01 Jan 2017	 
Date (Date Range)	
dd MMM yyyy – dd MMM yyyy

eg. 01 Jan 2017 – 02 Jan 2017	 
Phone	
Contact Number come with the plus sign with the country code.

eg. +60146666666	 
Numeric	
Integer value.

 
Longtext	
<String>

512
Address	
<String>

512
Dropdown	
<String>

64
Checkbox	
Checkbox can have multiple value, the value is separated by |

eg. <String>|<String>|<String>	 64
 

Request Example

Header

<APIKEY> - Value
Body

{
   "email":"example@enginemailer.com",
   "subcategories":[
      1,
      2
   ],
   "customfields":[
      {
         "customfield_key":"branch",
         "customfield_value":"KL"
      },
      {
         "customfield_key":"mobile",
         "customfield_value":"+60123456789"
      },
      {
         "customfield_key":"hobbies",
         "customfield_value":"Eating|Sleeping"
      }
   ],
   "sourcetype": "Signup from website"
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

JArray subcategory = new JArray();
subcategory.Add(1);
subcategory.Add(2);
JObject jObject = new JObject();

JArray customfield = new JArray();
JObject customfield1 = new JObject();
JObject customfield2 = new JObject();

customfield1.Add("customfield_key", "branch");
customfield1.Add("customfield_value", "Sydney");
customfield.Add(customfield1);

customfield2.Add("customfield_key", "mobile");
customfield2.Add("customfield_value", "+60123456789");
customfield.Add(customfield2);

customfield3.Add("customfield_key", "hobbies");
customfield3.Add("customfield_value", "Eating|Sleeping");
customfield.Add(customfield3);

jObject.Add("email", "example@weblite.com.my");
jObject.Add("subcategories", subcategory);
jObject.Add("customfields", customfield);
jObject.Add("sourcetype", "Signup from website");
var client = new RestClient("http://api.enginemailer.com/RESTAPI/subscriber/emsubscriber/insertSubscriber");

var request = new RestRequest(Method.POST);
request.AddHeader("APIKey", "<>");
request.AddParameter("email", jObject.ToString(), ParameterType.RequestBody);
var response = client.Execute(request).Content;
var response2 = JObject.Parse(response);
Facebook Twitter LinkedIn
Print Friendly and PDF
Was this article helpful?
 
0 out of 0 found this helpful
Have more questions? Submit a request
Articles in this section
Get Subscriber
Activate Subscriber
Subscriber REST API - GETTING STARTED
Insert Subscriber
Update Subscriber
UnSub Subscriber
Get Sub Category
Create Update Category
Get Custom Field
Batch Update Subscribers
See more
Related articles
Subscriber REST API - GETTING STARTED
Update Subscriber
Get Subscriber
A quick start guide on submitting emails
Activate Subscriber
Recently viewed articles
Activate Subscriber
Get Subscriber
Submitting Transactional Emails via REST-API Version 2
Errors for Subscribers API
Errors for Campaign API
Can't find your answer here?
Submit ticket here
Want to sign in to Zendesk?
Login to view Your Tickets
Find us on Facebook
Get to know the community
© 2017 All Rights Reserved. Enginemailer™ is a registered trademark of Teneo Technologies Sdn Bhd.Logo
Return to Enginemailer | Logout
Search documentation...
Enginemailer  Subscribers  REST API
Update Subscriber
Avatar Written by Enginemailer Support
Updated 1 year ago
 

UpdateSubscriber

Update data for an existing subscriber.

URL	https://api.enginemailer.com/restapi/subscriber/emsubscriber/updateSubscriber
Method	HTTP POST
 

Table: Parameter

Parameter name	Description	Column Type
SubscriberData	A list of subscriber data.	JSON String
 

Table: Data Definition for JSON

Parameter name 	Description	Column Type	Maximum Length	Required?
Email	Subscriber Email	String	128	Yes
SubCategories	List of sub categories id of the subscriber. It is pre-defined in the portal and it can be retrieved by invoking getSubCategory method. 	JArray (Int)	 	 No
CustomFields	The custom field value of the subscriber. All the custom field value must be in correct format based on their field type. 	Jarray (JObject)	 	No
SubCategories_type	
Sub Categories Insertion Type

0 - Do nothing to current subscriber.

1- Append the current sub categories.

2- Delete sub categories from the sub categories provided from a subscriber.

3- Replace new sub categories provided to the old one.

Integer	 	No(Default is 1)
customfield_type	
Custom Field Update Type

0 - Update specific custom field value.

1- Replace new custom field provided to the old one.

Integer	 	No(Default is 1)
 

Table: Custom Fields Data Type

Data Type	Expected Value Format	Maximum Length
Date (Not Date Range)	
dd MMM yyyy

eg. 01 Jan 2017	 
Date (Date Range)	
dd MMM yyyy – dd MMM yyyy

eg. 01 Jan 2017 – 02 Jan 2017	 
Phone	
Contact Number come with the plus sign with the country code.

eg. +60146666666	 
Numeric	
Integer value.

 
Longtext	
<String>

512
Address	
<String>

512
Dropdown	
<String>

64
Checkbox	
Checkbox can have multiple value, the value is separated by |

eg. <String>|<String>|<String> 	 64
 

Request Example

Header

<APIKEY> - Value
Body


{
    "email":"example@enginemailer.com",
    "subcategories_type":1,
    "subcategories":[ 1, 2 ], 
    "customfield_type":1,
    "customfields":[ 
    { "customfield_key":"branch", "customfield_value":"KL" }, 
    { "customfield_key":"mobile", "customfield_value":"+60123456789" }, 
    { "customfield_key":"hobbies", "customfield_value":"Eating|Sleeping" } 
    ] 
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

JArray subcategory = new JArray();
subcategory.Add(1);
subcategory.Add(2);
JObject jObject = new JObject();

JArray customfield = new JArray();
JObject customfield1 = new JObject();
JObject customfield2 = new JObject();

customfield1.Add("customfield_key", "branch");
customfield1.Add("customfield_value", "Sydney");
customfield.Add(customfield1);

customfield2.Add("customfield_key", "mobile");
customfield2.Add("customfield_value", "+60123456789");
customfield.Add(customfield2);

customfield3.Add("customfield_key", "hobbies");
customfield3.Add("customfield_value", "Eating|Sleeping");
customfield.Add(customfield3);

jObject.Add("email", "example@weblite.com.my");
jObject.Add("subcategories", subcategory);
jObject.Add("subcategories_type", 1); 
jObject.Add("customfield_type", 1);
jObject.Add("customfields", customfield); 
var client = new RestClient("http://api.enginemailer.com/RESTAPI/subscriber/emsubscriber/updateSubscriber"); 
var request = new RestRequest(Method.POST); 
request.AddHeader("APIKey", "<>"); 
request.AddParameter("email", jObject.ToString(), ParameterType.RequestBody); 
var response = client.Execute(request).Content; 
var response2 = JObject.Parse(response); 
Facebook Twitter LinkedIn
Print Friendly and PDF
Was this article helpful?
 
0 out of 0 found this helpful
Have more questions? Submit a request
Articles in this section
Get Subscriber
Activate Subscriber
Subscriber REST API - GETTING STARTED
Insert Subscriber
Update Subscriber
UnSub Subscriber
Get Sub Category
Create Update Category
Get Custom Field
Batch Update Subscribers
See more
Related articles
UnSub Subscriber
Get Subscriber
Subscriber REST API - GETTING STARTED
Get Sub Category
Create Update Category
Recently viewed articles
Insert Subscriber
Activate Subscriber
Get Subscriber
Submitting Transactional Emails via REST-API Version 2
Errors for Subscribers API
Can't find your answer here?
Submit ticket here
Want to sign in to Zendesk?
Login to view Your Tickets
Find us on Facebook
Get to know the community
© 2017 All Rights Reserved. Enginemailer™ is a registered trademark of Teneo Technologies Sdn Bhd.Logo
Return to Enginemailer | Logout
Search documentation...
Enginemailer  Subscribers  REST API
UnSub Subscriber
Avatar Written by Enginemailer Support
Updated 1 year ago
UnsubSubscriber

Unsubscribe existing subscriber from subscriber list.

URL	https://api.enginemailer.com/restapi/subscriber/emsubscriber/unSubSubscriber?email={email}
Method	HTTP GET with Query String
 

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

var client = new RestClient("http://api.enginemailer.com/RESTAPI/subscriber/emsubscriber/unSubSubscriber?email=example@enginemailer.com");

var request = new RestRequest(Method.GET);
request.AddHeader("APIKey", "<>");
var response = client.Execute(request).Content;
var response2 = JObject.Parse(response);
Facebook Twitter LinkedIn
Print Friendly and PDF
Was this article helpful?
 
0 out of 0 found this helpful
Have more questions? Submit a request
Articles in this section
Get Subscriber
Activate Subscriber
Subscriber REST API - GETTING STARTED
Insert Subscriber
Update Subscriber
UnSub Subscriber
Get Sub Category
Create Update Category
Get Custom Field
Batch Update Subscribers
See more
Related articles
Insert Subscriber
Get Subscriber
Adding Unsubscribe link to your emails
Subscriber REST API - GETTING STARTED
Introduction to Webhooks
Recently viewed articles
Update Subscriber
Insert Subscriber
Activate Subscriber
Get Subscriber
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
Enginemailer  Subscribers  REST API
Create Update Category
Avatar Written by Enginemailer Support
Updated 2 months ago
Create or modify the category and subcategories using the data provided in JSON format.

updateCategory

URL	https://api.enginemailer.com/restapi/subscriber/emsubscriber/updateCategory
Method	HTTP POST
 

Table: Parameter

Parameter name	Description	Column Type
SubscriberData	A list of category and subcategory data.	JSON String
 

Table: Data Definition for JSON

Parameter name	Description	Column Type	Maximum Length	Required?
categoryID	Category ID. 0 for new category. Otherwise, use the existing category ID.	Int	 	Yes
categoryName	Name of the category, for existing category, name will be updated.	String	128	Yes
description	Description for the category	String	128	No
isvisible	Visibility for the category. Default is true.	Boolean	 	No
subcategories	List of sub categories object	JArray (Int)	 	 No
 

Table: Subcategories Data Type

Data Type	Expected Value Format	Maximum Length
subcategoryID	
<Int>

0 for new subcategory.Otherwise, use the existing subcategory ID.

 
subcategoryName	
<String>

128
description	
<String> (Not Required)

128
 

Request Example

Header

<APIKEY> - Value
Body

{
   "categoryID":123,
   "categoryname":"Malaysian Festival",
   "description": "Festival celebrated in Malaysia",
   "subcategories":[
      {
         "subcategoryid":0,
         "subcategoryname":"Eid al-Fitri"
      },
      {
         "subcategoryId":0,
         "subcategoryNAME":"CNY"
      }
   ],
   "isvisible": false
}
 

Response

Success Response

{
  "Result": {
    "Status": "OK",
    "StatusCode": "200",
    "Data": {
      "categoryID": 123,
      "categoryName": "Malaysian Festival",
      "description": "Festival celebrated in Malaysia",
      "subcategories": [
        {
          "subcategoryID": 1,
          "subcategoryName": "Eid al-Fitri",
          "description": ""
        },
        {
          "subcategoryID": 2,
          "subcategoryName": "CNY",
          "description": ""
        }
      ]
    }
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
 

Facebook Twitter LinkedIn
Print Friendly and PDF
Was this article helpful?
 
0 out of 0 found this helpful
Have more questions? Submit a request
Articles in this section
Get Subscriber
Activate Subscriber
Subscriber REST API - GETTING STARTED
Insert Subscriber
Update Subscriber
UnSub Subscriber
Get Sub Category
Create Update Category
Get Custom Field
Batch Update Subscribers
See more
Related articles
Batch Update Subscribers
Get Custom Field
Get Sub Category
Assign Recipient List
Insert Subscriber - Example of the code (PHP)
Recently viewed articles
UnSub Subscriber
Update Subscriber
Insert Subscriber
Activate Subscriber
Get Subscriber
Can't find your answer here?
Submit ticket here
Want to sign in to Zendesk?
Login to view Your Tickets
Find us on Facebook
Get to know the community
© 2017 All Rights Reserved. Enginemailer™ is a registered trademark of Teneo Technologies Sdn Bhd.Logo
Return to Enginemailer | Logout
Search documentation...
Enginemailer  Subscribers  REST API
Get Custom Field
Avatar Written by Enginemailer Support
Updated 1 year ago
GetCustomField

Get Custom Field List.

URL	https://api.enginemailer.com/restapi/subscriber/emsubscriber/getCustomField
Method	HTTP GET
 

Request Example

Header

<APIKEY> - Value
 

Response

Success Response

{
    "Result":{
        "Status":"OK",
        "StatusCode":"200",
        "Data":[
            {
                "customfield_key":"phone",
                "customfield_type":"phone",
                "customfield_name":"phone",
                "phone_country_code":"MY"
            },
            {
                "customfield_key":"staff_id",
                "customfield_type":"numerical",
                "customfield_name":"staff_id",
                "is_unique":0
            },
            {
                "customfield_key":"branch",
                "customfield_type":"dropdown",
                "customfield_name":"Branch"
            },
            {
                "customfield_key":"Colors",
                "customfield_type":"text",
                "customfield_name":"Colors"
            },
            {
                "customfield_key":"cust_reg_no",
                "customfield_type":"numerical",
                "customfield_name":"Customer Reg No",
                "is_unique":1
            },
            {
                "customfield_key":"exampledaterange",
                "customfield_type":"date",
                "customfield_name":"exampleDateRange",
                "is_daterange":1
            },
            {
                "customfield_key":"services",
                "customfield_type":"checkbox",
                "customfield_name":"Services"
            }
        ]
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

JArray subcategory = new JArray();
subcategory.Add(1);
subcategory.Add(2);
JObject jObject = new JObject();

JArray customfield = new JArray();
JObject customfield1 = new JObject();
JObject customfield2 = new JObject();

customfield1.Add("customfield_key", "branch");
customfield1.Add("customfield_value", "Sydney");
customfield.Add(customfield1);

customfield2.Add("customfield_key", "mobile");
customfield2.Add("customfield_value", "+60123456789");
customfield.Add(customfield2);

customfield3.Add("customfield_key", "hobbies");
customfield3.Add("customfield_value", "Eating|Sleeping");
customfield.Add(customfield3);

jObject.Add("email", "ryannn23@weblite.com.my");
jObject.Add("subcategories", subcategory);
jObject.Add("customfields", customfield);
var client = new RestClient("http://api.enginemailer.com/RESTAPI/subscriber/emsubscriber/updateSubscriber");

var request = new RestRequest(Method.POST);
request.AddHeader("APIKey", "<>");
request.AddParameter("email", jObject.ToString(), ParameterType.RequestBody);
var response = client.Execute(request).Content;
var response2 = JObject.Parse(response);
 

Facebook Twitter LinkedIn
Print Friendly and PDF
Was this article helpful?
 
0 out of 0 found this helpful
Have more questions? Submit a request
Articles in this section
Get Subscriber
Activate Subscriber
Subscriber REST API - GETTING STARTED
Insert Subscriber
Update Subscriber
UnSub Subscriber
Get Sub Category
Create Update Category
Get Custom Field
Batch Update Subscribers
See more
Related articles
Batch Update Subscribers
Get Subscriber
Insert Subscriber
Activate Subscriber
Subscriber REST API - GETTING STARTED
Recently viewed articles
Create Update Category
UnSub Subscriber
Update Subscriber
Insert Subscriber
Activate Subscriber
Can't find your answer here?
Submit ticket here
Want to sign in to Zendesk?
Login to view Your Tickets
Find us on Facebook
Get to know the community
© 2017 All Rights Reserved. Enginemailer™ is a registered trademark of Teneo Technologies Sdn Bhd.