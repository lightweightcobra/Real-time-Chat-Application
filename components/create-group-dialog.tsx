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
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Contact, Chat } from "@/lib/types"

interface CreateGroupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contacts: Contact[]
  onGroupCreated: (group: Chat) => void
}

export default function CreateGroupDialog({ open, onOpenChange, contacts, onGroupCreated }: CreateGroupDialogProps) {
  const [groupName, setGroupName] = useState("")
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (selectedContacts.length < 1) {
      setError("Please select at least one contact")
      return
    }

    setIsLoading(true)

    try {
      // In a real app, you'd create a group in Supabase
      // For demo purposes, we'll create a group without actually using Supabase

      const newGroup: Chat = {
        id: Date.now().toString(),
        name: groupName,
        lastMessage: "Group created",
        timestamp: new Date(),
        unread: 0,
        isGroup: true,
        participants: [...selectedContacts],
        avatar: "/placeholder.svg?height=40&width=40",
      }

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      onGroupCreated(newGroup)
      onOpenChange(false)

      // Reset form
      setGroupName("")
      setSelectedContacts([])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create group")
    } finally {
      setIsLoading(false)
    }
  }

  const toggleContact = (contactId: string) => {
    setSelectedContacts((prev) =>
      prev.includes(contactId) ? prev.filter((id) => id !== contactId) : [...prev, contactId],
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-whatsapp-panel text-white border-whatsapp-dark sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-whatsapp-green">Create New Group</DialogTitle>
          <DialogDescription className="text-gray-400">
            Enter a group name and select contacts to add to your new group.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="group-name">Group Name</Label>
              <Input
                id="group-name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="bg-whatsapp-dark border-whatsapp-dark text-white"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Select Contacts</Label>
              <ScrollArea className="h-60 rounded-md border border-whatsapp-dark p-2">
                {contacts.length > 0 ? (
                  contacts.map((contact) => (
                    <div key={contact.id} className="flex items-center space-x-2 py-2">
                      <Checkbox
                        id={`contact-${contact.id}`}
                        checked={selectedContacts.includes(contact.id)}
                        onCheckedChange={() => toggleContact(contact.id)}
                        className="border-whatsapp-green data-[state=checked]:bg-whatsapp-green"
                      />
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={contact.avatar || "/placeholder.svg"} alt={contact.name} />
                        <AvatarFallback className="bg-whatsapp-green text-white">
                          {contact.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <Label htmlFor={`contact-${contact.id}`} className="text-sm font-normal cursor-pointer">
                        {contact.name}
                      </Label>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-4">No contacts available</p>
                )}
              </ScrollArea>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="bg-whatsapp-green hover:bg-whatsapp-light-green text-white"
              disabled={isLoading || !groupName || selectedContacts.length === 0}
            >
              {isLoading ? "Creating..." : "Create Group"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
