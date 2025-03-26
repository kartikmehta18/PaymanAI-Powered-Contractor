import { supabase } from '@/integrations/supabase/client';
import { Contractor } from '@/components/contractors/ContractorInterface';
import { Payment } from '@/components/payments/PaymentTableRow';
import { Database } from '@/integrations/supabase/types';

// Contractor Services
export const fetchContractors = async () => {
  const { data, error } = await supabase
    .from('contractors')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching contractors:', error);
    throw error;
  }
  
  return data.map(item => ({
    id: item.id,
    name: item.name,
    email: item.email,
    skills: item.skills,
    rate: parseFloat(item.rate as unknown as string),
    status: item.status,
    imageUrl: item.image_url || `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 99)}.jpg`
  })) as Contractor[];
};

export const addContractor = async (contractor: Omit<Contractor, 'id'>) => {
  // Define the type explicitly to match what Supabase expects
  type ContractorInsert = Database['public']['Tables']['contractors']['Insert'];
  
  const { data, error } = await supabase
    .from('contractors')
    .insert({
      name: contractor.name,
      email: contractor.email,
      skills: contractor.skills,
      rate: contractor.rate,
      status: contractor.status,
      image_url: contractor.imageUrl
    } as ContractorInsert)
    .select()
    .single();
  
  if (error) {
    console.error('Error adding contractor:', error);
    throw error;
  }
  
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    skills: data.skills,
    rate: parseFloat(data.rate as unknown as string),
    status: data.status,
    imageUrl: data.image_url
  } as Contractor;
};

export const updateContractorStatus = async (id: string, status: string) => {
  // Convert Date to ISO string for Supabase
  const { error } = await supabase
    .from('contractors')
    .update({ 
      status, 
      updated_at: new Date().toISOString() // Convert Date to string for Supabase
    })
    .eq('id', id);
  
  if (error) {
    console.error('Error updating contractor status:', error);
    throw error;
  }
};

// Payment Services
export const fetchPayments = async () => {
  const { data, error } = await supabase
    .from('payments')
    .select(`
      *,
      contractors:contractor_id (name, email)
    `)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching payments:', error);
    throw error;
  }
  
  return data.map(item => ({
    id: item.id,
    amount: parseFloat(item.amount as unknown as string),
    payeeId: item.payee_id || item.contractor_id,
    payeeName: item.contractors ? item.contractors.name : 'Unknown',
    payeeEmail: item.contractors ? item.contractors.email : 'unknown@example.com',
    memo: item.memo || '',
    status: item.status,
    createdAt: item.created_at,
    updatedAt: item.updated_at
  })) as Payment[];
};

export const addPayment = async (payment: {
  contractorId: string;
  amount: number;
  memo?: string;
  paymentMethod: string;
  payeeId?: string;
  status?: string;
  externalPaymentId?: string;
}) => {
  // Define the type explicitly to match what Supabase expects
  type PaymentInsert = Database['public']['Tables']['payments']['Insert'];
  
  const { data, error } = await supabase
    .from('payments')
    .insert({
      contractor_id: payment.contractorId,
      amount: payment.amount,
      memo: payment.memo,
      payment_method: payment.paymentMethod,
      payee_id: payment.payeeId,
      status: payment.status || 'processing',
      external_payment_id: payment.externalPaymentId
    } as PaymentInsert)
    .select()
    .single();
  
  if (error) {
    console.error('Error adding payment:', error);
    throw error;
  }
  
  return data;
};

export const updatePaymentStatus = async (id: string, status: string) => {
  // Convert Date to ISO string for Supabase
  const { error } = await supabase
    .from('payments')
    .update({ 
      status, 
      updated_at: new Date().toISOString() // Convert Date to string for Supabase
    })
    .eq('id', id);
  
  if (error) {
    console.error('Error updating payment status:', error);
    throw error;
  }
};

// Bulk operations
export const bulkPayContractors = async (contractorIds: string[], amount: number, memo: string) => {
  // Create an array of payment objects with properly typed values
  const payments = contractorIds.map(contractorId => ({
    contractor_id: contractorId,
    amount: amount,
    memo,
    payment_method: 'BULK',
    status: 'processing'
  }));
  
  // Define the type explicitly to match what Supabase expects
  type PaymentInsert = Database['public']['Tables']['payments']['Insert'];
  
  const { data, error } = await supabase
    .from('payments')
    .insert(payments as unknown as PaymentInsert[])
    .select();
  
  if (error) {
    console.error('Error bulk paying contractors:', error);
    throw error;
  }
  
  return data;
};
