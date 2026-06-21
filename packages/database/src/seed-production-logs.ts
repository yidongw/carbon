#!/usr/bin/env tsx
/**
 * Seed test data for Production Logs feature
 *
 * Usage:
 *   SUPABASE_URL=xxx SUPABASE_SERVICE_ROLE_KEY=xxx tsx packages/database/src/seed-production-logs.ts
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from './types.js';

const args = process.argv.slice(2);
const getArg = (flag) => {
  const index = args.indexOf(flag);
  return index !== -1 ? args[index + 1] : null;
};

const supabaseUrl = getArg('--url') || process.env.SUPABASE_URL || 'https://tybbyhtnowjvfkxjkcyz.supabase.co';
const supabaseKey = getArg('--key') || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY required');
  console.error('Usage: SUPABASE_SERVICE_ROLE_KEY=xxx node seed-test-data.mjs');
  process.exit(1);
}

console.log(`Connecting to: ${supabaseUrl}`);

const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function seed() {
  try {
    console.log('Starting seed...');

    // Get bypass user
    const { data: users } = await supabase.auth.admin.listUsers();
    const bypassUser = users?.users?.find(u => u.email === 'bypass@mail.com');

    if (!bypassUser) {
      console.error('bypass@mail.com user not found');
      return;
    }

    console.log(`Found user: ${bypassUser.email}`);

    // Get user's company
    const { data: userRecord } = await supabase
      .from('user')
      .select('companyId')
      .eq('id', bypassUser.id)
      .single();

    if (!userRecord) {
      console.error('User record not found');
      return;
    }

    const companyId = userRecord.companyId;
    console.log(`Company ID: ${companyId}`);

    // Get or create employee
    let { data: employee } = await supabase
      .from('employee')
      .select('id')
      .eq('userId', bypassUser.id)
      .single();

    if (!employee) {
      const { data: newEmployee } = await supabase
        .from('employee')
        .insert({
          companyId,
          userId: bypassUser.id,
          createdBy: bypassUser.id
        })
        .select()
        .single();
      employee = newEmployee;
      console.log(`Created employee: ${employee.id}`);
    }

    const employeeId = employee.id;

    // Get or create an item
    let { data: item } = await supabase
      .from('item')
      .select('id')
      .eq('companyId', companyId)
      .limit(1)
      .single();

    if (!item) {
      const { data: newItem } = await supabase
        .from('item')
        .insert({
          itemId: 'TEST-ITEM-001',
          description: 'Test Item for Production Logs',
          type: 'Part',
          companyId,
          createdBy: bypassUser.id
        })
        .select()
        .single();
      item = newItem;
      console.log(`Created item: ${item.id}`);
    }

    const itemId = item.id;

    // Get location
    const { data: location } = await supabase
      .from('location')
      .select('id')
      .eq('companyId', companyId)
      .limit(1)
      .single();

    // Get or create process
    let { data: process } = await supabase
      .from('process')
      .select('id')
      .eq('companyId', companyId)
      .limit(1)
      .single();

    if (!process) {
      const { data: newProcess } = await supabase
        .from('process')
        .insert({
          name: 'Assembly',
          description: 'Test assembly process',
          companyId,
          createdBy: bypassUser.id
        })
        .select()
        .single();
      process = newProcess;
    }

    // Get or create work center
    let { data: workCenter } = await supabase
      .from('workCenter')
      .select('id')
      .eq('companyId', companyId)
      .limit(1)
      .single();

    if (!workCenter) {
      const { data: newWorkCenter } = await supabase
        .from('workCenter')
        .insert({
          name: 'Main Floor',
          description: 'Main production floor',
          companyId,
          createdBy: bypassUser.id
        })
        .select()
        .single();
      workCenter = newWorkCenter;
    }

    // Create job
    const jobReadableId = `JOB-TEST-${Math.floor(Math.random() * 1000)}`;
    const { data: job } = await supabase
      .from('job')
      .insert({
        jobId: jobReadableId,
        itemId,
        unitOfMeasureCode: 'EA',
        locationId: location?.id,
        status: 'Ready',
        quantity: 100,
        companyId,
        createdBy: bypassUser.id
      })
      .select()
      .single();

    console.log(`Created job: ${job.jobId} (${job.id})`);

    // Create job operation
    const { data: operation } = await supabase
      .from('jobOperation')
      .insert({
        jobId: job.id,
        order: 1,
        processId: process.id,
        workCenterId: workCenter.id,
        description: 'Assembly Operation',
        laborTime: 60,
        laborUnit: 'minutes',
        companyId,
        createdBy: bypassUser.id
      })
      .select()
      .single();

    console.log(`Created operation: ${operation.id}`);

    // Create job make method
    await supabase
      .from('jobMakeMethod')
      .insert({
        jobId: job.id,
        itemId,
        companyId,
        createdBy: bypassUser.id
      });

    // Create pickups
    await supabase
      .from('jobOperationPickup')
      .insert([
        {
          jobOperationId: operation.id,
          employeeId,
          quantity: 30,
          configuration: { size: 'L', color: 'blue' },
          companyId,
          createdBy: bypassUser.id
        },
        {
          jobOperationId: operation.id,
          employeeId,
          quantity: 25,
          configuration: { size: 'M', color: 'red' },
          companyId,
          createdBy: bypassUser.id
        },
        {
          jobOperationId: operation.id,
          employeeId,
          quantity: 20,
          configuration: { size: 'S', color: 'green' },
          companyId,
          createdBy: bypassUser.id
        }
      ]);

    console.log('Created 3 pickups (total: 75 units)');

    // Create production quantities
    const reportId = crypto.randomUUID();
    await supabase
      .from('productionQuantity')
      .insert([
        {
          jobOperationId: operation.id,
          employeeId,
          reportId,
          quantity: 50,
          type: 'Production',
          configuration: { size: 'L', color: 'blue' },
          companyId,
          createdBy: bypassUser.id
        },
        {
          jobOperationId: operation.id,
          employeeId,
          reportId: crypto.randomUUID(),
          quantity: 5,
          type: 'Rework',
          configuration: { size: 'M', color: 'red' },
          companyId,
          createdBy: bypassUser.id
        },
        {
          jobOperationId: operation.id,
          employeeId,
          reportId: crypto.randomUUID(),
          quantity: 3,
          type: 'Scrap',
          companyId,
          createdBy: bypassUser.id
        }
      ]);

    console.log('Created production quantities');
    console.log('========================================');
    console.log('✅ Test data created successfully!');
    console.log(`Job ID: ${job.id}`);
    console.log(`Access at: https://erp-pr-108.foxhole.bot/x/job/${job.id}/production-logs`);
    console.log('Pickups: 75 units (30 + 25 + 20)');
    console.log('Production: 50 units');
    console.log('Remaining: 25 units');
    console.log('Rework: 5 units');
    console.log('Scrap: 3 units');
    console.log('========================================');

  } catch (error) {
    console.error('Error seeding data:', error.message);
    if (error.details) console.error('Details:', error.details);
    process.exit(1);
  }
}

seed();
