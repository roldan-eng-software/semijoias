import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import 'dotenv/config'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Starting seed...')

  // Categorias
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'aneis' },
      update: {},
      create: {
        name: 'Anéis',
        slug: 'aneis',
        description: 'Anéis elegantes em ouro rose e aço cirúrgico',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'colares' },
      update: {},
      create: {
        name: 'Colares',
        slug: 'colares',
        description: 'Colares delicados e sofisticados',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'pulseiras' },
      update: {},
      create: {
        name: 'Pulseiras',
        slug: 'pulseiras',
        description: 'Pulseiras modernas e clássicas',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'brincos' },
      update: {},
      create: {
        name: 'Brincos',
        slug: 'brincos',
        description: 'Brincos para todas as ocasiões',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'pingentes' },
      update: {},
      create: {
        name: 'Pingentes',
        slug: 'pingentes',
        description: 'Pingentes exclusivos',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'conjuntos' },
      update: {},
      create: {
        name: 'Conjuntos',
        slug: 'conjuntos',
        description: 'Kits matching completo',
      },
    }),
  ])

  console.log(`✅ Created ${categories.length} categories`)

  // Produtos
  const products = [
    // Anéis
    {
      name: 'Anel Coração Rose',
      slug: 'anel-coracao-rose',
      description: 'Anel delicado em ouro rose 18k com formato de coração. Perfeito para presentes românticos.',
      price: 189.90,
      compareAtPrice: 249.90,
      images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800'],
      categorySlug: 'aneis',
      material: 'Ouro Rose 18k',
      stone: 'Zircônia',
      gender: 'FEMININO',
      isFeatured: true,
      isNew: true,
      stock: 15,
      sku: 'ANL-CR-001',
    },
    {
      name: 'Anel Filigrana Dourado',
      slug: 'anel-filigrana-dourado',
      description: 'Anel artesanal com técnica de filigrana em banho de ouro 18k.',
      price: 279.90,
      images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800'],
      categorySlug: 'aneis',
      material: 'Aço Cirúrgico Dourado',
      stone: 'Sem pedra',
      gender: 'FEMININO',
      isFeatured: true,
      stock: 8,
      sku: 'ANL-FL-002',
    },
    {
      name: 'Anel Infinitu Prata',
      slug: 'anel-infinitu-prata',
      description: 'Anel símbolo do infinito em prata 925. Elegância atemporal.',
      price: 129.90,
      images: ['https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800'],
      categorySlug: 'aneis',
      material: 'Prata 925',
      stone: 'Zircônia',
      gender: 'UNISSEX',
      stock: 20,
      sku: 'ANL-IN-003',
    },
    // Colares
    {
      name: 'Colar Pingente Lua',
      slug: 'colar-pingente-lua',
      description: 'Colar delicadíssimo com pingente lua crescente em banho de ouro rose.',
      price: 159.90,
      compareAtPrice: 199.90,
      images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800'],
      categorySlug: 'colares',
      material: 'Ouro Rose 18k',
      stone: 'Zircônia',
      gender: 'FEMININO',
      isFeatured: true,
      isNew: true,
      stock: 12,
      sku: 'COL-LU-001',
    },
    {
      name: 'Colar Cascata Cristais',
      slug: 'colar-cascata-cristais',
      description: 'Colar com múltiplas correntes e cristais Swarovski. Para occasions especiais.',
      price: 389.90,
      images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800'],
      categorySlug: 'colares',
      material: 'Aço Cirúrgico',
      stone: 'Cristal Swarovski',
      gender: 'FEMININO',
      isFeatured: true,
      stock: 5,
      sku: 'COL-CA-002',
    },
    {
      name: 'Colar Torção Ouro',
      slug: 'colar-torcao-ouro',
      description: 'Colar moderno com design torcido em banho de ouro 18k.',
      price: 219.90,
      images: ['https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800'],
      categorySlug: 'colares',
      material: 'Ouro 18k',
      stone: 'Sem pedra',
      gender: 'FEMININO',
      stock: 10,
      sku: 'COL-TO-003',
    },
    // Pulseiras
    {
      name: 'Pulseira Bolinhas Rose',
      slug: 'pulseira-bolinhas-rose',
      description: 'Pulseira tradicional com bolinhas em ouro rose. Clássico atemporal.',
      price: 249.90,
      compareAtPrice: 329.90,
      images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800'],
      categorySlug: 'pulseiras',
      material: 'Ouro Rose 18k',
      stone: 'Sem pedra',
      gender: 'FEMININO',
      isFeatured: true,
      stock: 18,
      sku: 'PLS-BO-001',
    },
    {
      name: 'Pulseira Corda Dourada',
      slug: 'pulseira-corda-dourada',
      description: 'Pulseira em estilo corda com banho de ouro 18k.',
      price: 179.90,
      images: ['https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800'],
      categorySlug: 'pulseiras',
      material: 'Aço Cirúrgico Dourado',
      stone: 'Sem pedra',
      gender: 'FEMININO',
      stock: 15,
      sku: 'PLS-CO-002',
    },
    {
      name: 'Pulseira Berloques Prata',
      slug: 'pulseira-berloques-prata',
      description: 'Pulseira de berloques em prata 925. Personalizável com seus favoritos.',
      price: 149.90,
      images: ['https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800'],
      categorySlug: 'pulseiras',
      material: 'Prata 925',
      stone: 'Diversos',
      gender: 'FEMININO',
      isNew: true,
      stock: 25,
      sku: 'PLS-BE-003',
    },
    // Brincos
    {
      name: 'Brinco Argola Rose Pequena',
      slug: 'brinco-argola-rose-pequena',
      description: 'Argola clássica mini em ouro rose. Ideal para uso diário.',
      price: 189.90,
      images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800'],
      categorySlug: 'brincos',
      material: 'Ouro Rose 18k',
      stone: 'Sem pedra',
      gender: 'FEMININO',
      isFeatured: true,
      stock: 30,
      sku: 'BRN-AR-001',
    },
    {
      name: 'Brinco Gota Dourado',
      slug: 'brinco-gota-dourado',
      description: 'Brinco com pedra em formato de gota. Elegância para eventos.',
      price: 259.90,
      compareAtPrice: 329.90,
      images: ['https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800'],
      categorySlug: 'brincos',
      material: 'Ouro 18k',
      stone: 'Zircônia',
      gender: 'FEMININO',
      isFeatured: true,
      stock: 10,
      sku: 'BRN-GO-002',
    },
    {
      name: 'Brinco Pérola Cola',
      slug: 'brinco-perola-cola',
      description: 'Pérola natural colada em ouro rose. Sofisticação minimalista.',
      price: 319.90,
      images: ['https://images.unsplash.com/photo-1590548784585-643d2b9f2925?w=800'],
      categorySlug: 'brincos',
      material: 'Ouro Rose 18k',
      stone: 'Pérola',
      gender: 'FEMININO',
      isNew: true,
      stock: 8,
      sku: 'BRN-PC-003',
    },
    // Pingentes
    {
      name: 'Pingente Cruz Dourada',
      slug: 'pingente-cruz-dourada',
      description: 'Pingente religioso clássico em banho de ouro 18k.',
      price: 139.90,
      images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800'],
      categorySlug: 'pingentes',
      material: 'Ouro 18k',
      stone: 'Sem pedra',
      gender: 'UNISSEX',
      stock: 20,
      sku: 'PNG-CR-001',
    },
    {
      name: 'Pingente Flor Prata',
      slug: 'pingente-flor-prata',
      description: 'Pingente floral delicado em prata 925 com detalhes.',
      price: 99.90,
      images: ['https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800'],
      categorySlug: 'pingentes',
      material: 'Prata 925',
      stone: 'Zircônia',
      gender: 'FEMININO',
      stock: 15,
      sku: 'PNG-FL-002',
    },
    // Conjuntos
    {
      name: 'Conjunto Love Rose',
      slug: 'conjunto-love-rose',
      description: 'Kit completo: colar + brinco + anel com símbolo do amor.',
      price: 499.90,
      compareAtPrice: 649.90,
      images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800'],
      categorySlug: 'conjuntos',
      material: 'Ouro Rose 18k',
      stone: 'Zircônia',
      gender: 'FEMININO',
      isFeatured: true,
      isNew: true,
      stock: 5,
      sku: 'CNJ-LV-001',
    },
    {
      name: 'Conjunto Minimal Prata',
      slug: 'conjunto-minimal-prata',
      description: 'Conjunto clean: pulseira + colar + anel minimalista.',
      price: 299.90,
      images: ['https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800'],
      categorySlug: 'conjuntos',
      material: 'Prata 925',
      stone: 'Sem pedra',
      gender: 'FEMININO',
      stock: 8,
      sku: 'CNJ-MN-002',
    },
  ]

  for (const product of products) {
    const category = categories.find(c => c.slug === product.categorySlug)
    if (!category) continue

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        images: product.images,
        categoryId: category.id,
        material: product.material,
        stone: product.stone,
        gender: product.gender as any,
        isFeatured: product.isFeatured || false,
        isNew: product.isNew || false,
        stock: product.stock,
        sku: product.sku,
      },
    })
  }

  console.log(`✅ Created ${products.length} products`)

  // Configurações do site
  await prisma.siteConfig.upsert({
    where: { key: 'shop_name' },
    update: {},
    create: { key: 'shop_name', value: 'Simone Semijoias' },
  })

  await prisma.siteConfig.upsert({
    where: { key: 'shop_description' },
    update: {},
    create: { key: 'shop_description', value: 'Semijoias elegantes e sofisticadas para você' },
  })

  console.log('✅ Site configs created')
  console.log('🎉 Seed completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
