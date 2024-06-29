export const register = async () => {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // we do get a warning - Import trace for requested module:
    const { processQueue } = await import("@/lib/payments-worker/queues");

    try {
      (async () => {
        const x = 0;
        while (x < 1) {
          // Run always
          await processQueue("user_payment");
          await processQueue("admin_escrow");
        }
      })();

      console.log("User Queue Running!");
      console.log("Admin Queue Running!");
    } catch (error) {
      console.error("Failed to start queue processing:", error);
    }
  }
};
