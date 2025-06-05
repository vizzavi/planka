import socket from './socket';

export const transformChatMessage = (message) => ({
  ...message,
  ...(message.createdAt && { createdAt: new Date(message.createdAt) }),
});

const getChatMessages = (boardId, data, headers) =>
  socket.get(`/boards/${boardId}/chat-messages`, data, headers).then((body) => ({
    ...body,
    items: body.items.map(transformChatMessage),
  }));

const createChatMessage = (boardId, data, headers) =>
  socket.post(`/boards/${boardId}/chat-messages`, data, headers).then((body) => ({
    ...body,
    item: transformChatMessage(body.item),
  }));

const makeHandleChatMessageCreate = (next) => (body) => {
  next({
    ...body,
    item: transformChatMessage(body.item),
  });
};

export default {
  getChatMessages,
  createChatMessage,
  makeHandleChatMessageCreate,
};
