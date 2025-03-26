import { useEffect, useState } from 'react';
import { initPaymanService, getPaymanService } from '@/services/paymanService';
import { toast } from '@/components/ui/use-toast';

export const usePaymanService = (apiKey?: string) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Try to get saved API key if none is provided
    const savedApiKey = localStorage.getItem('paymanApiKey');
    const keyToUse = apiKey || savedApiKey;

    // Initialize only if we have an API key and service is not already initialized
    if (keyToUse && !isInitialized && !isInitializing) {
      setIsInitializing(true);
      try {
        initPaymanService(keyToUse);
        setIsInitialized(true);
        console.log("Payman service initialized successfully");
        toast({
          title: "Connected to Payman API",
          description: "You can now make payments and manage contractors",
        });
      } catch (err) {
        console.error("Failed to initialize Payman service:", err);
        setError(err instanceof Error ? err : new Error("Unknown error"));
        toast({
          variant: "destructive",
          title: "Connection Error",
          description: "Failed to connect to Payman API. Please check your API key in Settings.",
        });
      } finally {
        setIsInitializing(false);
      }
    }
  }, [apiKey, isInitialized, isInitializing]);

  const getService = () => {
    if (!isInitialized) {
      const savedApiKey = localStorage.getItem('paymanApiKey');
      if (!savedApiKey) {
        throw new Error("Payman service not initialized. Please set your API key in Settings.");
      }
      try {
        initPaymanService(savedApiKey);
        setIsInitialized(true);
        return getPaymanService();
      } catch (err) {
        console.error("Error initializing Payman service:", err);
        throw new Error("Failed to initialize Payman service. Please check your API key in Settings.");
      }
    }
    return getPaymanService();
  };

  return {
    isInitialized,
    isInitializing,
    error,
    getService,
  };
};

export default usePaymanService;
