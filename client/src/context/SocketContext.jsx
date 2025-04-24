import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

// 🔹 Custom Hook for easier access to socket
export const useSocket = () => {
  return useContext(SocketContext);
};

// 🔹 SocketProvider: Manages WebSocket connection
export const SocketProvider = ({ children }) => {
  const socket = useRef(null);
  const { userInfo } = useAppStore();

  //  Message Receiving Handler (Move this outside useEffect!)
  const handleRecieveMessage = (message) => {
    const { selectedChatData, selectedChatType, addMessage, addContactsInDMContacts } =
      useAppStore.getState();

    if (
      selectedChatType !== undefined &&
      (selectedChatData?._id === message.sender._id ||
        selectedChatData?._id === message.recipient._id)
    ) {
      console.log("📥 Message Received:", message);
      addMessage(message);
    }
    addContactsInDMContacts(message);
  };

  const handleRecieveChannelMessage = (message) => {
    const {
      selectedChatData,
      selectedChatType,
      addMessage,
      addChannelInChannelList,
    } = useAppStore.getState();

    if (
      selectedChatType !== undefined &&
      selectedChatData._id === message.channelId
    ) {
      addMessage(message);
    }
    addChannelInChannelList(message);
  };

  useEffect(() => {
    if (userInfo) {
      socket.current = io(HOST, {
        withCredentials: true,
        query: { userId: userInfo.id },
      });

      socket.current.on("connect", () => {
        console.log(" Connected to the socket server!");
      });

      socket.current.on("receiveMessage", handleRecieveMessage);
      socket.current.on("recieve-channel-message", handleRecieveChannelMessage);
    }

    //  Cleanup: Remove event listeners to prevent duplicate execution
    return () => {
      if (socket.current) {
        socket.current.off("receiveMessage", handleRecieveMessage); //  Fix duplicate listeners
        socket.current.disconnect();
        console.log("Disconnected from socket server.");
      }
    };
  }, [userInfo]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};
