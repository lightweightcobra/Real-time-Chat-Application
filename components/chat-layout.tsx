"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/sidebar"
import ChatList from "@/components/chat-list"
import ChatWindow from "@/components/chat-window"
import RightSidebar from "@/components/right-sidebar"
import type { Contact, Chat, Message } from "@/lib/types"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase"

export default function ChatLayout() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [chats, setChats] = useState<Chat[]>([])
  const [messages, setMessages] = useState<Record<string, Message[]>>({})
  const [showRightSidebar, setShowRightSidebar] = useState(false)
  const [loading, setLoading] = useState(true)

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/")
    }
  }, [user, authLoading, router])

  // Fetch user data when authenticated
  useEffect(() => {
    if (!user) return

    const fetchUserData = async () => {
      try {
        setLoading(true)

        // Mock data with proper user IDs
        const mockContacts: Contact[] = [
          { id: "contact-1", name: "John Doe", phone: "+1234567890", avatar: "/placeholder.svg?height=40&width=40" },
          { id: "contact-2", name: "Jane Smith", phone: "+0987654321", avatar: "/placeholder.svg?height=40&width=40" },
          { id: "contact-3", name: "Bob Johnson", phone: "+1122334455", avatar: "/placeholder.svg?height=40&width=40" },
          { id: "contact-4", name: "Alice Brown", phone: "+5566778899", avatar: "/placeholder.svg?height=40&width=40" },
        ]

        const mockChats: Chat[] = [
          {
            id: "chat-1",
            name: "John Doe",
            lastMessage: "Hey, how are you?",
            timestamp: new Date(Date.now() - 1000 * 60 * 5),
            unread: 2,
            isGroup: false,
            participants: ["contact-1"],
            avatar: "/placeholder.svg?height=40&width=40",
          },
          {
            id: "chat-2",
            name: "Team Project",
            lastMessage: "Meeting at 3pm",
            timestamp: new Date(Date.now() - 1000 * 60 * 60),
            unread: 0,
            isGroup: true,
            participants: ["contact-1", "contact-2", "contact-3"],
            avatar: "/placeholder.svg?height=40&width=40",
          },
          {
            id: "chat-3",
            name: "Jane Smith",
            lastMessage: "Can you send me the document?",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
            unread: 0,
            isGroup: false,
            participants: ["contact-2"],
            avatar: "/placeholder.svg?height=40&width=40",
          },
        ]

        // Mock messages with proper sender IDs
        const mockMessages: Record<string, Message[]> = {
          "chat-1": [
            {
              id: "msg-1",
              senderId: "contact-1",
              content: "Hey, how are you?",
              timestamp: new Date(Date.now() - 1000 * 60 * 30),
              type: "text",
            },
            {
              id: "msg-2",
              senderId: user.id,
              content: "I'm good, thanks! How about you?",
              timestamp: new Date(Date.now() - 1000 * 60 * 29),
              type: "text",
            },
            {
              id: "msg-3",
              senderId: "contact-1",
              content: "Doing well. Want to grab lunch tomorrow?",
              timestamp: new Date(Date.now() - 1000 * 60 * 25),
              type: "text",
            },
            {
              id: "msg-4",
              senderId: user.id,
              content: "Sure, that sounds great! 😊",
              timestamp: new Date(Date.now() - 1000 * 60 * 20),
              type: "text",
            },
          ],
          "chat-2": [
            {
              id: "msg-5",
              senderId: "contact-1",
              content: "Hi team, we need to discuss the project timeline.",
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
              type: "text",
            },
            {
              id: "msg-6",
              senderId: "contact-2",
              content: "I'm available after 2pm.",
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
              type: "text",
            },
            {
              id: "msg-7",
              senderId: user.id,
              content: "Same here. Let's schedule it for 3pm.",
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
              type: "text",
            },
            {
              id: "msg-8",
              senderId: "contact-1",
              content: "Great, let's have a meeting at 3pm then.",
              timestamp: new Date(Date.now() - 1000 * 60 * 60),
              type: "text",
            },
          ],
          "chat-3": [
            {
              id: "msg-9",
              senderId: "contact-2",
              content: "Hi, do you have the project document?",
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
              type: "text",
            },
            {
              id: "msg-10",
              senderId: user.id,
              content: "Yes, I'll send it to you.",
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.5),
              type: "text",
            },
            {
              id: "msg-11",
              senderId: user.id,
              content: "Here's the document",
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
              type: "document",
              fileName: "project_plan.pdf",
              fileSize: "2.5 MB",
            },
          ],
        }

        setContacts(mockContacts)
        setChats(mockChats)
        setMessages(mockMessages)
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [user])

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel("public:messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          const newMessage = payload.new as any

          // Add message to state
          setMessages((prev) => ({
            ...prev,
            [newMessage.chat_id]: [
              ...(prev[newMessage.chat_id] || []),
              {
                id: newMessage.id,
                senderId: newMessage.sender_id,
                content: newMessage.content,
                timestamp: new Date(newMessage.created_at),
                type: newMessage.type,
                fileName: newMessage.file_name,
                fileSize: newMessage.file_size,
              },
            ],
          }))

          // Update chat list
          setChats((prev) =>
            prev.map((chat) =>
              chat.id === newMessage.chat_id
                ? {
                    ...chat,
                    lastMessage: newMessage.content,
                    timestamp: new Date(newMessage.created_at),
                    unread: chat.id === selectedChat?.id ? 0 : chat.unread + 1,
                  }
                : chat,
            ),
          )
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, selectedChat])

  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat)
    const updatedChats = chats.map((c) => (c.id === chat.id ? { ...c, unread: 0 } : c))
    setChats(updatedChats)
  }

  const handleSendMessage = async (
    chatId: string,
    content: string,
    type: "text" | "document" | "image" = "text",
    fileDetails?: { fileName?: string; fileSize?: string },
  ) => {
    if (!user) return

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      content,
      timestamp: new Date(),
      type,
      ...(fileDetails && { fileName: fileDetails.fileName, fileSize: fileDetails.fileSize }),
    }

    // Update locally
    setMessages((prev) => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), newMessage],
    }))

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              lastMessage:
                type === "text" ? content : `${type === "document" ? "📄" : "🖼️"} ${fileDetails?.fileName || "File"}`,
              timestamp: new Date(),
            }
          : chat,
      ),
    )
  }

  const handleContactCreated = (contact: Contact, chat: Chat) => {
    setContacts((prev) => [...prev, contact])
    setChats((prev) => [chat, ...prev])
    setSelectedChat(chat)
    setMessages((prev) => ({
      ...prev,
      [chat.id]: [],
    }))
  }

  const handleCreateGroup = (group: Chat) => {
    setChats((prev) => [group, ...prev])
    setSelectedChat(group)
    setMessages((prev) => ({
      ...prev,
      [group.id]: [],
    }))
  }

  const toggleRightSidebar = () => {
    setShowRightSidebar((prev) => !prev)
  }

  if (authLoading || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-whatsapp-dark">
        <div className="text-white">Loading your chats...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen bg-whatsapp-dark">
      <div className="flex w-full">
        <Sidebar />
        <ChatList
          chats={chats}
          contacts={contacts}
          onSelectChat={handleSelectChat}
          selectedChatId={selectedChat?.id}
          onContactCreated={handleContactCreated}
          onGroupCreated={handleCreateGroup}
        />
        <ChatWindow
          chat={selectedChat}
          messages={selectedChat ? messages[selectedChat.id] || [] : []}
          onSendMessage={handleSendMessage}
          contacts={contacts}
          onInfoClick={toggleRightSidebar}
          showRightSidebar={showRightSidebar}
        />
        {showRightSidebar && selectedChat && (
          <RightSidebar chat={selectedChat} contacts={contacts} onClose={() => setShowRightSidebar(false)} />
        )}
      </div>
    </div>
  )
}
