import { motion } from "framer-motion";
import { Tag } from "lucide-react";

const TopicsSection = ({ repository }) => {
  if (!repository.topics || repository.topics.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Tag className="w-5 h-5 text-gray-600" />
        <span className="text-lg font-semibold text-gray-900">
          Topics & Technologies
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {repository.topics.map((topic, index) => (
          <motion.span
            key={topic}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-full text-sm border border-blue-200 hover:shadow-md transition-all cursor-pointer"
          >
            {topic}
          </motion.span>
        ))}
      </div>
    </div>
  );
};

export default TopicsSection;
