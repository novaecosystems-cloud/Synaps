import React from 'react';
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { MoreVertical, Settings, Trash2, Edit2, Users, UsersRound } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ActionMenuProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onMembers?: () => void;
  onSettings?: () => void;
  onAccess?: () => void;
}

export function ActionMenu({ onEdit, onDelete, onMembers, onSettings, onAccess }: ActionMenuProps) {
  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger asChild>
        <button className="p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground rounded-md transition-colors focus:outline-none">
          <MoreVertical className="h-4 w-4" />
        </button>
      </DropdownMenuPrimitive.Trigger>
      
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content 
          align="end" 
          sideOffset={5}
          className="z-50 min-w-[200px] outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
        >
          <div className="uiverse-action-card">
            {/* Top Block: Actions */}
            <ul className="list">
              {onEdit && (
                <DropdownMenuPrimitive.Item className="outline-none" onSelect={onEdit}>
                  <li className="element">
                    <Edit2 />
                    <p className="label">Edit</p>
                  </li>
                </DropdownMenuPrimitive.Item>
              )}
              {onMembers && (
                <DropdownMenuPrimitive.Item className="outline-none" onSelect={onMembers}>
                  <li className="element">
                    <Users />
                    <p className="label">Add Member</p>
                  </li>
                </DropdownMenuPrimitive.Item>
              )}
            </ul>
            
            {(onEdit || onMembers) && (onSettings || onDelete) && <div className="separator"></div>}
            
            {/* Middle Block: Danger / Config */}
            <ul className="list">
              {onSettings && (
                <DropdownMenuPrimitive.Item className="outline-none" onSelect={onSettings}>
                  <li className="element">
                    <Settings />
                    <p className="label">Settings</p>
                  </li>
                </DropdownMenuPrimitive.Item>
              )}
              {onDelete && (
                <DropdownMenuPrimitive.Item className="outline-none" onSelect={onDelete}>
                  <li className="element delete">
                    <Trash2 />
                    <p className="label">Delete</p>
                  </li>
                </DropdownMenuPrimitive.Item>
              )}
            </ul>
            
            {onAccess && <div className="separator"></div>}
            
            {/* Bottom Block: Access */}
            {onAccess && (
              <ul className="list">
                <DropdownMenuPrimitive.Item className="outline-none" onSelect={onAccess}>
                  <li className="element">
                    <UsersRound />
                    <p className="label">Team Access</p>
                  </li>
                </DropdownMenuPrimitive.Item>
              </ul>
            )}
          </div>
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
}
