import { expect, test } from '@playwright/test'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
let email = ''
let serviceName = ''

test.afterEach(async () => {
  if (serviceName) {
    await prisma.service.deleteMany({ where: { name: serviceName } })
  }

  if (email) {
    await prisma.user.delete({ where: { email } }).catch(() => undefined)
  }
})

test.afterAll(async () => {
  await prisma.$disconnect()
})

test('customer is routed to profile while an owner can manage services and logout', async ({ page }) => {
  const name = 'QA Petshop'
  email = `qa-${Date.now()}@example.test`
  serviceName = `Layanan QA ${Date.now()}`
  const password = 'Password123!'

  await page.goto('/dashboard')
  await expect(page).toHaveURL(/\/login$/)

  await page.goto('/register')
  await page.getByLabel('Nama').fill(name)
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: 'Daftar' }).click()

  await expect(page).toHaveURL(/\/profile$/)
  await expect(page.getByText(name)).toBeVisible()
  await expect(page.getByText(email)).toBeVisible()
  await expect(page.getByText('customer')).toBeVisible()

  await page.getByRole('button', { name: 'Logout' }).press('Enter')
  await expect(page).toHaveURL(/\/login$/)

  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: 'Masuk' }).click()
  await expect(page).toHaveURL(/\/profile$/)

  await page.goto('/dashboard')
  await expect(page).toHaveURL(/\/$/)

  await prisma.user.update({ where: { email }, data: { role: 'owner' } })

  await page.goto('/dashboard')
  await expect(page).toHaveURL(/\/dashboard$/)

  await page.goto('/dashboard/services')
  await page.getByLabel('Nama Layanan').fill(serviceName)
  await page.getByLabel('Tipe').selectOption('boarding')
  await page.getByLabel('Durasi (menit)').fill('60')
  await page.getByLabel('Harga (Rupiah)').fill('150000')
  await page.getByRole('button', { name: 'Tambah Layanan' }).click()

  await expect(page.getByText(serviceName)).toBeVisible()
  await expect(page.getByText('boarding')).toBeVisible()

  await page.getByRole('button', { name: `Hapus ${serviceName}` }).press('Enter')
  await expect(page.getByText(serviceName)).toHaveCount(0)

  await page.getByRole('button', { name: 'Logout' }).press('Enter')
  await expect(page).toHaveURL(/\/login$/)
})
