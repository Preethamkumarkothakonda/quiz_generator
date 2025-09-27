import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import { 
  Code, 
  Atom, 
  Zap, 
  TrendingUp, 
  Monitor, 
  Users, 
  Brain, 
  Database, 
  Smartphone, 
  Cloud,
  Shield,
  Search
} from 'lucide-react';

const TopicSelection: React.FC = () => {
  const [customTopic, setCustomTopic] = useState('');
  const { setTopic } = useQuiz();
  const navigate = useNavigate();

  const predefinedTopics = [
    {
      title: 'JavaScript',
      icon: Code,
      color: 'from-yellow-400 to-orange-500',
      bgColor: 'bg-gradient-to-br from-yellow-50 to-orange-50',
      iconColor: 'text-yellow-600'
    },
    {
      title: 'React',
      icon: Atom,
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Python',
      icon: Zap,
      color: 'from-green-400 to-green-600',
      bgColor: 'bg-gradient-to-br from-green-50 to-green-50',
      iconColor: 'text-green-600'
    },
    {
      title: 'Machine Learning',
      icon: TrendingUp,
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-gradient-to-br from-purple-50 to-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Web Development',
      icon: Monitor,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-50',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Team Management',
      icon: Users,
      color: 'from-pink-400 to-pink-600',
      bgColor: 'bg-gradient-to-br from-pink-50 to-pink-50',
      iconColor: 'text-pink-600'
    },
    {
      title: 'Data Science',
      icon: Brain,
      color: 'from-indigo-400 to-indigo-600',
      bgColor: 'bg-gradient-to-br from-indigo-50 to-indigo-50',
      iconColor: 'text-indigo-600'
    },
    {
      title: 'Database Design',
      icon: Database,
      color: 'from-teal-400 to-teal-600',
      bgColor: 'bg-gradient-to-br from-teal-50 to-teal-50',
      iconColor: 'text-teal-600'
    },
    {
      title: 'Mobile Development',
      icon: Smartphone,
      color: 'from-red-400 to-red-600',
      bgColor: 'bg-gradient-to-br from-red-50 to-red-50',
      iconColor: 'text-red-600'
    },
    {
      title: 'Cloud Computing',
      icon: Cloud,
      color: 'from-sky-400 to-sky-600',
      bgColor: 'bg-gradient-to-br from-sky-50 to-sky-50',
      iconColor: 'text-sky-600'
    },
    {
      title: 'Cybersecurity',
      icon: Shield,
      color: 'from-orange-400 to-orange-600',
      bgColor: 'bg-gradient-to-br from-orange-50 to-orange-50',
      iconColor: 'text-orange-600'
    },
    {
      title: 'SEO Marketing',
      icon: Search,
      color: 'from-emerald-400 to-emerald-600',
      bgColor: 'bg-gradient-to-br from-emerald-50 to-emerald-50',
      iconColor: 'text-emerald-600'
    }
  ];

  const handleTopicSelect = (topic: string) => {
    setTopic(topic);
    navigate('/loader');
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTopic.trim()) {
      handleTopicSelect(customTopic.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header Section */}
      <div className="text-center py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            AI Quiz Master
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Test your knowledge with AI-generated questions on any topic. Choose
            from popular categories or create your own custom quiz.
          </p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Choose Your Quiz Topic
          </h2>
        </motion.div>

        {/* Topics Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
        >
          {predefinedTopics.map((topic, index) => {
            const IconComponent = topic.icon;
            return (
              <motion.div
                key={topic.title}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                  delay: index * 0.1 + 0.4, 
                  duration: 0.6,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  scale: 1.05,
                  y: -8,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleTopicSelect(topic.title)}
                className={`${topic.bgColor} p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-white/50 backdrop-blur-sm group`}
              >
                <div className="text-center">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${topic.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors">
                    {topic.title}
                  </h3>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Custom Topic Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8"
        >
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Create Custom Quiz
            </h3>
            <p className="text-gray-600">
              Enter any topic you want to learn about
            </p>
          </div>
          
          <form onSubmit={handleCustomSubmit} className="max-w-md mx-auto">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="e.g., Quantum Physics, Digital Marketing..."
                  className="w-full px-6 py-4 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200 text-gray-700 placeholder-gray-400 shadow-sm"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={!customTopic.trim()}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Start Quiz
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-gray-500 text-sm">
            Powered by AI • 5 Questions • Instant Results
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default TopicSelection;
