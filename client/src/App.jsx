import { useState, useEffect, useCallback } from 'react';
import socket from './socket';
import UsernamePrompt from './components/UsernamePrompt';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import styles from './App.module.css';

export default function App() {
  const [username, setUsername]         = useState(null);
  const [channels, setChannels]         = useState([]);
  const [activeChannel, setActiveChannel] = useState('general');
  const [userCounts, setUserCounts]     = useState({});
  const [connected, setConnected]       = useState(false);

  // socket lifecycle
  useEffect(() => {
    socket.on('connect',      () => setConnected(true));
    socket.on('disconnect',   () => setConnected(false));
    socket.on('channels',     (list) => setChannels(list));
    socket.on('user_counts',  (counts) => setUserCounts(counts));

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('channels');
      socket.off('user_counts');
    };
  }, []);

  const handleSetUsername = useCallback((name) => {
    socket.connect();
    socket.once('connect', () => {
      socket.emit('set_username', name, (res) => {
        if (res?.ok) {
          setUsername(res.username);
          socket.emit('join_channel', 'general');
        }
      });
    });
  }, []);

  const handleChannelSelect = useCallback((channelId) => {
    setActiveChannel(channelId);
    socket.emit('join_channel', channelId);
  }, []);

  if (!username) {
    return <UsernamePrompt onSubmit={handleSetUsername} />;
  }

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <span className={styles.logo}>DEVCHAT</span>
        <span className={styles.meta}>
          <span>{username}</span>
          <span className={connected ? styles.online : styles.offline}>
            {connected ? '●' : '○'}
          </span>
        </span>
      </header>

      <div className={styles.body}>
        <Sidebar
          channels={channels}
          activeChannel={activeChannel}
          userCounts={userCounts}
          onSelect={handleChannelSelect}
        />
        <ChatWindow
          activeChannel={activeChannel}
          username={username}
        />
      </div>
    </div>
  );
}