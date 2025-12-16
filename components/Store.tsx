import React from 'react';
import { Check, Crown, Zap, Sparkles, Settings, Star } from './Icons';
import { PricingPlan, User } from '../types';

interface StoreProps {
  onClose: () => void;
  onPurchase: (plan: PricingPlan) => void;
  onManageSubscription: () => void;
  user: User;
}

const plans: PricingPlan[] = [
  {
    id: 'sub_monthly',
    type: 'subscription',
    name: 'FaceGen Pro',
    price: '$4.99/mo',
    description: 'The ultimate creator experience.',
    features: [
      'Unlimited AI Generations',
      'Unlock All 12+ Premium Niches',
      'Access "Inspire Me" & Magic Enhance',
      'Weekly New Face Drops',
      'Commercial Rights',
      'Priority Fast Queue'
    ],
    popular: true
  },
  {
    id: 'pack_small',
    type: 'credit_pack',
    name: 'Starter Pack',
    price: '$2.99',
    credits: 10,
    description: 'Perfect for trying it out.',
    features: [
      '10 High-Quality Generations',
      'Full Commercial License',
      'Credits Never Expire'
    ]
  },
  {
    id: 'pack_large',
    type: 'credit_pack',
    name: 'Studio Pack',
    price: '$9.99',
    credits: 50,
    description: 'Best value for serious designers.',
    features: [
      '50 High-Quality Generations',
      'Massive 35% Bulk Savings',
      'Credits Never Expire'
    ]
  }
];

const Store: React.FC<StoreProps> = ({ onClose, onPurchase, onManageSubscription, user }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-surface border border-white/10 rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/20 rounded-full text-neutral-400 hover:text-white hover:bg-black/40 transition-colors"
        >
          ✕
        </button>

        {/* Left Side: Brand & Benefits */}
        <div className="md:w-5/12 bg-gradient-to-br from-neutral-900 to-black p-8 md:p-12 flex flex-col justify-between border-r border-white/5 relative overflow-hidden">
           {/* Abstract Background Decoration */}
           <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50 pointer-events-none"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-gradient-to-br from-primary to-emerald-600 p-2.5 rounded-xl shadow-lg shadow-primary/20">
                <Crown className="text-white" size={28} />
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tight">FaceGen Pro</h2>
            </div>
            <p className="text-neutral-300 mb-10 text-lg leading-relaxed font-light">
              Join the elite community of watch face designers. Unlimited power, exclusive content, and professional tools.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-amber-400/10 p-2 rounded-lg mt-0.5">
                   <Sparkles size={20} className="text-amber-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">Weekly Drops</h4>
                  <p className="text-neutral-400 text-sm">Fresh premium styles added every Monday.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-2 rounded-lg mt-0.5">
                   <Zap size={20} className="text-primary" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">Unlimited Creation</h4>
                  <p className="text-neutral-400 text-sm">Create as many variations as you need. No limits.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-purple-500/10 p-2 rounded-lg mt-0.5">
                   <Crown size={20} className="text-purple-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">Commercial Rights</h4>
                  <p className="text-neutral-400 text-sm">Own your designs. Export for the store.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative z-10 mt-8 pt-8 border-t border-white/10">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Your Balance</p>
                <div className="text-3xl font-bold text-white flex items-center gap-2">
                  <Zap className={user.credits > 0 ? "fill-white" : "text-neutral-700"} size={24} />
                  {user.credits}
                </div>
              </div>
              {user.isPro && (
                <div className="bg-amber-400/20 border border-amber-400/30 px-3 py-1 rounded-full text-amber-400 text-xs font-bold flex items-center gap-1">
                  <Crown size={12} className="fill-amber-400" /> PRO ACTIVE
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Pricing Options */}
        <div className="md:w-7/12 p-8 md:p-12 bg-[#0f0f11] overflow-y-auto">
          <h3 className="text-xl font-bold text-white mb-6">Choose your plan</h3>
          
          <div className="space-y-4">
            {/* Subscription Card - Visually Highlighted */}
            {plans.filter(p => p.type === 'subscription').map((plan) => (
              <div 
                key={plan.id}
                onClick={() => onPurchase(plan)}
                className="relative group p-1 rounded-2xl bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-600 transition-all hover:scale-[1.02] cursor-pointer shadow-xl shadow-amber-500/30 ring-1 ring-amber-400/50"
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-black text-xs font-bold px-4 py-1 rounded-full shadow-md z-20 flex items-center gap-1">
                    <Star size={10} className="fill-black" /> RECOMMENDED
                </div>
                
                <div className="bg-neutral-900 rounded-xl p-6 h-full relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-white text-xl flex items-center gap-2">
                         {plan.name} <Crown size={16} className="text-amber-400 fill-amber-400" />
                      </h4>
                      <p className="text-neutral-400 text-sm mt-1">{plan.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-white text-2xl">{plan.price}</div>
                      <div className="text-neutral-500 text-xs">billed monthly</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-4">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-neutral-300">
                        <Check size={14} className="text-amber-400" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  
                  <div className="w-full bg-white text-black font-bold text-center py-3 rounded-lg hover:bg-neutral-200 transition-colors">
                    Start 7-Day Free Trial
                  </div>

                   {/* Manage Subscription Button - specifically placed here */}
                  {user.isPro && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); onManageSubscription(); }}
                        className="w-full mt-3 py-2 border border-white/10 rounded-lg text-xs font-medium text-neutral-400 hover:text-white hover:bg-white/5 flex items-center justify-center gap-2 transition-all"
                    >
                        <Settings size={14} /> Manage Subscription
                    </button>
                  )}
                </div>
              </div>
            ))}

            <div className="flex items-center gap-4 py-4">
              <div className="h-px bg-white/10 flex-1"></div>
              <span className="text-neutral-500 text-xs font-medium uppercase">Or Pay Per Pack</span>
              <div className="h-px bg-white/10 flex-1"></div>
            </div>

            {/* Credit Packs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {plans.filter(p => p.type === 'credit_pack').map((plan) => (
                <div 
                  key={plan.id}
                  onClick={() => onPurchase(plan)}
                  className="border border-white/10 bg-white/5 p-4 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="mb-4">
                    <div className="flex justify-between items-start mb-2">
                       <h4 className="font-semibold text-white group-hover:text-primary transition-colors">{plan.name}</h4>
                       <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2 py-0.5 rounded">
                         +{plan.credits}
                       </span>
                    </div>
                    <div className="font-bold text-white text-xl">{plan.price}</div>
                  </div>
                  <div className="space-y-1">
                     {plan.features.slice(0, 3).map((f, i) => (
                       <p key={i} className="text-xs text-neutral-400 flex items-center gap-1.5">
                         <div className="w-1 h-1 rounded-full bg-neutral-500"></div> {f}
                       </p>
                     ))}
                  </div>
                  <button className="mt-4 w-full py-2 bg-neutral-800 text-white text-xs font-bold rounded-lg hover:bg-neutral-700 transition-colors">
                    Buy Pack
                  </button>
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-[10px] text-neutral-600 mt-8 leading-tight">
             Payments are processed securely via Google Play. Recurring billing for subscriptions. Cancel anytime in Play Store settings.
             <br/>By continuing, you agree to our Terms of Service.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Store;