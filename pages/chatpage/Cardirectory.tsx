import React, { useContext, useEffect, useState } from "react";
import { SocketContext } from "../Provider/SocketContext";
import axios from "axios";
import URL from "../url";
import { AuthContext, UserInfo } from "../Provider/Auth_provider";
const Cardirectory: React.FC = () => {
  const { conn, setConn } = useContext(SocketContext);
  const [usercontact, setUsercontact] = useState<any[]>([]);
  const { user } = useContext(AuthContext);
  if (conn === null) {
    console.log("koneksi error");
    return null; // Return early if there's no WebSocket connection
  }
  const id = conn.url.split("/")[5];

  const fetchContact = async () => {
    try {
      const response = await axios.get(`${URL}/ws/GetClients/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const datas = response.data;
      setUsercontact(datas);
      console.log("data : ", datas);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    console.log("data conn : ", id)
    fetchContact();
      const interval = setInterval(fetchContact, 5000); // Auto update data every 1 second
      return () => clearInterval(interval); // Clear interval when component unmounts
  }, []);
  return (
    <>
      {usercontact.map((userr: UserInfo, index: number) => {
        return (
          <div
            className=" w-full h-full card card-side bg-yellow-500"
            key={index}
          >
            <div className=" flex flex-row gap-x-8 text-black">
              <div>
                <img
                  className=" w-10 h-10 my-2 mx-2 border rounded-lg"
                  src="/iui.jpg"
                  alt=""
                />
              </div>
              <div className=" flex flex-col">
                <h1>{userr.username}</h1>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default Cardirectory;
