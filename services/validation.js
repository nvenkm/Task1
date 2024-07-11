const z = require("zod");
const signupSchema = z.object({
  username: z
    .string((message = "Username must be a string"))
    .min(3, (message = "Username must be at least 3 characters long")),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, (message = "Password must be at least 6 characters long")),
});

const loginSchema = z.object({
  username: z
    .string((message = "Username must be a string"))
    .min(3, (message = "Username must be at least 3 characters long")),
  password: z
    .string()
    .min(6, (message = "Password must be at least 6 characters long")),
});

module.exports = {
  signupSchema,
  loginSchema,
};
