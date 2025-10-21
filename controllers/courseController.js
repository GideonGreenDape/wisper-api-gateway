const Course = require('../models/Course');
const Earning = require('../models/Earning');

exports.createCourse = async (req, res) => {
  try {
    const { title, description, price, image } = req.body;
    if (!title) return res.status(400).json({ message: 'Title required' });
    const course = new Course({ owner: req.auth_id, title, description, price, image });
    await course.save();

    // record earning when course listed
    const listingFee = Number(process.env.COURSE_LISTING_FEE || 0);
    if (listingFee > 0) {
      await Earning.create({ user: req.auth_id, amount: listingFee, transactionType: 'course_listing' });
    }

    res.status(201).json(course);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Create course failed' });
  }
};

exports.getCourses = async (req, res) => {
  const courses = await Course.find({ owner: req.auth_id }).sort({ createdAt: -1 });
  res.json(courses);
};

exports.updateCourse = async (req, res) => {
  try {
    const updates = req.body;
    updates.updatedAt = new Date();
    const course = await Course.findOneAndUpdate({ _id: req.params.id, owner: req.auth_id }, updates, { new: true });
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
};
