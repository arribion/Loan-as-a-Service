import cron from "node-cron";

export default function ping_onrender() {
    cron.schedule("* * * * *", () => {
      try {
        console.log(
          `[${new Date().toISOString()}] Running a backend server ping...`,
        );
      } catch (error) {
        console.log("error activating onrender backend server...");
        console.log("ERROR: ", error);
      }
    });
}