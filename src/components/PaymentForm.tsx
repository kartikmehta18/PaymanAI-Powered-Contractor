import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePaymentForm, ACHFormData, USDCFormData } from '@/hooks/usePaymentForm';

// ACH Payment Form Schema
const achFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, {
    message: "Amount must be a valid number.",
  }),
  accountNumber: z.string().min(5, {
    message: "Account number is required.",
  }),
  routingNumber: z.string().length(9, {
    message: "Routing number must be 9 digits.",
  }),
  accountType: z.enum(["checking", "savings"], {
    message: "Please select an account type.",
  }),
  accountHolderType: z.enum(["individual", "company"], {
    message: "Please select an account holder type.",
  }),
  memo: z.string().optional(),
});

// USDC Payment Form Schema
const usdcFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, {
    message: "Amount must be a valid number.",
  }),
  walletAddress: z.string().min(10, {
    message: "Valid wallet address is required.",
  }),
  memo: z.string().optional(),
});

interface PaymentFormProps {
  paymentMethod: 'ACH' | 'USDC';
  onSuccess?: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ 
  paymentMethod, 
  onSuccess 
}) => {
  const { handleSubmit, isSubmitting, error } = usePaymentForm(paymentMethod, onSuccess);
  
  const formSchema = paymentMethod === 'ACH' ? achFormSchema : usdcFormSchema;
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      amount: "",
      memo: "",
      ...(paymentMethod === 'ACH' ? {
        accountNumber: "",
        routingNumber: "",
        accountType: "checking",
        accountHolderType: "individual",
      } : {
        walletAddress: "",
      }),
    },
  });
  
  const onFormSubmit = async (data: z.infer<typeof formSchema>) => {
    const amountAsNumber = parseFloat(data.amount);
    
    if (paymentMethod === 'ACH') {
      const achData = data as z.infer<typeof achFormSchema>;
      await handleSubmit({
        name: achData.name,
        email: achData.email,
        amount: amountAsNumber,
        accountNumber: achData.accountNumber,
        routingNumber: achData.routingNumber,
        accountType: achData.accountType,
        accountHolderType: achData.accountHolderType,
        memo: achData.memo,
      } as ACHFormData);
    } else {
      const usdcData = data as z.infer<typeof usdcFormSchema>;
      await handleSubmit({
        name: usdcData.name,
        email: usdcData.email,
        amount: amountAsNumber,
        walletAddress: usdcData.walletAddress,
        memo: usdcData.memo,
      } as USDCFormData);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4">
        {error && (
          <div className="bg-red-50 p-3 rounded-md text-red-600 text-sm">
            {error}
          </div>
        )}
        
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recipient Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="john@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount (USD)</FormLabel>
              <FormControl>
                <Input placeholder="100.00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {paymentMethod === 'ACH' ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="accountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Number</FormLabel>
                    <FormControl>
                      <Input placeholder="1234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="routingNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Routing Number</FormLabel>
                    <FormControl>
                      <Input placeholder="123456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="accountType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select account type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="checking">Checking</SelectItem>
                        <SelectItem value="savings">Savings</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="accountHolderType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Holder Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select holder type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="individual">Individual</SelectItem>
                        <SelectItem value="company">Company</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </>
        ) : (
          <FormField
            control={form.control}
            name="walletAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>USDC Wallet Address</FormLabel>
                <FormControl>
                  <Input placeholder="0x..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <FormField
          control={form.control}
          name="memo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Memo (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Payment for web design services"
                  className="resize-none"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : `Send ${paymentMethod} Payment`}
        </Button>
      </form>
    </Form>
  );
};

export default PaymentForm;
