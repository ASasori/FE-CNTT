// import React, { useState,useEffect, useRef } from 'react';
// import './ChatPage.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faBars, faTimes, faUserCircle, faCog, faTh, faSignOutAlt, faTrash, faEllipsisV, faEdit } from '@fortawesome/free-solid-svg-icons';
// import { ReactComponent as SendIcon } from './assets/icons/send.svg'; // Import your SVG icon for the send button
// import { ReactComponent as MedicalIcon } from './assets/icons/symbol.svg'; // Import your SVG icon here
// import axios from 'axios'; // Import axios
// import { API_URL } from './api/apiConfig';
// function Sidebar({ conversations, onSelectConversation, currentConversationIndex, onRenameConversation, onDeleteConversation, isOpen, onClearConversation }) {
//   const [activeIndex, setActiveIndex] = useState(null);
//   const [editMode, setEditMode] = useState(null);
//   const optionsMenuRef = useRef(null);

//   const handleMenuToggle = (index) => {
//     setActiveIndex(activeIndex === index ? null : index);
//   };

//   const handleRenameClick = (index) => {
//     setEditMode(index);
//     setActiveIndex(null); // Hide the menu after clicking "Rename"
//   };

//   const handleRenameBlur = () => {
//     setEditMode(null); // Exit edit mode when focus is lost
//   };

//   // Close the options menu when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (optionsMenuRef.current && !optionsMenuRef.current.contains(event.target)) {
//         setActiveIndex(null); // Close the menu
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);

//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   return (
//     <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
//       <h2>Conversations</h2>
//       <ul>
//         {conversations.map((conv, index) => (
//           <li
//             key={index}
//             className={`conversation-item ${index === currentConversationIndex ? 'active' : ''}`}
//             onClick={() => onSelectConversation(index)}
//           >
//             {editMode === index ? (
//               <input
//                 type="text"
//                 value={conv.name}
//                 onChange={(e) => onRenameConversation(index, e.target.value)}
//                 onBlur={handleRenameBlur}
//                 autoFocus
//                 style={{ width: '80%', border: 'none', background: 'transparent', padding: '5px' }}
//               />
//             ) : (
//               <span onClick={() => onSelectConversation(index)} style={{ width: '80%', cursor: 'pointer' }}>
//                 {conv.name}
//               </span>
//             )}
//             <FontAwesomeIcon
//               icon={faEllipsisV}
//               className="menu-icon"
//               onClick={(e) => {
//                 e.stopPropagation(); // Prevent the click from triggering the onClick for the li
//                 handleMenuToggle(index);
//               }}
//             />
//             {activeIndex === index && (
//               <div className="options-menu" ref={optionsMenuRef}>
//                 <button className="option-button" onClick={() => handleRenameClick(index)}>
//                   <FontAwesomeIcon icon={faEdit} className="option-icon" /> Rename
//                 </button>
//                 <button className="option-button" onClick={() => onDeleteConversation(index)}>
//                   <FontAwesomeIcon icon={faTrash} className="option-icon" /> Delete
//                 </button>
//               </div>
//             )}
//           </li>
//         ))}
//       </ul>
//       <button onClick={onClearConversation} className="clear-conversation-button">Clear All Conversations</button>
//     </div>
//   );
// }

// function ChatPage() {
//   const [conversations, setConversations] = useState([]);
//   const [currentConversationIndex, setCurrentConversationIndex] = useState(0); 
//   const [input, setInput] = useState('');
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true); 
//   const [isMenuOpen, setIsMenuOpen] = useState(false); 

//   const currentConversation = conversations[currentConversationIndex];

//   const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNtMnlma2h5NDAwMDB1cGhkbjZiZXRkcnoiLCJpYXQiOjE3MzA0NTI3ODQsImV4cCI6MTc2MTk4ODc4NH0.e5cwsiOVusdeiWGjt7yLK55VqlnuRswwsCVBYYYvqpY';
  
//   const handleSendMessage = () => {
//     if (input.trim()) {
//       const currentConversationId = conversations[currentConversationIndex]?.id;
  
//       if (currentConversationId) {
//         // Construct the request payload
//         const payload = {
//           boxChatId: currentConversationId,
//           content: input.trim(),
//         };
  
//         // Send the POST request
//         axios.post('https://smart-q-and-a-about-medicine.onrender.com/messenger', payload, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         })
//         .then(response => {
//           // Extract message details from the response
//           const newMessage = {
//             text: response.data.data.content,
//             sender: 'user',
//           };
  
//           // Update the conversation with the new message
//           setConversations(prevConversations => {
//             const updatedConversations = [...prevConversations];
//             updatedConversations[currentConversationIndex].messages = [
//               ...updatedConversations[currentConversationIndex].messages,
//               newMessage
//             ];
//             return updatedConversations;
//           });
  
//           // Clear the input field after sending
//           setInput('');
  
//           // Simulate bot response
//           setTimeout(() => {
//             const botResponse = {
//               text: 'Bot response...',
//               sender: 'bot',
//             };
//             setConversations(prevConversations => {
//               const updatedConversations = [...prevConversations];
//               updatedConversations[currentConversationIndex].messages.push(botResponse);
//               return updatedConversations;
//             });
//           }, 1000);
//         })
//         .catch(error => {
//           console.error('Error sending message:', error);
//         });
//       }
//     }
//   };
  

// // Fetch conversations effect
// useEffect(() => {
//   axios.get('https://smart-q-and-a-about-medicine.onrender.com/box-chat', {
//       headers: {
//           Authorization: `Bearer ${token}`,
//       },
//   })
//   .then(response => {
//       const conversationsData = response.data.data.map(item => ({
//           id: item.boxChatId,
//           name: item.name,
//           messages: []
//       }));
      
//       setConversations(conversationsData);
//      // Kiểm tra nếu có chỉ số được lưu trong localStorage
//      const savedIndex = localStorage.getItem('selectedConversationIndex');
//      if (savedIndex !== null && savedIndex < conversationsData.length) {
//          setCurrentConversationIndex(parseInt(savedIndex, 10)); // Đặt chỉ số được lưu
//      } else if (conversationsData.length > 0) {
//          setCurrentConversationIndex(0); // Chọn box chat đầu tiên nếu không có chỉ số lưu trước đó
//      }
//   })
//   .catch(error => {
//       console.error('Error fetching data:', error);
//   });
// }, [token]); // Fetch conversations only once when the token changes

// // Fetch selected conversation effect
// useEffect(() => {
//   if (currentConversationIndex >= 0 && conversations.length > 0) {
//     const selectedConversationId = conversations[currentConversationIndex]?.id;

//     if (selectedConversationId) {
//       axios.get(`https://smart-q-and-a-about-medicine.onrender.com/box-chat/${selectedConversationId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       })
//       .then(response => {
//         const conversationData = response.data.data;
//         const messages = conversationData.Messenger.map(msg => ({
//           text: msg.content,
//           sender: 'user',
//         }));

//         setConversations(prevConversations => {
//           // Chỉ cập nhật nếu dữ liệu thực sự thay đổi
//           if (JSON.stringify(prevConversations[currentConversationIndex]?.messages) !== JSON.stringify(messages)) {
//             const updatedConversations = [...prevConversations];
//             updatedConversations[currentConversationIndex].messages = messages;
//             return updatedConversations;
//           }
//           return prevConversations;
//         });
//       })
//       .catch(error => {
//         console.error('Error fetching conversation data:', error);
//       });
//     }
//   }
// }, [currentConversationIndex, conversations.length, token]);

//   const handleSelectConversation = (index) => {
//     setCurrentConversationIndex(index);
//     localStorage.setItem('selectedConversationIndex', index); // Lưu vào localStorage
//   };

//   const handleNewConversation = () => {
//     axios.post('https://smart-q-and-a-about-medicine.onrender.com/box-chat', {
//       name: `New Conversation`, // Name of the new conversation
//     }, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })
//     .then(response => {
//       // Get the new conversation data from the response
//       const newConversation = {
//         id: response.data.data.boxChatId, // Adjust the key as needed based on API response structure
//         name: response.data.data.name,
//         messages: []
//       };
  
//       // Update the local state with the new conversation
//       setConversations([...conversations, newConversation]);
//       setCurrentConversationIndex(conversations.length); // Set the current index to the new conversation
//     })
//     .catch(error => {
//       console.error('Error creating a new conversation:', error);
//     });
//   };
  
//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   const handleLogout = () => {
//     alert('Logging out...');
//   };

//   const handleRenameConversation = (index, newName) => {
//     const selectedConversationId = conversations[index].id;
  
//     axios.patch(`https://smart-q-and-a-about-medicine.onrender.com/box-chat/${selectedConversationId}`, {
//       name: newName,
//     }, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })
//     .then(response => {
//       // Update the conversation name in the frontend after a successful response
//       const updatedConversations = [...conversations];
//       updatedConversations[index].name = response.data.data.name;
//       setConversations(updatedConversations);
//     })
//     .catch(error => {
//       console.error('Error updating conversation name:', error);
//     });
//   };
  
//   const handleDeleteConversation = (index) => {
//     const selectedConversationId = conversations[index].id;
  
//     axios.delete(`https://smart-q-and-a-about-medicine.onrender.com/box-chat/${selectedConversationId}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })
//     .then(() => {
//       // Remove the conversation from the local state after a successful API call
//       const updatedConversations = conversations.filter((_, i) => i !== index);
//       setConversations(updatedConversations);
//       // Optionally, reset the current conversation index to the first available conversation or -1 if none
//       setCurrentConversationIndex(updatedConversations.length > 0 ? 0 : -1);
//     })
//     .catch(error => {
//       console.error('Error deleting the conversation:', error);
//     });
//   };
  

//   const handleClearConversation = () => {
//     const updatedConversations = conversations.map((conv) => ({ ...conv, messages: [] }));
//     setConversations(updatedConversations);
//   };

//   return (
//     <div className="chat-page">
//       <button onClick={toggleSidebar} className="toggle-sidebar-button">
//         <FontAwesomeIcon icon={isSidebarOpen ? faTimes : faBars} />
//       </button>

//       <div className="user-avatar" onClick={toggleMenu}>
//         <FontAwesomeIcon icon={faUserCircle} size="2x" />
//       </div>

//       {isMenuOpen && (
//         <div className="user-menu">
//           <ul>
//             <li onClick={() => alert('Navigating to settings...')}>
//               <FontAwesomeIcon icon={faCog} /> Settings
//             </li>
//             <li onClick={() => alert('Navigating to dashboard...')}>
//               <FontAwesomeIcon icon={faTh} /> Dashboard
//             </li>
//             <li onClick={handleLogout}>
//               <FontAwesomeIcon icon={faSignOutAlt} /> Log out
//             </li>
//           </ul>
//         </div>
//       )}

//       <Sidebar
//         conversations={conversations}
//         onSelectConversation={handleSelectConversation}
//         currentConversationIndex={currentConversationIndex} // Pass current index as a prop
//         isOpen={isSidebarOpen}
//         onRenameConversation={handleRenameConversation}
//         onDeleteConversation={handleDeleteConversation}
//         onClearConversation={handleClearConversation}
//       />

//       <div className={`chat-container ${isSidebarOpen ? 'with-sidebar' : 'full-width'}`}>
//         {/* Title and Icon */}
//         <div className="chat-header">
//           <MedicalIcon className="medical-icon" />
//           <h2>Medical ChatBot</h2>
//         </div>

//         {/* Chat Window */}
// <div className="chat-window">
//   {currentConversation && currentConversation.messages.length > 0 ? (
//     currentConversation.messages.map((msg, index) => (
//       <div key={index} className={`message ${msg.sender}`}>
//         {msg.text}
//       </div>
//     ))
//   ) : (
//     <p>No messages yet. Start a conversation!</p> // Hiển thị khi không có tin nhắn
//   )}
// </div>


//         {/* Message Input Box */}
//         <div className="chat-input-container">
//           <input
//             type="text"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder="Type your message..."
//             className="chat-input"
//             onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
//           />
//           <button onClick={handleSendMessage} className="send-button">
//             <SendIcon className="send-icon" />
//           </button>
//           <button onClick={handleNewConversation} className="new-conversation-button">New Conversation</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ChatPage;



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
    const loadConversation = async () => {
      if (currentConversationIndex >= 0 && conversations.length > 0) {
        const conversationId = conversations[currentConversationIndex].id;
        try {
          const messages = await fetchConversationById(conversationId);
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
  }, [currentConversationIndex, conversations.length]);

  const handleSendMessage = async () => {
    if (input.trim()) {
      const conversationId = conversations[currentConversationIndex]?.id;
      try {
        const response = await sendMessageToBackend(input.trim(), conversationId);
        setConversations(prevConversations => {
          const updatedConversations = [...prevConversations];
          updatedConversations[currentConversationIndex].messages.push({
            text: response,
            sender: 'user',
          });
          return updatedConversations;
        });
        setInput('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleNewConversation = async () => {
    try {
      const newConversation = await createNewConversation();
      setConversations([...conversations, newConversation]);
      setCurrentConversationIndex(conversations.length);
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
      <div key={index} className={`message ${msg.sender}`}>
        {msg.text}
      </div>
    ))
  ) : (
    <p>No messages yet. Start a conversation!</p> // Hiển thị khi không có tin nhắn
  )}
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