import { TrendingDown, TrendingUp } from "lucide-react";

const Card = ({ title, value, change, icon: Icon, color = "blue" }) => (
  <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-400 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
        {change && (
          <div
            className={`flex items-center mt-2 ${
              change > 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            {change > 0 ? (
              <TrendingUp className="w-4 h-4 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-1" />
            )}
            <span className="text-sm">{Math.abs(change)}% vs last period</span>
          </div>
        )}
      </div>
      <Icon className={`w-8 h-8 text-${color}-400`} />
    </div>
  </div>
);

export default Card;