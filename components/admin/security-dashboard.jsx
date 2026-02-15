"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { formatDate } from "@/lib/utils"
import { Shield, AlertTriangle, CheckCircle, Eye, Lock, Activity, Users, Database } from "lucide-react"

export function SecurityDashboard() {
  const [securitySettings, setSecuritySettings] = useState({
    requireFaceVerification: true,
    enableAuditLogging: true,
    enableRealTimeMonitoring: true,
    enableEncryption: true,
    enableTwoFactorAuth: false,
  })

  const [auditLogs] = useState([
    {
      id: 1,
      action: "User Login",
      user: "admin@evoting.gov",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      ipAddress: "192.168.1.100",
      status: "success",
    },
    {
      id: 2,
      action: "Vote Cast",
      user: "voter1@email.com",
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      ipAddress: "192.168.1.101",
      status: "success",
    },
    {
      id: 3,
      action: "Failed Login Attempt",
      user: "unknown@email.com",
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      ipAddress: "192.168.1.102",
      status: "failed",
    },
    {
      id: 4,
      action: "Candidate Added",
      user: "admin@evoting.gov",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      ipAddress: "192.168.1.100",
      status: "success",
    },
  ])

  const handleSettingChange = (setting, value) => {
    setSecuritySettings((prev) => ({ ...prev, [setting]: value }))
  }

  const getSecurityScore = () => {
    const enabledFeatures = Object.values(securitySettings).filter(Boolean).length
    return Math.round((enabledFeatures / Object.keys(securitySettings).length) * 100)
  }

  const getStatusBadge = (status) => {
    return status === "success" ? (
      <Badge className="bg-green-100 text-green-800">Success</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800">Failed</Badge>
    )
  }

  const securityScore = getSecurityScore()

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Score</CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{securityScore}%</div>
            <p className="text-xs text-muted-foreground">System security level</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Current user sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Attempts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Integrity</CardTitle>
            <Database className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100%</div>
            <p className="text-xs text-muted-foreground">Vote data verified</p>
          </CardContent>
        </Card>
      </div>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lock className="h-5 w-5" />
            <span>Security Settings</span>
          </CardTitle>
          <CardDescription>Configure security features and access controls</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="face-verification">Require Face Verification</Label>
                <p className="text-sm text-muted-foreground">Mandate face verification before voting</p>
              </div>
              <Switch
                id="face-verification"
                checked={securitySettings.requireFaceVerification}
                onCheckedChange={(value) => handleSettingChange("requireFaceVerification", value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="audit-logging">Enable Audit Logging</Label>
                <p className="text-sm text-muted-foreground">Log all system activities for security monitoring</p>
              </div>
              <Switch
                id="audit-logging"
                checked={securitySettings.enableAuditLogging}
                onCheckedChange={(value) => handleSettingChange("enableAuditLogging", value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="real-time-monitoring">Real-time Monitoring</Label>
                <p className="text-sm text-muted-foreground">Monitor system activities in real-time</p>
              </div>
              <Switch
                id="real-time-monitoring"
                checked={securitySettings.enableRealTimeMonitoring}
                onCheckedChange={(value) => handleSettingChange("enableRealTimeMonitoring", value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="encryption">Data Encryption</Label>
                <p className="text-sm text-muted-foreground">Encrypt sensitive data at rest and in transit</p>
              </div>
              <Switch
                id="encryption"
                checked={securitySettings.enableEncryption}
                onCheckedChange={(value) => handleSettingChange("enableEncryption", value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
              </div>
              <Switch
                id="two-factor"
                checked={securitySettings.enableTwoFactorAuth}
                onCheckedChange={(value) => handleSettingChange("enableTwoFactorAuth", value)}
              />
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button>Save Security Settings</Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Security Alerts</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>System Secure:</strong> All security checks passed. No immediate threats detected.
            </AlertDescription>
          </Alert>

          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Failed Login Attempt:</strong> Suspicious login attempt detected from IP 192.168.1.102 at{" "}
              {formatDate(new Date(Date.now() - 60 * 60 * 1000))}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Audit Log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Recent Audit Log</span>
          </CardTitle>
          <CardDescription>System activity and security events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {auditLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{log.action}</span>
                    {getStatusBadge(log.status)}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    User: {log.user} | IP: {log.ipAddress}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">{formatDate(log.timestamp)}</div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t">
            <Button variant="outline">
              <Eye className="mr-2 h-4 w-4" />
              View Full Audit Log
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
