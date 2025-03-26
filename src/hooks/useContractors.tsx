import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Contractor } from '@/components/contractors/ContractorInterface';
import { 
  fetchContractors, 
  addContractor, 
  updateContractorStatus, 
  addPayment 
} from '@/services/supabaseService';
import { usePaymanService } from '@/hooks/usePaymanService';
import { getPaymanService } from '@/services/paymanService';

export function useContractors() {
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedContractors, setSelectedContractors] = useState<string[]>([]);
  
  const { isInitialized } = usePaymanService();
  
  // Fetch contractors from Supabase on component mount
  useEffect(() => {
    loadContractors();
  }, []);
  
  const loadContractors = async () => {
    setLoading(true);
    try {
      const data = await fetchContractors();
      setContractors(data);
    } catch (error) {
      console.error('Error loading contractors:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load contractors. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Function to handle adding a new contractor
  const handleAddContractor = async (contractor: Omit<Contractor, 'id' | 'status'>) => {
    try {
      const newContractor = await addContractor({
        ...contractor,
        status: 'pending'
      });
      
      // Add to contractors list
      setContractors([newContractor, ...contractors]);
      
      toast({
        title: "Contractor Added",
        description: `${contractor.name} has been added as a contractor.`,
      });
      
      return true;
    } catch (error) {
      console.error("Error adding contractor:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add contractor. Please try again.",
      });
      return false;
    }
  };
  
  const handlePay = async (contractor: Contractor) => {
    try {
      if (!contractor.id) {
        throw new Error("Contractor ID is required");
      }

      if (!isInitialized) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Payman service not initialized. Please check your API key in Settings.",
        });
        return;
      }

      const service = getPaymanService();

      // Create a test payee first
      const test_payee = await service.payments.createPayee({
        type: "TEST_RAILS",
        name: contractor.name,
        tags: ["test", "contractor"]
      });

      if (!test_payee?.id) {
        throw new Error("Failed to create test payee");
      }

      // Send payment using the test payee ID
      const payment = await service.payments.sendPayment({
        amountDecimal: contractor.rate,
        payeeId: test_payee.id,
        memo: `Payment for ${contractor.name} - ${new Date().toLocaleDateString()}`,
        metadata: {
          contractorId: contractor.id,
          department: "contractors"
        }
      });

      // Store payment record in Supabase
      await addPayment({
        contractorId: contractor.id,
        amount: contractor.rate,
        memo: payment.memo,
        paymentMethod: 'TEST_RAILS',
        payeeId: test_payee.id,
        status: payment.status || 'pending',
        externalPaymentId: payment.id
      });

      toast({
        title: "Payment Initiated",
        description: `Payment to ${contractor.name} has been initiated.`,
      });

      // Update contractor status if needed
      if (contractor.status === 'pending') {
        await updateContractorStatus(contractor.id, 'active');
        setContractors(prevContractors => 
          prevContractors.map(c => 
            c.id === contractor.id ? { ...c, status: 'active' } : c
          )
        );
      }

    } catch (error) {
      console.error("Error paying contractor:", error);
      toast({
        variant: "destructive",
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  };
  
  const handleActivateContractor = async (contractor: Contractor) => {
    try {
      await updateContractorStatus(contractor.id, 'active');
      
      // Update the local state
      setContractors(prevContractors => 
        prevContractors.map(c => 
          c.id === contractor.id ? { ...c, status: 'active' } : c
        )
      );
      
      toast({
        title: "Contractor Activated",
        description: `${contractor.name} has been activated.`,
      });
    } catch (error) {
      console.error("Error activating contractor:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to activate contractor. Please try again.",
      });
    }
  };
  
  const handleDeactivateContractor = async (contractor: Contractor) => {
    try {
      await updateContractorStatus(contractor.id, 'inactive');
      
      // Update the local state
      setContractors(prevContractors => 
        prevContractors.map(c => 
          c.id === contractor.id ? { ...c, status: 'inactive' } : c
        )
      );
      
      toast({
        title: "Contractor Deactivated",
        description: `${contractor.name} has been deactivated.`,
      });
    } catch (error) {
      console.error("Error deactivating contractor:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to deactivate contractor. Please try again.",
      });
    }
  };
  
  const toggleContractorSelection = (contractorId: string) => {
    setSelectedContractors(prev => {
      if (prev.includes(contractorId)) {
        return prev.filter(id => id !== contractorId);
      } else {
        return [...prev, contractorId];
      }
    });
  };
  
  const clearSelectedContractors = () => {
    setSelectedContractors([]);
  };
  
  return {
    contractors,
    loading,
    selectedContractors,
    isInitialized,
    handleAddContractor,
    handlePay,
    handleActivateContractor,
    handleDeactivateContractor,
    toggleContractorSelection,
    clearSelectedContractors
  };
}
