import { prisma } from "@/lib/prisma";

export const runtime = 'nodejs';

export async function GET() {
  let interval: NodeJS.Timeout | undefined;
  let hb: NodeJS.Timeout | undefined;
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      const send = (data: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };
      const initial = await prisma.callLog.findMany({ orderBy: { createdAt: 'desc' }, take: 50 });
      send({ type: 'snapshot', items: initial });

      interval = setInterval(async () => {
        const items = await prisma.callLog.findMany({ orderBy: { createdAt: 'desc' }, take: 50 });
        send({ type: 'tick', items });
      }, 3000);

      hb = setInterval(() => controller.enqueue(encoder.encode(`: heartbeat\n\n`)), 15000);
      controller.enqueue(encoder.encode(`event: open\ndata: ok\n\n`));
    },
    cancel() {
      if (interval) clearInterval(interval);
      if (hb) clearInterval(hb);
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  });
}
