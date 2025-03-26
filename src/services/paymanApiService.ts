
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

// Types for Payman API requests
export interface CreatePayeeRequest {
  type: 'US_ACH' | 'USDC' | 'CRYPTO_ADDRESS';
  name: string;
  email: string;
  walletAddress?: string;
  accountNumber?: string;
  routingNumber?: string;
  accountType?: 'checking' | 'savings';
  accountHolderType?: 'individual' | 'company';
}

export interface SendPaymentRequest {
  amountDecimal: number;
  payeeId: string;
  memo: string;
}

class PaymanApiService {
  private apiKey: string | null = null;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || "Fueg=="; // Default API key
    console.log("PaymanApiService initialized with API key:", this.apiKey);
  }

  // Set API key
  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
    console.log("API key updated:", apiKey);
  }

  // Create a payee
  async createPayee(data: CreatePayeeRequest) {
    console.log("Creating payee with data:", data);
    try {
      const { data: response, error } = await supabase.functions.invoke('payman-api', {
        body: { 
          ...data
        },
        headers: { 'x-payman-api-secret': this.apiKey || "Fueg==" }
      });

      if (error) {
        console.error("Error from Supabase edge function:", error);
        throw new Error(`Error creating payee: ${error.message}`);
      }

      console.log("Payee created successfully:", response);
      return response;
    } catch (error) {
      console.error('Error creating payee:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create payee',
      });
      throw error;
    }
  }

  // Send a payment
  async sendPayment(data: SendPaymentRequest) {
    console.log("Sending payment with data:", data);
    try {
      const { data: response, error } = await supabase.functions.invoke('payman-api', {
        body: { 
          ...data
        },
        headers: { 'x-payman-api-secret': this.apiKey || "Fueg==" }
      });

      if (error) {
        console.error("Error from Supabase edge function:", error);
        throw new Error(`Error sending payment: ${error.message}`);
      }

      console.log("Payment sent successfully:", response);
      return response;
    } catch (error) {
      console.error('Error sending payment:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send payment',
      });
      throw error;
    }
  }

  // Search for payees
  async searchPayees() {
    console.log("Searching for payees");
    try {
      const { data: response, error } = await supabase.functions.invoke('payman-api', {
        headers: { 'x-payman-api-secret': this.apiKey || "Fueg==" }
      });

      if (error) {
        console.error("Error from Supabase edge function:", error);
        throw new Error(`Error searching payees: ${error.message}`);
      }

      console.log("Payees retrieved successfully:", response);
      return response;
    } catch (error) {
      console.error('Error searching payees:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to search payees',
      });
      throw error;
    }
  }

  // Get balance
  async getBalance(currency: string = 'USD') {
    console.log(`Getting balance for currency: ${currency}`);
    try {
      const { data: response, error } = await supabase.functions.invoke('payman-api', {
        body: { 
          currency 
        },
        headers: { 'x-payman-api-secret': this.apiKey || "Fueg==" }
      });

      if (error) {
        console.error("Error from Supabase edge function:", error);
        throw new Error(`Error getting balance: ${error.message}`);
      }

      console.log("Balance retrieved successfully:", response);
      return response;
    } catch (error) {
      console.error('Error getting balance:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to get balance',
      });
      throw error;
    }
  }
}

// Create singleton instance
export const paymanApiService = new PaymanApiService("Fueg==");
export default paymanApiService;

