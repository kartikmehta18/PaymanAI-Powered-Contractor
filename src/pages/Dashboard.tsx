
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import BacklogItem from '@/components/BacklogItem';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';
import { transitions } from '@/lib/animations';
import { toast } from '@/components/ui/use-toast';

// Mock data for the dashboard
const backlogData = [
  {
    id: 'bl1',
    title: 'Redesign Landing Page',
    description: 'Create a modern and engaging landing page that highlights our key features and drives conversions. Should include responsive design for mobile and tablet devices.',
    priority: 'high',
    status: 'new',
    tags: ['UI/UX', 'Web Design', 'Responsive'],
    estimatedHours: 20,
  },
  {
    id: 'bl2',
    title: 'Optimize Database Queries',
    description: 'Improve performance of our core database queries to reduce load times and handle increased traffic. Focus on the product catalog and user authentication systems.',
    priority: 'medium',
    status: 'pending',
    tags: ['Backend', 'Performance', 'SQL'],
    estimatedHours: 15,
  },
  {
    id: 'bl3',
    title: 'Mobile App User Testing',
    description: 'Conduct user testing sessions with 5-10 participants to gather feedback on the new mobile app features. Document findings and recommend improvements.',
    priority: 'low',
    status: 'completed',
    tags: ['Research', 'Mobile', 'User Experience'],
    estimatedHours: 10,
  },
  {
    id: 'bl4',
    title: 'Create API Documentation',
    description: 'Develop comprehensive API documentation for our developer portal. Include authentication, endpoints, request/response formats, and example code snippets.',
    priority: 'medium',
    status: 'new',
    tags: ['Documentation', 'API', 'Developer Experience'],
    estimatedHours: 12,
  },
];

const paymentData = [
  {
    month: 'Jan',
    amount: 15000,
  },
  {
    month: 'Feb',
    amount: 18000,
  },
  {
    month: 'Mar',
    amount: 16500,
  },
  {
    month: 'Apr',
    amount: 19000,
  },
  {
    month: 'May',
    amount: 21500,
  },
  {
    month: 'Jun',
    amount: 20000,
  },
];

const contractorStats = {
  active: 8,
  total: 24,
  new: 3,
  averageRate: 75,
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [backlogItems, setBacklogItems] = useState(backlogData);
  const [newItemDialogOpen, setNewItemDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    tags: '',
    estimatedHours: 0
  });
  
  const handleFindContractor = (itemId: string) => {
    navigate('/contractors', { state: { backlogItemId: itemId } });
  };
  
  const handleNewItemSubmit = () => {
    if (!newItem.title || !newItem.description) {
      toast({
        variant: "destructive",
        title: "Missing Fields",
        description: "Please fill in all required fields.",
      });
      return;
    }
    
    const item = {
      id: `bl${backlogItems.length + 1}`,
      title: newItem.title,
      description: newItem.description,
      priority: newItem.priority,
      status: 'new' as 'new' | 'pending' | 'processing' | 'completed',
      tags: newItem.tags.split(',').map(tag => tag.trim()),
      estimatedHours: newItem.estimatedHours || 0,
    };
    
    setBacklogItems([...backlogItems, item]);
    setNewItemDialogOpen(false);
    setNewItem({
      title: '',
      description: '',
      priority: 'medium',
      tags: '',
      estimatedHours: 0
    });
    
    toast({
      title: "Item Added",
      description: "New backlog item has been created successfully.",
    });
  };
  
  return (
    <Layout>
      <motion.div
        initial={transitions.fadeIn.initial}
        animate={transitions.fadeIn.animate}
        exit={transitions.fadeIn.exit}
        className="py-6"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-gray-500 mt-1">
              Manage your projects, contractors and payments
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button
              onClick={() => navigate('/contractors')}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              Find Contractors
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="overview" onClick={() => setActiveTab('overview')}>Overview</TabsTrigger>
            <TabsTrigger value="backlog" onClick={() => setActiveTab('backlog')}>Backlog</TabsTrigger>
            <TabsTrigger value="payments" onClick={() => setActiveTab('payments')}>Payments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatsCard
                title="Active Contractors"
                value={contractorStats.active}
                description={`Out of ${contractorStats.total} total contractors`}
                trend="+12% from last month"
                trendUp={true}
              />
              <StatsCard
                title="Avg. Hourly Rate"
                value={`$${contractorStats.averageRate}`}
                description="Based on current contracts"
                trend="-5% from last month"
                trendUp={false}
              />
              <StatsCard
                title="Backlog Items"
                value={backlogItems.filter(item => item.status === 'new').length}
                description={`Out of ${backlogItems.length} total items`}
                trend="+2 new this week"
                trendUp={true}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="overflow-hidden">
                <CardHeader className="pb-0">
                  <CardTitle className="text-lg font-medium">Contractor Payments</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={paymentData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" />
                        <YAxis 
                          tickFormatter={(value) => `$${value / 1000}k`}
                          width={80}
                        />
                        <RechartsTooltip
                          formatter={(value) => [`$${value}`, 'Amount']}
                          labelFormatter={(label) => `Month: ${label}`}
                        />
                        <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Recent Backlog Items</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {backlogItems
                    .filter(item => item.status === 'new')
                    .slice(0, 3)
                    .map(item => (
                      <div key={item.id} className="p-3 border border-gray-100 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-sm">{item.title}</h3>
                          <div className={`text-xs px-2 py-0.5 rounded-full ${
                            item.priority === 'high'
                              ? 'bg-red-100 text-red-800'
                              : item.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mb-2 line-clamp-2">{item.description}</p>
                        <div className="flex justify-between items-center">
                          <div className="flex space-x-1">
                            {item.tags.slice(0, 2).map(tag => (
                              <span key={tag} className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                                {tag}
                              </span>
                            ))}
                            {item.tags.length > 2 && (
                              <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                                +{item.tags.length - 2}
                              </span>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs h-7 px-2"
                            onClick={() => handleFindContractor(item.id)}
                          >
                            Find Contractor
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => setActiveTab('backlog')}
                  >
                    View All Backlog Items
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="backlog" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Project Backlog</h2>
              <Button variant="outline" size="sm" onClick={() => setNewItemDialogOpen(true)}>
                Add New Item
              </Button>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {backlogItems.map(item => (
                <BacklogItem
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  description={item.description}
                  priority={item.priority as 'high' | 'medium' | 'low'}
                  status={item.status as 'new' | 'pending' | 'processing' | 'completed'}
                  estimatedHours={item.estimatedHours}
                  tags={item.tags}
                  onFindContractor={
                    item.status === 'new' ? handleFindContractor : undefined
                  }
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="payments" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Payment History</h2>
              <Button
                onClick={() => navigate('/payments')}
              >
                Make Payment
              </Button>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Monthly Payment Overview</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={paymentData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" />
                    <YAxis 
                      tickFormatter={(value) => `$${value / 1000}k`}
                      width={80}
                    />
                    <RechartsTooltip
                      formatter={(value) => [`$${value}`, 'Amount']}
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <div className="flex justify-between items-center mb-4 mt-8">
              <h3 className="text-lg font-medium">Recent Payments</h3>
              <Button variant="outline" size="sm" onClick={() => navigate('/payments')}>
                View All
              </Button>
            </div>
            
            <div className="space-y-4">
              {[
                { id: 'p1', contractor: 'Sarah Johnson', project: 'Mobile App Design', amount: 1800, date: '2023-05-15', status: 'completed' },
                { id: 'p2', contractor: 'Michael Chen', project: 'API Integration', amount: 2400, date: '2023-05-10', status: 'completed' },
                { id: 'p3', contractor: 'Emily Rodriguez', project: 'Content Creation', amount: 950, date: '2023-05-05', status: 'processing' },
              ].map(payment => (
                <Card key={payment.id} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row md:items-center p-4">
                    <div className="flex-1">
                      <div className="font-medium">{payment.contractor}</div>
                      <div className="text-sm text-gray-500">{payment.project}</div>
                    </div>
                    <div className="mt-2 md:mt-0 flex justify-between md:justify-end items-center flex-1">
                      <div className="flex flex-col md:items-end">
                        <div className="font-medium">${payment.amount.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(payment.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="ml-4 md:ml-8">
                        <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          payment.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : payment.status === 'processing'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          <span className={`mr-1 h-1.5 w-1.5 rounded-full ${
                            payment.status === 'completed'
                              ? 'bg-green-400'
                              : payment.status === 'processing'
                              ? 'bg-blue-400'
                              : 'bg-yellow-400'
                          }`} />
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        {/* New Backlog Item Dialog */}
        <Dialog open={newItemDialogOpen} onOpenChange={setNewItemDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Backlog Item</DialogTitle>
              <DialogDescription>
                Create a new task or feature for your project backlog.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  placeholder="Enter task title" 
                  value={newItem.title}
                  onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe the task or feature"
                  value={newItem.description}
                  onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={newItem.priority}
                  onValueChange={(value) => setNewItem({...newItem, priority: value as 'high' | 'medium' | 'low'})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input 
                  id="tags" 
                  placeholder="e.g. Frontend, Design, UI/UX"
                  value={newItem.tags}
                  onChange={(e) => setNewItem({...newItem, tags: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hours">Estimated Hours</Label>
                <Input 
                  id="hours" 
                  type="number" 
                  placeholder="0"
                  value={newItem.estimatedHours}
                  onChange={(e) => setNewItem({...newItem, estimatedHours: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewItemDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleNewItemSubmit}>Create Item</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </Layout>
  );
};

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  trend: string;
  trendUp: boolean;
}

const StatsCard = ({ title, value, description, trend, trendUp }: StatsCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-3xl font-semibold">{value}</h3>
            <span className={`text-xs font-medium ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
              {trend}
            </span>
          </div>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default Dashboard;
