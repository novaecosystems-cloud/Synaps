import React from 'react';
import { cn } from '@/lib/utils';
import { Pencil, UserPlus, Settings, Trash2, UsersRound } from 'lucide-react';

export function ActionCard({ className }: { className?: string }) {
  return (
    <div className={cn("w-[200px] bg-[#242832] rounded-[10px] py-[15px] flex flex-col gap-[10px] shadow-lg", className)} style={{
      backgroundImage: "linear-gradient(139deg, rgba(36, 40, 50, 1) 0%, rgba(36, 40, 50, 1) 0%, rgba(37, 28, 40, 1) 100%)"
    }}>
      <ul className="list-none flex flex-col gap-[8px] px-[10px]">
        <li className="flex items-center text-[#7e8590] gap-[10px] transition-all duration-300 py-[4px] px-[7px] rounded-[6px] cursor-pointer hover:bg-[#5353ff] hover:text-white hover:-translate-y-[1px] hover:translate-x-[1px] active:scale-95 group">
          <Pencil className="w-[19px] h-[19px] transition-all duration-300 group-hover:stroke-white" />
          <p className="font-semibold text-sm">Rename</p>
        </li>
        <li className="flex items-center text-[#7e8590] gap-[10px] transition-all duration-300 py-[4px] px-[7px] rounded-[6px] cursor-pointer hover:bg-[#5353ff] hover:text-white hover:-translate-y-[1px] hover:translate-x-[1px] active:scale-95 group">
          <UserPlus className="w-[19px] h-[19px] transition-all duration-300 group-hover:stroke-white" />
          <p className="font-semibold text-sm">Add Member</p>
        </li>
      </ul>
      
      <div className="border-t-[1.5px] border-[#42434a]"></div>
      
      <ul className="list-none flex flex-col gap-[8px] px-[10px]">
        <li className="flex items-center text-[#7e8590] gap-[10px] transition-all duration-300 py-[4px] px-[7px] rounded-[6px] cursor-pointer hover:bg-[#5353ff] hover:text-white hover:-translate-y-[1px] hover:translate-x-[1px] active:scale-95 group">
          <Settings className="w-[19px] h-[19px] transition-all duration-300 group-hover:stroke-white" />
          <p className="font-semibold text-sm">Settings</p>
        </li>
        <li className="flex items-center text-[#7e8590] gap-[10px] transition-all duration-300 py-[4px] px-[7px] rounded-[6px] cursor-pointer hover:bg-[#8e2a2a] hover:text-white hover:-translate-y-[1px] hover:translate-x-[1px] active:scale-95 group">
          <Trash2 className="w-[19px] h-[19px] transition-all duration-300 group-hover:stroke-white" />
          <p className="font-semibold text-sm">Delete</p>
        </li>
      </ul>
      
      <div className="border-t-[1.5px] border-[#42434a]"></div>
      
      <ul className="list-none flex flex-col gap-[8px] px-[10px]">
        <li className="flex items-center text-[#bd89ff] gap-[10px] transition-all duration-300 py-[4px] px-[7px] rounded-[6px] cursor-pointer hover:bg-[rgba(56,45,71,0.836)] hover:-translate-y-[1px] hover:translate-x-[1px] active:scale-95 group">
          <UsersRound className="w-[19px] h-[19px] transition-all duration-300 stroke-[#bd89ff]" />
          <p className="font-semibold text-sm">Team Access</p>
        </li>
      </ul>
    </div>
  );
}
