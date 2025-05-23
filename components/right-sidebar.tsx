"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Info,
  ImageIcon,
  FileText,
  Link2,
  Star,
  Bell,
  Search,
  X,
  UserPlus,
  Settings,
  Lock,
  Trash,
  Download,
  Share,
  Archive,
  Pin,
  Volume2,
  VolumeX,
  Shield,
  Calendar,
  MapPin,
  Camera,
  Mic,
  Phone,
  Video,
  Flag,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import type { Chat, Contact } from "@/lib/types"

interface RightSidebarProps {
  chat: Chat | null
  contacts: Contact[]
  onClose: () => void
}

export default function RightSidebar({ chat, contacts, onClose }: RightSidebarProps) {
  const [activeSection, setActiveSection] = useState<string>("info")
  const [isMuted, setIsMuted] = useState(false)
  const [isPinned, setIsPinned] = useState(false)

  const icons = [
    { id: "info", icon: Info, label: "Chat Info" },
    { id: "media", icon: ImageIcon, label: "Media" },
    { id: "files", icon: FileText, label: "Files" },
    { id: "links", icon: Link2, label: "Links" },
    { id: "starred", icon: Star, label: "Starred" },
    { id: "search", icon: Search, label: "Search" },
    { id: "notifications", icon: Bell, label: "Notifications" },
    { id: "privacy", icon: Lock, label: "Privacy" },
    { id: "security", icon: Shield, label: "Security" },
    { id: "archive", icon: Archive, label: "Archive" },
    { id: "pin", icon: Pin, label: "Pin Chat" },
    { id: "share", icon: Share, label: "Share" },
    { id: "download", icon: Download, label: "Download" },
    { id: "calendar", icon: Calendar, label: "Events" },
    { id: "location", icon: MapPin, label: "Location" },
    { id: "camera", icon: Camera, label: "Camera" },
    { id: "voice", icon: Mic, label: "Voice" },
    { id: "call", icon: Phone, label: "Call" },
    { id: "video", icon: Video, label: "Video Call" },
    { id: "settings", icon: Settings, label: "Settings" },
  ]

  if (!chat) {
    return null
  }

  const renderContent = () => {
    switch (activeSection) {
      case "info":
        return (
          <div className="p-4">
            <div className="flex flex-col items-center mb-6">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={chat.avatar || "/placeholder.svg"} alt={chat.name} />
                <AvatarFallback className="bg-whatsapp-green text-white text-2xl">
                  {chat.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-medium text-white">{chat.name}</h2>
              <p className="text-gray-400 text-sm">{chat.isGroup ? "Group" : "Contact"}</p>

              {/* Quick actions */}
              <div className="flex space-x-4 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-whatsapp-dark bg-whatsapp-dark hover:bg-whatsapp-dark/70 text-whatsapp-green"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-whatsapp-dark bg-whatsapp-dark hover:bg-whatsapp-dark/70 text-whatsapp-green"
                >
                  <Video className="h-4 w-4 mr-2" />
                  Video
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-whatsapp-dark bg-whatsapp-dark hover:bg-whatsapp-dark/70 text-whatsapp-green"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>

            {/* Chat settings */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {isMuted ? (
                    <VolumeX className="h-4 w-4 mr-2 text-gray-400" />
                  ) : (
                    <Volume2 className="h-4 w-4 mr-2 text-gray-400" />
                  )}
                  <span className="text-white">Mute notifications</span>
                </div>
                <Switch checked={isMuted} onCheckedChange={setIsMuted} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Pin className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="text-white">Pin chat</span>
                </div>
                <Switch checked={isPinned} onCheckedChange={setIsPinned} />
              </div>
            </div>

            {chat.isGroup && (
              <div className="mb-6">
                <h3 className="text-whatsapp-green font-medium mb-2">Participants ({chat.participants.length})</h3>
                <ScrollArea className="h-40">
                  {chat.participants.map((participantId) => {
                    const contact = contacts.find((c) => c.id === participantId)
                    return contact ? (
                      <div key={contact.id} className="flex items-center justify-between py-2">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage src={contact.avatar || "/placeholder.svg"} alt={contact.name} />
                            <AvatarFallback className="bg-whatsapp-green text-white">
                              {contact.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-white">{contact.name}</p>
                            <p className="text-gray-400 text-xs">{contact.phone}</p>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                          <Phone className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : null
                  })}
                </ScrollArea>
                <Button className="w-full mt-2 bg-whatsapp-dark hover:bg-whatsapp-dark/70 text-whatsapp-green">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Participant
                </Button>
              </div>
            )}

            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start border-whatsapp-dark bg-whatsapp-dark hover:bg-whatsapp-dark/70 text-whatsapp-green"
              >
                <Archive className="h-4 w-4 mr-2" />
                Archive Chat
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-whatsapp-dark bg-whatsapp-dark hover:bg-whatsapp-dark/70 text-yellow-500"
              >
                <Flag className="h-4 w-4 mr-2" />
                Report
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-whatsapp-dark bg-whatsapp-dark hover:bg-whatsapp-dark/70 text-red-500"
              >
                <Trash className="h-4 w-4 mr-2" />
                {chat.isGroup ? "Delete Group" : "Delete Chat"}
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-whatsapp-dark bg-whatsapp-dark hover:bg-whatsapp-dark/70 text-red-500"
              >
                <X className="h-4 w-4 mr-2" />
                {chat.isGroup ? "Exit Group" : "Block Contact"}
              </Button>
            </div>
          </div>
        )
      case "media":
        return (
          <div className="p-4">
            <h3 className="text-whatsapp-green font-medium mb-4">Media, Links and Documents</h3>

            {/* Media tabs */}
            <div className="flex space-x-2 mb-4">
              <Button
                size="sm"
                variant="outline"
                className="border-whatsapp-dark bg-whatsapp-dark hover:bg-whatsapp-dark/70 text-whatsapp-green"
              >
                <ImageIcon className="h-4 w-4 mr-1" />
                Photos
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-whatsapp-dark bg-whatsapp-dark hover:bg-whatsapp-dark/70 text-gray-400"
              >
                <Video className="h-4 w-4 mr-1" />
                Videos
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-whatsapp-dark bg-whatsapp-dark hover:bg-whatsapp-dark/70 text-gray-400"
              >
                <FileText className="h-4 w-4 mr-1" />
                Docs
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                <div
                  key={i}
                  className="aspect-square bg-whatsapp-dark rounded-md flex items-center justify-center hover:bg-whatsapp-dark/70 cursor-pointer"
                >
                  <ImageIcon className="h-8 w-8 text-gray-500" />
                </div>
              ))}
            </div>

            <div className="flex space-x-2">
              <Button className="flex-1 bg-whatsapp-dark hover:bg-whatsapp-dark/70 text-whatsapp-green">
                <Download className="h-4 w-4 mr-2" />
                Download All
              </Button>
              <Button className="flex-1 bg-whatsapp-dark hover:bg-whatsapp-dark/70 text-whatsapp-green">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        )
      case "starred":
        return (
          <div className="p-4">
            <h3 className="text-whatsapp-green font-medium mb-4">Starred Messages</h3>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-whatsapp-dark p-3 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-whatsapp-green text-sm font-medium">John Doe</span>
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  </div>
                  <p className="text-white text-sm mb-1">This is a starred message example</p>
                  <p className="text-gray-400 text-xs">Yesterday, 2:30 PM</p>
                </div>
              ))}
            </div>
          </div>
        )
      case "search":
        return (
          <div className="p-4">
            <h3 className="text-whatsapp-green font-medium mb-4">Search Messages</h3>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search in this chat..."
                className="w-full pl-10 pr-4 py-2 bg-whatsapp-dark text-white rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-whatsapp-green"
              />
            </div>
            <div className="text-center text-gray-400 py-8">
              <Search className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Search for messages, photos, and more</p>
            </div>
          </div>
        )
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400">
              <div className="mb-4">
                {icons.find((icon) => icon.id === activeSection)?.icon && (
                  <div className="h-12 w-12 mx-auto mb-2 opacity-50">
                    {React.createElement(icons.find((icon) => icon.id === activeSection)!.icon, {
                      className: "h-12 w-12",
                    })}
                  </div>
                )}
              </div>
              <p>This section is under development</p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="w-80 h-full bg-whatsapp-panel border-l border-whatsapp-dark flex">
      {/* Icon sidebar */}
      <div className="w-16 h-full bg-whatsapp-panel flex flex-col items-center py-4 border-r border-whatsapp-dark">
        <TooltipProvider>
          <ScrollArea className="flex-1 w-full">
            <div className="flex flex-col items-center space-y-4 px-2">
              {icons.map((item) => (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`rounded-full w-10 h-10 ${
                        activeSection === item.id
                          ? "text-whatsapp-green bg-whatsapp-dark/50"
                          : "text-gray-400 hover:text-white hover:bg-whatsapp-dark/30"
                      }`}
                      onClick={() => setActiveSection(item.id)}
                    >
                      <item.icon className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </ScrollArea>

          {/* Close button at bottom */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-gray-400 hover:text-white hover:bg-whatsapp-dark/30 mt-4"
                onClick={onClose}
              >
                <X className="h-6 w-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Close</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">{renderContent()}</div>
    </div>
  )
}
