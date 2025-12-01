const Course = require('../models/Course');
const Earning = require('../models/Earning');
const {AdminNotification, sendSignupEmailInternal} = require('../utils/mailer');

exports.createCourse = async (req, res) => { 
  try {
    const { title, description, price } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title required' });
    }

    const newCourseData = {
      owner: req.auth_id,
      title,
      description,
      price,
    };

    
    if (req.file) {
      const imageUrl = `/uploads/courseImages/${req.file.filename}`;
      newCourseData.image = imageUrl;
    }

    const course = new Course(newCourseData);
    await course.save();

    const listingFee = Number(process.env.COURSE_LISTING_FEE || 0);
    const emailResponse = await AdminNotification({ to: 'chisomalaoma@gmail.com' });
    console.log(emailResponse);
   await AdminNotification({ to: 'gideoniboyi87@gmail.com' });
    if (listingFee > 0) {
      await Earning.create({
        user: req.auth_id,
        amount: listingFee,
        transactionType: 'course_listing',
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Course created successfully',
      course,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Create course failed' });
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
