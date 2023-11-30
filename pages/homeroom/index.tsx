import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import useStore from "@/pages/Penyimpanan";
import { SocketContext } from "@/pages/Provider/SocketContext";
import URL from "@/pages/url";
import URL_WS from "@/pages/urlws";
import Room from "../room";
import { AuthContext } from "../Provider/Auth_provider";

const HomeRoom: React.FC = () => {
  const [roomDatas, setRoomDatas] = useState<any[]>([]);
  const router = useRouter();
  const tokenuser = useStore((state: any) => state.tokenuser);
  const username = useStore((state: any) => state.username);
  const { setConn } = useContext(SocketContext);
  const { user } = useContext(AuthContext);


  const fetchRoom = async () => {
    try {
      const response = await axios.get(`${URL}/ws/GetRoom`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const datas = response.data;
      console.log(datas);
      setRoomDatas(datas);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchRoom();
  }, []);

  const joinRoom = async (id: string) => {
    console.log("room id : ", id);
    console.log("token user : ", tokenuser);
    console.log("username : ", username);
    const ws = new WebSocket(
      `${URL_WS}/joinRoom/${id}?userId=${tokenuser}&username=${user.username}`
    );
    ws.onerror = (error) => {
      console.log("WebSocket error: ", error);
    };
    ws.onopen = () => {
      if (ws.OPEN) {
        setConn(ws);
        useStore.setState({ id: id, username : username });   // Update the roomId state
        console.log(ws);
        router.push("/chatpage");
      }
    };
  };
  const handleRoomCreated = () => {
    // Panggil fungsi fetchRoom untuk mendapatkan daftar ruang terbaru setelah membuat ruang baru
    fetchRoom();
  };
  return (
    <>
      <section className="bg-gray-50 dark:bg-red-700 xl:h-full md:h-full sm:min-h-screen ip5:h-full w-full text-black">
        <div className="container px-5 mx-auto">
          <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0 ">
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <Room onRoomCreated={handleRoomCreated} />
            </div>
          </div>
          <div className="flex flex-wrap -m-4 text-center py-10">
            {roomDatas.map((roomData) => (
              <div className="p-4 md:w-1/4 sm:w-1/2 w-full" key={roomData.ID}>
                <div className="border-2 border-gray-200  h-full rounded-lg">
                  <div className="flex flex-row justify-around">
                    <div className=" flex flex-col">
                      <div className="">
                        <h1>Room : </h1>
                      </div>
                      <div className=" ">
                        <h1 className=" text-xl flex justify-center py-2 text-black">
                          {roomData.name}
                        </h1>
                      </div>
                    </div>
                    <button
                      onClick={() => joinRoom(roomData.id)}
                      className=""
                    >
                      <div className=" bg-yellow-500 flex items-center w-20 h-10 justify-center">
                        JOIN
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default HomeRoom
