import { NextRequest } from 'next/server';
import { EventStreamResponse, EventStream } from '@/lib/event-stream';
import { getDoctorActivity } from '@/lib/doctor-service';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// Store active connections
const connections = new Map<string, EventStream>();

// Send updates to all connected clients for a doctor
function broadcastToDoctor(doctorId: string, data: any) {
  const connection = connections.get(doctorId);
  if (connection) {
    connection.send(JSON.stringify(data));
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const doctorId = searchParams.get('doctorId');

  if (!doctorId) {
    return new Response('doctorId is required', { status: 400 });
  }

  // Create a new SSE connection
  const stream = new EventStreamResponse();
  const eventStream = stream.getEventStream();
  
  // Store the connection
  connections.set(doctorId, eventStream);
  
  // Send initial data
  try {
    const activity = await getDoctorActivity(doctorId);
    eventStream.send(JSON.stringify({
      type: 'INITIAL_DATA',
      payload: activity
    }));
  } catch (error) {
    console.error('Error sending initial data:', error);
  }

  // Clean up on client disconnect
  request.signal.addEventListener('abort', () => {
    connections.delete(doctorId);
    eventStream.close();
  });

  return stream.response;
}

// Utility function to notify all connected clients of an update
export function notifyDoctorUpdate(doctorId: string, type: string, data: any) {
  broadcastToDoctor(doctorId, {
    type,
    payload: data,
    timestamp: new Date().toISOString()
  });
}

// Example: Notify when a document is uploaded
export function notifyDocumentUpload(doctorId: string, document: any) {
  notifyDoctorUpdate(doctorId, 'DOCUMENT_UPLOADED', document);
}

// Example: Notify when activity is updated
export function notifyActivityUpdate(doctorId: string, activity: any) {
  notifyDoctorUpdate(doctorId, 'ACTIVITY_UPDATE', activity);
}
