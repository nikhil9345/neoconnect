'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function SubmitCasePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    department: '',
    location: '',
    severity: 'Low',
    isAnonymous: false,
  });
  const [attachments, setAttachments] = useState<FileList | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value.toString());
      });

      if (attachments) {
        for (let i = 0; i < attachments.length; i++) {
          data.append('attachments', attachments[i]);
        }
      }

      await api.post('/cases/create', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      toast.success('Case submitted successfully!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit case');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Submit Feedback / Complaint</CardTitle>
          <CardDescription>Fill out the form below to report an issue or provide feedback.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                required 
                value={formData.title} 
                onChange={e => setFormData({ ...formData, title: e.target.value })} 
                placeholder="Brief summary of the issue"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select 
                  id="category"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background text-gray-800"
                  required
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="">Select Category</option>
                  <option value="HR">HR</option>
                  <option value="IT">IT Support</option>
                  <option value="Facilities">Facilities</option>
                  <option value="Safety">Safety & Security</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Target Department</Label>
                <Input 
                  id="department" 
                  required 
                  value={formData.department} 
                  onChange={e => setFormData({ ...formData, department: e.target.value })} 
                  placeholder="e.g. Sales, Engineering"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location" 
                  required 
                  value={formData.location} 
                  onChange={e => setFormData({ ...formData, location: e.target.value })} 
                  placeholder="Office, Floor, or Remote"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="severity">Severity</Label>
                <select 
                  id="severity"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background text-gray-800"
                  required
                  value={formData.severity}
                  onChange={e => setFormData({ ...formData, severity: e.target.value })}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Detailed Description</Label>
              <Textarea 
                id="description" 
                required 
                rows={5}
                value={formData.description} 
                onChange={e => setFormData({ ...formData, description: e.target.value })} 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="attachments">Attachments (Images or PDF)</Label>
              <Input 
                id="attachments" 
                type="file" 
                multiple 
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={e => setAttachments(e.target.files)} 
              />
            </div>

            <div className="flex items-center space-x-2 border p-4 rounded-lg bg-gray-50">
              <input 
                type="checkbox" 
                id="anonymous" 
                className="w-4 h-4 text-blue-600 rounded"
                checked={formData.isAnonymous}
                onChange={e => setFormData({ ...formData, isAnonymous: e.target.checked })}
              />
              <Label htmlFor="anonymous" className="font-semibold text-gray-700">Submit Anonymously</Label>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Case'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
