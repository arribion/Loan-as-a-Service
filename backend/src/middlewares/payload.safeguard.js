
// const payloadSafeguard = (req, res, next) => {
//   const { check } = req.body;
//   if (typeof check === "string") {
//     try {
//       let parsed = req.body;
//       // Loop handles multiple layers of stringification if they exist
//       while (typeof parsed === "string") {
//         parsed = JSON.parse(parsed);
//       }
//       req.body = parsed;
//     } catch (err) {
//       return res.status(400).json({ error: "Malformed JSON payload" });
//     }
//   }
//   next();
// };

// export default payloadSafeguard;

