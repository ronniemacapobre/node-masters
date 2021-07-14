const { eventDataAccess } = require('../dataAccess');

const getAllEvents = async (req, res) => {
  const events = await eventDataAccess.getAllEvents();

  res.status(200).send(events);
};

module.exports = {
  getAllEvents,
};
