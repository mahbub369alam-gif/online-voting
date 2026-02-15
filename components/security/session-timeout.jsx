"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Clock, AlertTriangle } from "lucide-react"

const SESSION_TIMEOUT = 30 * 60 * 1000 // 30 minutes
const WARNING_TIME = 5 * 60 * 1000 // 5 minutes before timeout

export function SessionTimeout() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [lastActivity, setLastActivity] = useState(Date.now())
  const [showWarning, setShowWarning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)

  useEffect(() => {
    if (!user) return

    const updateActivity = () => {
      setLastActivity(Date.now())
      setShowWarning(false)
    }

    // Track user activity
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart", "click"]
    events.forEach((event) => {
      document.addEventListener(event, updateActivity, true)
    })

    const checkSession = () => {
      const now = Date.now()
      const timeSinceActivity = now - lastActivity
      const timeUntilTimeout = SESSION_TIMEOUT - timeSinceActivity
      const timeUntilWarning = SESSION_TIMEOUT - WARNING_TIME - timeSinceActivity

      if (timeSinceActivity >= SESSION_TIMEOUT) {
        // Session expired
        signOut()
        router.push("/")
      } else if (timeUntilWarning <= 0 && !showWarning) {
        // Show warning
        setShowWarning(true)
        setTimeLeft(Math.max(0, timeUntilTimeout))
      }

      if (showWarning) {
        setTimeLeft(Math.max(0, timeUntilTimeout))
      }
    }

    const interval = setInterval(checkSession, 1000)

    return () => {
      clearInterval(interval)
      events.forEach((event) => {
        document.removeEventListener(event, updateActivity, true)
      })
    }
  }, [user, lastActivity, showWarning, signOut, router])

  const handleExtendSession = () => {
    setLastActivity(Date.now())
    setShowWarning(false)
  }

  const handleSignOut = () => {
    signOut()
    router.push("/")
  }

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  if (!showWarning || !user) return null

  return (
    <Dialog open={showWarning} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <span>Session Expiring Soon</span>
          </DialogTitle>
          <DialogDescription>
            Your session will expire due to inactivity. Would you like to extend your session?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-lg font-mono">{formatTime(timeLeft)}</span>
            </div>
            <Progress value={(timeLeft / WARNING_TIME) * 100} className="w-full" />
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleSignOut} className="w-full sm:w-auto bg-transparent">
            Sign Out
          </Button>
          <Button onClick={handleExtendSession} className="w-full sm:w-auto">
            Extend Session
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
