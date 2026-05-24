const Announcement = require('../models/announcement.model');
const User = require('../models/user.model');

// @desc    Create a new announcement
// @route   POST /api/announcements
exports.createAnnouncement = async (req, res) => {
  console.log('--- CREATE ANNOUNCEMENT START ---');
  try {
    const { title, summary, content, category, date } = req.body;

    if (!title || !summary || !category) {
      return res.status(400).json({ success: false, message: 'Title, summary, and category are required.' });
    }

    const announcement = await Announcement.create({
      title,
      summary,
      content: content || summary,
      category,
      date: date || new Date(),
      created_by: req.user.id,
      created_by_role: req.user.role
    });

    console.log('✅ Announcement created:', announcement.id);
    res.status(201).json({ success: true, data: announcement });
  } catch (error) {
    console.error('Create Announcement Error:', error);
    res.status(500).json({ success: false, message: 'Error creating announcement: ' + error.message });
  }
};

// @desc    Get all announcements
// @route   GET /api/announcements
exports.getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.findAll({
      include: [{ model: User, as: 'author', attributes: ['full_name', 'role'] }],
      order: [['created_at', 'DESC']]
    });
    res.status(200).json({ success: true, data: announcements });
  } catch (error) {
    console.error('Get Announcements Error:', error);
    res.status(500).json({ success: false, message: 'Error fetching announcements: ' + error.message });
  }
};

// @desc    Get announcement by ID
// @route   GET /api/announcements/:id
exports.getAnnouncementById = async (req, res) => {
  try {
    const announcement = await Announcement.findByPk(req.params.id, {
      include: [{ model: User, as: 'author', attributes: ['full_name', 'role'] }]
    });

    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found.' });
    }

    res.status(200).json({ success: true, data: announcement });
  } catch (error) {
    console.error('Get Announcement By ID Error:', error);
    res.status(500).json({ success: false, message: 'Error fetching announcement: ' + error.message });
  }
};

// @desc    Update an announcement
// @route   PATCH /api/announcements/:id
exports.updateAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByPk(req.params.id);
    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found.' });
    }

    const { title, summary, content, category, date } = req.body;
    if (title) announcement.title = title;
    if (summary) announcement.summary = summary;
    if (content) announcement.content = content;
    if (category) announcement.category = category;
    if (date) announcement.date = date;

    await announcement.save();
    console.log('✅ Announcement updated:', announcement.id);
    res.status(200).json({ success: true, data: announcement });
  } catch (error) {
    console.error('Update Announcement Error:', error);
    res.status(500).json({ success: false, message: 'Error updating announcement: ' + error.message });
  }
};

// @desc    Delete an announcement
// @route   DELETE /api/announcements/:id
exports.deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByPk(req.params.id);
    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found.' });
    }

    await announcement.destroy();
    console.log('✅ Announcement deleted:', req.params.id);
    res.status(200).json({ success: true, message: 'Announcement deleted successfully.' });
  } catch (error) {
    console.error('Delete Announcement Error:', error);
    res.status(500).json({ success: false, message: 'Error deleting announcement: ' + error.message });
  }
};
