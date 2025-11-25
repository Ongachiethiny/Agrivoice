"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Key, Database, Globe, Bell, Lock } from "lucide-react"

export default function SettingsPanel() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold">Settings</h2>
          <p className="text-muted-foreground mt-1">Configure Azure integrations and system preferences</p>
        </div>

        <Tabs defaultValue="azure" className="w-full">
          <TabsList className="w-full grid w-full grid-cols-4">
            <TabsTrigger value="azure">Azure Keys</TabsTrigger>
            <TabsTrigger value="language">Language</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {/* Azure Configuration */}
          <TabsContent value="azure" className="space-y-4">
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Key className="h-5 w-5 text-primary" />
                Azure API Keys
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Computer Vision Key</label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      type="password"
                      placeholder="Enter your Computer Vision API key"
                      className="font-mono text-xs"
                    />
                    <Button variant="outline">Test</Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Status: <Badge className="mt-1">Connected</Badge>
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium">GPT-4 Endpoint</label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      type="password"
                      placeholder="https://your-resource.openai.azure.com/"
                      className="font-mono text-xs"
                    />
                    <Button variant="outline">Test</Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Status: <Badge className="mt-1">Connected</Badge>
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium">Translator Key</label>
                  <div className="flex gap-2 mt-1">
                    <Input type="password" placeholder="Enter your Translator API key" className="font-mono text-xs" />
                    <Button variant="outline">Test</Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Status: <Badge className="mt-1">Connected</Badge>
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium">Speech Services Key</label>
                  <div className="flex gap-2 mt-1">
                    <Input type="password" placeholder="Enter your Speech Services key" className="font-mono text-xs" />
                    <Button variant="outline">Test</Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Status: <Badge variant="outline">Optional</Badge>
                  </p>
                </div>

                <Button className="w-full">Save API Keys</Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Database className="h-5 w-5 text-accent" />
                Power Automate Configuration
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Flow Webhook URL</label>
                  <Input
                    type="url"
                    placeholder="https://prod-xx.eastus.logic.azure.com:443/workflows/..."
                    className="font-mono text-xs mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Flow Timeout (seconds)</label>
                  <Input type="number" defaultValue="30" className="mt-1" />
                </div>

                <Button className="w-full">Update Flow Configuration</Button>
              </div>
            </Card>
          </TabsContent>

          {/* Language Settings */}
          <TabsContent value="language" className="space-y-4">
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Globe className="h-5 w-5 text-chart-2" />
                Language Preferences
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Default Output Language</label>
                  <select className="w-full px-3 py-2 border border-input rounded-md mt-1 text-sm">
                    <option>English</option>
                    <option>Swahili</option>
                    <option>French</option>
                    <option>Amharic</option>
                    <option>Arabic</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Regional Dialect</label>
                  <select className="w-full px-3 py-2 border border-input rounded-md mt-1 text-sm">
                    <option>East Africa (Kenya, Uganda, Tanzania)</option>
                    <option>West Africa (Nigeria, Ghana)</option>
                    <option>Southern Africa (South Africa, Botswana)</option>
                  </select>
                </div>

                <Button className="w-full">Save Preferences</Button>
              </div>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="space-y-4">
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Bell className="h-5 w-5 text-chart-1" />
                Notification Settings
              </h3>
              <div className="space-y-4">
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-sm">Alert on API errors or service degradation</span>
                </label>

                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-sm">Regional disease outbreak notifications</span>
                </label>

                <label className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm">Daily usage summary</span>
                </label>

                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-sm">High error rate alerts</span>
                </label>

                <Button className="w-full">Save Notification Preferences</Button>
              </div>
            </Card>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security" className="space-y-4">
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Lock className="h-5 w-5 text-destructive" />
                Security & Access
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Session Management</p>
                  <Button variant="outline" className="w-full bg-transparent">
                    Change Password
                  </Button>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">API Key Rotation</p>
                  <p className="text-xs text-muted-foreground mb-2">Last rotated: 30 days ago</p>
                  <Button variant="outline" className="w-full bg-transparent">
                    Rotate All Keys
                  </Button>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Data Retention</p>
                  <select className="w-full px-3 py-2 border border-input rounded-md mt-1 text-sm">
                    <option>30 days</option>
                    <option>90 days</option>
                    <option>6 months</option>
                    <option>1 year</option>
                  </select>
                  <p className="text-xs text-muted-foreground mt-2">Diagnostic logs and farmer data retention policy</p>
                </div>

                <Button className="w-full">Save Security Settings</Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
