const AuditRequest = require('../models/AuditRequest');

// @desc    Submit new audit (Public)
exports.submitAudit = async (req, res, next) => {
  try {
    const audit = await AuditRequest.create(req.body);
    res.status(201).json({ success: true, data: audit });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all audits (Admin Only)
exports.getAudits = async (req, res, next) => {
  try {
    const audits = await AuditRequest.find().sort('-createdAt');
    res.status(200).json({ success: true, data: audits });
  } catch (error) {
    next(error);
  }
};