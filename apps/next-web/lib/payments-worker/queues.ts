import { processUserPaymentQueue, processAdminEscrowQueue } from "./process";
import { Redis } from "./redis";

export const processQueue = async (QUEUE_TYPE: string) => {
  await new Promise<void>(async (resolve) => {
    const response = await Redis.getInstance().fetch(QUEUE_TYPE);
    if (!response) {
      console.log(`Nothing left to process in ${QUEUE_TYPE} queue. Waiting...`);
      await new Promise(() => setTimeout(resolve, 20000));
    } else {
      console.log(`Processing ${QUEUE_TYPE} - ${response}`);

      if (QUEUE_TYPE === "user_payment") {
        await processUserPaymentQueue(JSON.parse(response));
      } else if (QUEUE_TYPE === "admin_escrow") {
        await processAdminEscrowQueue(JSON.parse(response));
      }

      resolve();
    }
  });
};

process.on("uncaughtException", function (err) {
  console.log("Caught exception: " + err);
});
