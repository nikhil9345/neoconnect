'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/AuthProvider';
import { Eye } from 'lucide-react';

export default function CasesPage() {
  const { user } = useAuth();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await api.get('/cases');
        setCases(res.data);
      } catch (error) {
        console.error("Failed to fetch cases");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchCases();
    }
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800';
      case 'Assigned': return 'bg-purple-100 text-purple-800';
      case 'InProgress': return 'bg-yellow-100 text-yellow-800';
      case 'Pending': return 'bg-orange-100 text-orange-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'Escalated': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'text-red-600 font-bold';
      case 'High': return 'text-orange-600 font-semibold';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) return <div>Loading cases...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cases Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage and track cases.</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                <tr>
                  <th scope="col" className="px-6 py-4">Tracking ID</th>
                  <th scope="col" className="px-6 py-4">Title</th>
                  <th scope="col" className="px-6 py-4">Category</th>
                  <th scope="col" className="px-6 py-4">Severity</th>
                  <th scope="col" className="px-6 py-4">Status</th>
                  <th scope="col" className="px-6 py-4">Date</th>
                  <th scope="col" className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cases.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      No cases found.
                    </td>
                  </tr>
                ) : (
                  cases.map((c: any) => (
                    <tr key={c._id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {c.trackingId}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-800 max-w-xs truncate">
                        {c.title}
                      </td>
                      <td className="px-6 py-4">
                        {c.category}
                      </td>
                      <td className={`px-6 py-4 ${getSeverityColor(c.severity)}`}>
                        {c.severity}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(c.status)}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/cases/${c._id}`} className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-900 hover:underline font-medium">
                          <Eye size={16} /> View
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
