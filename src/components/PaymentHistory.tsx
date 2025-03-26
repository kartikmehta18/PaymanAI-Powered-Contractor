
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { getPaymanService } from '@/services/paymanService';
import { toast } from '@/components/ui/use-toast';
import type { StatusType } from '@/components/StatusBadge';
import { useParams, useSearchParams } from 'react-router-dom';
import PaymentTable from './payments/PaymentTable';
import { Payment } from './payments/PaymentTableRow';
import { fetchPayments } from '@/services/supabaseService';

interface PaymentHistoryProps {
  statusFilter?: StatusType;
}

const PaymentHistory = ({ statusFilter }: PaymentHistoryProps) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  
  const fetchPaymentData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Fetching payments...");
      // Try to get payments from Supabase first
      try {
        const data = await fetchPayments();
        setPayments(data);
        console.log("Fetched payments from Supabase:", data);
      } catch (supabaseErr) {
        console.error('Error fetching payments from Supabase, falling back to mock service:', supabaseErr);
        
        // Fall back to the mock service
        const service = getPaymanService();
        const result = await service.getPayments();
        console.log("Fetched payments from mock service:", result);
        setPayments(result);
      }
    } catch (err) {
      console.error('Error fetching payments:', err);
      const message = err instanceof Error ? err.message : 'Failed to load payments';
      setError(message);
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentData();
    
    // Set up polling to refresh payment statuses
    const intervalId = setInterval(() => {
      fetchPaymentData();
    }, 10000); // Poll every 10 seconds
    
    return () => clearInterval(intervalId);
  }, []);

  // Filter payments based on statusFilter prop
  useEffect(() => {
    if (statusFilter && payments.length > 0) {
      console.log(`Filtering payments by status: ${statusFilter}`);
      setFilteredPayments(payments.filter(payment => payment.status === statusFilter));
    } else {
      setFilteredPayments(payments);
    }
  }, [statusFilter, payments]);

  // Use filtered payments instead of the full list
  const displayPayments = filteredPayments;

  return (
    <Card>
      <CardContent className="p-0">
        <PaymentTable 
          payments={displayPayments}
          isLoading={isLoading}
          error={error}
          onRefresh={fetchPaymentData}
        />
      </CardContent>
    </Card>
  );
};

export default PaymentHistory;
