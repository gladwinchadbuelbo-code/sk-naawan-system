const Attendance = require('../models/attendance.model');
const Event = require('../models/event.model');
const { logTransaction } = require('../services/transaction_log.service');

// @desc    Record Attendance (Manual or QR)
// @route   POST /api/attendance
exports.recordAttendance = async (req, res) => {
  console.log('--- RECORD ATTENDANCE START ---');
  console.log('Request Body:', req.body);

  const { event_id, participant_name, qr_code_used } = req.body;

  try {
    if (!event_id || !participant_name) {
      console.warn('Record Attendance Validation Failure: Missing event_id or participant_name');
      return res.status(400).json({ message: 'Event ID and participant name are required.' });
    }

    const event = await Event.findByPk(event_id);
    if (!event) {
      console.warn(`Event not found for ID: ${event_id}`);
      return res.status(404).json({ message: 'Event not found' });
    }

    const attendance = await Attendance.create({
      event_id,
      participant_name,
      qr_code_used: qr_code_used || false,
      recorded_by: req.user.id,
      time_in: new Date()
    });

    console.log(`✅ Attendance recorded for: ${participant_name} in event ID ${event_id}`);

    // Audit Logging
    await logTransaction({
      user_id: req.user.id,
      action_type: 'ATTENDANCE_RECORD',
      description: `Recorded attendance for "${participant_name}" in event "${event.title}" (QR: ${qr_code_used || false})`,
      related_record_id: attendance.id
    });

    res.status(201).json(attendance);
  } catch (error) {
    console.error('❌ Record Attendance Error:', error);
    res.status(500).json({ message: 'Error saving attendance record to database: ' + error.message });
  } finally {
    console.log('--- RECORD ATTENDANCE END ---');
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
    res.status(200).json(records);
  } catch (error) {
    console.error('❌ Get Event Attendance Error:', error);
    res.status(500).json({ message: 'Error fetching attendance records: ' + error.message });
  }
};

// @desc    Remove Attendance Record
// @route   DELETE /api/attendance/:id
exports.removeAttendance = async (req, res) => {
  console.log(`Removing attendance ID: ${req.params.id}`);
  try {
    const record = await Attendance.findByPk(req.params.id);
    if (!record) {
      console.warn(`Attendance record not found for ID: ${req.params.id}`);
      return res.status(404).json({ message: 'Record not found' });
    }

    const event = await Event.findByPk(record.event_id);
    const participantName = record.participant_name;

    await record.destroy();
    console.log('✅ Attendance record removed successfully');

    // Audit Logging
    await logTransaction({
      user_id: req.user.id,
      action_type: 'ATTENDANCE_REMOVE',
      description: `Removed attendance record for "${participantName}" in event "${event ? event.title : 'Unknown'}"`,
      related_record_id: req.params.id
    });

    res.status(200).json({ message: 'Attendance record removed successfully.' });
  } catch (error) {
    console.error('❌ Remove Attendance Error:', error);
    res.status(500).json({ message: 'Error deleting attendance record: ' + error.message });
  }
};
