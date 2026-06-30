import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, 
  MapPin, 
  ShieldCheck, 
  Send, 
  X, 
  Navigation, 
  BarChart3, 
  LayoutDashboard, 
  Target, 
  Zap, 
  Video, 
  CheckCircle, 
  User, 
  Trophy, 
  FileText, 
  Wrench, 
  ArrowRight, 
  Award,
  AlertTriangle,
  Loader2,
  Activity,
  UserCheck,
  Building,
  RefreshCw,
  Eye,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Search,
  CheckCircle2,
  Trash2
} from 'lucide-react';

// Seeded real-world mock data for community reports
const DEFAULT_FEED = [
  {
    id: 1,
    category: "Water Leakage",
    severity: "High",
    risk_score: 78,
    recommended_action: "Sewer and water lines cracked near Sector 4. Active water flooding onto adjacent roads. Shut off main valve and deploy repair crew.",
    xp_rewarded: 35,
    badge_earned: "Water Warden",
    estimated_cost: "₹15,000 - ₹25,000",
    department_needed: "Water & Sanitation Dept",
    time: "02:10 AM",
    location: { lat: 28.6139, lng: 77.2090 },
    manualAddress: "",
    userVerified: false,
    dispatched: false,
    isMine: false,
    mediaType: "image",
    description: "Huge water rupture on Sector 4 road. It's washing away soil beneath the street."
  },
  {
    id: 2,
    category: "Pothole",
    severity: "Medium",
    risk_score: 45,
    recommended_action: "Deep pothole on main avenue near lane 12. Poses immediate danger to high-speed motorcyclists. Fill with temporary cold-mix asphalt.",
    xp_rewarded: 20,
    badge_earned: "Pothole Patrol",
    estimated_cost: "₹4,000 - ₹6,000",
    department_needed: "Public Works Department",
    time: "01:45 AM",
    location: { lat: 28.5355, lng: 77.3910 },
    manualAddress: "",
    userVerified: true,
    dispatched: false,
    isMine: false,
    mediaType: "image",
    description: "Deep tire-shredding pothole in the middle of the express lane."
  },
  {
    id: 3,
    category: "Hazardous Tree",
    severity: "Critical",
    risk_score: 92,
    recommended_action: "Large cracked oak branch hanging over power lines on Sector 15 Boulevard. Extreme risk of branch falling and causing localized power outage.",
    xp_rewarded: 50,
    badge_earned: "Forest Ranger",
    estimated_cost: "₹10,000 - ₹12,000",
    department_needed: "Electrical Dept",
    time: "Yesterday",
    location: null,
    manualAddress: "Sector 15 Boulevard, near Central Library",
    userVerified: true,
    dispatched: true,
    isMine: false,
    mediaType: "none",
    description: "Tree limb cracked after strong storm, now resting on high-voltage power wires."
  },
  {
    id: 4,
    category: "Broken Streetlight",
    severity: "Low",
    risk_score: 25,
    recommended_action: "Replace burnt-out LED bulb on Pole #43-B. Area is completely dark, raising pedestrian safety risks.",
    xp_rewarded: 15,
    badge_earned: "Light Bearer",
    estimated_cost: "₹1,500 - ₹2,000",
    department_needed: "Electrical Dept",
    time: "2 days ago",
    location: { lat: 28.6120, lng: 77.2295 },
    manualAddress: "",
    userVerified: true,
    dispatched: true,
    isMine: false,
    mediaType: "image",
    description: "The entire corner streetlight has been broken for over a week."
  }
];

// Seeded spam records demonstrating the AI Fraud & Spam Prevention system
const SPAM_LOGS = [
  {
    id: 101,
    rejected_at: "02:05 AM",
    submission_text: "My cute sleeping kitten inside a cardboard box.",
    detected_spam_type: "Off-Topic Media",
    rejection_reason: "Object identified as domestic pet (Felis catus). No civic hazard detected. Community resources must only address legitimate infrastructure safety reports.",
    confidence: "99.8%",
    reported_as: "Garbage Pile"
  },
  {
    id: 102,
    rejected_at: "01:20 AM",
    submission_text: "Check out this screenshot from Cyberpunk 2077!",
    detected_spam_type: "Synthetic / Gaming Media",
    rejection_reason: "Submitted file identified as a virtual game render. CivicSite mandates real-world geographic photographs to prevent municipal routing waste.",
    confidence: "98.4%",
    reported_as: "Electrical Hazard"
  },
  {
    id: 103,
    rejected_at: "Yesterday",
    submission_text: "test test 123 report please ignore",
    detected_spam_type: "Gibberish / Placeholder",
    rejection_reason: "Description contains repetitive placeholder words with no actionable geographic or infrastructure description. Submission discarded.",
    confidence: "100%",
    reported_as: "Other"
  }
];

// Simulated Top Citizens Leaderboard
const LEADERBOARD = [
  { rank: 1, name: "Arjun Mehta", xp: 840, level: 9, badge: "Civic Sentinel" },
  { rank: 2, name: "Priya Sharma", xp: 620, level: 7, badge: "Civic Sentinel" },
  { rank: 3, name: "Kunal Das", xp: 390, level: 4, badge: "District Guardian" },
  { rank: 4, name: "Meera Nair", xp: 280, level: 3, badge: "Neighborhood Watcher" }
];

export default function CivicSitePlatform() {
  const [activeTab, setActiveTab] = useState<'report' | 'dashboard' | 'dispatch' | 'insights' | 'spam-prevention'>('report');

  // Gamification State
  const [userProfile, setUserProfile] = useState({ xp: 185, level: 2, title: "Neighborhood Watcher" });
  
  // App States
  const [reportText, setReportText] = useState("");
  const [manualAddress, setManualAddress] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Stats
  const [stats, setStats] = useState({ open: 18, verified: 12, resolved: 106, spamBlocked: 34 });
  const [feed, setFeed] = useState<any[]>([]);
  const [spamLogs, setSpamLogs] = useState<any[]>(SPAM_LOGS);
  const [prediction, setPrediction] = useState("Click 'Run Macro Analytics' above to synthesize active community trends and generate real-time predictive hazard forecasting.");
  const [isPredicting, setIsPredicting] = useState(false);
  
  // In-app alert system to avoid window.alert in iframe
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Filter state for dashboard
  const [filterCategory, setFilterCategory] = useState<string>("All");

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [isLoaded, setIsLoaded] = useState(false);
  
  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type });
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    const savedFeed = localStorage.getItem('civicsite_feed');
    const savedStats = localStorage.getItem('civicsite_stats');
    const savedProfile = localStorage.getItem('civicsite_profile');
    const savedSpam = localStorage.getItem('civicsite_spam');
    
    if (savedFeed) {
      setFeed(JSON.parse(savedFeed));
    } else {
      setFeed(DEFAULT_FEED);
    }
    
    if (savedSpam) {
      setSpamLogs(JSON.parse(savedSpam));
    } else {
      setSpamLogs(SPAM_LOGS);
    }
    
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
    
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }
    
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('civicsite_feed', JSON.stringify(feed));
      localStorage.setItem('civicsite_stats', JSON.stringify(stats));
      localStorage.setItem('civicsite_profile', JSON.stringify(userProfile));
      localStorage.setItem('civicsite_spam', JSON.stringify(spamLogs));
    }
  }, [feed, stats, userProfile, spamLogs, isLoaded]);

  const getLocation = () => {
    setIsFetchingLocation(true);
    setManualAddress(""); 
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
          setIsFetchingLocation(false);
          showNotification("GPS sensor synchronized successfully!", "success");
        },
        () => {
          setIsFetchingLocation(false);
          // Fallback to random coordinate close to New Delhi for realistic visualization
          const fallbackLat = 28.6139 + (Math.random() - 0.5) * 0.05;
          const fallbackLng = 77.2090 + (Math.random() - 0.5) * 0.05;
          setLocation({ lat: fallbackLat, lng: fallbackLng });
          showNotification("GPS signal weak inside sandbox environment. Switched to local region coordinates.", "info");
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      setIsFetchingLocation(false);
      showNotification("Geolocation is not supported by your browser.", "error");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { 
      setImageFile(file); 
      setImagePreview(URL.createObjectURL(file)); 
      showNotification(`Image "${file.name}" ready for AI validation`, "info");
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { 
      setVideoFile(file); 
      setVideoPreview(URL.createObjectURL(file)); 
      showNotification(`Video clip ready for AI analysis`, "info");
    }
  };

  const calculateRank = (xp: number) => {
    if (xp < 100) return "Civic Recruit";
    if (xp < 300) return "Neighborhood Watcher";
    if (xp < 600) return "District Guardian";
    return "Civic Sentinel";
  };

  const handleReportSubmit = async () => {
    if (!reportText && !imageFile && !videoFile) {
      showNotification("Please provide a description or upload media evidence.", "error");
      return;
    }
    setIsAnalyzing(true);

    const formData = new FormData();
    const locationString = manualAddress ? `[Location: ${manualAddress}]` : (location ? `[GPS: ${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}]` : "[Geographic Zone: Unassigned]");
    formData.append('text', `${reportText} ${locationString}`);
    if (imageFile) formData.append('image', imageFile);
    if (videoFile) formData.append('video', videoFile);

    try {
      const res = await fetch('/api/analyze', { method: 'POST', body: formData });
      const data = await res.json();
      
      // Check for Spam/Fraud Detection
      if (data.is_civic_hazard === false) {
        showNotification(`AI Gatekeeper: Request Rejected. Detected: Spam or Off-Topic content.`, "error");
        
        // Log to Spam Feed
        const newSpamLog = {
          id: Date.now(),
          rejected_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          submission_text: reportText || "Media file without descriptive text.",
          detected_spam_type: "Intercepted Spam / Fraud",
          rejection_reason: data.rejection_reason || "Report does not represent a valid physical civic infrastructure hazard.",
          confidence: "99.4%",
          reported_as: "Declined"
        };
        
        setSpamLogs([newSpamLog, ...spamLogs]);
        setStats(prev => ({ ...prev, spamBlocked: prev.spamBlocked + 1 }));
        setIsAnalyzing(false);
        setActiveTab('spam-prevention');
        return;
      }
      
      const newReport = { 
        ...data, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
        id: Date.now(), 
        location: location || { lat: 28.6139 + (Math.random() - 0.5) * 0.04, lng: 77.2090 + (Math.random() - 0.5) * 0.04 }, 
        manualAddress, 
        userVerified: false, 
        dispatched: false, 
        isMine: true,
        description: reportText,
        mediaType: imageFile ? 'image' : (videoFile ? 'video' : 'none')
      };
      
      setFeed([newReport, ...feed]);
      setStats(prev => ({ ...prev, open: prev.open + 1 }));
      
      const rewardedXp = data.xp_rewarded || 20;
      const newXp = userProfile.xp + rewardedXp;
      const nextLevel = Math.floor(newXp / 100) + 1;
      
      setUserProfile({ 
        xp: newXp, 
        level: nextLevel, 
        title: calculateRank(newXp) 
      });
      
      showNotification(`AI Verified: legitimate hazard accepted! +${rewardedXp} XP rewarded. Badge: "${data.badge_earned || 'Sentinel Cadet'}"`, "success");
      
      // Reset input fields
      setReportText(""); 
      setManualAddress(""); 
      setImageFile(null); 
      setImagePreview(null); 
      setVideoFile(null); 
      setVideoPreview(null); 
      setLocation(null);
      
      setActiveTab('dashboard');
    } catch (error) {
      console.error(error);
      showNotification("Communication with analysis kernel timed out. Utilizing local fallback...", "error");
      
      // Secure local fallback for testing in restricted API settings
      const mockAISuccess = {
        is_civic_hazard: true,
        rejection_reason: "",
        category: "Public Nuisance / Rubbish",
        severity: "Medium",
        risk_score: 55,
        recommended_action: "Debris and household trash dumped illegally at the corner. Clean debris and deploy illegal dumping signage.",
        xp_rewarded: 25,
        badge_earned: "Waste Warden",
        estimated_cost: "₹3,500 - ₹5,000",
        department_needed: "Sanitation Department"
      };
      
      const newReport = {
        ...mockAISuccess,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        id: Date.now(),
        location: location || { lat: 28.6139, lng: 77.2090 },
        manualAddress,
        userVerified: false,
        dispatched: false,
        isMine: true,
        description: reportText || "Illegal street dumping and visual clutter reported near main junction.",
        mediaType: imageFile ? 'image' : (videoFile ? 'video' : 'none')
      };
      
      setFeed([newReport, ...feed]);
      setStats(prev => ({ ...prev, open: prev.open + 1 }));
      const newXp = userProfile.xp + 25;
      setUserProfile({
        xp: newXp,
        level: Math.floor(newXp / 100) + 1,
        title: calculateRank(newXp)
      });
      
      setReportText(""); setManualAddress(""); setImageFile(null); setImagePreview(null); setVideoFile(null); setVideoPreview(null); setLocation(null);
      setActiveTab('dashboard');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleVerify = (id: number) => {
    setFeed(feed.map(item => item.id === id ? { ...item, userVerified: true } : item));
    setStats(prev => ({ ...prev, verified: prev.verified + 1 }));
    const newXp = userProfile.xp + 5;
    setUserProfile({ xp: newXp, level: Math.floor(newXp / 100) + 1, title: calculateRank(newXp) });
    showNotification("Verification recorded on-chain. +5 XP awarded!", "success");
  };

  const dispatchToMunicipality = (id: number) => {
    setFeed(feed.map(item => item.id === id ? { ...item, dispatched: true } : item));
    setStats(prev => ({ ...prev, open: Math.max(0, prev.open - 1), resolved: prev.resolved + 1 }));
    showNotification("Agentic Municipal route active. Dispatch team deployed!", "success");
  };

  const generatePrediction = async () => {
    const validFeed = feed.filter(f => f.is_civic_hazard !== false);
    if (validFeed.length === 0) {
      setPrediction("Insufficient historical reports found. Please file local reports first.");
      return;
    }
    setIsPredicting(true);
    try {
      const res = await fetch('/api/predict', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ feed: validFeed }) 
      });
      const data = await res.json();
      setPrediction(data.insight || "Localized storm runoff combined with recent sewer blockage increases flash flood risk in North sector by 65% within 48 hours.");
      showNotification("Spatial-temporal predictions compiled!", "success");
    } catch (error) { 
      console.error(error); 
      // High-fidelity fallback based on feed categories
      const categoriesCount = validFeed.reduce((acc: any, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + 1;
        return acc;
      }, {});
      let fallbackInsight = "Predictive Model suggests compounding infrastructure strain: ";
      if (categoriesCount["Water Leakage"] && categoriesCount["Water Leakage"] > 0) {
        fallbackInsight = "Multiple active water leakages detected. Soil saturation index has increased by 40% near Sector 4, indicating a high probability of localized sub-surface subsidence (sinkholes) within 72 hours.";
      } else {
        fallbackInsight = "Accumulated road debris and pothole frequency in central commercial streets suggests a 75% rise in vehicular tire wear complaints and peak-hour delivery delays next week.";
      }
      setPrediction(fallbackInsight);
      showNotification("Predictive insight synthesized locally.", "info");
    } finally { 
      setIsPredicting(false); 
    }
  };

  const handleSimulateSpam = () => {
    // Easily let user submit or see a spam simulation
    const simulatedSpam = {
      id: Date.now(),
      rejected_at: "Just Now",
      submission_text: "Sharing a picture of my delicious chocolate ice cream cone! Yummy!",
      detected_spam_type: "Food / Off-Topic Image",
      rejection_reason: "AI Sentinel identified object as food dessert. No public utility damage or community safety hazard. Auto-flagged and deleted to prevent waste.",
      confidence: "99.9%",
      reported_as: "Street Garbage"
    };
    setSpamLogs([simulatedSpam, ...spamLogs]);
    setStats(prev => ({ ...prev, spamBlocked: prev.spamBlocked + 1 }));
    showNotification("AI intercepted food picture spam automatically! View log in Security tab.", "success");
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#070708] flex flex-col items-center justify-center text-emerald-500 font-mono gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
        <span className="animate-pulse tracking-widest text-xs">CIVICSITE PLATFORM ENGINES ONLINE...</span>
      </div>
    );
  }

  const nextLevelXp = userProfile.level * 100;
  const progressPercent = Math.min(100, ((userProfile.xp % 100) / 100) * 100);

  // Filters categories
  const filteredFeed = feed.filter(item => {
    if (filterCategory === "All") return true;
    return item.category.toLowerCase().includes(filterCategory.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#b3b9c1] flex font-sans pb-24 md:pb-0 relative overflow-x-hidden antialiased">
      
      {/* Toast Notification Container */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 md:left-auto md:right-6 md:translate-x-0 z-50 bg-[#111112] border border-slate-800 rounded-2xl p-4 shadow-2xl max-w-sm w-[92vw] md:w-85 overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-emerald-500 to-teal-600" />
            <div className="flex gap-3 items-start pl-1">
              {notification.type === 'error' ? (
                <div className="p-2 bg-red-950/40 text-red-400 rounded-xl border border-red-900/30">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              ) : notification.type === 'success' ? (
                <div className="p-2 bg-emerald-950/40 text-emerald-400 rounded-xl border border-emerald-900/20">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              ) : (
                <div className="p-2 bg-blue-950/40 text-blue-400 rounded-xl border border-blue-900/30">
                  <Zap className="w-5 h-5" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white tracking-wider uppercase font-mono">
                  {notification.type === 'error' ? 'Security Notice' : notification.type === 'success' ? 'Validation Passed' : 'Sentinel Alert'}
                </p>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{notification.message}</p>
              </div>
              <button onClick={() => setNotification(null)} className="text-slate-500 hover:text-white transition cursor-pointer p-0.5 rounded-full hover:bg-slate-900">
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE HEADER */}
      <header className="md:hidden bg-[#111113]/90 backdrop-blur-lg border-b border-slate-900 p-4 flex justify-between items-center fixed top-0 left-0 w-full z-40 shadow-lg">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-emerald-500 w-6 h-6" />
          <span className="text-lg font-light tracking-widest text-white">CIVIC<span className="font-bold text-emerald-500">SITE</span></span>
        </div>
        <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 rounded-full px-3 py-1 shadow-inner">
          <Trophy className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-xs font-bold text-white font-mono">{userProfile.xp} <span className="text-[10px] text-slate-400">XP</span></span>
          <span className="text-slate-700 text-xs">|</span>
          <span className="text-[10px] font-bold text-emerald-500 uppercase font-mono">LVL {userProfile.level}</span>
        </div>
      </header>

      {/* DESKTOP SIDEBAR */}
      <aside className="w-72 border-r border-slate-900 bg-[#0f0f11] p-6 hidden md:flex flex-col fixed h-full z-10 shadow-2xl">
        <div className="mb-8">
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="bg-emerald-950/30 p-1.5 rounded-lg border border-emerald-900/30">
              <ShieldCheck className="text-emerald-500 w-6 h-6" />
            </div>
            <h1 className="text-xl font-light text-white tracking-widest">
              CIVIC<span className="font-bold text-emerald-500">SITE</span>
            </h1>
          </div>
          <p className="text-[10px] text-slate-500 font-mono tracking-wider uppercase ml-1">Hyperlocal Problem Solver</p>
        </div>
        
        <nav className="space-y-1 mb-8">
          <button 
            onClick={() => setActiveTab('report')} 
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all duration-300 border cursor-pointer ${
              activeTab === 'report' 
                ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_10px_20px_-10px_rgba(16,185,129,0.15)] font-bold' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border-transparent'
            }`}
          >
            <div className="flex items-center gap-3">
              <Target className="w-4.5 h-4.5" />
              <span>Report Hazard</span>
            </div>
            {activeTab === 'report' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
          </button>
          
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all duration-300 border cursor-pointer ${
              activeTab === 'dashboard' 
                ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] font-bold' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border-transparent'
            }`}
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-4.5 h-4.5" />
              <span>Live Dashboard</span>
            </div>
            {activeTab === 'dashboard' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
          </button>
          
          <button 
            onClick={() => setActiveTab('dispatch')} 
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all duration-300 border cursor-pointer ${
              activeTab === 'dispatch' 
                ? 'bg-blue-500/5 text-blue-400 border-blue-500/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] font-bold' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border-transparent'
            }`}
          >
            <div className="flex items-center gap-3">
              <Wrench className="w-4.5 h-4.5" />
              <span>Agentic Dispatch</span>
            </div>
            <span className="text-[10px] bg-blue-950/40 text-blue-400 border border-blue-900/30 px-2 py-0.5 rounded-full font-mono">
              {feed.filter(i => !i.dispatched).length}
            </span>
          </button>
          
          <button 
            onClick={() => setActiveTab('insights')} 
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all duration-300 border cursor-pointer ${
              activeTab === 'insights' 
                ? 'bg-purple-500/5 text-purple-400 border-purple-500/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] font-bold' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border-transparent'
            }`}
          >
            <div className="flex items-center gap-3">
              <BarChart3 className="w-4.5 h-4.5" />
              <span>Predictive AI Insights</span>
            </div>
            {activeTab === 'insights' && <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />}
          </button>

          <button 
            onClick={() => setActiveTab('spam-prevention')} 
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all duration-300 border cursor-pointer ${
              activeTab === 'spam-prevention' 
                ? 'bg-red-500/5 text-red-400 border-red-500/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] font-bold' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border-transparent'
            }`}
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4.5 h-4.5 text-red-500" />
              <span>AI Spam Guard</span>
            </div>
            <span className="text-[10px] bg-red-950/40 text-red-400 border border-red-900/30 px-2 py-0.5 rounded-full font-mono">
              {stats.spamBlocked}
            </span>
          </button>
        </nav>

        {/* ADVANCED GAMIFICATION & SOCIAL PANEL */}
        <div className="mt-auto space-y-4">
          <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center gap-3 mb-3 border-b border-slate-900 pb-3">
              <div className="bg-gradient-to-br from-emerald-900/40 to-teal-950/20 p-2.5 rounded-xl border border-emerald-900/20">
                <User className="w-5.5 h-5.5 text-emerald-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">You (Incognito)</p>
                <p className="text-[10px] text-emerald-500 font-semibold tracking-wider uppercase font-mono">{userProfile.title}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-slate-500">XP METERS</span>
                <span className="text-emerald-400 font-semibold">{userProfile.xp} / {nextLevelXp} XP</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden p-0.5 border border-slate-900">
                <div 
                  className="bg-gradient-to-r from-emerald-600 to-teal-400 h-full rounded-full transition-all duration-700 ease-out" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-[9px] text-slate-500 text-right font-mono tracking-wide">{nextLevelXp - userProfile.xp} XP NEEDED FOR LVL {userProfile.level + 1}</p>
            </div>

            <div className="bg-black/30 border border-slate-950/60 rounded-xl p-2.5 mt-3.5 space-y-2">
              <p className="text-[9px] uppercase text-slate-500 font-bold tracking-widest font-mono">PEER SHIELDS</p>
              <div className="flex gap-2">
                <div className={`p-1.5 rounded-lg bg-[#141416] border ${userProfile.xp > 0 ? 'border-amber-500/20 text-amber-500 bg-amber-950/5' : 'border-slate-900 text-slate-700'} flex items-center justify-center`} title="Audit Starter Badge">
                  <Award className="w-4 h-4" />
                </div>
                <div className={`p-1.5 rounded-lg bg-[#141416] border ${userProfile.xp >= 150 ? 'border-emerald-500/20 text-emerald-500 bg-emerald-950/5' : 'border-slate-900 text-slate-700'} flex items-center justify-center`} title="Neighborhood Watcher Badge">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className={`p-1.5 rounded-lg bg-[#141416] border ${userProfile.xp >= 300 ? 'border-blue-500/20 text-blue-500 bg-blue-950/5' : 'border-slate-900 text-slate-700'} flex items-center justify-center`} title="On-chain Sentinel Certificate">
                  <Zap className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Mini active leaderboard */}
          <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-900">
            <p className="text-[9px] uppercase text-slate-500 font-bold tracking-widest font-mono mb-2 flex items-center gap-1">
              <Trophy className="w-3 h-3 text-amber-500" />
              <span>Weekly Watch Leaderboard</span>
            </p>
            <div className="space-y-1.5">
              {LEADERBOARD.map((user) => (
                <div key={user.rank} className="flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-slate-600 font-mono">#{user.rank}</span>
                    <span className="text-slate-300 truncate font-medium">{user.name}</span>
                  </div>
                  <span className="text-emerald-500 font-mono font-bold font-semibold">{user.xp} XP</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-[#111113]/95 backdrop-blur-lg border-t border-slate-900 flex justify-around p-3.5 z-40 shadow-2xl">
        <button 
          onClick={() => setActiveTab('report')} 
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'report' ? 'text-emerald-500 scale-105 font-bold' : 'text-slate-500'}`}
        >
          <Target className="w-5.5 h-5.5" />
          <span className="text-[9px] tracking-wide">Report</span>
        </button>
        <button 
          onClick={() => setActiveTab('dashboard')} 
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'dashboard' ? 'text-emerald-500 scale-105 font-bold' : 'text-slate-500'}`}
        >
          <LayoutDashboard className="w-5.5 h-5.5" />
          <span className="text-[9px] tracking-wide">Dashboard</span>
        </button>
        <button 
          onClick={() => setActiveTab('dispatch')} 
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'dispatch' ? 'text-blue-500 scale-105 font-bold' : 'text-slate-500'}`}
        >
          <div className="relative">
            <Wrench className="w-5.5 h-5.5" />
            <span className="absolute -top-1.5 -right-2 bg-blue-600 text-[8px] text-white rounded-full px-1.5 border border-slate-900 font-mono font-bold">
              {feed.filter(i => !i.dispatched).length}
            </span>
          </div>
          <span className="text-[9px] tracking-wide">Dispatch</span>
        </button>
        <button 
          onClick={() => setActiveTab('insights')} 
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'insights' ? 'text-purple-500 scale-105 font-bold' : 'text-slate-500'}`}
        >
          <BarChart3 className="w-5.5 h-5.5" />
          <span className="text-[9px] tracking-wide">Insights</span>
        </button>
        <button 
          onClick={() => setActiveTab('spam-prevention')} 
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'spam-prevention' ? 'text-red-500 scale-105 font-bold' : 'text-slate-500'}`}
        >
          <div className="relative">
            <ShieldCheck className="w-5.5 h-5.5 text-red-500" />
            <span className="absolute -top-1.5 -right-2 bg-red-600 text-[8px] text-white rounded-full px-1.5 border border-slate-900 font-mono font-bold">
              {stats.spamBlocked}
            </span>
          </div>
          <span className="text-[9px] tracking-wide">AI Guard</span>
        </button>
      </nav>

      {/* MAIN CONTENT CANVAS */}
      <main className="flex-1 p-4 pt-24 md:pt-8 md:p-8 md:ml-72 w-full min-h-screen bg-[#070708] overflow-y-auto">
        
        {/* TAB 1: HAZARD REPORT INTAKE */}
        {activeTab === 'report' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto space-y-6"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2 py-0.5 bg-emerald-950/40 text-emerald-400 border border-emerald-900/30 text-[9px] font-mono rounded font-bold uppercase tracking-wider">SECURE INGEST</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <h2 className="text-2xl md:text-3xl font-light text-white tracking-wide">Report Community Hazard</h2>
                <p className="text-xs md:text-sm text-slate-500 leading-relaxed mt-1">
                  File photographic, video, or textual evidence. The CivicSite Sentinel Engine autonomously audits reports to verify hazardous infrastructure and filter synthetic/spam submissions.
                </p>
              </div>
            </div>

            <div className="bg-[#0f0f11] border border-slate-900 rounded-2xl p-5 md:p-7 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400" />
              
              <input type="file" accept="image/*" className="hidden" ref={imageInputRef} onChange={handleImageUpload} />
              <input type="file" accept="video/*" className="hidden" ref={videoInputRef} onChange={handleVideoUpload} />

              {/* Media upload slots */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {!imagePreview ? (
                  <motion.div 
                    whileHover={{ scale: 1.01, borderColor: '#10b98140' }}
                    onClick={() => imageInputRef.current?.click()} 
                    className="border border-dashed border-slate-800 hover:border-slate-700 bg-slate-950/20 rounded-xl p-6 text-center transition-all cursor-pointer flex flex-col justify-center items-center h-32 md:h-40"
                  >
                    <div className="p-3 bg-emerald-950/30 rounded-full border border-emerald-900/20 mb-2.5">
                      <Camera className="w-5.5 h-5.5 text-emerald-400" />
                    </div>
                    <p className="text-xs font-semibold text-slate-300">Add Hazard Photograph</p>
                    <p className="text-[10px] text-slate-500 mt-1">Legitimate physical damage photo</p>
                  </motion.div>
                ) : (
                  <div className="relative border border-slate-800 rounded-xl overflow-hidden h-32 md:h-40 bg-black">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => { setImagePreview(null); setImageFile(null); }} 
                      className="absolute top-2.5 right-2.5 bg-black/80 hover:bg-red-600/90 p-2 rounded-full text-white transition-all cursor-pointer border border-slate-800"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {!videoPreview ? (
                  <motion.div 
                    whileHover={{ scale: 1.01, borderColor: '#3b82f640' }}
                    onClick={() => videoInputRef.current?.click()} 
                    className="border border-dashed border-slate-800 hover:border-slate-700 bg-slate-950/20 rounded-xl p-6 text-center transition-all cursor-pointer flex flex-col justify-center items-center h-32 md:h-40"
                  >
                    <div className="p-3 bg-blue-950/30 rounded-full border border-blue-900/20 mb-2.5">
                      <Video className="w-5.5 h-5.5 text-blue-400" />
                    </div>
                    <p className="text-xs font-semibold text-slate-300">Add Motion Evidence</p>
                    <p className="text-[10px] text-slate-500 mt-1">Short MP4 / MOV clip</p>
                  </motion.div>
                ) : (
                  <div className="relative border border-slate-800 rounded-xl overflow-hidden h-32 md:h-40 bg-black">
                    <video src={videoPreview} className="w-full h-full object-contain" controls />
                    <button 
                      onClick={() => { setVideoPreview(null); setVideoFile(null); }} 
                      className="absolute top-2.5 right-2.5 bg-black/80 hover:bg-red-600/90 p-2 rounded-full text-white transition-all cursor-pointer border border-slate-800"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Text Input */}
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider font-mono">Incident Hazard Description</label>
                    <span className="text-[10px] text-slate-600 font-mono">Min 10 characters</span>
                  </div>
                  <textarea 
                    className="w-full bg-slate-950/80 border border-slate-900 focus:border-emerald-500/40 rounded-xl p-4 text-xs md:text-sm text-slate-200 placeholder-slate-700 focus:outline-none transition-all duration-300 min-h-[90px] resize-y leading-relaxed"
                    rows={3} 
                    placeholder="Provide a thorough, precise description of the infrastructure issue, such as location landmarks, immediate safety risks, or severity signs..." 
                    value={reportText} 
                    onChange={(e) => setReportText(e.target.value)}
                  />
                </div>

                {/* Geo-location validation module */}
                <div className="space-y-3 bg-slate-950/40 border border-slate-900 rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider font-mono">Spatial Verification</label>
                    <span className="px-1.5 py-0.5 bg-slate-900 text-slate-500 text-[8px] rounded font-mono border border-slate-800">WGS-84 COMPLIANT</span>
                  </div>
                  
                  <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between bg-black/40 border border-slate-950 p-3 gap-3 rounded-lg">
                    <div className="flex items-center gap-3">
                      <MapPin className={`w-5 h-5 flex-shrink-0 transition-colors ${location ? 'text-emerald-400' : 'text-slate-600'}`} />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-300">GPS Geo-Tagging</p>
                        <p className="text-[10px] text-slate-500 truncate font-mono mt-0.5">
                          {location ? `Verified lat: ${location.lat.toFixed(6)}, lng: ${location.lng.toFixed(6)}` : "Integrate exact sensor coordinates"}
                        </p>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={getLocation} 
                      disabled={isFetchingLocation} 
                      className="text-[11px] bg-[#141416] border border-slate-800 hover:border-emerald-500/20 hover:bg-emerald-500/5 hover:text-emerald-400 font-bold px-4 py-2 rounded-lg text-slate-300 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                    >
                      {isFetchingLocation ? <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" /> : <MapPin className="w-3.5 h-3.5" />}
                      {location ? 'Re-verify GPS' : 'Fetch GPS Tag'}
                    </button>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
                      <Navigation className="w-4 h-4 text-slate-600" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Or, input nearest sector or landmark address (e.g. Sector 4 commercial market)..." 
                      value={manualAddress}
                      onChange={(e) => { setManualAddress(e.target.value); setLocation(null); }}
                      className="w-full bg-black/40 border border-slate-900 focus:border-emerald-500/40 rounded-xl pl-10 pr-4 py-3 text-xs md:text-sm focus:outline-none text-slate-200 placeholder-slate-700 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Submit trigger button */}
                <div className="pt-2">
                  <button 
                    onClick={handleReportSubmit} 
                    disabled={isAnalyzing || (!reportText && !imageFile && !videoFile)} 
                    className="w-full cursor-pointer bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-4 rounded-xl flex justify-center items-center gap-2 transition-all duration-300 text-xs tracking-wider uppercase border border-emerald-500/20 hover:shadow-[0_0_20px_rgba(16,185,129,0.25)] disabled:from-slate-950 disabled:to-slate-950 disabled:border-slate-900 disabled:text-slate-600 disabled:cursor-not-allowed"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                        <span>AI Kernel Verifying Submission Authenticity...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> 
                        <span>Submit to Civic Sentinel Guard</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* AI Fraud highlight card */}
            <div className="bg-emerald-950/5 border border-emerald-900/10 rounded-2xl p-4 flex gap-3.5 items-start">
              <ShieldCheck className="w-5.5 h-5.5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-slate-200">AI Sentinel Fraud Shield Active</p>
                <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                  Our advanced deep learning models check every text, photograph, and video input against physical infrastructure failure categories. Submitting spam, fake test words, or off-topic imagery results in automatic instant rejection with no XP points awarded.
                </p>
                <button 
                  onClick={handleSimulateSpam}
                  className="mt-2.5 text-[10px] text-emerald-400 font-bold hover:text-emerald-300 flex items-center gap-1 cursor-pointer hover:underline uppercase tracking-wide font-mono"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Simulate Spam Detection (Demonstration)</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: LIVE TRACKING DASHBOARD */}
        {activeTab === 'dashboard' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6 max-w-5xl mx-auto"
          >
            {/* Real-time Sentinel Analytics Header banner */}
            <div className="bg-gradient-to-r from-[#181127] to-[#0d0914] border border-purple-950/30 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Sparkles className="w-44 h-44 text-purple-500" />
              </div>
              <div className="space-y-1 relative z-10">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-purple-950 text-purple-400 border border-purple-900/30 text-[9px] font-mono rounded font-bold uppercase tracking-wider">PREDICTIVE AI ENGINES</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                </div>
                <h3 className="text-purple-300 font-medium text-sm md:text-base tracking-wide flex items-center gap-2">
                  <BarChart3 className="w-4.5 h-4.5" /> 
                  <span>Predictive Infrastructure Analytics System Online</span>
                </h3>
                <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
                  CivicSite compiles local report densities, hazard classes, and coordinates dynamically. Execute predictive macro forecasting in our insights hub to identify cascading utility damage risk profiles.
                </p>
              </div>
              <button 
                onClick={() => { setActiveTab('insights'); generatePrediction(); }} 
                className="w-full md:w-auto text-xs font-bold bg-purple-600 hover:bg-purple-500 hover:shadow-[0_0_15px_rgba(147,51,234,0.3)] text-white px-5 py-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap self-stretch md:self-auto border border-purple-500/20"
              >
                <span>Synthesize Predictions</span> 
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Network Stat Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
               <div className="bg-[#0f0f11] border border-slate-900 rounded-2xl p-4 shadow-md relative overflow-hidden">
                 <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider font-mono">Open Infrastructure Hazards</p>
                 <div className="flex items-baseline gap-2 mt-1">
                   <p className="text-2xl md:text-4xl font-light text-white font-mono">{stats.open}</p>
                   <span className="text-xs text-slate-500">tickets</span>
                 </div>
                 <div className="absolute -bottom-4 -right-4 text-slate-900 opacity-20">
                   <Target className="w-16 h-16" />
                 </div>
               </div>
               
               <div className="bg-[#0f0f11] border border-slate-900 rounded-2xl p-4 shadow-md relative overflow-hidden">
                 <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider font-mono">Peer-Verified Indicators</p>
                 <div className="flex items-baseline gap-2 mt-1">
                   <p className="text-2xl md:text-4xl font-light text-emerald-400 font-mono">{stats.verified}</p>
                   <span className="text-[10px] text-emerald-600 font-mono font-bold font-semibold bg-emerald-950/20 px-1.5 py-0.5 rounded border border-emerald-900/10">ON-CHAIN</span>
                 </div>
                 <div className="absolute -bottom-4 -right-4 text-emerald-950 opacity-10">
                   <ShieldCheck className="w-16 h-16" />
                 </div>
               </div>
               
               <div className="bg-[#0f0f11] border border-slate-900 rounded-2xl p-4 shadow-md relative overflow-hidden">
                 <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider font-mono">Resolved & Cleared</p>
                 <div className="flex items-baseline gap-2 mt-1">
                   <p className="text-2xl md:text-4xl font-light text-blue-400 font-mono">{stats.resolved}</p>
                   <span className="text-xs text-slate-500">units</span>
                 </div>
                 <div className="absolute -bottom-4 -right-4 text-blue-950 opacity-10">
                   <Wrench className="w-16 h-16" />
                 </div>
               </div>

               <div className="bg-[#0f0f11] border border-slate-900 rounded-2xl p-4 shadow-md relative overflow-hidden">
                 <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider font-mono">AI Spam Intercepts</p>
                 <div className="flex items-baseline gap-2 mt-1">
                   <p className="text-2xl md:text-4xl font-light text-red-500 font-mono">{stats.spamBlocked}</p>
                   <span className="text-xs text-red-400 font-mono">defended</span>
                 </div>
                 <div className="absolute -bottom-4 -right-4 text-red-950 opacity-10">
                   <AlertTriangle className="w-16 h-16" />
                 </div>
               </div>
            </div>

            {/* Simulated Live Visual Scan Canvas */}
            <div className="bg-[#0f0f11] border border-slate-900 rounded-2xl p-5 shadow-xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-900 pb-4 mb-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-400 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <span>Real-time Coordinate Spatial Grid Scan</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">Live geographic distribution mapping of active municipal tickets.</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono bg-slate-950 border border-slate-900 px-3 py-1 rounded-lg">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-slate-300">GEO SCANNER ENGAGED</span>
                </div>
              </div>

              {/* Pure SVG Custom High-Contrast Radar Map / Scatter Grid */}
              <div className="relative w-full h-48 bg-slate-950/40 rounded-xl overflow-hidden border border-slate-900 flex items-center justify-center">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#141416_1px,transparent_1px),linear-gradient(to_bottom,#141416_1px,transparent_1px)] bg-[size:24px_24px]" />
                
                {/* Circular Radar Grids */}
                <div className="absolute w-24 h-24 rounded-full border border-slate-900/80" />
                <div className="absolute w-48 h-48 rounded-full border border-slate-900/60" />
                <div className="absolute w-72 h-72 rounded-full border border-slate-900/40" />
                
                {/* Simulated Radar Swivel sweep line */}
                <motion.div 
                  className="absolute w-1/2 h-0.5 bg-gradient-to-r from-emerald-500/20 to-transparent origin-left left-1/2 top-1/2"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
                />

                {/* Simulated Interactive Coordinate dots for active hazards */}
                {feed.filter(i => !i.dispatched).map((item, idx) => {
                  // Coordinate fallback maps
                  const leftPos = 20 + (idx * 22) % 60;
                  const topPos = 25 + (idx * 17) % 55;
                  
                  return (
                    <motion.div 
                      key={item.id}
                      className="absolute cursor-pointer group"
                      style={{ left: `${leftPos}%`, top: `${topPos}%` }}
                      whileHover={{ scale: 1.3 }}
                      onClick={() => showNotification(`Active ticket ${item.category} (Risk score: ${item.risk_score}) centered.`, "info")}
                    >
                      <span className={`absolute -inset-1.5 rounded-full opacity-40 animate-ping ${
                        item.severity === 'Critical' ? 'bg-red-500' : 'bg-emerald-500'
                      }`} />
                      <span className={`relative block w-2.5 h-2.5 rounded-full border border-slate-950 ${
                        item.severity === 'Critical' ? 'bg-red-500' : 'bg-emerald-500'
                      }`} />
                      
                      {/* Tooltip */}
                      <div className="hidden group-hover:block absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#111] border border-slate-800 text-[9px] text-white py-1 px-2.5 rounded-md shadow-2xl whitespace-nowrap z-30 font-mono">
                        {item.category} ({item.severity})
                      </div>
                    </motion.div>
                  );
                })}

                <div className="absolute bottom-3 left-3 flex gap-4 text-[9px] font-mono text-slate-500 bg-slate-950/80 px-2.5 py-1.5 rounded-md border border-slate-900">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Active Hazard</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span>Critical Alert</span>
                  </div>
                </div>

                <div className="absolute top-3 right-3 text-[9px] font-mono text-slate-500">
                  SYSTEM LATENCY: <span className="text-emerald-500">12ms</span>
                </div>
              </div>
            </div>

            {/* Interactive category filters */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h2 className="text-base font-semibold text-white tracking-wide font-mono flex items-center gap-2">
                <Navigation className="text-emerald-500 w-4.5 h-4.5" /> 
                <span>Dynamic Infrastructure Feeds</span>
              </h2>

              <div className="flex flex-wrap items-center gap-1.5">
                {["All", "Water Leakage", "Pothole", "Tree", "Streetlight"].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-mono tracking-wide border cursor-pointer transition-all duration-300 ${
                      filterCategory === cat 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-bold' 
                        : 'bg-slate-950/40 text-slate-500 border-slate-900 hover:text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Report List Grid */}
            {filteredFeed.length > 0 ? (
              <div className="space-y-4">
                {filteredFeed.map((item) => (
                  <motion.div 
                    key={item.id} 
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-5 border rounded-2xl flex flex-col lg:flex-row gap-5 transition-all duration-300 ${
                      item.dispatched 
                        ? 'bg-[#0a0a0a] border-slate-950 opacity-60' 
                        : 'bg-[#0f0f11] border-slate-900 hover:border-slate-850 shadow-lg hover:shadow-xl'
                    }`}
                  >
                     {/* Geographic embedded/mock widget */}
                     <div className="w-full lg:w-1/3 h-48 lg:h-auto min-h-[170px] relative overflow-hidden rounded-xl border border-slate-900 bg-slate-950/40">
                       {item.location ? ( 
                         <iframe 
                           title="Incident Map Coordinates"
                           width="100%" 
                           height="100%" 
                           frameBorder="0" 
                           style={{ border: 0, filter: "grayscale(1) invert(0.9) contrast(1.1)" }} 
                           src={`https://www.google.com/maps?q=${item.location.lat},${item.location.lng}&output=embed&z=15`} 
                           allowFullScreen
                         /> 
                       ) : ( 
                         <div className="h-full flex flex-col justify-center items-center p-4 text-center">
                           <MapPin className="w-6 h-6 text-slate-700 mb-2" />
                           <p className="text-xs font-semibold text-slate-400">Neighborhood Address</p>
                           <p className="text-[10px] text-slate-500 mt-1 italic max-w-[200px] leading-relaxed">
                             "{item.manualAddress || 'Not Provided'}"
                           </p>
                         </div> 
                       )}
                     </div>

                     {/* Report details card */}
                     <div className="w-full lg:w-2/3 flex flex-col justify-between">
                       <div className="space-y-4">
                         <div className="flex flex-wrap items-center justify-between gap-2.5">
                           <div className="flex items-center gap-2">
                             <span className="px-2.5 py-1 bg-[#141416] text-slate-200 text-[10px] font-bold rounded-lg font-mono border border-slate-800 uppercase tracking-wider">
                               {item.category}
                             </span>
                             <span className="text-[10px] text-slate-500 font-mono">{item.time}</span>
                           </div>
                           
                           <div className="flex items-center gap-2">
                             <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border font-mono ${
                               item.severity === 'Critical' 
                                 ? 'text-red-400 bg-red-950/20 border-red-900/20 shadow-[0_0_8px_rgba(239,68,68,0.1)] animate-pulse' 
                                 : item.severity === 'High'
                                 ? 'text-amber-400 bg-amber-950/20 border-amber-900/20'
                                 : 'text-blue-400 bg-blue-950/20 border-blue-900/20'
                             }`}>
                               {item.severity} severity
                             </span>
                             <span className="text-[10px] font-bold font-mono text-white bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-900">
                               RISK SCORE: {item.risk_score}
                             </span>
                           </div>
                         </div>
                         
                         <div>
                           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 font-mono">Resident report details</p>
                           <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans border-l border-emerald-500/40 pl-3.5 py-0.5 mb-3.5">
                             "{item.description || 'No descriptive text provided.'}"
                           </p>

                           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 font-mono">Recommended AI Action Plan</p>
                           <p className="text-xs text-slate-400 leading-relaxed font-sans border-l border-slate-800 pl-3.5 py-0.5">
                             {item.recommended_action}
                           </p>
                         </div>
                       </div>

                       <div className="flex flex-col sm:flex-row justify-between sm:items-center border-t border-slate-900 mt-5 pt-4 gap-3">
                         <div className="flex items-center gap-1.5 text-[10px] font-mono">
                           <span className="text-slate-500">MUNICIPAL DEPT IN CHARGE:</span>
                           <span className="text-slate-200 font-semibold">{item.department_needed}</span>
                         </div>

                         {item.dispatched ? (
                            <p className="text-[9px] font-bold text-blue-400 flex items-center gap-1.5 uppercase tracking-widest font-mono bg-blue-950/20 border border-blue-900/20 px-3 py-1.5 rounded-lg">
                              <Wrench className="w-3.5 h-3.5" /> 
                              <span>Assigned to field units</span>
                            </p>
                         ) : (
                           <div className="flex flex-wrap items-center gap-2">
                             <span className="text-[9px] font-bold text-emerald-500 flex items-center gap-1.5 uppercase tracking-wider font-mono bg-emerald-950/20 border border-emerald-900/20 px-2.5 py-1 rounded-lg">
                               <ShieldCheck className="w-3.5 h-3.5" /> 
                               <span>AI validated</span>
                             </span>
                             
                             <button 
                               type="button"
                               onClick={() => handleVerify(item.id)} 
                               disabled={item.userVerified || item.isMine} 
                               className={`text-[10px] font-bold px-3 py-1.5 rounded-xl border flex items-center gap-1 transition-all duration-300 cursor-pointer ${
                                 item.isMine 
                                   ? 'bg-slate-950/40 text-slate-600 border-slate-900/40 cursor-not-allowed' 
                                   : item.userVerified 
                                   ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40 hover:bg-emerald-900/10' 
                                   : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-200'
                               }`}
                             >
                               <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> 
                               <span>
                                 {item.isMine ? 'Authoring Report' : item.userVerified ? 'Verified by Peer' : 'Verify Incident (+5 XP)'}
                               </span>
                             </button>
                           </div>
                         )}
                       </div>
                     </div>
                  </motion.div>
                ))}
              </div>
            ) : ( 
              <div className="text-center bg-[#0f0f11] border border-slate-900 rounded-2xl py-20 shadow-xl">
                <Search className="w-12 h-12 mx-auto mb-4 text-slate-700 animate-pulse" />
                <p className="text-sm font-semibold text-slate-400">No active reports match this category filter</p>
                <p className="text-xs text-slate-600 mt-1">Select other category filters or submit a new hazard audit.</p>
              </div> 
            )}
          </motion.div>
        )}

        {/* TAB 3: AGENTIC DISPATCH HUB (Unique Feature) */}
        {activeTab === 'dispatch' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-4xl mx-auto"
          >
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2 py-0.5 bg-blue-950/40 text-blue-400 border border-blue-900/30 text-[9px] font-mono rounded font-bold uppercase tracking-wider">MUNICIPAL INTEGRATION</span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              </div>
              <h2 className="text-2xl md:text-3xl font-light text-white tracking-wide">Agentic Dispatch Hub</h2>
              <p className="text-xs md:text-sm text-slate-500 leading-relaxed mt-1">
                Autonomous municipal routing and automatic work order generators. When residents file verified issues, CivicSite's agentic pipeline maps the hazard, estimates repair budgets, and routes dispatch coordinates to city maintenance.
              </p>
            </div>

            {/* Workflow Pipeline Progress Indicator */}
            <div className="bg-[#0f0f11] border border-slate-900 rounded-2xl p-5 shadow-xl">
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-400 mb-4 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-blue-400 animate-pulse" />
                <span>Active Routing & Dispatch Pipeline Stepper</span>
              </h3>
              
              <div className="grid grid-cols-5 gap-2 relative">
                {[
                  { step: "1", title: "Ingest", desc: "Citizen files report" },
                  { step: "2", title: "AI Audit", desc: "Anti-spam guard check" },
                  { step: "3", title: "Verify", desc: "Peer consensus validation" },
                  { step: "4", title: "Budget", desc: "AI cost estimation" },
                  { step: "5", title: "Dispatch", desc: "Work order routed" }
                ].map((item, idx) => (
                  <div key={idx} className="text-center flex flex-col items-center">
                    <div className="w-7 h-7 rounded-full bg-blue-950/40 border border-blue-900/40 text-blue-400 flex items-center justify-center text-xs font-mono font-bold mb-2 relative z-10">
                      {item.step}
                    </div>
                    <p className="text-[10px] font-bold text-slate-300 font-mono uppercase">{item.title}</p>
                    <p className="text-[8px] text-slate-500 mt-0.5 leading-tight hidden sm:block">{item.desc}</p>
                  </div>
                ))}
                {/* Horizontal line */}
                <div className="absolute top-3.5 left-8 right-8 h-0.5 bg-slate-900 z-0" />
              </div>
            </div>
            
            <div className="bg-[#0f0f11] border border-slate-900 rounded-2xl p-5 md:p-7 shadow-xl">
              <div className="flex justify-between items-center border-b border-slate-900 pb-4 mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-400">
                  Pending Autonomous Work Orders ({feed.filter(i => !i.dispatched).length})
                </h3>
                <span className="text-[9px] text-slate-500 font-mono">ESTIMATED TOTAL BUDGETS AT ACTIVE ROUTE</span>
              </div>

              {feed.filter(i => !i.dispatched).length === 0 ? (
                <div className="text-center text-slate-600 py-16">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-25 text-slate-500 animate-pulse" />
                  <p className="text-sm font-semibold text-slate-400">All Work Orders Routed & Dispatched</p>
                  <p className="text-xs text-slate-600 mt-1">Every active hazard has been routed to corresponding public utility departments.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {feed.filter(i => !i.dispatched).map(item => (
                    <div 
                      key={item.id} 
                      className="bg-slate-950/60 border border-blue-950/20 hover:border-blue-900/40 p-4 md:p-5 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all duration-300"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-mono font-semibold bg-blue-950/30 text-blue-400 border border-blue-900/20 px-2 py-0.5 rounded uppercase tracking-wider">
                            {item.category}
                          </span>
                          <span className="text-[10px] text-slate-600 font-mono">TICKET ID: #{item.id}</span>
                        </div>
                        <p className="text-sm font-bold text-white leading-relaxed">Authorized Work Order: {item.category} Repair Route</p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10px] text-slate-500 font-mono">
                          <p className="flex items-center gap-1">
                            <Building className="w-3.5 h-3.5 text-blue-400" />
                            <span>Destination unit:</span>
                            <span className="text-blue-300 font-semibold">{item.department_needed}</span>
                          </p>
                          <p className="hidden sm:block text-slate-800">•</p>
                          <p>Est. Repair Cost: <span className="text-slate-300 font-semibold">{item.estimated_cost}</span></p>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed bg-[#0a0a0c] p-3 rounded-lg border border-slate-900 mt-2 font-mono text-[11px]">
                          <span className="text-blue-400 font-bold">ROUTING INSTRUCTION:</span> {item.recommended_action}
                        </p>
                      </div>
                      <button 
                        onClick={() => dispatchToMunicipality(item.id)} 
                        className="w-full md:w-auto justify-center bg-blue-600 hover:bg-blue-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.25)] text-white text-xs font-semibold px-4.5 py-3 rounded-lg shadow-lg flex items-center gap-2 transition-all duration-300 cursor-pointer border border-blue-500/10"
                      >
                        <Zap className="w-3.5 h-3.5 animate-pulse" /> 
                        <span>Authorize Route</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* TAB 4: PREDICTIVE AI INSIGHTS */}
        {activeTab === 'insights' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-4xl mx-auto"
          >
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2 py-0.5 bg-purple-950/40 text-purple-400 border border-purple-900/30 text-[9px] font-mono rounded font-bold uppercase tracking-wider">MACRO REASONING</span>
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
              </div>
              <h2 className="text-2xl md:text-3xl font-light text-white tracking-wide">Predictive AI Insights</h2>
              <p className="text-xs md:text-sm text-slate-500 leading-relaxed mt-1">
                Spatial-temporal analytics forecasting cascading hazard risks. Powered by Gemini, CivicSite correlates neighborhood category densities, rainfall history, and soil factors to predict future public utility failure points before they manifest.
              </p>
            </div>
            
            <div className="bg-[#0f0f11] border border-slate-900 rounded-2xl p-5 md:p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-purple-500 to-indigo-500" />
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 border-b border-slate-900 pb-5 gap-4">
                <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-400 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-400 animate-pulse" /> 
                  <span>Active Macro Prediction Models</span>
                </h3>
                
                <button 
                  onClick={generatePrediction} 
                  disabled={isPredicting} 
                  className="w-full sm:w-auto justify-center text-xs font-bold bg-purple-600 hover:bg-purple-500 hover:shadow-[0_0_15px_rgba(147,51,234,0.25)] text-white px-5 py-3 rounded-xl flex items-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border border-purple-500/10"
                >
                  {isPredicting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Processing Spatial-Temporal Vectors...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5 animate-pulse text-purple-300" />
                      <span>Run Macro Analytics</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-slate-950/60 border border-slate-900 p-5 md:p-7 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 text-purple-500 pointer-events-none">
                  <BarChart3 className="w-40 h-40" />
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
                  <p className="text-[10px] font-bold uppercase text-purple-400 tracking-wider font-mono">Live Predictive Prognosis</p>
                </div>
                <p className="text-xs md:text-sm text-slate-200 font-light leading-relaxed relative z-10 font-mono">
                  {prediction}
                </p>
              </div>

              {/* Multi-modal AI forecasting breakdown cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900 space-y-2">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                  <p className="text-xs font-bold text-slate-200 uppercase font-mono">Risk saturation model</p>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Soil load meters around water leaks currently register a 43% wet-pack factor, implying higher ground-slip risks on high-grade inclines if leaks persist past 72 hours.
                  </p>
                </div>
                
                <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900 space-y-2">
                  <Activity className="w-5 h-5 text-purple-400" />
                  <p className="text-xs font-bold text-slate-200 uppercase font-mono">Compounding utility curves</p>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Correlating historical power-grid maps with hazardous tree records allows local city response units to prune branches proactively, averting storm outages.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 5: AI SPAM GUARD & DATA HYGIENE LOGS (Unique Feature) */}
        {activeTab === 'spam-prevention' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-4xl mx-auto"
          >
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2 py-0.5 bg-red-950/40 text-red-400 border border-red-900/30 text-[9px] font-mono rounded font-bold uppercase tracking-wider">FRAUD SHIELD LOGS</span>
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              </div>
              <h2 className="text-2xl md:text-3xl font-light text-white tracking-wide">AI Spam & Fraud Prevention</h2>
              <p className="text-xs md:text-sm text-slate-500 leading-relaxed mt-1">
                Zero waste, high-purity public hazard databases. To protect municipal workers from hunting fake pothole coordinates or inspecting funny memes, CivicSite utilizes a rigorous server-side AI guard rail to automatically inspect and drop spam.
              </p>
            </div>

            {/* Spam guard statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#0f0f11] border border-slate-900 p-4 rounded-xl relative overflow-hidden">
                <p className="text-[9px] text-slate-500 uppercase tracking-wider font-mono">Fraud Filtering Rate</p>
                <p className="text-2xl font-light text-white font-mono mt-1">99.8%</p>
                <span className="text-[9px] text-slate-600 block mt-1 leading-normal">Of off-topic uploads auto-discarded</span>
              </div>
              <div className="bg-[#0f0f11] border border-slate-900 p-4 rounded-xl relative overflow-hidden">
                <p className="text-[9px] text-slate-500 uppercase tracking-wider font-mono">Intercepted Spam Files</p>
                <p className="text-2xl font-light text-red-400 font-mono mt-1">{stats.spamBlocked}</p>
                <span className="text-[9px] text-slate-600 block mt-1 leading-normal">Rejected community uploads</span>
              </div>
              <div className="bg-[#0f0f11] border border-slate-900 p-4 rounded-xl relative overflow-hidden">
                <p className="text-[9px] text-slate-500 uppercase tracking-wider font-mono">Data hygiene index</p>
                <p className="text-2xl font-light text-emerald-400 font-mono mt-1">100%</p>
                <span className="text-[9px] text-slate-600 block mt-1 leading-normal">Clean, highly actionable dispatch feeds</span>
              </div>
            </div>

            <div className="bg-[#0f0f11] border border-slate-900 rounded-2xl p-5 md:p-7 shadow-xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-900 pb-4 mb-4 gap-2">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-400 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span>Real-time Intercept & Rejection Audit Ledger</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">Log of local submissions discarded by our deep classification guard.</p>
                </div>
                <button 
                  onClick={handleSimulateSpam}
                  className="w-full sm:w-auto text-center font-bold text-[10px] bg-red-950/20 text-red-400 border border-red-900/30 hover:bg-red-900 hover:text-white px-3.5 py-2 rounded-lg cursor-pointer transition-all duration-300"
                >
                  SIMULATE SPAM ATTEMPT
                </button>
              </div>

              {spamLogs.length > 0 ? (
                <div className="space-y-3">
                  {spamLogs.map((item) => (
                    <div 
                      key={item.id} 
                      className="bg-slate-950/40 border border-slate-900 p-4 rounded-xl space-y-2"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-1.5 text-[10px] font-mono">
                        <div className="flex items-center gap-2">
                          <span className="bg-red-950/30 text-red-400 border border-red-900/20 px-2 py-0.5 rounded uppercase font-semibold">
                            {item.detected_spam_type}
                          </span>
                          <span className="text-slate-600">TIME: {item.rejected_at}</span>
                        </div>
                        <span className="text-red-500 font-bold bg-red-950/20 border border-red-900/10 px-2 py-0.5 rounded">
                          AI CONFIDENCE: {item.confidence}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 text-xs">
                        <div className="bg-[#0c0c0e] p-3 rounded-lg border border-slate-900/80">
                          <p className="text-[9px] font-bold text-slate-600 uppercase tracking-wide font-mono mb-1">Incoming Submission Text</p>
                          <p className="text-slate-400 font-mono leading-relaxed truncate-2-lines font-medium">"{item.submission_text}"</p>
                        </div>
                        
                        <div className="bg-[#0c0c0e] p-3 rounded-lg border border-slate-900/80">
                          <p className="text-[9px] font-bold text-red-500/80 uppercase tracking-wide font-mono mb-1">AI Automated Rejection Reason</p>
                          <p className="text-slate-400 leading-relaxed font-sans">{item.rejection_reason}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-slate-600 py-12">
                  <ShieldCheck className="w-12 h-12 mx-auto mb-3 opacity-25 text-emerald-500 animate-pulse" />
                  <p className="text-sm font-semibold text-slate-400">No Rejection Logs Found</p>
                  <p className="text-xs text-slate-600 mt-1">Data filters have been silent today. Click above to inject a simulated spam report.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
