import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Input, Button } from 'semantic-ui-react';

import selectors from '../../selectors';
import api, { socket } from '../../api';

import styles from './Chat.module.scss';

const Chat = React.memo(() => {
  const boardId = useSelector((state) => selectors.selectCurrentBoard(state).id);
  const currentUser = useSelector(selectors.selectCurrentUser);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    let isMounted = true;
    api.getChatMessages(boardId).then(({ items }) => {
      if (isMounted) {
        setMessages(items);
      }
    });
    const handleCreate = ({ item }) => {
      setMessages((prev) => [...prev, item]);
    };
    socket.on('chatMessageCreate', handleCreate);
    return () => {
      isMounted = false;
      socket.off('chatMessageCreate', handleCreate);
    };
  }, [boardId]);

  const handleSubmit = useCallback(() => {
    if (!text.trim()) {
      return;
    }
    api.createChatMessage(boardId, { text }).catch(() => {});
    setText('');
  }, [boardId, text]);

  return (
    <div className={styles.chat}>
      <div className={styles.messages}>
        {messages.map((m) => (
          <div key={m.id} className={styles.message}>
            <b>{m.user.name}</b>: {m.text}
          </div>
        ))}
      </div>
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSubmit();
          }
        }}
        placeholder="Say something"
        action={<Button content="Send" onClick={handleSubmit} />}
        className={styles.input}
      />
    </div>
  );
});

export default Chat;
