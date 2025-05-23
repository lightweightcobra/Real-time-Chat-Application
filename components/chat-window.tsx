"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Smile, Paperclip, Mic, Search, Phone, Video, File, ImageIcon, Info } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { Chat, Message, Contact } from "@/lib/types"
import { formatTime } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"

interface ChatWindowProps {
  chat: Chat | null
  messages: Message[]
  onSendMessage: (
    chatId: string,
    content: string,
    type?: "text" | "document" | "image",
    fileDetails?: { fileName?: string; fileSize?: string },
  ) => void
  contacts: Contact[]
  onInfoClick?: () => void
  showRightSidebar?: boolean
}

export default function ChatWindow({
  chat,
  messages,
  onSendMessage,
  contacts,
  onInfoClick,
  showRightSidebar,
}: ChatWindowProps) {
  const { user } = useAuth()
  const [messageInput, setMessageInput] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chat || !messageInput.trim()) return

    onSendMessage(chat.id, messageInput)
    setMessageInput("")
  }

  const handleSendFile = (type: "document" | "image") => {
    if (!chat) return

    if (type === "document") {
      onSendMessage(chat.id, "I've sent you a document", "document", { fileName: "document.pdf", fileSize: "1.2 MB" })
    } else {
      onSendMessage(chat.id, "I've sent you an image", "image", { fileName: "image.jpg" })
    }
  }

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-whatsapp-chat-bg">
        <div className="text-center text-gray-500">
          <h3 className="text-xl font-medium mb-2">Select a chat to start messaging</h3>
          <p>Or start a new conversation</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-whatsapp-chat-bg">
      {/* Chat header */}
      <div className="flex items-center justify-between p-3 bg-whatsapp-panel border-b border-whatsapp-dark">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={chat.avatar || "/placeholder.svg"} alt={chat.name} />
            <AvatarFallback className="bg-whatsapp-green text-white">
              {chat.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-white font-medium">{chat.name}</h3>
            <p className="text-xs text-gray-400">
              {chat.isGroup ? `${chat.participants.length} participants` : "Online"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-whatsapp-dark/30">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-whatsapp-dark/30">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-whatsapp-dark/30">
            <Video className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`text-gray-400 hover:text-white hover:bg-whatsapp-dark/30 ${showRightSidebar ? "text-whatsapp-green" : ""}`}
            onClick={onInfoClick}
          >
            <Info className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto p-4 scrollbar-hide"
        style={{
          backgroundImage: "url('/placeholder.svg?height=500&width=500')",
          backgroundSize: "30%",
          backgroundRepeat: "repeat",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",
          backgroundColor: "rgba(11, 20, 26, 0.95)",
        }}
      >
        {messages.map((message) => {
          // Check if the message is from the current user
          const isCurrentUser = message.senderId === user?.id || message.senderId === "current-user"
          const sender = isCurrentUser ? "You" : contacts.find((c) => c.id === message.senderId)?.name || "Unknown"

          return (
            <div key={message.id} className={`flex mb-4 ${isCurrentUser ? "justify-end" : "justify-start"}`}>
              <div className="flex items-end space-x-2 max-w-[70%]">
                {/* Avatar for other users (left side) */}
                {!isCurrentUser && chat.isGroup && (
                  <Avatar className="h-8 w-8 mb-1">
                    <AvatarImage
                      src={contacts.find((c) => c.id === message.senderId)?.avatar || "/placeholder.svg"}
                      alt={sender}
                    />
                    <AvatarFallback className="bg-whatsapp-green text-white text-xs">
                      {sender.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={`rounded-lg p-3 relative ${
                    isCurrentUser
                      ? "bg-whatsapp-message-out text-white rounded-br-none"
                      : "bg-whatsapp-message-in text-white rounded-bl-none"
                  }`}
                >
                  {/* Sender name for group chats (only for other users) */}
                  {chat.isGroup && !isCurrentUser && (
                    <p className="text-xs font-medium text-whatsapp-green mb-1">{sender}</p>
                  )}

                  {/* Message content */}
                  {message.type === "text" && <p className="break-words">{message.content}</p>}

                  {message.type === "document" && (
                    <div className="flex items-center bg-whatsapp-dark/30 p-2 rounded">
                      <File className="h-8 w-8 mr-2 text-whatsapp-green" />
                      <div>
                        <p className="text-sm font-medium">{message.fileName}</p>
                        <p className="text-xs text-gray-400">{message.fileSize}</p>
                      </div>
                    </div>
                  )}

                  {message.type === "image" && (
                    <div className="bg-whatsapp-dark/30 p-2 rounded">
                      <div className="h-40 bg-whatsapp-dark/50 rounded flex items-center justify-center">
                        <ImageIcon className="h-10 w-10 text-gray-400" />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{message.fileName}</p>
                    </div>
                  )}

                  {/* Timestamp and status */}
                  <div className={`flex items-center justify-end mt-1 space-x-1`}>
                    <p className="text-xs text-gray-400">{formatTime(message.timestamp)}</p>
                    {isCurrentUser && (
                      <div className="flex space-x-1">
                        {/* Message status indicators */}
                        <div className="w-4 h-3 flex items-center justify-end">
                          {/* Double checkmark for delivered/read */}
                          <svg className="w-4 h-3 text-gray-400" viewBox="0 0 16 11" fill="currentColor">
                            <path d="M11.071 0.929a1 1 0 0 1 1.414 0l3.5 3.5a1 1 0 0 1 0 1.414l-7.5 7.5a1 1 0 0 1-1.414 0L2.929 9.2a1 1 0 1 1 1.414-1.414L7.5 10.943l6.571-6.571a1 1 0 0 1 1.414 0z" />
                            <path d="M6.071 0.929a1 1 0 0 1 1.414 0l3.5 3.5a1 1 0 0 1 0 1.414l-7.5 7.5a1 1 0 0 1-1.414 0L-2.071 9.2a1 1 0 1 1 1.414-1.414L2.5 10.943l6.571-6.571a1 1 0 0 1 1.414 0z" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Message tail */}
                  <div
                    className={`absolute bottom-0 w-3 h-3 ${
                      isCurrentUser
                        ? "right-0 transform translate-x-1 bg-whatsapp-message-out"
                        : "left-0 transform -translate-x-1 bg-whatsapp-message-in"
                    }`}
                    style={{
                      clipPath: isCurrentUser ? "polygon(0 0, 100% 0, 0 100%)" : "polygon(100% 0, 100% 100%, 0 100%)",
                    }}
                  />
                </div>

                {/* Avatar for current user (right side) */}
                {isCurrentUser && chat.isGroup && (
                  <Avatar className="h-8 w-8 mb-1">
                    <AvatarImage src="/placeholder.svg" alt="You" />
                    <AvatarFallback className="bg-whatsapp-green text-white text-xs">YOU</AvatarFallback>
                  </Avatar>
                )}
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="p-3 bg-whatsapp-panel">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white hover:bg-whatsapp-dark/30"
              >
                <Smile className="h-6 w-6" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-none" align="start">
              <div className="emoji-picker-container">
                <div className="p-2 bg-whatsapp-panel rounded-md">
                  <div className="grid grid-cols-5 gap-2">
                    {["😀", "😂", "😍", "🥰", "😎", "🙄", "😴", "🤔", "👍", "❤️"].map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        className="text-2xl hover:bg-whatsapp-dark/30 p-1 rounded"
                        onClick={() => {
                          setMessageInput((prev) => prev + emoji)
                          setShowEmojiPicker(false)
                        }}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white hover:bg-whatsapp-dark/30"
              >
                <Paperclip className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="bg-whatsapp-panel border-whatsapp-dark text-white">
              <DropdownMenuItem onClick={() => handleSendFile("document")} className="hover:bg-whatsapp-dark/30">
                <File className="mr-2 h-4 w-4" />
                <span>Document</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSendFile("image")} className="hover:bg-whatsapp-dark/30">
                <ImageIcon className="mr-2 h-4 w-4" />
                <span>Image</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Input
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type a message"
            className="bg-whatsapp-dark text-white border-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />

          <Button
            type={messageInput.trim() ? "submit" : "button"}
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white hover:bg-whatsapp-dark/30"
          >
            {messageInput.trim() ? (
              <span className="text-whatsapp-green font-medium">Send</span>
            ) : (
              <Mic className="h-6 w-6" />
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
