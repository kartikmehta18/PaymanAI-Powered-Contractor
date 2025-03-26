
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import PaymentForm from '@/components/PaymentForm';
import PaymentHistory from '@/components/PaymentHistory';
import { usePaymanService } from '@/hooks/usePaymanService';
import { motion } from 'framer-motion';
import { transitions } from '@/lib/animations';
import { StatusType } from '@/components/StatusBadge';
import { supabase } from '@/integrations/supabase/client';

// Mock payment data for stats
const mockPaymentStats = {
  total: 12600,
  pending: 950,
  thisMonth: 4450
};

const Payments = () => {
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'ACH' | 'USDC'>('ACH');
  const [activeTab, setActiveTab] = useState('all');
  const [balanceData, setBalanceData] = useState({ usd: 0, usdc: 0 });
  
  // Get Payman service
  const { isInitialized } = usePaymanService();
  
  const handlePaymentSuccess = () => {
    setPaymentDialogOpen(false);
  };

  // Fetch balance data
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        // In a real app, this would call the Payman API via our edge function
        // const { data } = await supabase.functions.invoke('payman-api', {
        //   body: { action: 'get-balance' }
        // });
        // setBalanceData(data);
        
        // For now, just use mock data
        setBalanceData({ usd: 15000, usdc: 5000 });
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    };

    if (isInitialized) {
      fetchBalance();
    }
  }, [isInitialized]);
  
  return (
    <Layout>
      <motion.div
        initial={transitions.fadeIn.initial}
        animate={transitions.fadeIn.animate}
        exit={transitions.fadeIn.exit}
        className="py-6"
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
            <p className="text-gray-500 mt-1">
              Manage your contractor payments and transaction history
            </p>
          </div>
          <Button
            onClick={() => setPaymentDialogOpen(true)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            disabled={!isInitialized}
          >
            New Payment
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Available Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">
                ${balanceData.usd.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">USD</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Pending Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">
                ${mockPaymentStats.pending.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">Awaiting processing</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">
                ${mockPaymentStats.thisMonth.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">Current month total</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs 
          defaultValue="all" 
          className="space-y-6"
          onValueChange={setActiveTab}
        >
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="all">All Payments</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="failed">Failed</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all" className="space-y-0">
            <PaymentHistory />
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-0">
            <PaymentHistory statusFilter="completed" />
          </TabsContent>
          
          <TabsContent value="pending" className="space-y-0">
            <PaymentHistory statusFilter="processing" />
          </TabsContent>
          
          <TabsContent value="failed" className="space-y-0">
            <PaymentHistory statusFilter="failed" />
          </TabsContent>
        </Tabs>
        
        <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>New Payment</DialogTitle>
              <DialogDescription>
                Send a payment to a contractor or vendor
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="ach" className="w-full" onValueChange={(value) => setPaymentMethod(value as 'ACH' | 'USDC')}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="ach">ACH Transfer</TabsTrigger>
                <TabsTrigger value="usdc">USDC Payment</TabsTrigger>
              </TabsList>
              
              <TabsContent value="ach">
                <PaymentForm
                  onSuccess={handlePaymentSuccess}
                  paymentMethod="ACH"
                />
              </TabsContent>
              
              <TabsContent value="usdc">
                <PaymentForm
                  onSuccess={handlePaymentSuccess}
                  paymentMethod="USDC"
                />
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </motion.div>
    </Layout>
  );
};

export default Payments;
