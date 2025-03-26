import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { transitions } from '@/lib/animations';

const apiKeyFormSchema = z.object({
  paymanApiKey: z.string().min(32, {
    message: "API key must be at least 32 characters long.",
  }).refine((val) => /^[A-Za-z0-9+/=_-]+$/.test(val), {
    message: "Invalid API key format. Please check your API key.",
  }),
});

const companyFormSchema = z.object({
  companyName: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  website: z.string().url({
    message: "Please enter a valid URL.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

const notificationsFormSchema = z.object({
  emailNotifications: z.boolean(),
  paymentNotifications: z.boolean(),
  contractorUpdateNotifications: z.boolean(),
  marketingEmails: z.boolean(),
});

const Settings = () => {
  const [apiKey, setApiKey] = useState('');
  
  const apiKeyForm = useForm<z.infer<typeof apiKeyFormSchema>>({
    resolver: zodResolver(apiKeyFormSchema),
    defaultValues: {
      paymanApiKey: '',
    },
  });
  
  const companyForm = useForm<z.infer<typeof companyFormSchema>>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      companyName: 'TechLaunch',
      website: 'https://techlaunch.example.com',
      email: 'info@techlaunch.example.com',
    },
  });
  
  const notificationsForm = useForm<z.infer<typeof notificationsFormSchema>>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues: {
      emailNotifications: true,
      paymentNotifications: true,
      contractorUpdateNotifications: true,
      marketingEmails: false,
    },
  });
  
  useEffect(() => {
    const savedApiKey = localStorage.getItem('paymanApiKey');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      apiKeyForm.setValue('paymanApiKey', savedApiKey);
      import('@/services/paymanService').then(({ initPaymanService }) => {
        try {
          initPaymanService(savedApiKey);
          console.log('Initialized service with saved API key');
        } catch (error) {
          console.error('Failed to initialize service with saved API key:', error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to initialize service with saved API key. Please re-enter your API key.",
          });
        }
      });
    }
  }, []);
  
  const onSubmitApiKey = async (values: z.infer<typeof apiKeyFormSchema>) => {
    try {
      const { initPaymanService } = await import('@/services/paymanService');
      initPaymanService(values.paymanApiKey);
      
      localStorage.setItem('paymanApiKey', values.paymanApiKey);
      setApiKey(values.paymanApiKey);
      
      toast({
        title: "Success",
        description: "API key updated and validated successfully. You can now make payments."
      });
      
      // Reload the page to ensure all components are initialized with the new API key
      window.location.reload();
    } catch (error) {
      console.error('Failed to initialize Payman service:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update API key"
      });
    }
  };
  
  const onSubmitCompany = (values: z.infer<typeof companyFormSchema>) => {
    toast({
      title: "Success", 
      description: "Company information updated successfully"
    });
  };
  
  const onSubmitNotifications = (values: z.infer<typeof notificationsFormSchema>) => {
    toast({
      title: "Success",
      description: "Notification preferences updated successfully"
    });
  };
  
  return (
    <Layout>
      <motion.div
        initial={transitions.fadeIn.initial}
        animate={transitions.fadeIn.animate}
        exit={transitions.fadeIn.exit}
        className="py-6"
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-gray-500 mt-1">
              Manage your account settings and preferences
            </p>
          </div>
        </div>
        
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-6">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>
                  Update your company details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...companyForm}>
                  <form onSubmit={companyForm.handleSubmit(onSubmitCompany)} className="space-y-4">
                    <FormField
                      control={companyForm.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={companyForm.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={companyForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit">Save Changes</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Account Security</CardTitle>
                <CardDescription>
                  Manage your password and account security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input type="password" id="current-password" />
                </div>
                
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input type="password" id="new-password" />
                </div>
                
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input type="password" id="confirm-password" />
                </div>
                
                <Button>Update Password</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payman API Configuration</CardTitle>
                <CardDescription>
                  Manage your Payman API keys and configuration settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...apiKeyForm}>
                  <form onSubmit={apiKeyForm.handleSubmit(onSubmitApiKey)} className="space-y-4">
                    <FormField
                      control={apiKeyForm.control}
                      name="paymanApiKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payman API Key</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" />
                          </FormControl>
                          <FormDescription>
                            Your API key is used to authenticate requests to the Payman API
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit">Save API Key</Button>
                  </form>
                </Form>
                
                <div className="mt-8 space-y-4">
                  <div>
                    <h3 className="text-md font-medium mb-2">API Documentation</h3>
                    <p className="text-sm text-gray-500 mb-2">
                      Learn more about the Payman API and how to use it in your applications.
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <a href="https://docs.paymanai.com" target="_blank" rel="noopener noreferrer">
                        View Documentation
                      </a>
                    </Button>
                  </div>
                  
                  <div>
                    <h3 className="text-md font-medium mb-2">Webhooks</h3>
                    <p className="text-sm text-gray-500 mb-2">
                      Configure webhooks to receive real-time updates when events happen in your account.
                    </p>
                    <Button variant="outline" size="sm">
                      Configure Webhooks
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Control how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...notificationsForm}>
                  <form onSubmit={notificationsForm.handleSubmit(onSubmitNotifications)} className="space-y-6">
                    <FormField
                      control={notificationsForm.control}
                      name="emailNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Email Notifications</FormLabel>
                            <FormDescription>
                              Receive email notifications for important account updates
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={notificationsForm.control}
                      name="paymentNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Payment Notifications</FormLabel>
                            <FormDescription>
                              Get notified about payment status changes and transactions
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={notificationsForm.control}
                      name="contractorUpdateNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Contractor Updates</FormLabel>
                            <FormDescription>
                              Receive notifications when contractors update their status or availability
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={notificationsForm.control}
                      name="marketingEmails"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Marketing Emails</FormLabel>
                            <FormDescription>
                              Receive product updates, new features announcements, and promotional offers
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit">Save Preferences</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </Layout>
  );
};

export default Settings;
