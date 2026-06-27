import Plan from '../models/Plan.js';
import { asyncHandler } from '../middleware/error.middleware.js';

// GET /api/plans — public pricing plans
export const getPlans = asyncHandler(async (req, res) => {
  const plans = await Plan.find().sort('order');
  res.json({ plans });
});

// POST /api/plans — admin
export const createPlan = asyncHandler(async (req, res) => {
  const plan = await Plan.create(req.body);
  res.status(201).json({ plan });
});

// PUT /api/plans/:id — admin
export const updatePlan = asyncHandler(async (req, res) => {
  const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!plan) {
    res.status(404);
    throw new Error('Plan not found');
  }
  res.json({ plan });
});

// DELETE /api/plans/:id — admin
export const deletePlan = asyncHandler(async (req, res) => {
  const plan = await Plan.findByIdAndDelete(req.params.id);
  if (!plan) {
    res.status(404);
    throw new Error('Plan not found');
  }
  res.json({ message: 'Plan removed' });
});
