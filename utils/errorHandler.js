export default function handleServerError(res, err) {
  // Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    const key = Object.keys(err.keyValue)[0];
    return res.status(400).send(`The ${key} provided already exists.`);
  }

  // Mongoose invalid ObjectId error (e.g., invalid ID format in URL)
  if (err.name === "CastError") {
    return res.status(400).send(`Invalid format for field: ${err.path}`);
  }

  // General fallback for all other errors
  return res.status(500).send("Server error: " + err.message);
};