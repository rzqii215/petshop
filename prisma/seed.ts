import {
  Prisma,
  PrismaClient,
  type AppointmentType,
  type ReminderKind,
  type Role,
} from '@prisma/client'
import defaults from '../docs/data/config-defaults.json'

const prisma = new PrismaClient()

type SeedSummary = Record<string, number>

async function seed() {
  const summary: SeedSummary = {}

  await prisma.$transaction(async (tx) => {
    summary.siteSettings = (
      await tx.siteSetting.createMany({
        data: defaults.siteSettings,
        skipDuplicates: true,
      })
    ).count

    summary.bookingPolicies = (
      await tx.bookingPolicy.createMany({
        data: defaults.bookingPolicies.map((policy) => ({
          ...policy,
          type: policy.type as AppointmentType,
        })),
        skipDuplicates: true,
      })
    ).count

    let reminderPolicies = 0
    for (const policy of defaults.reminderPolicies) {
      const existing = await tx.reminderPolicy.findFirst({
        where: {
          kind: policy.kind as ReminderKind,
          offsetHours: policy.offsetHours,
          channel: policy.channel,
        },
        select: { id: true },
      })

      if (!existing) {
        await tx.reminderPolicy.create({
          data: {
            ...policy,
            kind: policy.kind as ReminderKind,
          },
        })
        reminderPolicies += 1
      }
    }
    summary.reminderPolicies = reminderPolicies

    summary.featureFlags = (
      await tx.featureFlag.createMany({
        data: defaults.featureFlags,
        skipDuplicates: true,
      })
    ).count

    let accessPolicies = 0
    for (const policy of defaults.accessPolicies) {
      const existing = await tx.accessPolicy.findUnique({
        where: {
          role_resource: {
            role: policy.role as Role,
            resource: policy.resource,
          },
        },
        select: { id: true },
      })

      if (!existing) {
        await tx.accessPolicy.create({
          data: {
            ...policy,
            role: policy.role as Role,
          },
        })
        accessPolicies += 1
      }
    }
    summary.accessPolicies = accessPolicies

    let formFieldConfigs = 0
    for (const config of defaults.formFieldConfigs) {
      const existing = await tx.formFieldConfig.findUnique({
        where: {
          entity_field: {
            entity: config.entity,
            field: config.field,
          },
        },
        select: { id: true },
      })

      if (!existing) {
        await tx.formFieldConfig.create({
          data: {
            ...config,
            validation: config.validation ?? Prisma.DbNull,
          },
        })
        formFieldConfigs += 1
      }
    }
    summary.formFieldConfigs = formFieldConfigs
  })

  console.log('Configuration defaults seeded:', summary)
}

seed()
  .catch((error: unknown) => {
    console.error('Failed to seed configuration defaults:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
