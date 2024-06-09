export const register = async () => {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // we do get a warning - Import trace for requested module:
    const { userPayoutWorker, adminEscrowWorker } = await import(
      "@/lib/redis/queues"
    );

    try {
      await userPayoutWorker.waitUntilReady();
      await adminEscrowWorker.waitUntilReady();

      console.log("Admin Worker Running - ", adminEscrowWorker.isRunning());
      console.log("User Worker Running - ", userPayoutWorker.isRunning());

      console.log("Workers ready!");
    } catch (error) {
      console.error("Failed to initialize admin workers:", error);
    }
  }
};
