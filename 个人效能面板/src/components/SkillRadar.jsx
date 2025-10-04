import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

const SkillRadar = ({ skills }) => {
  // 为雷达图准备数据，确保至少有6个技能点
  const radarData = skills.length > 0 ? skills : [
    { name: 'React', level: 0 },
    { name: 'JavaScript', level: 0 },
    { name: 'Node.js', level: 0 },
    { name: 'Python', level: 0 },
    { name: 'CSS', level: 0 },
    { name: 'Git', level: 0 }
  ];

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="name" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <Radar
            name="技能水平"
            dataKey="level"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SkillRadar;
