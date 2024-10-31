import React, { useState } from 'react';
import './ChatPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faUserCircle, faCog, faTh, faSignOutAlt, faTrash, faEllipsisV, faEdit } from '@fortawesome/free-solid-svg-icons';
import { ReactComponent as SendIcon } from './assets/icons/send.svg'; // Import your SVG icon for the send button
import { ReactComponent as MedicalIcon } from './assets/icons/symbol.svg'; // Import your SVG icon here



function Sidebar({ conversations, onSelectConversation,currentConversationIndex,onRenameConversation, onDeleteConversation, isOpen, onClearConversation }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const [editMode, setEditMode] = useState(null);

  const handleMenuToggle = (index) => {
    if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
    }
  };

  const handleRenameClick = (index) => {
    setEditMode(index);
    setActiveIndex(null); // Ẩn menu sau khi nhấn "Rename"
  };

  const handleRenameBlur = (index) => {
    setEditMode(null); // Thoát chế độ chỉnh sửa khi mất focus
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <h2>Conversations</h2>
      <ul>
        {conversations.map((conv, index) => (
          <li key={index} 
          className={`conversation-item ${index === currentConversationIndex ? 'active' : ''}`}
          onClick={() => onSelectConversation(index)}>

            
            {editMode === index ? (
              <input
                type="text"
                value={conv.name}
                onChange={(e) => onRenameConversation(index, e.target.value)}
                onBlur={() => handleRenameBlur(index)} // Kết thúc chỉnh sửa khi mất focus
                autoFocus
                style={{ width: '80%', border: 'none', background: 'transparent', padding: '5px' }}
              />
            ) : (
              <span onClick={() => onSelectConversation(index)} style={{ width: '80%', cursor: 'pointer' }}>
                {conv.name}
              </span>
            )}
            <FontAwesomeIcon
              icon={faEllipsisV}
              className="menu-icon"
              onClick={() => handleMenuToggle(index)}
            />
            {activeIndex === index && (
              <div className="options-menu">
                <button className="option-button" onClick={() => handleRenameClick(index)}>
                  <FontAwesomeIcon icon={faEdit} className="option-icon" /> Rename
                </button>
                <button className="option-button" onClick={() => onDeleteConversation(index)}>
                  <FontAwesomeIcon icon={faTrash} className="option-icon" /> Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
      <button onClick={onClearConversation} className="clear-conversation-button">Clear All Conversations</button>
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

  const handleDeleteConversation = (index) => {
    const updatedConversations = conversations.filter((_, i) => i !== index);
    setConversations(updatedConversations);
    setCurrentConversationIndex(0);
  };

  const handleClearConversation = () => {
    const updatedConversations = conversations.map((conv) => ({ ...conv, messages: [] }));
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
        currentConversationIndex={currentConversationIndex} // Pass current index as a prop
        isOpen={isSidebarOpen}
        onRenameConversation={handleRenameConversation}
        onDeleteConversation={handleDeleteConversation}
        onClearConversation={handleClearConversation}
      />

      <div className={`chat-container ${isSidebarOpen ? 'with-sidebar' : 'full-width'}`}>
        {/* Title and Icon */}
        <div className="chat-header">
          <MedicalIcon className="medical-icon" />
          <h2>Medical ChatBot</h2>
        </div>

        {/* Chat Window */}
        <div className="chat-window">
          {currentConversation.messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
        </div>

        {/* Message Input Box */}
        <div className="chat-input-container">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="chat-input"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button onClick={handleSendMessage} className="send-button">
            <SendIcon className="send-icon" />
          </button>
          <button onClick={handleNewConversation} className="new-conversation-button">New Conversation</button>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
