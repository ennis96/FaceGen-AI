import React from 'react';
import { Check, Crown, Zap, Sparkles } from './Icons';
import { PricingPlan, User } from '../types';

interface StoreProps {
  onClose: () => void;
  onPurchase: (plan: PricingPlan) => void;
  user: User;
}

const plans: PricingPlan[] = [
  {
    id: 'sub_monthly',
    type: 'subscription',
    name: 'Pro Creator',
    price: '$4.99/mo',
    description: 'For the ultimate customization experience.',
    features: [
      'Unlimited AI Generations',
      '4x Quality Upscaling',
      'Cloud Library Sync',
      'Priority Support'
    ],
    popular: true
  },
  {
    id: 'pack_small',
    type: 'credit_pack',
    name: 'Starter Pack',
    price: '$2.99',
    credits: 10,
    description: 'Perfect for casual designers.',
    features: [
      '10 AI Generation Credits',
      'Standard Quality',
      'No Expiration'
    ]
  },
  {
    id: 'pack_large',
    type: 'credit_pack',
    name: 'Studio Pack',
    price: '$9.99',
    credits: 50,
    description: 'Best value for one-time purchases.',
    features: [
      '50 AI Generation Credits',
      'Standard Quality',
      'No Expiration'
    ]
  }
];

const Store: React.FC<StoreProps> = ({ onClose, onPurchase, user }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface border border-white/10 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col md:flex-row overflow-hidden">
        
        {/* Left Side: Value Prop */}
        <div className="md:w-1/3 bg-gradient-to-br from-neutral-900 to-black p-8 flex flex-col justify-between border-r border-white/5">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-primary/20 p-2 rounded-lg">
                <Crown className="text-primary" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white">ChronoGen Pro</h2>
            </div>
            <p className="text-neutral-400 mb-8 leading-relaxed">
              Unlock the full potential of AI watch face design. Create unlimited styles without limits.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-neutral-300">
                <Sparkles size={16} className="text-amber-400" />
                <span>Advanced AI Models</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-neutral-300">
                <Zap size={16} className="text-amber-400" />
                <span>Fast Generation Queue</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-neutral-300">
                <Crown size={16} className="text-amber-400" />
                <span>Commercial License</span>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-white/10">
            <p className="text-xs text-neutral-500 mb-2">Current Balance</p>
            <div className="text-2xl font-bold text-white flex items-center gap-2">
              <Zap className="fill-white" size={20} />
              {user.credits} Credits
            </div>
          </div>
        </div>

        {/* Right Side: Plans */}
        <div className="md:w-2/3 p-8 bg-background relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors"
          >
            ✕
          </button>

          <h3 className="text-xl font-bold text-white mb-6">Select a Plan</h3>
          
          <div className="grid gap-4">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                onClick={() => onPurchase(plan)}
                className={`group relative p-4 rounded-xl border-2 cursor-pointer transition-all hover:scale-[1.01] ${
                  plan.popular 
                    ? 'border-primary/50 bg-primary/5 hover:bg-primary/10' 
                    : 'border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 right-4 bg-primary text-black text-xs font-bold px-3 py-1 rounded-full">
                    RECOMMENDED
                  </div>
                )}
                
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-white text-lg">{plan.name}</h4>
                    <p className="text-neutral-400 text-sm">{plan.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-white text-xl">{plan.price}</div>
                    {plan.type === 'credit_pack' && (
                      <div className="text-emerald-400 text-sm font-medium">+{plan.credits} Credits</div>
                    )}
                  </div>
                </div>

                <div className="space-y-1 mt-3">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-neutral-300">
                      <Check size={12} className="text-primary" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-neutral-500 mt-6">
            Secure payment processed by RevenueCat. You can cancel subscriptions anytime.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Store;