import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Shield, AlertCircle, CheckCircle2, Copy, Clock } from "lucide-react";
import { VerificationResponse, VerifyCodeResponse } from "@shared/auth";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = "username" | "verification" | "success";

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const [step, setStep] = useState<Step>("username");
  const [username, setUsername] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [copied, setCopied] = useState(false);

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/request-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim() }),
      });

      const data: VerificationResponse = await response.json();

      if (data.success) {
        setGeneratedCode(data.code);
        setTimeLeft(data.expiresIn);
        setStep("verification");
        startCountdown();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to generate verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username, 
          code: verificationCode.trim() 
        }),
      });

      const data: VerifyCodeResponse = await response.json();

      if (data.success) {
        setStep("success");
        // Store auth token
        if (data.token) {
          localStorage.setItem("auth_token", data.token);
        }
        // Close modal after success
        setTimeout(() => {
          onOpenChange(false);
          resetModal();
        }, 2000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const startCountdown = () => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setError("Verification code expired. Please request a new one.");
          setStep("username");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const copyCommand = () => {
    navigator.clipboard.writeText(`/verify ${generatedCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetModal = () => {
    setStep("username");
    setUsername("");
    setVerificationCode("");
    setGeneratedCode("");
    setError("");
    setTimeLeft(600);
    setCopied(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-minecraft-green" />
            Minecraft Verification
          </DialogTitle>
          <DialogDescription>
            Verify your Minecraft account to access your profile and store
          </DialogDescription>
        </DialogHeader>

        {step === "username" && (
          <form onSubmit={handleUsernameSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Minecraft Username</Label>
              <Input
                id="username"
                placeholder="Enter your Minecraft username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading || !username.trim()}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Verification Code
            </Button>
          </form>
        )}

        {step === "verification" && (
          <div className="space-y-4">
            <Card className="border-minecraft-green/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Step 1: Join the Server</CardTitle>
                <CardDescription>
                  Connect to <code className="text-minecraft-green">indusnetwork.highms.pro:25826</code>
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-gold/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Step 2: Run Command</CardTitle>
                <CardDescription>Execute this command in chat:</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-2 bg-background/50 rounded-md p-3">
                  <code className="text-minecraft-green font-mono flex-1">
                    /verify {generatedCode}
                  </code>
                  <Button variant="ghost" size="sm" onClick={copyCommand}>
                    {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-between">
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Expires in {formatTime(timeLeft)}
              </Badge>
            </div>

            <form onSubmit={handleVerificationSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Verification Complete?</Label>
                <Input
                  id="code"
                  placeholder="Click 'Verify' after running the command"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  disabled={loading}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={() => setStep("username")} disabled={loading}>
                  Back
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Verify
                </Button>
              </div>
            </form>
          </div>
        )}

        {step === "success" && (
          <div className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-minecraft-green/20 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-minecraft-green" />
            </div>
            <div>
              <h3 className="font-semibold">Verification Successful!</h3>
              <p className="text-sm text-muted-foreground">
                Welcome back, {username}! You can now access all features.
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
