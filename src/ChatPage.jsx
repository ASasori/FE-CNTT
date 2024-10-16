import React, { useState } from 'react';
import './ChatPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faUserCircle, faCog, faTh, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

function Sidebar({ conversations, onSelectConversation, isOpen, onRenameConversation }) {
  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <h2>Conversations</h2>
      <ul>
        {conversations.map((conv, index) => (
          <li key={index} onClick={() => onSelectConversation(index)}>
            <input
              type="text"
              value={conv.name}
              onChange={(e) => onRenameConversation(index, e.target.value)}
              style={{ width: '100%', border: 'none', background: 'transparent', padding: '5px' }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function ChatPage() {
  const [conversations, setConversations] = useState([{ id: 1, name: 'Conversation 1', messages: [] }]);
  const [currentConversationIndex, setCurrentConversationIndex] = useState(0); 
  const [input, setInput] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); 
  const [isMenuOpen, setIsMenuOpen] = useState(false); 

  const currentConversation = conversations[currentConversationIndex];

  const handleSendMessage = () => {
    if (input.trim()) {
      const updatedConversations = [...conversations];
      updatedConversations[currentConversationIndex].messages.push({
        text: input,
        sender: 'user',
      });
      setConversations(updatedConversations);

      setTimeout(() => {
        const updatedConversations = [...conversations];
        updatedConversations[currentConversationIndex].messages.push({
          text: 'Bot response...',
          sender: 'bot',
        });
        setConversations(updatedConversations);
      }, 1000);

      setInput('');
    }
  };

  const handleSelectConversation = (index) => {
    setCurrentConversationIndex(index);
  };

  const handleNewConversation = () => {
    const newConversation = { id: conversations.length + 1, name: `Conversation ${conversations.length + 1}`, messages: [] };
    setConversations([...conversations, newConversation]);
    setCurrentConversationIndex(conversations.length);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    alert('Logging out...');
  };

  const handleRenameConversation = (index, newName) => {
    const updatedConversations = [...conversations];
    updatedConversations[index].name = newName;
    setConversations(updatedConversations);
  };

  return (
    <div className="chat-page">
      <button onClick={toggleSidebar} className="toggle-sidebar-button">
        <FontAwesomeIcon icon={isSidebarOpen ? faTimes : faBars} />
      </button>

      <div className="user-avatar" onClick={toggleMenu}>
        <FontAwesomeIcon icon={faUserCircle} size="2x" />
      </div>

      {isMenuOpen && (
        <div className="user-menu">
          <ul>
            <li onClick={() => alert('Navigating to settings...')}>
              <FontAwesomeIcon icon={faCog} /> Settings
            </li>
            <li onClick={() => alert('Navigating to dashboard...')}>
              <FontAwesomeIcon icon={faTh} /> Dashboard
            </li>
            <li onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} /> Log out
            </li>
          </ul>
        </div>
      )}

      <Sidebar
        conversations={conversations}
        onSelectConversation={handleSelectConversation}
        isOpen={isSidebarOpen}
        onRenameConversation={handleRenameConversation}
      />
      
      <div className={`chat-container ${isSidebarOpen ? 'with-sidebar' : 'full-width'}`}>
        <div className="chat-window">
          {currentConversation.messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
        </div>
        <div className="chat-input-container">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="chat-input"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button onClick={handleSendMessage} className="send-button">Send</button>
          <button onClick={handleNewConversation} className="new-conversation-button">New Conversation</button>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
