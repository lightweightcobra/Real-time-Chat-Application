"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Contact, Chat } from "@/lib/types"

interface CreateContactDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onContactCreated: (contact: Contact, chat: Chat) => void
}

export default function CreateContactDialog({ open, onOpenChange, onContactCreated }: CreateContactDialogProps) {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // Validate phone number (basic validation)
      if (!phone.match(/^\+?[0-9]{10,15}$/)) {
        throw new Error("Please enter a valid phone number")
      }

      // In a real app, you'd check if the user exists in the database
      // For demo purposes, we'll create a contact and a chat

      // Create a new contact
      const newContact: Contact = {
        id: Date.now().toString(),
        name,
        phone,
        avatar: "/placeholder.svg?height=40&width=40",
      }

      // Create a new chat for this contact
      const newChat: Chat = {
        id: Date.now().toString(),
        name,
        lastMessage: "Say hi to your new contact!",
        timestamp: new Date(),
        unread: 0,
        isGroup: false,
        participants: [newContact.id],
        avatar: "/placeholder.svg?height=40&width=40",
      }

      // In a real app with Supabase, you would:
      // 1. Check if the user exists by phone number
      // 2. Create a contact record
      // 3. Create a chat
      // 4. Add both users as participants

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      onContactCreated(newContact, newChat)
      onOpenChange(false)

      // Reset form
      setName("")
      setPhone("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create contact")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-whatsapp-panel text-white border-whatsapp-dark">
        <DialogHeader>
          <DialogTitle className="text-whatsapp-green">Create New Contact</DialogTitle>
          <DialogDescription className="text-gray-400">
            Enter the details of the person you want to add to your contacts.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-whatsapp-dark border-whatsapp-dark text-white"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-whatsapp-dark border-whatsapp-dark text-white"
                placeholder="+1234567890"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="bg-whatsapp-green hover:bg-whatsapp-light-green text-white"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Contact"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
