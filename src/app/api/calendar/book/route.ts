import { NextResponse } from 'next/server';
import { google } from 'googleapis';

const calendar = google.calendar({
  version: 'v3',
  auth: new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    undefined,
    process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    ['https://www.googleapis.com/auth/calendar']
  ),
});

export async function POST(request: Request) {
  try {
    const { date, time } = await request.json();
    
    const [hours, minutes] = time.split(':');
    const startTime = new Date(date);
    startTime.setHours(parseInt(hours), parseInt(minutes), 0);
    
    const endTime = new Date(startTime);
    endTime.setMinutes(startTime.getMinutes() + 30);

    const event = {
      summary: 'Meeting Request',
      start: {
        dateTime: startTime.toISOString(),
        timeZone: 'Europe/Paris',
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: 'Europe/Paris',
      },
    };

    await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      requestBody: event,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Calendar error:', error);
    return NextResponse.json(
      { error: 'Failed to book meeting' },
      { status: 500 }
    );
  }
} 