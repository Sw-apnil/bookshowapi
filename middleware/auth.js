import { clerkClient } from "@clerk/express";

// Middleware to allow ONLY admin users
export const protectAdmin = async (req, res, next) => {
  try {
    // clerkMiddleware() server.js me laga hota hai
    // usi ke through hume authenticated userId milta hai
    const { userId } = req.auth();

    // Clerk se full user details nikaal rahe hain
    // taaki role check kar sakein
    const user = await clerkClient.users.getUser(userId);

    // Role check: sirf admin allowed
    // role Clerk ke privateMetadata me stored hota hai
    if (user.privateMetadata.role !== "admin") {
      // Agar admin nahi hai → request yahin block
      return res.json({
        success: false,
        message: "Not Authorized",
      });
    }

    // Agar admin hai → request ko aage controller tak jaane do
    next();
  } catch (error) {
    // Agar koi bhi error aaye (auth missing, clerk error, etc.)
    // Fail-safe: user ko unauthorized maan lo
    return res.json({
      success: false,
      message: "Not Authorized",
    });
  }
};
