const USERS = [
  {
    id: "u-admin",
    name: "System Admin",
    email: "admin@lifelink.org",
    password: "admin123",
    role: "Admin",
  },
  {
    id: "u-donor",
    name: "Demo Donor",
    email: "donor@lifelink.org",
    password: "donor123",
    role: "Donor",
  },
  {
    id: "u-recipient",
    name: "Demo Recipient",
    email: "recipient@lifelink.org",
    password: "recipient123",
    role: "Recipient",
  },
];

const login = (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");

  const user = USERS.find((candidate) => candidate.email === email && candidate.password === password);
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = Buffer.from(`${user.id}:${user.role}:${Date.now()}`).toString("base64");

  return res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

module.exports = { login };
