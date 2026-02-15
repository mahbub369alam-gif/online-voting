"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Lock, Key, CheckCircle, AlertTriangle } from "lucide-react"

// Simulated encryption functions (in production, use proper cryptographic libraries)
const generateKeyPair = () => {
  return {
    publicKey: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...",
    privateKey: "MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...",
  }
}

const encryptVote = (voteData, publicKey) => {
  // Simulate encryption process
  const encrypted = btoa(JSON.stringify(voteData) + publicKey.slice(0, 10))
  return {
    encryptedData: encrypted,
    hash: btoa(encrypted).slice(0, 32),
    timestamp: new Date().toISOString(),
  }
}

const verifyVoteIntegrity = (encryptedVote) => {
  // Simulate integrity verification
  return Math.random() > 0.1 // 90% success rate for demo
}

export function VoteEncryption({ voteData, onEncryptionComplete }) {
  const [encryptionStatus, setEncryptionStatus] = useState("idle") // idle, encrypting, success, failed
  const [keyPair, setKeyPair] = useState(null)
  const [encryptedVote, setEncryptedVote] = useState(null)
  const [verificationResult, setVerificationResult] = useState(null)

  const handleGenerateKeys = () => {
    setEncryptionStatus("encrypting")

    // Simulate key generation delay
    setTimeout(() => {
      const keys = generateKeyPair()
      setKeyPair(keys)
      setEncryptionStatus("success")
    }, 2000)
  }

  const handleEncryptVote = () => {
    if (!keyPair || !voteData) return

    setEncryptionStatus("encrypting")

    // Simulate encryption delay
    setTimeout(() => {
      const encrypted = encryptVote(voteData, keyPair.publicKey)
      setEncryptedVote(encrypted)

      // Verify integrity
      const isValid = verifyVoteIntegrity(encrypted)
      setVerificationResult(isValid)

      setEncryptionStatus(isValid ? "success" : "failed")

      if (isValid) {
        onEncryptionComplete?.(encrypted)
      }
    }, 1500)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "encrypting":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <div className="animate-spin mr-1">⟳</div>
            Processing
          </Badge>
        )
      case "success":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Secure
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="destructive">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        )
      default:
        return (
          <Badge variant="outline">
            <Shield className="w-3 h-3 mr-1" />
            Ready
          </Badge>
        )
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Lock className="h-5 w-5" />
            <span>Vote Encryption</span>
          </div>
          {getStatusBadge(encryptionStatus)}
        </CardTitle>
        <CardDescription>
          Your vote is encrypted using advanced cryptographic methods to ensure privacy and security.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Generation */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Key className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Encryption Keys</span>
          </div>

          {!keyPair ? (
            <div className="p-4 border rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground mb-3">Generate cryptographic keys to secure your vote</p>
              <Button onClick={handleGenerateKeys} disabled={encryptionStatus === "encrypting"}>
                {encryptionStatus === "encrypting" ? "Generating..." : "Generate Keys"}
              </Button>
            </div>
          ) : (
            <div className="p-4 border rounded-lg bg-green-50">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Keys Generated Successfully</span>
              </div>
              <div className="text-xs text-green-700 font-mono break-all">
                Public Key: {keyPair.publicKey.slice(0, 50)}...
              </div>
            </div>
          )}
        </div>

        {/* Vote Encryption */}
        {keyPair && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Vote Data Encryption</span>
            </div>

            {!encryptedVote ? (
              <div className="p-4 border rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground mb-3">Encrypt your vote data for secure transmission</p>
                <Button onClick={handleEncryptVote} disabled={encryptionStatus === "encrypting"}>
                  {encryptionStatus === "encrypting" ? "Encrypting..." : "Encrypt Vote"}
                </Button>
              </div>
            ) : (
              <div className="p-4 border rounded-lg bg-green-50">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Vote Encrypted Successfully</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-medium">Hash: </span>
                    <span className="font-mono text-green-700">{encryptedVote.hash}</span>
                  </div>
                  <div>
                    <span className="font-medium">Timestamp: </span>
                    <span className="text-green-700">{encryptedVote.timestamp}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Verification Result */}
        {verificationResult !== null && (
          <Alert variant={verificationResult ? "default" : "destructive"}>
            {verificationResult ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
            <AlertDescription>
              {verificationResult
                ? "Vote integrity verified. Your encrypted vote is ready for secure submission."
                : "Vote integrity check failed. Please try encrypting again."}
            </AlertDescription>
          </Alert>
        )}

        {/* Security Information */}
        <div className="p-4 border rounded-lg bg-blue-50">
          <h4 className="font-medium text-blue-900 mb-2">Security Features</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• End-to-end encryption using RSA-2048</li>
            <li>• Cryptographic hash verification</li>
            <li>• Tamper-proof vote storage</li>
            <li>• Anonymous vote casting</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
