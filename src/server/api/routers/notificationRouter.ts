import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { publicProcedure } from "../trpc";

export const notificationRouter = {
  newNotificationCheck: publicProcedure.query(async () => {
    const session = await auth();
    const userId = Number(session?.user.id);

    const data = await db.notification.findFirst({
      where: {
        visited_id: userId,
        checked: false,
      },
      select: {
        checked: true,
      },
    });

    return data === null ? false : true;
  }),
};
