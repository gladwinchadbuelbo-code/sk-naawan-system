const Attendance = require('../models/attendance.model');
const Event = require('../models/event.model');

// @desc    Record Attendance (Manual or QR)
// @route   POST /api/attendance
exports.recordAttendance = async (req, res) => {
  const { event_id, participant_name, qr_code_used } = req.body;

  try {
    const event = await Event.findByPk(event_id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const attendance = await Attendance.create({
      event_id,
      participant_name,
      qr_code_used: qr_code_used || false,
      recorded_by: req.user.id,
      time_in: new Date()
    });

    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Attendance for an Event
// @route   GET /api/attendance/event/:id
exports.getEventAttendance = async (req, res) => {
  try {
    const records = await Attendance.findAll({
      where: { event_id: req.params.id },
      order: [['time_in', 'DESC']]
    });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove Attendance Record
// @route   DELETE /api/attendance/:id
exports.removeAttendance = async (req, res) => {
  try {
    const record = await Attendance.findByPk(req.params.id);
    if (!record) return res.status(404).json({ message: 'Record not found' });

    await record.destroy();
    res.json({ message: 'Attendance record removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
