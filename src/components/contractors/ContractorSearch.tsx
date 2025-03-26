
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface ContractorSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  skills?: string[];
  onSkillsChange?: (skills: string[]) => void;
}

const ContractorSearch = ({ 
  searchTerm, 
  onSearchChange,
  skills = [],
  onSkillsChange
}: ContractorSearchProps) => {
  const [skillInput, setSkillInput] = useState('');
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && skillInput.trim() && onSkillsChange) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        onSkillsChange([...skills, skillInput.trim()]);
      }
      setSkillInput('');
    }
  };
  
  const removeSkill = (skill: string) => {
    if (onSkillsChange) {
      onSkillsChange(skills.filter(s => s !== skill));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search contractors by name, email, or skills..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1"
        />
        
        {onSkillsChange && (
          <div className="relative flex-1">
            <Input
              placeholder="Add skill filter (e.g. React)..."
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full"
            />
            {skillInput && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => setSkillInput('')}
              >
                <X size={14} />
              </Button>
            )}
          </div>
        )}
      </div>
      
      {onSkillsChange && skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {skills.map(skill => (
            <Badge key={skill} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
              {skill}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1 hover:bg-gray-200 rounded-full"
                onClick={() => removeSkill(skill)}
              >
                <X size={12} />
              </Button>
            </Badge>
          ))}
          
          {skills.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs"
              onClick={() => onSkillsChange([])}
            >
              Clear All
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ContractorSearch;
