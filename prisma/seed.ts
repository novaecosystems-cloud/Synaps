import { PrismaClient, ProjectStatus, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with demo data...');

  // Clean existing data (ignored errors)
  try { await prisma.gap.deleteMany({}); } catch (e) {}
  try { await prisma.decision.deleteMany({}); } catch (e) {}
  try { await prisma.projectTask.deleteMany({}); } catch (e) {}
  try { await prisma.document.deleteMany({}); } catch (e) {}
  try { await prisma.projectMember.deleteMany({}); } catch (e) {}
  try { await prisma.project.deleteMany({}); } catch (e) {}
  try { await prisma.user.deleteMany({}); } catch (e) {}
  try { await prisma.organization.deleteMany({}); } catch (e) {}

  // 1. Create Organization
  const org = await prisma.organization.create({
    data: {
      name: 'Acme Corp',
      settings: {
        stripeCustomerId: 'cus_demo_123',
        subscriptionStatus: 'active',
        planId: 'pro',
      }
    },
  });

  // 2. Create Users
  const user1 = await prisma.user.create({
    data: {
      id: 'user-1', // Fixed ID for demo testing
      email: 'alice@acmecorp.com',
      name: 'Alice - Project Manager',
      role: Role.OWNER,
      organizationId: org.id,
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      id: 'user-2',
      email: 'bob@acmecorp.com',
      name: 'Bob - Engineer',
      role: Role.MEMBER,
      organizationId: org.id,
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
    },
  });

  // 3. Create Projects
  const project1 = await prisma.project.create({
    data: {
      name: 'Downtown Skyscraper',
      description: 'Construction of a 50-story commercial building in downtown.',
      status: ProjectStatus.ACTIVE,
      organizationId: org.id,
      ownerId: user1.id,
      metadata: { budget: 150000000, currency: 'USD' },
      members: {
        create: [
          { userId: user1.id, role: 'MANAGER' },
          { userId: user2.id, role: 'EDITOR' },
        ],
      },
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: 'Metro Line Extension',
      description: 'Extending the blue line by 5 stations.',
      status: ProjectStatus.DRAFT,
      organizationId: org.id,
      ownerId: user1.id,
      metadata: { budget: 45000000, currency: 'USD' },
      members: {
        create: [
          { userId: user1.id, role: 'MANAGER' },
        ],
      },
    },
  });

  // 4. Create Documents
  await prisma.document.create({
    data: {
      name: 'Structural_Blueprint_v2.pdf',
      mimeType: 'application/pdf',
      sizeBytes: 1048576 * 5, // 5MB
      organizationId: org.id,
      projectId: project1.id,
      ownerId: user2.id,
      scanStatus: 'CLEAN',
    },
  });

  await prisma.document.create({
    data: {
      name: 'Site_Survey_Report.xlsx',
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      sizeBytes: 1048576 * 2, // 2MB
      organizationId: org.id,
      projectId: project1.id,
      ownerId: user1.id,
      scanStatus: 'CLEAN',
    },
  });

  // 5. Create Tasks
  await prisma.projectTask.create({
    data: {
      title: 'Review Foundation Blueprints',
      status: 'ACTIVE',
      projectId: project1.id,
      deadline: new Date(Date.now() + 86400000 * 3), // 3 days from now
    },
  });

  await prisma.projectTask.create({
    data: {
      title: 'Approve Budget Increase',
      status: 'INCOMPLETE',
      projectId: project1.id,
      deadline: new Date(Date.now() + 86400000 * 1),
    },
  });

  // 6. Notifications for demo
  await prisma.notification.create({
    data: {
      userId: user1.id,
      organizationId: org.id,
      title: 'Blueprint Processed',
      message: 'Structural_Blueprint_v2.pdf has been successfully parsed and chunked.',
      type: 'DOCUMENT_PROCESSED',
      isRead: false,
      link: `/dashboard/documents`,
    }
  });

  await prisma.notification.create({
    data: {
      userId: user1.id,
      organizationId: org.id,
      title: 'Task Assigned',
      message: 'You have been assigned: Approve Budget Increase',
      type: 'PROJECT_UPDATE',
      isRead: true,
      link: `/dashboard/tasks`,
    }
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
