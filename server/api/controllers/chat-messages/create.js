const { idInput } = require('../../../utils/inputs');

module.exports = {
  inputs: {
    boardId: { ...idInput, required: true },
    text: { type: 'string', required: true, maxLength: 1024 },
  },

  async fn(inputs) {
    const { currentUser } = this.req;

    const board = await Board.qm.getOneById(inputs.boardId);
    if (!board) {
      throw { boardNotFound: 'Board not found' };
    }

    const boardMembership = await BoardMembership.qm.getOneByBoardIdAndUserId(board.id, currentUser.id);
    if (!boardMembership) {
      throw { boardNotFound: 'Board not found' }; // Forbidden
    }

    const message = {
      id: Date.now(),
      boardId: board.id,
      user: sails.helpers.users.presentOne(currentUser, currentUser),
      text: inputs.text,
      createdAt: new Date(),
    };

    sails.hooks['chat-messages'].addMessage(message);

    sails.sockets.broadcast(`board:${board.id}`, 'chatMessageCreate', { item: message }, this.req);

    return { item: message };
  },
};
