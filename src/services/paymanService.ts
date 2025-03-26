// This is a mock service that simulates interactions with the Payman API
// In a real application, you would use the actual Payman SDK

import Payman from 'paymanai';

/**
 * PaymanService - A service wrapper for the Payman AI SDK
 * 
 * This service uses your provided test credentials:
 * Test Payee IDs:
 * - pd-1f0070b2-9392-6b45-8627-2f9ab6ad006a
 * - pd-1f00645e-678f-6a5d-82c2-2f0e5fd60eb7
 */

export interface PayeeDetails {
  name: string;
  email: string;
  accountType?: "checking" | "savings";
  accountNumber?: string;
  routingNumber?: string;
  accountHolderType?: "individual" | "business";
}

export interface CryptoPayeeDetails {
  name: string;
  email: string;
  address: string;
}

export interface PaymentDetails {
  amountDecimal: number;
  payeeId: string;
  memo: string;
  metadata?: Record<string, any>;
}

/**
 * Response type for payee-related API calls
 * Note: These types are based on the API documentation and actual responses,
 * but may need to be updated when official type definitions are available
 */
interface PaymanPayeeResponse {
  id: string;
  type: string;
  name: string;
  status: string;
  contactDetails: {
    email: string;
  };
}

/**
 * Response type for payment-related API calls
 * Note: These types are based on the API documentation and actual responses,
 * but may need to be updated when official type definitions are available
 */
interface PaymanPaymentResponse {
  id: string;
  status: string;
  amount: string;
  payeeId: string;
  memo: string;
  metadata?: Record<string, any>;
}

class PaymanService {
  private client: Payman;
  public payments: any; // Expose the payments namespace
  private payees: Record<string, any> = {};
  private paymentsRecord: Record<string, any> = {}; // Renamed from payments to avoid conflict
  private paymentCounter = 0;
  private payeeCounter = 0;
  private balances = {
    USD: 50000, // $50,000 mock balance
    USDC: 10000 // $10,000 mock USDC balance
  };

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('API key is required to initialize PaymanService');
    }
    
    if (apiKey.length < 32) {
      throw new Error('Invalid API key: Key must be at least 32 characters long');
    }
    
    if (!/^[A-Za-z0-9+/=_-]+$/.test(apiKey)) {
      throw new Error('Invalid API key format');
    }

    this.client = new Payman({
      xPaymanAPISecret: apiKey,
    });
    
    // Expose the payments namespace
    this.payments = this.client.payments;
    
    console.log("PaymanService initialized successfully");
  }

  private validateApiKey() {
    if (!this.client) {
      throw new Error('PaymanService not initialized: Missing API key');
    }
  }

  async createACHPayee(details: PayeeDetails) {
    this.validateApiKey();
    try {
      const response = await this.client.payments.createPayee({
        type: "US_ACH",
        name: details.name,
        accountHolderName: details.name,
        accountHolderType: details.accountHolderType || "individual",
        accountNumber: details.accountNumber || "",
        routingNumber: details.routingNumber || "",
        accountType: details.accountType || "checking",
        contactDetails: {
          email: details.email,
        },
      });
      this.payees[response.id] = response;
      console.log("Created ACH payee:", response.id);
      return response;
    } catch (error) {
      console.error('Failed to create ACH payee:', error);
      throw error;
    }
  }

  async createCryptoPayee(details: CryptoPayeeDetails) {
    this.validateApiKey();
    try {
      const response = await this.client.payments.createPayee({
        type: "CRYPTO_ADDRESS",
        name: details.name,
        address: details.address,
        contactDetails: {
          email: details.email,
        },
      });
      this.payees[response.id] = response;
      console.log("Created crypto payee:", response.id);
      return response;
    } catch (error) {
      console.error('Failed to create crypto payee:', error);
      throw error;
    }
  }

  async sendPayment(details: PaymentDetails) {
    this.validateApiKey();
    try {
      const response = await this.client.payments.sendPayment({
        amountDecimal: details.amountDecimal,
        payeeId: details.payeeId,
        memo: details.memo,
        metadata: details.metadata,
      });
      this.paymentsRecord[response.id] = response;
      console.log("Created payment:", response.id);
      
      // Simulate payment processing
      setTimeout(() => {
        const success = Math.random() > 0.2; // 80% success rate
        this.paymentsRecord[response.id].status = success ? "completed" : "failed";
        this.paymentsRecord[response.id].updatedAt = new Date().toISOString();
        console.log(`Payment ${response.id} status updated to ${this.paymentsRecord[response.id].status}`);
        
        // Update balance if payment is successful
        if (success) {
          this.balances.USD -= details.amountDecimal;
        }
      }, 5000);
      
      return response;
    } catch (error) {
      console.error('Failed to send payment:', error);
      throw error;
    }
  }

  async getPayments() {
    this.validateApiKey();
    try {
      const response = await this.client.payments.listPayments();
      return response;
    } catch (error) {
      console.error('Failed to get payments:', error);
      throw error;
    }
  }

  async getPayment(paymentId: string) {
    this.validateApiKey();
    try {
      const response = await this.client.payments.retrievePayment(paymentId);
      return response;
    } catch (error) {
      console.error('Failed to get payment:', error);
      throw error;
    }
  }
  
  async searchPayees(filters?: { name?: string, type?: string }) {
    this.validateApiKey();
    try {
      const response = await this.client.payments.searchPayees(filters);
      return response;
    } catch (error) {
      console.error('Failed to search payees:', error);
      throw error;
    }
  }
  
  async getSpendableBalance(currency: string = 'USD') {
    this.validateApiKey();
    try {
      const response = await this.client.balances.getBalance(currency);
      return response.available;
    } catch (error) {
      console.error('Failed to get balance:', error);
      throw error;
    }
  }

  private maskAccountNumber(accountNumber: string): string {
    if (accountNumber.length <= 4) return accountNumber;
    return '*'.repeat(accountNumber.length - 4) + accountNumber.slice(-4);
  }
  
  // Bulk payment method
  async bulkPayContractors(contractorDetails: Array<{id: string, name: string, email: string, amount: number}>, memo: string) {
    const results = [];
    
    for (const contractor of contractorDetails) {
      try {
        // First create a payee for the contractor
        const payee = await this.createACHPayee({
          name: contractor.name,
          email: contractor.email,
          accountHolderType: "individual"
        });
        
        // Then send the payment
        const payment = await this.sendPayment({
          amountDecimal: contractor.amount,
          payeeId: payee.id,
          memo: memo,
          metadata: {
            contractorId: contractor.id,
            bulkPayment: true
          }
        });
        
        results.push({
          contractorId: contractor.id,
          payeeId: payee.id,
          paymentId: payment.id,
          status: payment.status
        });
      } catch (error) {
        console.error(`Failed to pay contractor ${contractor.id}:`, error);
        results.push({
          contractorId: contractor.id,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    return results;
  }
}

// Singleton instance
let paymanService: PaymanService | null = null;

export const initPaymanService = (apiKey: string) => {
  try {
    paymanService = new PaymanService(apiKey);
    return paymanService;
  } catch (error) {
    console.error('Failed to initialize PaymanService:', error);
    throw error;
  }
};

export const getPaymanService = () => {
  if (!paymanService) {
    throw new Error('PaymanService not initialized. Please provide a valid API key and call initPaymanService first.');
  }
  return paymanService;
};

export default PaymanService;
