'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    escalated: 0,
    inProgress: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await api.get('/cases');
        const cases = res.data;
        
        setStats({
          total: cases.length,
          resolved: cases.filter((c: any) => c.status === 'Resolved').length,
          escalated: cases.filter((c: any) => c.status === 'Escalated').length,
          inProgress: cases.filter((c: any) => c.status === 'InProgress' || c.status === 'Assigned').length,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchCases();
    }
  }, [user]);

  if (!user || loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground mt-1 text-lg">
          {user.role === 'Staff' 
            ? "Track your submitted feedback and complaints." 
            : "Monitor and manage feedback cases."}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.resolved}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Escalated</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.escalated}</div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
