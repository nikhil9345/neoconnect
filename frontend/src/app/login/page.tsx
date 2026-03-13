'use client';

import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner";
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('Staff');
  const [regDept, setRegDept] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data, res.data.token);
      toast.success("Login successful");
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/register', {
        name: regName,
        email: regEmail,
        password: regPassword,
        role: regRole,
        department: regDept
      });
      login(res.data, res.data.token);
      toast.success("Registration successful");
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-blue-600 font-bold">NeoConnect</CardTitle>
          <CardDescription>Staff Feedback & Case Management</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="regName">Name</Label>
                  <Input id="regName" value={regName} onChange={e => setRegName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="regEmail">Email</Label>
                  <Input id="regEmail" type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="regPassword">Password</Label>
                  <Input id="regPassword" type="password" value={regPassword} onChange={e => setRegPassword(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="regDept">Department</Label>
                  <Input id="regDept" value={regDept} onChange={e => setRegDept(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Role (For demo purposes)</Label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    value={regRole} 
                    onChange={e => setRegRole(e.target.value)}
                  >
                    <option value="Staff">Staff</option>
                    <option value="CaseManager">Case Manager</option>
                    <option value="Secretariat">Secretariat</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Registering...' : 'Register'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
