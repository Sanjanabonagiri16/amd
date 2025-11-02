"use client";
import { useEffect, useState } from "react";
import { Search, Download, Filter, UserCheck, Bot, Phone, AlertCircle, ChevronDown } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type CallRow = {
  id: string;
  createdAt: string;
  phone: string;
  strategy: string;
  status: string;
  rawResult?: any;
  callSid?: string;
};

export default function HistoryPage() {
  const [calls, setCalls] = useState<CallRow[]>([]);
  const [filteredCalls, setFilteredCalls] = useState<CallRow[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [strategyFilter, setStrategyFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  useEffect(() => {
    const fetchCalls = async () => {
      const res = await fetch("/api/calls");
      const data = await res.json();
      setCalls(data.items || []);
      setFilteredCalls(data.items || []);
    };
    fetchCalls();
    const interval = setInterval(fetchCalls, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let filtered = calls;

    if (searchQuery) {
      filtered = filtered.filter(c => 
        c.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.callSid?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (strategyFilter !== "all") {
      filtered = filtered.filter(c => c.strategy === strategyFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    setFilteredCalls(filtered);
  }, [searchQuery, strategyFilter, statusFilter, calls]);

  const handleExport = () => {
    window.location.href = "/api/calls/export";
    toast.success("Exporting call history...");
  };

  const getStatusIcon = (call: any) => {
    // Parse rawResult if it's a string
    let result = call.rawResult;
    if (typeof result === 'string') {
      try {
        result = JSON.parse(result);
      } catch (e) {
        result = {};
      }
    }
    const amdStatus = result?.amdStatus;
    if (amdStatus === 'human') return <UserCheck className="h-4 w-4 text-green-500" />;
    if (amdStatus === 'machine') return <Bot className="h-4 w-4 text-orange-500" />;
    return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      completed: "default",
      initiated: "secondary",
      error: "destructive"
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Call History</h1>
        <p className="text-muted-foreground">View and manage your call logs</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Search and filter your call history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by phone or Call SID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={strategyFilter} onChange={(e) => setStrategyFilter(e.target.value)}>
              <option value="all">All Strategies</option>
              <option value="twilio_native">Twilio Native</option>
              <option value="jambonz_sip">Jambonz SIP</option>
              <option value="hf_service">Hugging Face</option>
              <option value="gemini_flash">Gemini Flash</option>
            </Select>

            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Statuses</option>
              <option value="initiated">Initiated</option>
              <option value="completed">Completed</option>
              <option value="error">Error</option>
            </Select>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredCalls.length} of {calls.length} calls
            </p>
            <Button onClick={handleExport} variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Call History Table */}
      <Card>
        <CardContent className="p-0">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-4 text-left text-sm font-medium">Time</th>
                  <th className="p-4 text-left text-sm font-medium">Phone</th>
                  <th className="p-4 text-left text-sm font-medium">Strategy</th>
                  <th className="p-4 text-left text-sm font-medium">Result</th>
                  <th className="p-4 text-left text-sm font-medium">Status</th>
                  <th className="p-4 text-left text-sm font-medium">Call SID</th>
                  <th className="p-4 text-left text-sm font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {filteredCalls.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center">
                      <Phone className="mx-auto h-12 w-12 text-muted-foreground/50" />
                      <p className="mt-2 text-sm text-muted-foreground">No calls found</p>
                    </td>
                  </tr>
                ) : (
                  filteredCalls.map((call) => (
                    <>
                      <tr
                        key={call.id}
                        className="border-b transition-colors hover:bg-muted/50 cursor-pointer"
                        onClick={() => setExpandedRow(expandedRow === call.id ? null : call.id)}
                      >
                        <td className="p-4 text-sm">
                          {new Date(call.createdAt).toLocaleString()}
                        </td>
                        <td className="p-4 text-sm font-medium">{call.phone}</td>
                        <td className="p-4 text-sm">{call.strategy}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(call)}
                            <span className="text-sm capitalize">
                              {(() => {
                                let result = call.rawResult;
                                if (typeof result === 'string') {
                                  try { result = JSON.parse(result); } catch (e) { return 'N/A'; }
                                }
                                return result?.amdStatus || 'N/A';
                              })()}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">{getStatusBadge(call.status)}</td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {call.callSid || 'N/A'}
                        </td>
                        <td className="p-4">
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${
                              expandedRow === call.id ? 'rotate-180' : ''
                            }`}
                          />
                        </td>
                      </tr>
                      {expandedRow === call.id && (
                        <tr className="border-b bg-muted/20">
                          <td colSpan={7} className="p-4">
                            <div className="space-y-2 text-sm">
                              <div className="flex gap-2">
                                <span className="font-medium">Call ID:</span>
                                <span className="text-muted-foreground">{call.id}</span>
                              </div>
                              {call.rawResult && (
                                <div className="flex gap-2">
                                  <span className="font-medium">Raw Result:</span>
                                  <code className="text-xs bg-muted px-2 py-1 rounded">
                                    {JSON.stringify(call.rawResult)}
                                  </code>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3 p-4">
            {filteredCalls.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Phone className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">No calls found</p>
              </div>
            ) : (
              filteredCalls.map((call) => (
                <Card key={call.id}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(call)}
                        <span className="font-medium">{call.phone}</span>
                      </div>
                      {getStatusBadge(call.status)}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Strategy:</span>
                        <p className="font-medium">{call.strategy}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Result:</span>
                        <p className="font-medium capitalize">
                          {call.rawResult?.amdStatus || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(call.createdAt).toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
