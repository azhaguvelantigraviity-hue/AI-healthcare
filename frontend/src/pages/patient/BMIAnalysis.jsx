import React, { useState } from 'react';
import { Activity, Scale, Ruler, HeartPulse, ShieldAlert, Utensils, Droplets, Info, CheckCircle2, XCircle, Dumbbell, AlertTriangle, Lightbulb } from 'lucide-react';

const categoryData = {
  Underweight: {
    foods: ['Nuts & Nut Butters', 'Avocados', 'Whole Milk Dairy', 'Lean Meats'],
    avoid: ['Excessive Caffeine', 'Low-Calorie Fillers', 'Skipping Meals'],
    exercise: ['Strength Training 3-4x/week', 'Light Yoga', 'Focus on building muscle mass'],
    risks: ['Osteoporosis', 'Anemia', 'Weakened Immune System'],
    tips: ['Eat 5-6 smaller meals daily', 'Track macro intake', 'Ensure adequate sleep']
  },
  Normal: {
    foods: ['Lean Proteins', 'Whole Grains', 'Leafy Greens', 'Healthy Fats'],
    avoid: ['Excessive Processed Sugar', 'Trans Fats', 'High-Sodium Foods'],
    exercise: ['150 mins moderate cardio/week', 'Strength Training 2x/week', 'Daily walking'],
    risks: ['Maintain current healthy state to avoid future risks'],
    tips: ['Maintain balanced diet', 'Stay hydrated', 'Sleep 7-8 hours daily']
  },
  Overweight: {
    foods: ['Vegetables', 'Lean Protein', 'Whole Grains', 'Fruits'],
    avoid: ['Sugary Drinks', 'Processed Foods', 'Excess Fast Food'],
    exercise: ['30–45 minutes brisk walking', 'Strength training 3 times/week'],
    risks: ['Increased risk of hypertension', 'Increased risk of type 2 diabetes'],
    tips: ['Maintain calorie deficit', 'Stay hydrated', 'Sleep 7–8 hours daily']
  },
  Obese: {
    foods: ['High-Fiber Vegetables', 'Lean Fish & Poultry', 'Legumes', 'Berries'],
    avoid: ['All Sugary Beverages', 'Fried Foods', 'Highly Processed Snacks', 'Refined Carbs'],
    exercise: ['Low-impact cardio (Swimming/Cycling)', 'Daily walking (start small)', 'Physical therapy guided movement'],
    risks: ['Type 2 Diabetes', 'Cardiovascular Disease', 'Sleep Apnea', 'Joint Issues'],
    tips: ['Consult a dietitian', 'Track daily calories strictly', 'Prioritize stress management']
  }
};

const BMIAnalysis = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState('');

  const calculateBMI = (e) => {
    e.preventDefault();
    if (!weight || !height) return;
    
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    if (h > 0 && w > 0) {
      const bmiValue = (w / (h * h)).toFixed(1);
      setBmi(bmiValue);
      
      if (bmiValue < 18.5) setCategory('Underweight');
      else if (bmiValue >= 18.5 && bmiValue <= 24.9) setCategory('Normal');
      else if (bmiValue >= 25 && bmiValue <= 29.9) setCategory('Overweight');
      else setCategory('Obese');
    }
  };

  const reset = () => {
    setWeight('');
    setHeight('');
    setBmi(null);
    setCategory('');
  };

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Underweight': return { text: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', fill: 'bg-blue-500', shadow: 'shadow-blue-200' };
      case 'Normal': return { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', fill: 'bg-emerald-500', shadow: 'shadow-emerald-200' };
      case 'Overweight': return { text: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', fill: 'bg-amber-500', shadow: 'shadow-amber-200' };
      case 'Obese': return { text: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', fill: 'bg-red-500', shadow: 'shadow-red-200' };
      default: return { text: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200', fill: 'bg-gray-500', shadow: 'shadow-gray-200' };
    }
  };

  const colors = getCategoryColor(category);
  const activeData = categoryData[category];

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      
      {/* Premium Header */}
      <div className="relative overflow-hidden bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex justify-between items-center z-10">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full blur-3xl opacity-60 z-0"></div>
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-40 h-40 bg-gradient-to-tr from-blue-50 to-indigo-50 rounded-full blur-2xl opacity-60 z-0"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <Activity className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">BMI Analysis</h1>
              <p className="text-gray-500 font-medium mt-1">Calculate and track your Body Mass Index</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Calculator Form */}
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
               <Scale className="w-32 h-32" />
             </div>
             
             <h2 className="text-xl font-bold text-gray-900 mb-6">Enter Details</h2>
             
             <form onSubmit={calculateBMI} className="space-y-5 relative z-10">
               <div>
                 <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Height (cm)</label>
                 <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                     <Ruler className="h-5 w-5 text-gray-400" />
                   </div>
                   <input 
                     type="number" 
                     required
                     placeholder="e.g. 175"
                     value={height}
                     onChange={(e) => setHeight(e.target.value)}
                     className="block w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium text-lg outline-none"
                   />
                 </div>
               </div>

               <div>
                 <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Weight (kg)</label>
                 <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                     <Scale className="h-5 w-5 text-gray-400" />
                   </div>
                   <input 
                     type="number" 
                     required
                     step="0.1"
                     placeholder="e.g. 70.5"
                     value={weight}
                     onChange={(e) => setWeight(e.target.value)}
                     className="block w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium text-lg outline-none"
                   />
                 </div>
               </div>

               <div className="pt-4 flex flex-col sm:flex-row gap-4">
                 <button 
                   type="submit"
                   className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                 >
                   <Activity className="w-5 h-5" /> Calculate BMI
                 </button>
                 {bmi && (
                   <button 
                     type="button"
                     onClick={reset}
                     className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3.5 px-6 rounded-2xl transition-all"
                   >
                     Reset
                   </button>
                 )}
               </div>
             </form>
          </div>
        </div>

        {/* Results */}
        <div className="xl:col-span-8">
          {bmi ? (
            <div className={`h-full rounded-3xl p-8 border ${colors.border} ${colors.bg} transition-all duration-500 relative overflow-hidden shadow-sm`}>
               <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 rounded-full blur-3xl opacity-20 bg-current text-inherit z-0"></div>
               
               <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
                 <div className="text-center md:text-left">
                    <p className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">Your BMI Score</p>
                    <div className="flex items-baseline justify-center md:justify-start gap-2">
                      <span className={`text-7xl font-black tracking-tighter ${colors.text}`}>{bmi}</span>
                    </div>
                    <div className="mt-4 inline-flex items-center gap-2 bg-white px-5 py-2 rounded-full shadow-sm border border-white/50">
                      <div className={`w-3 h-3 rounded-full ${colors.fill} animate-pulse`}></div>
                      <span className={`font-black text-lg tracking-wide ${colors.text}`}>{category}</span>
                    </div>
                 </div>

                 {/* Gauge / Bar */}
                 <div className="w-full max-w-sm shrink-0">
                    <div className="h-4 w-full rounded-full bg-gray-200 flex overflow-hidden shadow-inner">
                      <div className="h-full bg-blue-400" style={{ width: '25%' }} title="Underweight (< 18.5)"></div>
                      <div className="h-full bg-emerald-400" style={{ width: '25%' }} title="Normal (18.5 - 24.9)"></div>
                      <div className="h-full bg-amber-400" style={{ width: '25%' }} title="Overweight (25 - 29.9)"></div>
                      <div className="h-full bg-red-400" style={{ width: '25%' }} title="Obese (> 30)"></div>
                    </div>
                    <div className="flex justify-between text-xs font-bold text-gray-500 mt-3 px-1 uppercase tracking-wider">
                      <span>16</span>
                      <span>18.5</span>
                      <span>25</span>
                      <span>30</span>
                      <span>40+</span>
                    </div>
                 </div>
               </div>

               {/* Comprehensive Recommendations Grid */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                 
                 {/* Recommended Foods */}
                 <div className="bg-white rounded-2xl p-5 shadow-sm border border-white/60">
                   <h4 className="font-bold text-emerald-700 mb-4 flex items-center gap-2">
                     <CheckCircle2 className="w-5 h-5" /> Recommended Foods
                   </h4>
                   <ul className="space-y-3">
                     {activeData.foods.map((item, i) => (
                       <li key={i} className="flex items-start gap-2 text-sm text-gray-700 font-medium">
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></div>
                         {item}
                       </li>
                     ))}
                   </ul>
                 </div>

                 {/* Avoid */}
                 <div className="bg-white rounded-2xl p-5 shadow-sm border border-white/60">
                   <h4 className="font-bold text-red-700 mb-4 flex items-center gap-2">
                     <XCircle className="w-5 h-5" /> Foods to Avoid
                   </h4>
                   <ul className="space-y-3">
                     {activeData.avoid.map((item, i) => (
                       <li key={i} className="flex items-start gap-2 text-sm text-gray-700 font-medium">
                         <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0"></div>
                         {item}
                       </li>
                     ))}
                   </ul>
                 </div>

                 {/* Daily Exercise */}
                 <div className="bg-white rounded-2xl p-5 shadow-sm border border-white/60">
                   <h4 className="font-bold text-indigo-700 mb-4 flex items-center gap-2">
                     <Dumbbell className="w-5 h-5" /> Daily Exercise
                   </h4>
                   <ul className="space-y-3">
                     {activeData.exercise.map((item, i) => (
                       <li key={i} className="flex items-start gap-2 text-sm text-gray-700 font-medium">
                         <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0"></div>
                         {item}
                       </li>
                     ))}
                   </ul>
                 </div>

                 {/* Health Risks */}
                 <div className="bg-white rounded-2xl p-5 shadow-sm border border-white/60 md:col-span-1 lg:col-span-1">
                   <h4 className="font-bold text-amber-700 mb-4 flex items-center gap-2">
                     <AlertTriangle className="w-5 h-5" /> Health Risks
                   </h4>
                   <ul className="space-y-3">
                     {activeData.risks.map((item, i) => (
                       <li key={i} className="flex items-start gap-2 text-sm text-gray-700 font-medium">
                         <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></div>
                         {item}
                       </li>
                     ))}
                   </ul>
                 </div>

                 {/* Lifestyle Tips */}
                 <div className="bg-white rounded-2xl p-5 shadow-sm border border-white/60 md:col-span-2 lg:col-span-2">
                   <h4 className="font-bold text-blue-700 mb-4 flex items-center gap-2">
                     <Lightbulb className="w-5 h-5" /> Lifestyle Tips
                   </h4>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                     {activeData.tips.map((item, i) => (
                       <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                         <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                           <HeartPulse className="w-4 h-4 text-blue-500" />
                         </div>
                         <span className="text-sm text-gray-700 font-bold">{item}</span>
                       </div>
                     ))}
                   </div>
                 </div>

               </div>
            </div>
          ) : (
            <div className="h-full rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center p-8 text-center min-h-[400px]">
              <div>
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                  <Activity className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Awaiting Details</h3>
                <p className="text-gray-500 max-w-sm mx-auto">Enter your height and weight in the calculator to instantly see your Body Mass Index and personalized health tips.</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default BMIAnalysis;
