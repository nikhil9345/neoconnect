'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/components/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function PollsPage() {
  const { user } = useAuth();
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  // New poll formulation
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);

  const fetchPolls = async () => {
    try {
      const res = await api.get('/polls');
      setPolls(res.data);
    } catch (error) {
      toast.error('Failed to load polls');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchPolls();
  }, [user]);

  const handleCreatePoll = async (e: React.FormEvent) => {
    e.preventDefault();
    const validOptions = options.filter(o => o.trim() !== '');
    if (validOptions.length < 2) {
      return toast.error("Provide at least 2 options");
    }
    try {
      await api.post('/polls', { question, options: validOptions });
      toast.success('Poll created successfully');
      setQuestion('');
      setOptions(['', '']);
      fetchPolls();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create poll');
    }
  };

  const handleVote = async (pollId: string, optionIndex: number) => {
    try {
      await api.post(`/polls/${pollId}/vote`, { optionIndex });
      toast.success('Vote recorded!');
      fetchPolls();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to vote');
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Active Polls</h1>
        <p className="text-muted-foreground mt-1">Vote on company decisions and policies.</p>
      </div>

      {['Secretariat', 'Admin'].includes(user?.role || '') && (
        <Card className="bg-blue-50/50 border-blue-100">
          <CardHeader>
            <CardTitle className="text-blue-800">Create New Poll</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreatePoll} className="space-y-4">
              <div className="space-y-2">
                <Label>Question / Topic</Label>
                <Input required value={question} onChange={e => setQuestion(e.target.value)} placeholder="E.g. Where should we host the annual retreat?" />
              </div>
              <div className="space-y-2">
                <Label>Options</Label>
                {options.map((opt, i) => (
                  <div key={i} className="flex gap-2">
                    <Input value={opt} onChange={e => updateOption(i, e.target.value)} placeholder={`Option ${i + 1}`} />
                  </div>
                ))}
                <div className="pt-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => setOptions([...options, ''])}>
                    + Add Option
                  </Button>
                </div>
              </div>
              <Button type="submit">Create Poll</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {polls.map((poll: any) => {
          // Format data for Recharts
          const chartData = poll.votes.map((v: any) => ({
            name: poll.options[v.optionIndex],
            votes: v.count
          }));
          const totalVotes = poll.votes.reduce((acc: number, curr: any) => acc + curr.count, 0);

          return (
            <Card key={poll._id} className="flex flex-col">
              <CardHeader>
                <CardDescription>Created: {new Date(poll.createdAt).toLocaleDateString()}</CardDescription>
                <CardTitle className="leading-tight">{poll.question}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col space-y-6">
                
                {/* Voting Section */}
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">Cast your vote</p>
                  {poll.options.map((opt: string, idx: number) => (
                    <Button 
                      key={idx} 
                      variant="outline" 
                      className="w-full justify-start font-normal hover:bg-blue-50 hover:text-blue-700" 
                      onClick={() => handleVote(poll._id, idx)}
                    >
                      {opt}
                    </Button>
                  ))}
                </div>

                {/* Results Section */}
                {totalVotes > 0 && (
                  <div className="flex-1 pt-4 border-t mt-auto">
                    <p className="text-sm font-semibold text-gray-500 mb-4">{totalVotes} Total Votes</p>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                          <XAxis type="number" hide />
                          <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                          <Tooltip cursor={{fill: 'transparent'}} />
                          <Bar dataKey="votes" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
