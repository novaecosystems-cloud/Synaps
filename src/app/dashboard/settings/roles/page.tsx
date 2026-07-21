'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, X } from 'lucide-react';

const permissions = [
  { name: 'View Projects', owner: true, admin: true, manager: true, member: true },
  { name: 'Create Projects', owner: true, admin: true, manager: true, member: false },
  { name: 'Delete Projects', owner: true, admin: true, manager: false, member: false },
  { name: 'Invite Users', owner: true, admin: true, manager: true, member: false },
  { name: 'Change Roles', owner: true, admin: true, manager: false, member: false },
  { name: 'Update Organization', owner: true, admin: true, manager: false, member: false },
  { name: 'Delete Account', owner: true, admin: false, manager: false, member: false },
];

export default function RolesSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Roles & Permissions</h1>
        <p className="text-muted-foreground">Understand what each role can do within your organization.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Permission Matrix</CardTitle>
          <CardDescription>A complete breakdown of capabilities by role tier.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Capability</TableHead>
                <TableHead className="text-center">Owner</TableHead>
                <TableHead className="text-center">Admin</TableHead>
                <TableHead className="text-center">Manager</TableHead>
                <TableHead className="text-center">Member</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissions.map((perm) => (
                <TableRow key={perm.name}>
                  <TableCell className="font-medium">{perm.name}</TableCell>
                  <TableCell className="text-center">
                    {perm.owner ? <Check className="h-4 w-4 mx-auto text-green-500" /> : <X className="h-4 w-4 mx-auto text-muted-foreground" />}
                  </TableCell>
                  <TableCell className="text-center">
                    {perm.admin ? <Check className="h-4 w-4 mx-auto text-green-500" /> : <X className="h-4 w-4 mx-auto text-muted-foreground" />}
                  </TableCell>
                  <TableCell className="text-center">
                    {perm.manager ? <Check className="h-4 w-4 mx-auto text-green-500" /> : <X className="h-4 w-4 mx-auto text-muted-foreground" />}
                  </TableCell>
                  <TableCell className="text-center">
                    {perm.member ? <Check className="h-4 w-4 mx-auto text-green-500" /> : <X className="h-4 w-4 mx-auto text-muted-foreground" />}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
