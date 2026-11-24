import { prisma } from "@/lib/prisma";

// API route used by the booking page (client) to fetch bookable classes.
export async function GET() {
  const classes = await prisma.class.findMany({
    include: {
      trainer: { select: { name: true } },
      _count: { select: { bookings: true } },
    },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
  });

  return Response.json({ classes });
}
