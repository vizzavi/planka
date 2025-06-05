const { idInput } = require('../../../utils/inputs');

module.exports = {
  inputs: {
    boardId: { ...idInput, required: true },
  },

  async fn(inputs) {
    const board = await Board.qm.getOneById(inputs.boardId);
    if (!board) {
      throw { boardNotFound: 'Board not found' };
    }

    const messages = sails.hooks['chat-messages'].getMessages(board.id);

    return { items: messages };
  },
};
