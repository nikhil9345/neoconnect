'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/components/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { FileText, Download } from 'lucide-react';

export default function PublicHubPage() {
  const { user } = useAuth();
  const [resolvedCases, setResolvedCases] = useState([]);
  const [minutes, setMinutes] = useState([]);
  
  // Minutes upload
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const fetchResolvedCases = async () => {
    try {
      const res = await api.get('/cases');
      setResolvedCases(res.data.filter((c: any) => c.status === 'Resolved'));
    } catch (e) {}
  };

  const fetchMinutes = async () => {
    try {
      const res = await api.get('/minutes');
      setMinutes(res.data);
    } catch (e) {}
  };

  useEffect(() => {
    if (user) {
      fetchResolvedCases();
      fetchMinutes();
    }
  }, [user]);

  const handleUploadMinutes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !file) return toast.error("Title and PDF file are required");
    
    try {
      const data = new FormData();
      data.append('title', title);
      data.append('file', file);
      
      await api.post('/minutes/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success("Meeting minutes uploaded");
      setTitle('');
      setFile(null);
      fetchMinutes();
    } catch (error) {
      toast.error("Failed to upload minutes");
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Public Hub</h1>
        <p className="text-muted-foreground mt-1 text-lg">Company-wide transparency and updates.</p>
      </div>

      <Tabs defaultValue="impact" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3 mb-6 bg-white border h-14">
          <TabsTrigger value="impact" className="text-md">Impact Tracking</TabsTrigger>
          <TabsTrigger value="minutes" className="text-md">Minutes Archive</TabsTrigger>
          <TabsTrigger value="digest" className="text-md hidden lg:inline-flex">Quarterly Digest</TabsTrigger>
        </TabsList>
        
        <TabsContent value="impact">
          <Card>
            <CardHeader>
              <CardTitle>Impact Tracking</CardTitle>
              <CardDescription>A transparent log of resolved feedback and our actions.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-4">Issue (Category)</th>
                      <th className="px-6 py-4">Department</th>
                      <th className="px-6 py-4 w-1/2">Resolution / Actions Taken</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resolvedCases.length === 0 ? (
                      <tr><td colSpan={3} className="px-6 py-8 text-center bg-gray-50/50">No resolved cases yet.</td></tr>
                    ) : (
                      resolvedCases.map((c: any) => {
                        // In a real app we might store specific resolution notes. Using the last note.
                        const lastNote = c.notes && c.notes.length > 0 ? c.notes[c.notes.length - 1].text : 'Resolved without notes';
                        return (
                          <tr key={c._id} className="border-b bg-white">
                            <td className="px-6 py-4 font-medium text-gray-900">
                              {c.title} <br/><span className="text-xs text-blue-600 uppercase mt-1 inline-block">{c.category}</span>
                            </td>
                            <td className="px-6 py-4">{c.department}</td>
                            <td className="px-6 py-4 text-gray-700 italic border-l">"{lastNote}"</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="minutes">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Meeting Minutes Archive</CardTitle>
                  <CardDescription>Searchable log of all official company meetings.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {minutes.length === 0 ? (
                    <div className="p-8 text-center border-2 border-dashed rounded-lg bg-gray-50 text-gray-500">
                      No meeting minutes found.
                    </div>
                  ) : (
                    minutes.map((m: any) => {
                      const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
                      return (
                        <div key={m._id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow bg-white">
                          <div className="flex gap-3 items-center">
                            <div className="p-3 bg-red-100 text-red-600 rounded-lg">
                              <FileText size={24} />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{m.title}</h3>
                              <p className="text-xs text-gray-500 mt-1">
                                Uploaded {new Date(m.createdAt).toLocaleDateString()} by {m.uploadedBy?.name || 'Admin'}
                              </p>
                            </div>
                          </div>
                          <a 
                            href={`${baseUrl}${m.fileUrl}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                            title="Download PDF"
                          >
                            <Download size={20} />
                          </a>
                        </div>
                      )
                    })
                  )}
                </CardContent>
              </Card>
            </div>

            {['Secretariat', 'Admin'].includes(user?.role || '') && (
              <div>
                <Card className="bg-slate-50">
                  <CardHeader>
                    <CardTitle className="text-lg">Upload Minutes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleUploadMinutes} className="space-y-4">
                      <div className="space-y-2">
                        <Label>Meeting Title</Label>
                        <Input required value={title} onChange={e => setTitle(e.target.value)} placeholder="E.g. Q3 Townhall" bg-white />
                      </div>
                      <div className="space-y-2">
                        <Label>PDF File</Label>
                        <Input 
                          type="file" 
                          accept=".pdf" 
                          required 
                          onChange={e => setFile(e.target.files ? e.target.files[0] : null)}
                          className="bg-white cursor-pointer"
                        />
                      </div>
                      <Button type="submit" className="w-full">Upload</Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="digest">
          <Card>
            <CardHeader>
              <CardTitle>Quarterly Digest</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none space-y-8">
                <article className="border-b pb-8">
                  <h2 className="text-2xl font-bold mb-2">Q1 Review: Focus on Employee Well-being</h2>
                  <p className="text-sm text-gray-500 font-semibold mb-4">March 15, 2026</p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Following extensive feedback through the NeoConnect platform, management has successfully converted five open work areas into focus zones. Furthermore, our cafeteria has expanded the salad bar to incorporate more diverse dietary alternatives...
                  </p>
                  <a href="#" className="text-blue-600 font-medium hover:underline">Read full article &rarr;</a>
                </article>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
