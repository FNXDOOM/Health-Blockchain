import { NextResponse } from 'next/server';

declare module './event-stream' {
  export class EventStreamResponse extends NextResponse {
    private encoder: TextEncoder;
    private stream: TransformStream;
    private writer: WritableStreamDefaultWriter;
    private controller: ReadableStreamDefaultController | null;
    
    constructor();
    getEventStream(): EventStream;
  }

  export class EventStream {
    constructor(writer: WritableStreamDefaultWriter, encoder: TextEncoder);
    send(data: string): void;
    close(): void;
  }
}
