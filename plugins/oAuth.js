const { google } = require('googleapis');
const { OAuth2 } = google.auth;

// Load your OAuth2 credentials from a file or environment variables
const oauth2Client = new OAuth2(
  '58731885792-kvouebki7nd5n93lrdfa76c89dbdh3kl.apps.googleusercontent.com',
  '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',
  'http://localhost:3000/callback'
);

// Use a token that you’ve obtained from the OAuth flow
oauth2Client.setCredentials({
  refresh_token: 'YOUR_REFRESH_TOKEN',
});

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

// Event to be added
const event = {
  summary: 'Meeting with Client',
  location: '123 Main St',
  description: 'Discuss project scope and deliverables.',
  start: {
    dateTime: '2024-10-20T09:00:00-07:00', // Event start time
    timeZone: 'America/Los_Angeles',
  },
  end: {
    dateTime: '2024-10-20T10:00:00-07:00', // Event end time
    timeZone: 'America/Los_Angeles',
  },
};

// Insert the event
calendar.events.insert(
  {
    calendarId: 'primary', // 'primary' refers to the user's main calendar
    resource: event,
  },
  (err, event) => {
    if (err) {
      console.log('Error adding event to Google Calendar: ', err);
      return;
    }
    console.log('Event created: %s', event.data.htmlLink);
  }
);
