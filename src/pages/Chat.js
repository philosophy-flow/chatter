import './Chat.css';
import React, {useState, useEffect, useRef} from 'react';
import {auth, db} from '../firebase';

export default function Chat() {
  const [chatInfo, setChatInfo] = useState({
    user: auth().currentUser,
    username: '',
    chats: [],
    usersOnline: [],
    content: '',
    readError: null,
    writeError: null
  });


  // scroll to bottom of chat log when updated
  const logEndRef = useRef(null);
  const scrollToBottom = () => {
    logEndRef.current.scrollIntoView({behavior: 'smooth'});
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatInfo.chats])


  // read info from database
  useEffect(() => {
    setChatInfo(chatInfo => ({...chatInfo, readError: null}));

    // sync current chats + online users
    try {
      db.ref('chats').on('value', snapshot => {
        let chats = [];
        snapshot.forEach(snap => {
          chats.push(snap.val());
        });
        setChatInfo(chatInfo => ({...chatInfo, chats: chats}));
      });

      // set user online in db in case of page refresh
      db.ref(`online/${chatInfo.user.uid}`).set(true);

      
      db.ref('online').on('value', snapshot => {
        let usersOnline = [];
        const dataObject = snapshot.val();

        
        for (const [key, value] of Object.entries(dataObject)) {
          if (value) {
            db.ref('users').orderByKey().equalTo(key).once('value',
            snapshot => {
              const username = snapshot.val()[key].username;
              if (!usersOnline.includes(username)) {
                usersOnline.push(username);
              }
            })
            .then(() => setChatInfo(chatInfo => ({...chatInfo, usersOnline: usersOnline})));
          }
        }
      });
    } catch (error) {
      setChatInfo(chatInfo => ({...chatInfo, readError: error.message}));
    }


    // retrieve current user username
    db.ref('users').orderByKey().equalTo(chatInfo.user.uid).once('value', snapshot => {
      const username = snapshot.val()[chatInfo.user.uid].username;
      setChatInfo(chatInfo => ({...chatInfo, username: username}));
    });

    return () => {
      db.ref('chats').off();
      db.ref('online').off();
    }
  }, [chatInfo.user.uid]);



  // track form input as state
  function handleChange(e) {
    setChatInfo(chatInfo => ({...chatInfo, content: e.target.value}));
  }



  // update db with new chat info on form submission
  function handleSubmit(e) {
    e.preventDefault();
    setChatInfo(chatInfo => ({...chatInfo, writeError: null}));

    db.ref('chats').push({
      content: chatInfo.content,
      timestamp: Date.now(),
      uid: chatInfo.user.uid,
      username: chatInfo.username
    })
    .catch(error =>
        setChatInfo(chatInfo => ({...chatInfo, writeError: error.message}))
    );

    setChatInfo(chatInfo => ({...chatInfo, content: ''}));
  }


  // tracks online status for current user
  const onlineRef = db.ref(`online/${chatInfo.user.uid}`);

  // deauthenticate user + update db 
  function handleLogout() {
    onlineRef.set(false);
    auth().signOut();
  }


  // update online status inside db if user does not log out before ending session
  onlineRef.onDisconnect().set(false);

  return (
    <div className="Chat">
      <div className="chat-logo">CHATTER</div>

      <div className="chat-log">
        {
          chatInfo.chats.map(chat => {
            return (
              <p className="chat-entry" key={chat.timestamp}>
                <span style={chat.username === chatInfo.username ? {color: '#fc466b'} : null}>{chat.username}: </span>
                {chat.content}
              </p>
            )
          })
        }
        <div ref={logEndRef}></div>
      </div>
      
      <form className="chat-form" onSubmit={handleSubmit}>
        <input type="text" placeholder="Say something..." value={chatInfo.content} onChange={handleChange} />
        <button type="submit"><i className="fas fa-arrow-right fa-2x"></i></button>
      </form>
      
      <div className="chat-info-container">
        <div className="chat-profile">
          <p>{chatInfo.username}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>

        <div className="chat-users">
          <h3>Users online:</h3>
          {
            chatInfo.usersOnline.map(user => <p key={user}>{user}</p>)
          }
        </div>
      </div>


    </div>
  );
}
