import React, { useContext, useEffect, useState } from "react";
import { SocketContext } from "../Provider/SocketContext";
import axios from "axios";
import URL from "../url";
import { AuthContext, UserInfo } from "../Provider/Auth_provider";
const Card = () => {
  const { conn, setConn } = useContext(SocketContext);
  const [messageclient, setMessageclient] = useState<any[]>([]);
  if (conn === null) {
    console.log("koneksi error");
    return null; // Return early if there's no WebSocket connection
  }
  const id = conn.url.split("/")[5];

  const fetchContact = async () => {
    try {
      const response = await axios.get(`${URL}/ws/GetMessage/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const datas = response.data;
      setMessageclient(datas);
      console.log("data : ", datas);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    console.log("data conn : ", id);
    fetchContact();
    const interval = setInterval(fetchContact, 5000); // Auto update data every 1 second
    return () => clearInterval(interval); // Clear interval when component unmounts
  }, []);

  return (
    <>
      {messageclient.map((message: any, index: number) => {
        if (message.content === "A new user has been joined") {
          return <div></div>;
        } else if (message.content === "User left the chat") {
          return <div></div>;
        } else {
          return (
            <div
              className=" w-full h-auto card card-side bg-yellow-500 py-5 my-5 break-all hyphens-auto"
              key={index}
            >
              <div className=" flex flex-row w-full justify-between text-black bg-red-500">
                <div className=" flex w-10 bg-blue-700">
                  <h1>{message.username}</h1>
                </div>
                <div className=" flex w-full py-5 justify-center px-5">
                  <p className=" text-center ">{message.content}</p>
                </div>
                <div className=" flex w-10 bg-slate-600">
                  <p>12m</p>
                </div>
              </div>
            </div>
          );
        }
      })}
    </>
  );
};

export default Card;
