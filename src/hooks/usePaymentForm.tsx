
import { useState } from 'react';
import { getPaymanService } from '@/services/paymanService';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Base interface for all payment form data
export interface PaymentFormData {
  name: string;
  email: string;
  amount: number;
  memo?: string;
}

// ACH payment form data extends the base payment form data
export interface ACHFormData extends PaymentFormData {
  accountNumber: string;
  routingNumber: string;
  accountType: 'checking' | 'savings';
  accountHolderType: 'individual' | 'company';
}

// USDC payment form data extends the base payment form data
export interface USDCFormData extends PaymentFormData {
  walletAddress: string;
}

export const usePaymentForm = (paymentMethod: 'ACH' | 'USDC', onSuccess?: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: Partial<ACHFormData> | Partial<USDCFormData>) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const service = getPaymanService();
      let payee;

      // Ensure all required fields are present
      if (!formData.name || !formData.email || formData.amount === undefined) {
        throw new Error("Missing required fields");
      }

      // Create payee based on payment method
      if (paymentMethod === 'ACH') {
        const achData = formData as Partial<ACHFormData>;
        
        // Check for required ACH-specific fields
        if (!achData.accountNumber || !achData.routingNumber || 
            !achData.accountType || !achData.accountHolderType) {
          throw new Error("Missing required ACH account information");
        }
        
        // In a real app, this would call the Payman API via our edge function
        // const { data, error } = await supabase.functions.invoke('payman-api', {
        //   body: { 
        //     action: 'create-payee',
        //     type: 'US_ACH',
        //     name: achData.name,
        //     email: achData.email,
        //     accountNumber: achData.accountNumber,
        //     routingNumber: achData.routingNumber,
        //     accountType: achData.accountType,
        //     accountHolderType: achData.accountHolderType
        //   }
        // });
        // if (error) throw new Error(error.message);
        // payee = data;
        
        // For now, use the mock service
        payee = await service.createACHPayee({
          name: achData.name,
          email: achData.email,
          accountNumber: achData.accountNumber,
          routingNumber: achData.routingNumber,
          accountType: achData.accountType,
          accountHolderType: achData.accountHolderType,
        });
      } else {
        const usdcData = formData as Partial<USDCFormData>;
        
        // Check for required USDC-specific fields
        if (!usdcData.walletAddress) {
          throw new Error("Missing required wallet address");
        }
        
        // In a real app, this would call the Payman API via our edge function
        // const { data, error } = await supabase.functions.invoke('payman-api', {
        //   body: { 
        //     action: 'create-payee',
        //     type: 'USDC',
        //     name: usdcData.name,
        //     email: usdcData.email,
        //     walletAddress: usdcData.walletAddress
        //   }
        // });
        // if (error) throw new Error(error.message);
        // payee = data;
        
        // For now, use the mock service
        payee = await service.createUSDCPayee({
          name: usdcData.name,
          email: usdcData.email,
          walletAddress: usdcData.walletAddress,
        });
      }

      // Send payment using created payee
      // In a real app, this would call the Payman API via our edge function
      // const { data: payment, error } = await supabase.functions.invoke('payman-api', {
      //   body: { 
      //     action: 'send-payment',
      //     amountDecimal: formData.amount,
      //     payeeId: payee.id,
      //     memo: formData.memo || ''
      //   }
      // });
      // if (error) throw new Error(error.message);
      
      // For now, use the mock service
      const payment = await service.sendPayment({
        amountDecimal: formData.amount as number,
        payeeId: payee.id,
        memo: formData.memo || '',
      });

      toast({
        title: "Payment Initiated",
        description: `${paymentMethod} payment of $${formData.amount} to ${formData.name} is processing.`,
      });

      if (onSuccess) {
        onSuccess();
      }

      return { payee, payment };
    } catch (err) {
      console.error('Payment submission error:', err);
      const message = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(message);
      
      toast({
        variant: "destructive",
        title: "Payment Failed",
        description: message,
      });
      
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit,
    isSubmitting,
    error,
  };
};

export default usePaymentForm;
