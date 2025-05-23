export interface Contact {
  id: string
  name: string
  phone: string
  avatar: string
}

export interface Chat {
  id: string
  name: string
  lastMessage: string
  timestamp: Date
  unread: number
  isGroup: boolean
  participants: string[]
  avatar: string
}

export interface Message {
  id: string
  senderId: string
  content: string
  timestamp: Date
  type: "text" | "document" | "image"
  fileName?: string
  fileSize?: string
}
