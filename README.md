# Lumberyard

## Tests

```
mocha
```

## .env

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
INCOMING_QUEUE_URL=
AWS_QUEUE_REGION=

WEBMAKER_URL=

SPREADSHEET_KEY=
GOOGLE_USERNAME= (any valid google username/email, required for tests to pass)
GOOGLE_PASSWORD= (any valid password, required for tests to pass)

## Workers

### Mailer

This worker allows you to send HTML emails to any number of recipients.

#### Notification message

Event type: 'mailer'

Data:

'From' should be a string of the form `Full Name <email@something.com>` or `email@something.com`. 'To' can be an array or a string.

```js
{
  from: 'help@webmaker.org',
  to: ['email1@blda23ah.com', 'email2@asd23dasdas.com'],
  subject: 'A subject for the email',
  html: '<h1>This is the email body</h1><p>lorem ipsum...</p>'
}
```

Test command:

```shell
aws sqs send-message --queue-url  https://sqs.us-east-1.amazonaws.com/<<QUEUE NAME>> --message-body '{"event_type":"mailer","data":{"from":"help@webmaker.org","to":["<<YOUREMAIL>>"],"subject":"A subject for the email","html":"<h1>This is the email body</h1><p>lorem ipsum...</p>"}}'
```

### Google Spreadsheet

This worker allows you add a row to any Google spreadsheet with basic auth.

#### Notification message

Event type: 'google_spreadsheet'

Data:

Field names should correspond to column headers converted to **lowercase with no spaces or underscores**

E.g. CREATED_AT, Created at, CreatedAt all become `createdat`

In addition to any row data you add, an automatically generated `createdat` field will also be added to the document if it has a column with that name.

```js
{
  userId: '102321', // Include this if the event counts as a contribution
  spreadsheet: '1swJ87dr03nxhYvn7uJoWpybE3kcLV2bW3OGoJ-H-z3o', // Google spreadsheet ID
  worksheet: 0, // Google worksheet ID
  row: {
    email: 'help@webmaker.org',
    username: 'testuser',
    language: 'English',
    link: 'blah.com',
    webliteracy: 'weblit-Security'
  }
}

```

Test command:

```shell
aws sqs send-message --queue-url https://sqs.us-east-1.amazonaws.com/<<QUEUE NAME>> --message-body '{"event_type":"google_spreadsheet","data":{"spreadsheet":"1swJ87dr03nxhYvn7uJoWpybE3kcLV2bW3OGoJ-H-z3o","worksheet":0,"row":{"email":"help@webmaker.org","username":"testuser","language":"English","link":"blah.com","webliteracy":"weblit-Security"}}}'
```

