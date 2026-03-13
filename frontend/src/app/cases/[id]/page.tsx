'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/components/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';

export default function CaseDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [caseItem, setCaseItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [noteText, setNoteText] = useState('');

  // For updates
  const [assigneeId, setAssigneeId] = useState('');
  const [status, setStatus] = useState('');
  const [caseManagers, setCaseManagers] = useState<any[]>([]);

  const fetchCase = async () => {
    try {
      const res = await api.get(`/cases/${id}`);
      setCaseItem(res.data);
      setStatus(res.data.status);
    } catch (error) {
      toast.error('Failed to load case');
    } finally {
      setLoading(false);
    }
  };

  const fetchCaseManagers = async () => {
    try {
      const res = await api.get('/auth/case-managers');
      console.log('Case Managers loaded:', res.data);
      setCaseManagers(res.data);
      if (res.data.length === 0) {
        toast.info('No case managers found in system');
      } else {
        toast.success(`Loaded ${res.data.length} case managers`);
      }
    } catch (error) {
      console.error('Failed to load case managers', error);
      toast.error('API Error: Failed to load case managers');
    }
  };

  useEffect(() => {
    if (user && id) {
      fetchCase();
      if (['Secretariat', 'Admin'].includes(user.role)) {
        fetchCaseManagers();
      }
    }
  }, [user, id]);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    try {
      await api.post(`/cases/${id}/notes`, { text: noteText });
      setNoteText('');
      toast.success('Note added');
      fetchCase(); // Refresh
    } catch (err) {
      toast.error('Failed to add note');
    }
  };

  const handleUpdateStatus = async () => {
    try {
      await api.put(`/cases/${id}/status`, { status });
      toast.success('Status updated');
      fetchCase();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigneeId.trim()) return;
    try {
      await api.put(`/cases/${id}/assign`, { assignedTo: assigneeId });
      toast.success('Case assigned');
      fetchCase();
    } catch (err) {
      toast.error('Failed to assign case');
    }
  };

  if (loading || !caseItem) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardDescription className="uppercase tracking-wider font-semibold text-blue-600 mb-1">
                  {caseItem.trackingId}
                </CardDescription>
                <CardTitle className="text-2xl font-bold">{caseItem.title}</CardTitle>
              </div>
              <Badge variant="outline" className="text-sm px-3 py-1 font-semibold">{caseItem.status}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm bg-gray-50 p-4 rounded-lg">
              <div>
                <span className="block text-gray-500 font-medium">Category</span>
                <span className="font-semibold text-gray-900">{caseItem.category}</span>
              </div>
              <div>
                <span className="block text-gray-500 font-medium">Department</span>
                <span className="font-semibold text-gray-900">{caseItem.department}</span>
              </div>
              <div>
                <span className="block text-gray-500 font-medium">Severity</span>
                <span className="font-semibold text-gray-900">{caseItem.severity}</span>
              </div>
              <div>
                <span className="block text-gray-500 font-medium">Location</span>
                <span className="font-semibold text-gray-900">{caseItem.location}</span>
              </div>
              <div>
                <span className="block text-gray-500 font-medium">Created On</span>
                <span className="font-semibold text-gray-900">{new Date(caseItem.createdAt).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="block text-gray-500 font-medium">Reporter</span>
                <span className="font-semibold text-gray-900">{caseItem.createdBy ? caseItem.createdBy.name : 'Anonymous'}</span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{caseItem.description}</p>
            </div>

            {caseItem.attachments && caseItem.attachments.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Attachments</h3>
                <div className="flex flex-wrap gap-2">
                  {caseItem.attachments.map((file: string, idx: number) => {
                    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
                    return (
                      <a key={idx} href={`${baseUrl}${file}`} target="_blank" rel="noreferrer" className="text-blue-600 underline font-medium text-sm p-2 bg-blue-50 rounded">
                        Attachment {idx + 1}
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notes Section */}
        <Card>
          <CardHeader>
            <CardTitle>Case Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {caseItem.notes.length === 0 ? (
                <p className="text-gray-500 text-sm italic">No notes added yet.</p>
              ) : (
                caseItem.notes.map((note: any, idx: number) => (
                  <div key={idx} className="bg-white border rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-sm text-gray-900">{note.addedBy?.name || 'Unknown'}</span>
                      <span className="text-xs text-gray-500">{new Date(note.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-gray-700 text-sm whitespace-pre-wrap">{note.text}</p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleAddNote} className="pt-4 border-t mt-4 space-y-3">
              <Label>Add a new note</Label>
              <Textarea
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                placeholder="Type your note here..."
                required
              />
              <Button type="submit" variant="secondary">Add Note</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Action Sidebar */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Case Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">

            {/* Status Update (CaseMgr, Secretariat, Admin) */}
            {['CaseManager', 'Secretariat', 'Admin'].includes(user?.role || '') && (
              <div className="space-y-3">
                <Label>Update Status</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                >
                  <option value="New">New</option>
                  <option value="Assigned">Assigned</option>
                  <option value="InProgress">In Progress</option>
                  <option value="Pending">Pending</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Escalated">Escalated</option>
                </select>
                <Button onClick={handleUpdateStatus} className="w-full">Update Status</Button>
              </div>
            )}

            {/* Assignment (Secretariat, Admin) */}
            {['Secretariat', 'Admin'].includes(user?.role || '') && (
              <form onSubmit={handleAssign} className="space-y-3 pt-6 border-t">
                <Label>Assign to Case Manager</Label>
                <div className="text-xs text-gray-500 mb-2">
                  Currently assigned: <span className="font-semibold">{caseItem.assignedTo ? caseItem.assignedTo.name : 'Unassigned'}</span>
                </div>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value)}
                  required
                >
                  <option value="">Select a Case Manager</option>
                  {caseManagers.map(mgr => (
                    <option key={mgr._id} value={mgr._id}>
                      {mgr.name}
                    </option>
                  ))}
                </select>
                <Button type="submit" className="w-full" variant="outline">Assign Case</Button>
              </form>
            )}

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
