module.exports = {
  parseDateTime: (
    inputDate,
    dateTimeSeparator = ' ',
    dateSeparator = '-',
    timeSeparator = ':'
  ) => {
    try {
      // Parse date and time
      const [date, time] = inputDate.split(dateTimeSeparator);

      // Parse year, month, day
      const [year, month, day] = date.split(dateSeparator);

      // Parse hours, mins, secs
      const [hours, mins, secs] = time.split(timeSeparator);

      return new Date(year, month, day, hours, mins, secs);
    } catch (error) {
      return null;
    }
  },
};
