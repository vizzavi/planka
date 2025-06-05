module.exports = function defineChatMessagesHook(sails) {
  const messagesByBoardId = new Map();
  return {
    initialize(cb) {
      sails.log.info('Initializing custom hook (`chat-messages`)');
      return cb();
    },
    addMessage(message) {
      const boardId = message.boardId;
      const arr = messagesByBoardId.get(boardId) || [];
      arr.push(message);
      if (arr.length > 50) {
        arr.shift();
      }
      messagesByBoardId.set(boardId, arr);
    },
    getMessages(boardId) {
      return messagesByBoardId.get(boardId) || [];
    },
  };
};
