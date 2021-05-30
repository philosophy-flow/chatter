import React, {useState, useEffect} from 'react';
import {auth, db} from '../firebase';

export default function Chat() {
  const [chatInfo, setChatInfo] = useState({
    user: auth().currentUser,
    username: '',
    chats: [],
    content: '',
    readError: null,
    writeError: null
  });


  // read info from database
  useEffect(() => {
    setChatInfo(chatInfo => ({...chatInfo, readError: null}));

    // sync current chats
    try {
      db.ref('chats').on('value', snapshot => {
        let chats = [];
        snapshot.forEach(snap => {
          chats.push(snap.val());
        });
        setChatInfo(chatInfo => ({...chatInfo, chats: chats}));
      });
    } catch (error) {
      setChatInfo(chatInfo => ({...chatInfo, readError: error.message}));
    }

    // retrieve current user username
    db.ref('users').orderByKey().equalTo(chatInfo.user.uid).once('value', snapshot => {
      const username = snapshot.val()[chatInfo.user.uid].username;
      setChatInfo(chatInfo => ({...chatInfo, username: username}));
    });
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

  function handleLogout() {
    auth().signOut();
  }

  return (
    <div>
      <div className="chat-log">
        {
          chatInfo.chats.map(chat => {
            return (
              <p key={chat.timestamp}>
                <strong>{chat.username}: </strong>{chat.content}
              </p>
            )
          })
        }
      </div>
      <hr/>
      <form className="chat-form" onSubmit={handleSubmit}>
        <input type="text" value={chatInfo.content} onChange={handleChange} />
        <button type="submit">Submit</button>
      </form>
      <div>
        <p>Logged in as: <strong>{chatInfo.username}</strong></p>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <hr/>
      <div>
        <h3>Users online:</h3>
      </div>

    </div>
  );
}
