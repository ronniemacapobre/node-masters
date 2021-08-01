module.exports = {
  parseDateTime: (
    inputDateTime,
    dateTimeSeparator = ' ',
    dateSeparator = '-',
    timeSeparator = ':'
  ) => {
    try {
      // Parse date and time
      const [date, time] = inputDateTime.split(dateTimeSeparator);

      // Parse year, month, day
      const [year, month, day] = date.split(dateSeparator);

      // Parse hours, mins, secs
      const [hours, mins, secs] = time.split(timeSeparator);

      return new Date(`${year}-${month}-${day} ${hours}:${mins}:${secs}`);
    } catch {
      return null;
    }
  },
  parseDate: (inputDate, isWholeDay = true, dateSeparator = '_') => {
    try {
      const [year, month, day] = inputDate.split(dateSeparator);
      return new Date(
        `${year}-${month}-${day} ${isWholeDay ? '23:59:59' : '00:00:00'}`
      );
    } catch {
      return null;
    }
  },
};
