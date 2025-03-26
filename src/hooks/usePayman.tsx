
import { useState } from 'react';
import { toast } from 'sonner';

// Mock Payman SDK (in a real app, we would import the actual SDK)
// This simulates the SDK behavior for the demo
interface PaymanConfig {
  xPaymanAPISecret: string;
}

interface ContactDetails {
  email: string;
  phone?: string;
}

interface PayeeData {
  type: "US_ACH" | "USDC";
  name: string;
  accountHolderName: string;
  accountHolderType: "individual" | "business";
  accountNumber?: string;
  routingNumber?: string;
  accountType?: "checking" | "savings";
  walletAddress?: string;
  contactDetails: ContactDetails;
}

interface PaymentData {
  amountDecimal: number;
  payeeId: string;
  memo: string;
}

interface Payee {
  id: string;
  name: string;
  type: "US_ACH" | "USDC";
  created: Date;
  accountHolderName: string;
  contactDetails: ContactDetails;
}

interface Payment {
  id: string;
  status: "pending" | "processing" | "completed" | "failed";
  amountDecimal: number;
  payeeId: string;
  memo: string;
  created: Date;
}

// Mock class to simulate Payman SDK
class MockPayman {
  private apiSecret: string;
  
  constructor(config: PaymanConfig) {
    this.apiSecret = config.xPaymanAPISecret;
  }
  
  payments = {
    createPayee: async (data: PayeeData): Promise<Payee> => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validate API key (simple check for demo)
      if (!this.apiSecret || this.apiSecret === "<PAYMAN_API_SECRET>") {
        throw new Error("Invalid or missing API key");
      }
      
      // Return mock data
      return {
        id: `payee_${Math.random().toString(36).substring(2, 11)}`,
        name: data.name,
        type: data.type,
        created: new Date(),
        accountHolderName: data.accountHolderName,
        contactDetails: data.contactDetails
      };
    },
    
    sendPayment: async (data: PaymentData): Promise<Payment> => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validate API key (simple check for demo)
      if (!this.apiSecret || this.apiSecret === "<PAYMAN_API_SECRET>") {
        throw new Error("Invalid or missing API key");
      }
      
      // Return mock data
      return {
        id: `payment_${Math.random().toString(36).substring(2, 11)}`,
        status: "pending",
        amountDecimal: data.amountDecimal,
        payeeId: data.payeeId,
        memo: data.memo,
        created: new Date()
      };
    }
  };
}

// Used to mimic importing the Payman SDK
const Payman = MockPayman;

export function usePayman(apiKey?: string) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Create Payman instance with provided API key or placeholder
  const paymanClient = new Payman({
    xPaymanAPISecret: apiKey || "<PAYMAN_API_SECRET>",
  });
  
  const createPayee = async (payeeData: PayeeData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const payee = await paymanClient.payments.createPayee(payeeData);
      toast.success(`Payee "${payeeData.name}" created successfully`);
      setIsLoading(false);
      return payee;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      toast.error(`Failed to create payee: ${errorMessage}`);
      setIsLoading(false);
      throw err;
    }
  };
  
  const sendPayment = async (paymentData: PaymentData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const payment = await paymanClient.payments.sendPayment(paymentData);
      toast.success(`Payment of $${paymentData.amountDecimal.toFixed(2)} sent successfully`);
      setIsLoading(false);
      return payment;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      toast.error(`Payment failed: ${errorMessage}`);
      setIsLoading(false);
      throw err;
    }
  };
  
  return {
    createPayee,
    sendPayment,
    isLoading,
    error
  };
}

// Export types for use in other components
export type { 
  PayeeData, 
  PaymentData, 
  Payee, 
  Payment,
  ContactDetails 
};
