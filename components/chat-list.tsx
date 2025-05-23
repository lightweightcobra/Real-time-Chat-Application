"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, UserPlus, Users } from "lucide-react"
import type { Chat, Contact } from "@/lib/types"
import { formatDistanceToNow } from "@/lib/utils"
import CreateContactDialog from "@/components/create-contact-dialog"
import CreateGroupDialog from "@/components/create-group-dialog"

interface ChatListProps {
  chats: Chat[]
  contacts: Contact[]
  onSelectChat: (chat: Chat) => void
  selectedChatId?: string
  onContactCreated: (contact: Contact, chat: Chat) => void
  onGroupCreated: (group: Chat) => void
}

export default function ChatList({
  chats,
  contacts,
  onSelectChat,
  selectedChatId,
  onContactCreated,
  onGroupCreated,
}: ChatListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [createContactOpen, setCreateContactOpen] = useState(false)
  const [createGroupOpen, setCreateGroupOpen] = useState(false)

  const filteredChats = chats.filter((chat) => chat.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="w-80 h-full bg-whatsapp-panel border-r border-whatsapp-dark flex flex-col">
      <div className="p-3 border-b border-whatsapp-dark">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search or start new chat"
            className="pl-10 bg-whatsapp-dark text-white border-none focus-visible:ring-0 focus-visible:ring-offset-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {filteredChats.map((chat) => (
          <div
            key={chat.id}
            className={`flex items-center p-3 cursor-pointer hover:bg-whatsapp-dark/50 ${
              selectedChatId === chat.id ? "bg-whatsapp-dark/70" : ""
            }`}
            onClick={() => onSelectChat(chat)}
          >
            <Avatar className="h-12 w-12 mr-3">
              <AvatarImage src={chat.avatar || "/placeholder.svg"} alt={chat.name} />
              <AvatarFallback className="bg-whatsapp-green text-white">
                {chat.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <h3 className="text-white font-medium truncate">{chat.name}</h3>
                <span className="text-xs text-gray-400">{formatDistanceToNow(chat.timestamp)}</span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <p className="text-sm text-gray-400 truncate">{chat.lastMessage}</p>
                {chat.unread > 0 && (
                  <Badge className="bg-whatsapp-green text-white rounded-full h-5 min-w-5 flex items-center justify-center">
                    {chat.unread}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-whatsapp-dark space-y-2">
        <Button
          className="w-full bg-whatsapp-green hover:bg-whatsapp-light-green text-white"
          onClick={() => setCreateContactOpen(true)}
        >
          <UserPlus className="mr-2 h-4 w-4" /> Create Contact
        </Button>
        <Button
          className="w-full bg-whatsapp-dark hover:bg-whatsapp-dark/70 text-whatsapp-green"
          onClick={() => setCreateGroupOpen(true)}
        >
          <Users className="mr-2 h-4 w-4" /> Create Group
        </Button>
      </div>

      <CreateContactDialog
        open={createContactOpen}
        onOpenChange={setCreateContactOpen}
        onContactCreated={onContactCreated}
      />

      <CreateGroupDialog
        open={createGroupOpen}
        onOpenChange={setCreateGroupOpen}
        contacts={contacts}
        onGroupCreated={onGroupCreated}
      />
    </div>
  )
}
