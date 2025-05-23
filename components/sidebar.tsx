"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { MessageSquare, Users, Phone, Settings, User, Bell, Moon, LogOut } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function Sidebar() {
  const [activeIcon, setActiveIcon] = useState("chats")
  const { signOut } = useAuth()

  const icons = [
    { id: "profile", icon: User, label: "Profile" },
    { id: "chats", icon: MessageSquare, label: "Chats" },
    { id: "groups", icon: Users, label: "Groups" },
    { id: "calls", icon: Phone, label: "Calls" },
    { id: "notifications", icon: Bell, label: "Notifications" },
    { id: "settings", icon: Settings, label: "Settings" },
    { id: "darkMode", icon: Moon, label: "Dark Mode" },
    { id: "logout", icon: LogOut, label: "Logout" },
  ]

  return (
    <div className="w-16 h-full bg-whatsapp-panel flex flex-col items-center py-4 border-r border-whatsapp-dark">
      <TooltipProvider>
        <div className="flex flex-col items-center space-y-6">
          {icons.map((item) => (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`rounded-full ${
                    activeIcon === item.id
                      ? "text-whatsapp-green bg-whatsapp-dark/50"
                      : "text-gray-400 hover:text-white hover:bg-whatsapp-dark/30"
                  }`}
                  onClick={() => {
                    if (item.id === "logout") {
                      signOut()
                    } else {
                      setActiveIcon(item.id)
                    }
                  }}
                >
                  <item.icon className="h-6 w-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
    </div>
  )
}
