import { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios'
import autosize from 'autosize'
import { useRouter } from 'next/router';
import Headerchat from '../chatpage/Headerchat';
import { SocketContext } from '../Provider/SocketContext';
import URL from '../url';
import Chatbuble from '../chatpage/Chatbuble';
import { AuthContext } from '../Provider/Auth_provider';
import { Message, useMessage } from '../Provider/MessageContext';


const Chat = () => {


const [users, setUsers] = useState<Array<{ username : string}>>([]);
const {messages, setMessages} = useMessage()
const [inputMessage, setInputMessage] = useState<string>("");
const textarea = useRef<HTMLTextAreaElement>(null);
const { conn, setConn } = useContext(SocketContext);
const router = useRouter();
const { user } = useContext(AuthContext)

useEffect(() => {
    if (conn === null) {
        router.push("/homeroom")
        console.log("koneksi error")
        return
    }
    const id = conn.url.split("/")[5];
    async function getUsers() {
        try {
           const response = await fetch(`${URL}/ws/GetClients/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
           }) 
           const datas = await response.json();
           console.log("data - data: " + JSON.stringify(datas))
           setUsers(datas);
        } catch (error) {
            console.log(error);
        }
    }
    getUsers();
}, []) //get client in the room
useEffect(() => {
    if (conn === null) {
        router.push("/homeroom");
        console.log("koneksi error2")
        
    } else  if (conn !== null && conn.readyState === WebSocket.OPEN) {
      conn.onmessage = (message) => {
          const m : Message = JSON.parse(message.data);
          if (m.content === 'A new user has been joined') {
              setUsers([...users, { username: m.username }])
          }
          if (m.content === 'A user has been left') {
              setUsers(prevUsers => prevUsers.filter((user) => user.username !== m.username))
              setMessages([...messages, m])
          }
          user.username == m.username ? (m.type = 'self') : (m.type = 'recv')
          setMessages([...messages, m])
      }
      conn.onclose = () => {}
      conn.onerror = () => {}
      conn.onopen = () => {}
    }
}, [textarea, messages, users, conn]) // get websocket

// Implement logic to send a message
// Implement logic to send a message
const sendMessage = async (): Promise<void> => {
    if (!textarea.current?.value) return;
    if (conn === null) {
        router.push("/");
        console.log("koneksi error3")
    } else   if (conn !== null && conn.readyState === WebSocket.OPEN) {
      conn.send(textarea.current.value)
      console.log("input message : ", textarea.current.value);
      textarea.current.value = "";
    }
};
  return (
    <>
    <div className=" inline-flex flex-col h-full py-5 w-[460px] px-5">
      <div className=" mb-5">
        <Headerchat />
      </div>
      <div>
        <Chatbuble data={messages}/>
        <div className=" relative mt-20">
          <div className="join">
            <div className="">
              <div>
                <textarea
                ref={textarea}
                  className="input input-bordered join-item w-80"
                  placeholder="Type a message..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                />
              </div>
            </div>
            <div className="indicator">
              <button className="btn join-item" onClick={sendMessage}>
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
  )
}

export default Chat
