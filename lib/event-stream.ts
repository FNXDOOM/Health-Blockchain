import { NextResponse } from 'next/server';

export class EventStreamResponse extends NextResponse {
  private encoder = new TextEncoder();
  private stream: TransformStream;
  private writer: WritableStreamDefaultWriter;
  private controller: ReadableStreamDefaultController | null = null;

  constructor() {
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();
    
    super(stream.readable, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

    this.stream = stream;
    this.writer = writer;
  }

  getEventStream(): EventStream {
    return new EventStream(this.writer, this.encoder);
  }

  // Add response getter to fix TypeScript error
  get response(): Response {
    return new Response(this.stream.readable, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  }
}

export class EventStream {
  constructor(
    private writer: WritableStreamDefaultWriter,
    private encoder: TextEncoder
  ) {}

  send(data: string) {
    this.writer.write(this.encoder.encode(`data: ${data}\n\n`));
  }

  close() {
    this.writer.close();
  }
}

// Type definitions for TypeScript
declare global {
  interface ReadableStreamDefaultController {
    error(error?: any): void;
  }

  interface WritableStreamDefaultWriter {
    write(chunk: any): Promise<void>;
    close(): Promise<void>;
  }
}
