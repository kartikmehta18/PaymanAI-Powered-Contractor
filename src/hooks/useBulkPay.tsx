
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { Contractor } from '@/components/contractors/ContractorInterface';
import { addPayment } from '@/services/supabaseService';
import { getPaymanService } from '@/services/paymanService';

export function useBulkPay(
  contractors: Contractor[], 
  selectedContractors: string[], 
  clearSelectedContractors: () => void,
  isInitialized: boolean
) {
  const [bulkPayOpen, setBulkPayOpen] = useState<boolean>(false);
  const [bulkAmount, setBulkAmount] = useState<string>('');
  const [bulkMemo, setBulkMemo] = useState<string>('');
  const navigate = useNavigate();
  
  const handleBulkPay = async () => {
    if (!bulkAmount || parseFloat(bulkAmount) <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: "Please enter a valid payment amount.",
      });
      return;
    }
    
    if (selectedContractors.length === 0) {
      toast({
        variant: "destructive",
        title: "No Contractors Selected",
        description: "Please select at least one contractor to pay.",
      });
      return;
    }
    
    try {
      if (!isInitialized) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Payman service not initialized. Please check your API key.",
        });
        return;
      }
      
      const service = getPaymanService();
      const amount = parseFloat(bulkAmount);
      const memo = bulkMemo || `Bulk payment - ${new Date().toLocaleDateString()}`;
      
      // Get selected contractors
      const selectedContractorDetails = contractors
        .filter(c => selectedContractors.includes(c.id))
        .map(c => ({
          id: c.id,
          name: c.name,
          email: c.email,
          amount: amount
        }));
      
      // Process bulk payment
      const results = await service.bulkPayContractors(selectedContractorDetails, memo);
      
      // Store payments in Supabase
      for (const contractor of selectedContractorDetails) {
        await addPayment({
          contractorId: contractor.id,
          amount: contractor.amount,
          memo: memo,
          paymentMethod: 'BULK',
          status: 'processing'
        });
      }
      
      toast({
        title: "Bulk Payment Initiated",
        description: `Payments to ${selectedContractorDetails.length} contractors have been initiated.`,
      });
      
      // Close dialog and reset values
      setBulkPayOpen(false);
      setBulkAmount('');
      setBulkMemo('');
      clearSelectedContractors();
      
      // Navigate to payments page to see the results
      navigate('/payments');
      
    } catch (error) {
      console.error("Error processing bulk payment:", error);
      toast({
        variant: "destructive",
        title: "Bulk Payment Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  };
  
  return {
    bulkPayOpen,
    setBulkPayOpen,
    bulkAmount,
    setBulkAmount,
    bulkMemo,
    setBulkMemo,
    handleBulkPay
  };
}
