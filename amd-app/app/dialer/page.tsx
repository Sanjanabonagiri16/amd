"use client";
import { useState } from "react";
import { Phone, Loader2, UserCheck, Bot, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const STRATEGIES = [
  { id: "twilio_native", label: "Twilio Native AMD", desc: "Fast, reliable, 1-3s detection" },
  { id: "jambonz_sip", label: "Jambonz SIP AMD", desc: "Open-source SIP-based" },
  { id: "hf_service", label: "Hugging Face ML", desc: "AI-powered wav2vec2" },
  { id: "gemini_flash", label: "Google Gemini Flash", desc: "Ultra-fast speech pipeline" }
];

type CallStatus = "idle" | "connecting" | "in-call" | "completed" | "error";

export default function DialerPage() {
  const [phone, setPhone] = useState("");
  const [strategy, setStrategy] = useState(STRATEGIES[0].id);
  const [status, setStatus] = useState<CallStatus>("idle");
  const [result, setResult] = useState<{ type: "human" | "machine" | null; confidence?: number }>({ type: null });
  const [callSid, setCallSid] = useState<string | null>(null);

  const handleDial = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("connecting");
    setResult({ type: null });
    
    try {
      const res = await fetch("/api/calls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, strategy })
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Failed to initiate call");
      
      setCallSid(data.callSid);
      setStatus("in-call");
      toast.success("Call initiated successfully!");
      
      // Simulate AMD result after 3 seconds (replace with real SSE/webhook)
      setTimeout(() => {
        const mockResult = Math.random() > 0.5 ? "human" : "machine";
        setResult({ type: mockResult, confidence: 0.85 + Math.random() * 0.1 });
        setStatus("completed");
        toast.success(`Detected: ${mockResult.toUpperCase()}`);
      }, 3000);
      
    } catch (error: any) {
      setStatus("error");
      toast.error(error.message);
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "connecting": return "text-blue-500";
      case "in-call": return "text-yellow-500";
      case "completed": return result.type === "human" ? "text-green-500" : "text-orange-500";
      case "error": return "text-red-500";
      default: return "text-muted-foreground";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "connecting":
      case "in-call":
        return <Loader2 className="h-5 w-5 animate-spin" />;
      case "completed":
        return result.type === "human" ? <UserCheck className="h-5 w-5" /> : <Bot className="h-5 w-5" />;
      case "error":
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <Phone className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Telephony Dialer</h1>
        <p className="text-muted-foreground">Place outbound calls with AMD detection</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Make a Call</CardTitle>
            <CardDescription>Enter phone number and select AMD strategy</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleDial} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number</label>
                <Input
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  disabled={status === "connecting" || status === "in-call"}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">AMD Strategy</label>
                <Select
                  value={strategy}
                  onChange={(e) => setStrategy(e.target.value)}
                  disabled={status === "connecting" || status === "in-call"}
                >
                  {STRATEGIES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </Select>
                <p className="text-xs text-muted-foreground">
                  {STRATEGIES.find(s => s.id === strategy)?.desc}
                </p>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={status === "connecting" || status === "in-call"}
              >
                {status === "connecting" || status === "in-call" ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {status === "connecting" ? "Connecting..." : "In Call..."}
                  </>
                ) : (
                  <>
                    <Phone className="mr-2 h-5 w-5" />
                    Dial
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Call Status</CardTitle>
            <CardDescription>Real-time call information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={getStatusColor()}>
                {getStatusIcon()}
              </div>
              <div>
                <p className="font-medium capitalize">{status.replace("-", " ")}</p>
                {callSid && <p className="text-xs text-muted-foreground">SID: {callSid}</p>}
              </div>
            </div>

            {result.type && (
              <div className="rounded-lg border bg-muted/50 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {result.type === "human" ? (
                      <UserCheck className="h-5 w-5 text-green-500" />
                    ) : (
                      <Bot className="h-5 w-5 text-orange-500" />
                    )}
                    <span className="font-medium capitalize">{result.type} Detected</span>
                  </div>
                  <Badge variant={result.type === "human" ? "default" : "secondary"}>
                    {((result.confidence || 0) * 100).toFixed(0)}% confidence
                  </Badge>
                </div>
              </div>
            )}

            {status === "idle" && (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <Phone className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">No active call</p>
              </div>
            )}

            {(status === "connecting" || status === "in-call") && (
              <div className="space-y-2">
                <div className="h-16 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-pulse" />
                <p className="text-xs text-center text-muted-foreground">Analyzing audio...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Strategy Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {STRATEGIES.map((s) => (
              <div
                key={s.id}
                className={`rounded-lg border p-4 transition-colors ${
                  strategy === s.id ? "border-primary bg-primary/5" : "border-border"
                }`}
              >
                <h4 className="font-medium">{s.label}</h4>
                <p className="mt-1 text-xs text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
