const Job = require('../models/Job');
const Earning = require('../models/Earning');
const sendJobPostSuccessEmail= require('../utils/mailer').sendJobPostSuccessEmail;
const {AdminNotification} = require('../utils/mailer');



exports.createJob = async (req, res) => {
  try {
    const { title, company, description, jobType, pricePerHour, qualification, applicationMethod, applicationUrl,experienceLevel } = req.body;
    if (!title) return res.status(400).json({ message: 'Title required' });
    
    console.log(title)

    const job = new Job({
      owner: req.auth_id,
      title,
      company,
      description,
      jobType,
      pricePerHour,
      qualification,
      experienceLevel,
      applicationMethod,
      applicationUrl
    });
    await job.save();

    console.log('was successfull here')

    // sendJobPostSuccessEmail(req.auth_email, job.title);

    const emailResponse = await AdminNotification({ to: 'chisomalaoma@gmail.com' });
        console.log(emailResponse);
       await AdminNotification({ to: 'gideoniboyi87@gmail.com' });

    // record earning: when job created (assume a listing fee)
    const listingFee = Number(process.env.JOB_LISTING_FEE || 0);
    if (listingFee > 0) {
      await Earning.create({ user: req.auth_id, amount: listingFee, transactionType: 'job_listing' });
    }

    res.status(201).json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Create job failed' });
  }
};

exports.getJobs = async (req, res) => {
  const jobs = await Job.find({ owner: req.auth_id }).sort({ createdAt: -1 });
  res.json(jobs);
};

exports.updateJob = async (req, res) => {
  try {
    const updates = req.body;
    updates.updatedAt = new Date();
    const job = await Job.findOneAndUpdate({ _id: req.params.id, owner: req.auth_id }, updates, { new: true });
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
};
