'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/components/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a855f7', '#ec4899', '#64748b'];

export default function AnalyticsPage() {
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/analytics/stats');
        setData(res.data);
      } catch (error) {
        console.error("Failed to fetch analytics");
      } finally {
        setLoading(false);
      }
    };

    if (user && ['Secretariat', 'Admin'].includes(user.role)) {
      fetchStats();
    } else if (user) {
      setLoading(false);
    }
  }, [user]);

  if (authLoading || loading) return <div>Loading...</div>;

  if (!['Secretariat', 'Admin'].includes(user?.role || '')) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
        <ShieldAlert size={64} className="text-red-500 opacity-50" />
        <h1 className="text-2xl font-bold text-gray-800">Access Denied</h1>
        <p className="text-gray-500">You do not have permission to view the analytics dashboard.</p>
      </div>
    );
  }

  // Format data for Recharts
  const deptData = data?.casesByDepartment.map((d: any) => ({ name: d._id, value: d.count })) || [];
  const statusData = data?.casesByStatus.map((d: any) => ({ name: d._id, value: d.count })) || [];
  const categoryData = data?.casesByCategory.map((d: any) => ({ name: d._id, value: d.count })) || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
        <p className="text-muted-foreground mt-1">System-wide statistics and intelligent hotspot detection.</p>
      </div>

      {data?.hotspots && data.hotspots.length > 0 && (
        <Card className="border-red-200 bg-red-50 shadow-sm">
          <CardHeader className="pb-3 border-b border-red-100 bg-red-50/50">
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-red-600" />
              <CardTitle className="text-red-800 text-lg">System Hotspots Detected</CardTitle>
            </div>
            <CardDescription className="text-red-600 font-medium">
              Departments experiencing an elevated volume (5+) of specific case categories.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid gap-4 md:grid-cols-3">
              {data.hotspots.map((h: any, i: number) => (
                <div key={i} className="bg-white border border-red-200 rounded-lg p-4 flex flex-col items-center justify-center text-center shadow-sm">
                  <div className="text-3xl font-black text-red-600 mb-1">{h.count}</div>
                  <div className="text-sm font-bold text-gray-900 leading-tight">Cases in {h._id.department}</div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1 border border-gray-200 px-2 py-1 rounded bg-gray-50">{h._id.category}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="min-h-[350px] flex flex-col">
          <CardHeader>
            <CardTitle>Cases by Status</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center">
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value">
                    {statusData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : <p className="text-gray-400">No data</p>}
          </CardContent>
        </Card>

        <Card className="min-h-[350px] flex flex-col">
          <CardHeader>
            <CardTitle>Cases by Department</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center">
            {deptData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={deptData} cx="50%" cy="50%" innerRadius={0} outerRadius={80} fill="#8884d8" dataKey="value" label={(props: any) => {
                    const name = props.name ?? "";
                    const percent = props.percent ?? 0;
                    return `${name} ${(percent * 100).toFixed(0)}%`;
                  }}>
                    {deptData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : <p className="text-gray-400">No data</p>}
          </CardContent>
        </Card>

        <Card className="min-h-[350px] flex flex-col lg:col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Cases by Category</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex items-end">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={categoryData} margin={{ top: 20, right: 0, left: 0, bottom: 20 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-45} textAnchor="end" />
                  <YAxis allowDecimals={false} />
                  <RechartsTooltip cursor={{ fill: '#f3f4f6' }} />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <p className="text-gray-400 m-auto">No data</p>}
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
