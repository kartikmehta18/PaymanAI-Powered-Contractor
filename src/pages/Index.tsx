
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AnimatedHero from '@/components/AnimatedHero';
import { motion } from 'framer-motion';
import { transitions, createAnimationSequence } from '@/lib/animations';
import Layout from '@/components/Layout';

const Index = () => {
  const navigate = useNavigate();
  const sequence = createAnimationSequence(0.2);
  
  return (
    <Layout>
      <div className="relative min-h-screen overflow-hidden">
        <AnimatedHero />
        
        <div className="relative pt-20 pb-16 md:pt-32 md:pb-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 md:mb-20">
              <motion.div
                {...sequence.next()}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6">
                  <span className="block">Automate your contractor</span>
                  <span className="block">hiring and payments</span>
                </h1>
                <p className="max-w-2xl mx-auto text-xl text-gray-600 mb-8">
                  Let AI find, hire, and pay the best contractors for your projects, 
                  with full control and compliance built in.
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button 
                    size="lg" 
                    className="rounded-full px-8 h-12 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                    onClick={() => navigate('/dashboard')}
                  >
                    Get Started
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="rounded-full px-8 h-12 shadow-sm"
                    onClick={() => navigate('/contractors')}
                  >
                    Find Contractors
                  </Button>
                </div>
              </motion.div>
            </div>
            
            <motion.div
              {...sequence.next(0.5)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-24"
            >
              <FeatureCard
                title="AI-Powered Matching"
                description="Our AI automatically matches your projects with the perfect contractors based on skills, availability, and budget."
              />
              <FeatureCard
                title="Seamless Payments"
                description="Send payments via ACH or USDC with a few clicks. Tax forms and compliance handled automatically."
              />
              <FeatureCard
                title="Full Control"
                description="You always have the final say. Review AI recommendations and approve all financial transactions."
              />
            </motion.div>
            
            <motion.div
              {...sequence.next(0.3)}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-10 md:p-12">
                <div className="flex flex-col justify-center">
                  <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">
                    Why businesses choose Payman Vision
                  </h2>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center bg-blue-100 text-blue-700 h-5 w-5 rounded-full mr-3 mt-0.5">✓</span>
                      <span className="text-gray-700">Save 20+ hours per month on contractor management</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center bg-blue-100 text-blue-700 h-5 w-5 rounded-full mr-3 mt-0.5">✓</span>
                      <span className="text-gray-700">Reduce time-to-hire by 75% with AI matching</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center bg-blue-100 text-blue-700 h-5 w-5 rounded-full mr-3 mt-0.5">✓</span>
                      <span className="text-gray-700">Automatic tax compliance and documentation</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center bg-blue-100 text-blue-700 h-5 w-5 rounded-full mr-3 mt-0.5">✓</span>
                      <span className="text-gray-700">Secure, fast payments with complete audit trail</span>
                    </li>
                  </ul>
                  <Button
                    className="mt-8 self-start rounded-full bg-blue-600"
                    onClick={() => navigate('/dashboard')}
                  >
                    Start Now
                  </Button>
                </div>
                <div className="flex items-center justify-center">
                  <div className="glass rounded-xl p-6 shadow-lg transform rotate-1 max-w-md">
                    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-lg font-medium">Project Backlog</div>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">3 items</span>
                      </div>
                      <div className="space-y-3">
                        <div className="p-3 border border-gray-100 rounded-md">
                          <div className="flex justify-between">
                            <div className="font-medium text-sm">Mobile App Design</div>
                            <div className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">High</div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">Matching with 3 contractors...</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-lg font-medium">Payments</div>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">This month</span>
                      </div>
                      <div className="flex items-center justify-between p-3 border border-gray-100 rounded-md">
                        <div>
                          <div className="font-medium text-sm">John Anderson</div>
                          <div className="text-xs text-gray-500">Website Development</div>
                        </div>
                        <div className="text-sm font-medium">$1,200.00</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-semibold text-gray-900 mb-4">
                Ready to transform your contractor workflow?
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Join innovative companies using Payman Vision to streamline their contractor management and payment process.
              </p>
              <Button 
                size="lg" 
                className="rounded-full px-8 h-12 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                onClick={() => navigate('/dashboard')}
              >
                Get Started Today
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const FeatureCard = ({ title, description }: { title: string; description: string }) => {
  return (
    <div className="glass p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
      <h3 className="text-lg font-medium text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default Index;
