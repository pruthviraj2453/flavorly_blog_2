import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { NutritionInfo } from '@shared/schema';

interface NutritionalChartProps {
  nutritionInfo: Partial<NutritionInfo>;
  animated?: boolean;
}

interface NutrientData {
  name: string;
  value: number;
  color: string;
}

const COLORS = ['#FF6B6B', '#4ECDC4', '#FFD166', '#83D483'];

const NutritionalChart: React.FC<NutritionalChartProps> = ({
  nutritionInfo,
  animated = true,
}) => {
  const [chartData, setChartData] = useState<NutrientData[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  
  useEffect(() => {
    const data: NutrientData[] = [];
    
    if (nutritionInfo.calories) {
      if (nutritionInfo.proteins) {
        data.push({
          name: 'Proteins',
          value: nutritionInfo.proteins,
          color: COLORS[0],
        });
      }
      
      if (nutritionInfo.carbs) {
        data.push({
          name: 'Carbs',
          value: nutritionInfo.carbs,
          color: COLORS[1],
        });
      }
      
      if (nutritionInfo.fats) {
        data.push({
          name: 'Fats',
          value: nutritionInfo.fats,
          color: COLORS[2],
        });
      }
      
      if (nutritionInfo.fiber) {
        data.push({
          name: 'Fiber',
          value: nutritionInfo.fiber,
          color: COLORS[3],
        });
      }
    }
    
    setChartData(data);
  }, [nutritionInfo]);
  
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };
  
  const onPieLeave = () => {
    setActiveIndex(-1);
  };
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 rounded-md shadow-md border border-gray-200">
          <p className="font-medium text-gray-800">{`${payload[0].name}: ${payload[0].value}g`}</p>
        </div>
      );
    }
    
    return null;
  };
  
  if (!nutritionInfo.calories || chartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg h-64">
        <p className="text-gray-500">No nutritional data available</p>
      </div>
    );
  }
  
  return (
    <motion.div
      className="w-full bg-white rounded-xl shadow-sm p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-lg font-semibold mb-4 text-center">Nutritional Information</h3>
      
      <div className="flex flex-wrap justify-between mb-4">
        <div className="text-center p-2">
          <span className="block text-gray-500 text-sm">Calories</span>
          <motion.span 
            className="block text-xl font-bold"
            initial={animated ? { scale: 0 } : { scale: 1 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
          >
            {nutritionInfo.calories}
          </motion.span>
        </div>
        
        {chartData.map((entry, index) => (
          <div key={`stat-${entry.name}`} className="text-center p-2">
            <span className="block text-gray-500 text-sm">{entry.name}</span>
            <motion.span 
              className="block text-xl font-bold"
              style={{ color: entry.color }}
              initial={animated ? { scale: 0 } : { scale: 1 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 + (index * 0.1), duration: 0.5, type: 'spring' }}
            >
              {entry.value}g
            </motion.span>
          </div>
        ))}
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={activeIndex !== -1 ? 90 : 80}
              paddingAngle={5}
              dataKey="value"
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              animationBegin={animated ? 200 : 0}
              animationDuration={animated ? 800 : 0}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  stroke={entry.color}
                  strokeWidth={index === activeIndex ? 2 : 0}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {nutritionInfo.additionalInfo && (
        <motion.div 
          className="mt-4 text-sm text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="italic">{nutritionInfo.additionalInfo}</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default NutritionalChart;