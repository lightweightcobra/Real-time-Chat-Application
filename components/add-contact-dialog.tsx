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
import type { Contact } from "@/lib/types"

interface AddContactDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onContactAdded: (contact: Contact) => void
}

export default function AddContactDialog({ open, onOpenChange, onContactAdded }: AddContactDialogProps) {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // In a real app, you'd get the current user's ID from auth
      const userId = "current-user"

      // Validate phone number (basic validation)
      if (!phone.match(/^\+?[0-9]{10,15}$/)) {
        throw new Error("Please enter a valid phone number")
      }

      // For demo purposes, we'll create a contact without actually using Supabase
      // In a real app, you'd insert into the contacts table
      const newContact: Contact = {
        id: Date.now().toString(),
        name,
        phone,
        avatar: "/placeholder.svg?height=40&width=40",
      }

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      onContactAdded(newContact)
      onOpenChange(false)

      // Reset form
      setName("")
      setPhone("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add contact")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-whatsapp-panel text-white border-whatsapp-dark">
        <DialogHeader>
          <DialogTitle className="text-whatsapp-green">Add New Contact</DialogTitle>
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
              {isLoading ? "Adding..." : "Add Contact"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
