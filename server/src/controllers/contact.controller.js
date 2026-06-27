import Contact from '../models/Contact.js';
import { asyncHandler } from '../middleware/error.middleware.js';

// POST /api/contact — public contact form submission
export const submitContact = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;
  const entry = await Contact.create({ name, email, subject, message });
  res.status(201).json({ message: 'Thanks for reaching out! We will get back to you soon.', id: entry._id });
});

// GET /api/contact — admin: list submissions
export const listContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find().sort('-createdAt');
  res.json({ count: contacts.length, contacts });
});

// PATCH /api/contact/:id — admin: mark handled
export const markHandled = asyncHandler(async (req, res) => {
  const contact = await Contact.findByIdAndUpdate(
    req.params.id,
    { handled: true },
    { new: true }
  );
  if (!contact) {
    res.status(404);
    throw new Error('Submission not found');
  }
  res.json({ contact });
});
