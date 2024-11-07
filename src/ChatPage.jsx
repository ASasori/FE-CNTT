import React, { useState, useEffect, useRef } from 'react';
import './ChatPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faUserCircle, faCog, faTh, faSignOutAlt, faTrash, faEllipsisV, faEdit } from '@fortawesome/free-solid-svg-icons';
import { ReactComponent as SendIcon } from './assets/icons/send.svg';
import { ReactComponent as MedicalIcon } from './assets/icons/symbol.svg';
import { useNavigate } from 'react-router-dom';


import {
  sendMessageToBackend,
  fetchConversations,
  fetchConversationById,
  createNewConversation,
  renameConversation,
  deleteConversation,
} from './api/chatApi.js';

function Sidebar({ conversations, onSelectConversation, currentConversationIndex, onRenameConversation, onDeleteConversation, isOpen, onClearConversation }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const [editMode, setEditMode] = useState(null);
  const optionsMenuRef = useRef(null);

  const handleMenuToggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleRenameClick = (index) => {
    setEditMode(index);
    setActiveIndex(null); // Hide the menu after clicking "Rename"
  };

  const handleRenameBlur = () => {
    setEditMode(null); // Exit edit mode when focus is lost
  };

  // Close the options menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsMenuRef.current && !optionsMenuRef.current.contains(event.target)) {
        setActiveIndex(null); // Close the menu
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <h2>Conversations</h2>
      <ul>
        {conversations.map((conv, index) => (
          <li
            key={index}
            className={`conversation-item ${index === currentConversationIndex ? 'active' : ''}`}
            onClick={() => onSelectConversation(index)}
          >
            {editMode === index ? (
              <input
                type="text"
                value={conv.name}
                onChange={(e) => onRenameConversation(index, e.target.value)}
                onBlur={handleRenameBlur}
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
              onClick={(e) => {
                e.stopPropagation(); // Prevent the click from triggering the onClick for the li
                handleMenuToggle(index);
              }}
            />
            {activeIndex === index && (
              <div className="options-menu" ref={optionsMenuRef}>
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
  const [conversations, setConversations] = useState([]);
  const [currentConversationIndex, setCurrentConversationIndex] = useState(0);
  const [input, setInput] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();
  const [isModelSwitched, setIsModelSwitched] = useState(false);
  const [selectedModel, setSelectedModel] = useState('Auto');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null); // Tạo ref cho dropdown

  const handleSwitchModelClick = () => {
    setShowDropdown(!showDropdown);
  };
  // Hook để đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleModelSelect = (model) => {
    setSelectedModel(model);
    setShowDropdown(false);
    console.log("Model selected:", model);
  };
  const handleSwitchModel = () => {
    setIsModelSwitched(!isModelSwitched);
    console.log("Model switched:", !isModelSwitched);
    // Thêm logic để chuyển model nếu cần, ví dụ gọi API hoặc thay đổi trạng thái
  };
  useEffect(() => {
    const loadConversations = async () => {
      try {
        const fetchedConversations = await fetchConversations();
        setConversations(fetchedConversations);
        const savedIndex = localStorage.getItem('selectedConversationIndex');
        setCurrentConversationIndex(
          savedIndex !== null && savedIndex < fetchedConversations.length
            ? parseInt(savedIndex, 10)
            : 0
        );
      } catch (error) {
        console.error('Failed to load conversations:', error);
      }
    };

    loadConversations();
  }, []);

  useEffect(() => {
    console.log('useEffect chạy để tải tin nhắn cuộc hội thoại');
    const loadConversation = async () => {
      if (currentConversationIndex >= 0 && conversations.length > 0) {
        const conversationId = conversations[currentConversationIndex].id;
        try {
          let messages = await fetchConversationById(conversationId);
          // Log each message with a distinction between user and chatbot
          messages = messages.reverse();
          messages.forEach((msg, index) => {
            console.log(`Message ${index + 1}:`, msg.sender === 'user' ? 'User' : 'Chatbot', '-', msg.text);
          });
          setConversations(prevConversations => {
            const updatedConversations = [...prevConversations];
            updatedConversations[currentConversationIndex].messages = messages;
            return updatedConversations;
          });
        } catch (error) {
          console.error('Failed to load conversation messages:', error);
        }
      }
    };

    loadConversation();
  }, [currentConversationIndex, conversations.length, conversations[currentConversationIndex]?.messages.length]);
  //}, [currentConversationIndex, conversations]);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);

  const handleSendMessage = async () => {
    if (input.trim()) {
      const conversationId = conversations[currentConversationIndex]?.id;

      // Thêm tin nhắn của người dùng vào cuộc trò chuyện
      setConversations(prevConversations => {
        const updatedConversations = [...prevConversations];
        updatedConversations[currentConversationIndex].messages.push({
          text: input.trim(),
          sender: 'user',
        });
        return updatedConversations;
      });

      // Xóa trường nhập liệu
      setInput('');

      // Thêm chỉ báo "typing"
      setIsWaitingForResponse(true); // Bắt đầu trạng thái đợi phản hồi
      setConversations(prevConversations => {
        const updatedConversations = [...prevConversations];
        updatedConversations[currentConversationIndex].messages.push({
          text: 'Đang chờ phản hồi...', // Thông báo hiển thị
          sender: 'typing',
        });
        return updatedConversations;
      });

      try {
        // Gửi tin nhắn tới backend và đợi phản hồi
        const response = await sendMessageToBackend(input.trim(), conversationId);

        // Cập nhật cuộc trò chuyện với phản hồi từ chatbot
        setConversations(prevConversations => {
          const updatedConversations = [...prevConversations];
          const messages = updatedConversations[currentConversationIndex].messages;

          // Xóa chỉ báo "typing"
          messages.pop();

          // Thêm phản hồi thực tế từ chatbot
          messages.push({
            text: response,
            sender: 'bot',
          });

          return updatedConversations;
        });
      } catch (error) {
        console.error('Error sending message:', error);

        // Xóa chỉ báo "typing" nếu có lỗi
        setConversations(prevConversations => {
          const updatedConversations = [...prevConversations];
          updatedConversations[currentConversationIndex].messages.pop();
          return updatedConversations;
        });
      } finally {
        setIsWaitingForResponse(false); // Kết thúc trạng thái đợi phản hồi
      }
    }
  };



  const handleNewConversation = async () => {
    try {
      const newConversation = await createNewConversation();
      setConversations([newConversation, ...conversations]);
      setCurrentConversationIndex(0);
    } catch (error) {
      console.error('Error creating a new conversation:', error);
    }
  };

  const handleRenameConversation = async (index, newName) => {
    try {
      const updatedName = await renameConversation(conversations[index].id, newName);
      setConversations(prevConversations => {
        const updatedConversations = [...prevConversations];
        updatedConversations[index].name = updatedName;
        return updatedConversations;
      });
    } catch (error) {
      console.error('Error renaming conversation:', error);
    }
  };

  const handleDeleteConversation = async (index) => {
    try {
      await deleteConversation(conversations[index].id);
      setConversations(conversations.filter((_, i) => i !== index));
      setCurrentConversationIndex(conversations.length > 0 ? 0 : -1);
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    alert('You have been logged out.');
    navigate('/login');
  };
  const handleSelectConversation = (index) => {
    setCurrentConversationIndex(index);
    localStorage.setItem('selectedConversationIndex', index); // Lưu vào localStorage
  };

  const handleClearConversation = () => {
    const updatedConversations = conversations.map((conv) => ({ ...conv, messages: [] }));
    setConversations(updatedConversations);
  };

  const currentConversation = conversations[currentConversationIndex] || null;


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
          {currentConversation && currentConversation.messages.length > 0 ? (
            currentConversation.messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.sender === 'user' ? 'user-message' : 'chatbot-response'}`}
              >
                {/* {msg.text} */}
                {msg.text.split("\n").map((line, lineIndex) => (
                  <div key={lineIndex}>{line}</div> // Each line is displayed in a separate <div>
                ))}
              </div>
            ))
          ) : (
            <p>No messages yet. Start a conversation!</p> // Hiển thị khi không có tin nhắn
          )}
          {isWaitingForResponse && (
            <div className="waiting-indicator">
              <span>🤖 Đang chờ phản hồi từ chatbot...</span>
            </div>
          )}
          <div className="chat-header">
            {/* Thêm SVG vào trong header */}
            <button onClick={handleSwitchModelClick} className="switch-model-button">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="icon-md"
              >
                <path
                  d="M3.06957 10.8763C3.62331 6.43564 7.40967 3 12 3C14.2824 3 16.4028 3.85067 18.0118 5.25439V4C18.0118 3.44772 18.4595 3 19.0118 3C19.5641 3 20.0118 3.44772 20.0118 4V8C20.0118 8.55228 19.5641 9 19.0118 9H15C14.4477 9 14 8.55228 14 8C14 7.44772 14.4477 7 15 7H16.9571C15.6757 5.76379 13.9101 5 12 5C8.43108 5 5.48466 7.67174 5.0542 11.1237C4.98586 11.6718 4.48619 12.0607 3.93815 11.9923C3.39011 11.924 3.00123 11.4243 3.06957 10.8763ZM20.0618 12.0077C20.6099 12.076 20.9988 12.5757 20.9304 13.1237C20.3767 17.5644 16.5903 21 12 21C9.72322 21 7.60762 20.1535 5.99999 18.7559V20C5.99999 20.5523 5.55228 21 4.99999 21C4.44771 21 3.99999 20.5523 3.99999 20V16C3.99999 15.4477 4.44771 15 4.99999 15H8.99999C9.55228 15 9.99999 15.4477 9.99999 16C9.99999 16.5523 9.55228 17 8.99999 17H7.04285C8.32433 18.2362 10.0899 19 12 19C15.5689 19 18.5153 16.3283 18.9458 12.8763C19.0141 12.3282 19.5138 11.9393 20.0618 12.0077Z"
                  fill="currentColor"
                ></path>
              </svg>
            </button>
            {showDropdown && (
              <div className="model-dropdown" ref={dropdownRef}>
                <ul>
                  <li onClick={() => handleModelSelect('Gemini')}>Gemini</li>
                  <li onClick={() => handleModelSelect('GPT-3.5')}>GPT-3.5</li>
                  <li onClick={() => handleModelSelect('Auto')}>Auto</li>
                </ul>
              </div>
            )}
          </div>

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