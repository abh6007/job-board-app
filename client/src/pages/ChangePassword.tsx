import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, Key, Copy, CheckCircle2 } from "lucide-react";
import { useLocation } from "wouter";

export default function ChangePasswordPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showRecoveryCode, setShowRecoveryCode] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  // Get recovery code
  const { data: recoveryData } = useQuery({
    queryKey: ["/api/recovery-code"],
    enabled: showRecoveryCode,
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      const response = await fetch("/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to change password");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Password changed successfully",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setLocation("/admin"), 2000);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "New password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    changePasswordMutation.mutate({ currentPassword, newPassword });
  };

  const copyRecoveryCode = () => {
    if (recoveryData?.code) {
      navigator.clipboard.writeText(recoveryData.code);
      setCodeCopied(true);
      toast({
        title: "Copied!",
        description: "Recovery code copied to clipboard",
      });
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => setLocation("/admin")} className="mb-4">
            ← Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Password & Security</h1>
          <p className="text-gray-600 mt-2">Manage your password and recovery options</p>
        </div>

        <div className="space-y-6">
          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Change Password
              </CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    type="password"
                    id="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 6 characters)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={changePasswordMutation.isPending}
                  className="w-full"
                >
                  {changePasswordMutation.isPending ? "Changing..." : "Change Password"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Recovery Code */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                Recovery Code
              </CardTitle>
              <CardDescription>
                Use this code to reset your password if you get locked out
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!showRecoveryCode ? (
                <>
                  <Alert>
                    <AlertDescription>
                      Your recovery code is a secret key that lets you reset your password even if
                      you're locked out. Keep it safe!
                    </AlertDescription>
                  </Alert>
                  <Button
                    onClick={() => setShowRecoveryCode(true)}
                    variant="outline"
                    className="w-full"
                  >
                    Show Recovery Code
                  </Button>
                </>
              ) : (
                <>
                  <Alert className="bg-yellow-50 border-yellow-200">
                    <AlertDescription className="text-yellow-800">
                      ⚠️ <strong>Important:</strong> Save this code somewhere safe! You'll need it
                      to reset your password if you forget it.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <Label>Your Recovery Code</Label>
                    <div className="flex gap-2">
                      <Input
                        value={recoveryData?.code || "Loading..."}
                        readOnly
                        className="font-mono"
                      />
                      <Button
                        onClick={copyRecoveryCode}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        {codeCopied ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  <Alert className="bg-blue-50 border-blue-200">
                    <AlertDescription className="text-blue-800">
                      <strong>How to use:</strong> If you forget your password, go to{" "}
                      <code className="bg-blue-100 px-2 py-1 rounded">
                        /reset-password
                      </code>{" "}
                      and enter this code along with your username to reset your password.
                    </AlertDescription>
                  </Alert>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
