import { useState, useEffect, useRef, useCallback } from 'react';
import socket from '../socket';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import styles from './ChatWindow.module.css';

export default function ChatWindow({ activeChannel, username }) {
  const [messages, setMessages] = useState([]);
  const prevChannel = useRef(null);

  useEffect(() => {
    function onHistory({ channel, messages: history }) {
      if (channel === activeChannel) setMessages(history);
    }
    function onNewMessage(msg) {
      if (msg.channel === activeChannel) setMessages((prev) => [...prev, msg]);
    }

    socket.on('message_history', onHistory);
    socket.on('new_message', onNewMessage);

    if (prevChannel.current !== activeChannel) {
      prevChannel.current = activeChannel;
      setMessages([]);
    }

    return () => {
      socket.off('message_history', onHistory);
      socket.off('new_message', onNewMessage);
    };
  }, [activeChannel]);

  const handleSend = useCallback((text) => {
    socket.emit('send_message', { channel: activeChannel, text });
  }, [activeChannel]);

  return (
    <div className={styles.window}>
      <MessageList messages={messages} username={username} />
      <MessageInput onSend={handleSend} />
    </div>
  );
}