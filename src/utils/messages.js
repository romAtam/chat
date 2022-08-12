const sendMessage = (message, name) => {
  const date = new Date().getTime();
  return { message, date, name };
};
module.exports = { sendMessage };
