/**
 * Serviço de cálculo de frete via API dos Correios
 * Usa a API pública (sem contrato) para consulta de preços e prazos
 *
 * Códigos de serviço:
 * - PAC:    04510
 * - SEDEX:  04014
 * - Mini Envios: 04227
 */

export interface ShippingOption {
  serviceCode: string
  serviceName: string
  price: number
  deliveryDays: number
  error?: string
}

export interface ShippingCalculationRequest {
  originCep: string
  destinationCep: string
  weight: number      // em kg
  length: number      // em cm
  height: number      // em cm
  width: number       // em cm
  declaredValue?: number
}

// CEP de origem da loja (configurável)
const ORIGIN_CEP = process.env.CORREIOS_ORIGIN_CEP || '01001000'

// Dimensões padrão para semijoias (embalagem pequena)
const DEFAULT_PACKAGE = {
  weight: 0.3,   // 300g
  length: 16,    // 16cm
  height: 5,     // 5cm
  width: 11,     // 11cm
}

const SERVICES = [
  { code: '04014', name: 'SEDEX' },
  { code: '04510', name: 'PAC' },
]

/**
 * Calcula o frete usando a API dos Correios
 */
export async function calculateShipping(
  destinationCep: string,
  totalWeight?: number,
  declaredValue?: number
): Promise<ShippingOption[]> {
  const cleanCep = destinationCep.replace(/\D/g, '')

  if (cleanCep.length !== 8) {
    return []
  }

  const weight = totalWeight || DEFAULT_PACKAGE.weight

  const results: ShippingOption[] = []

  for (const service of SERVICES) {
    try {
      const params = new URLSearchParams({
        nCdEmpresa: '',
        sDsSenha: '',
        nCdServico: service.code,
        sCepOrigem: ORIGIN_CEP.replace(/\D/g, ''),
        sCepDestino: cleanCep,
        nVlPeso: String(weight),
        nCdFormato: '1', // Caixa/Pacote
        nVlComprimento: String(DEFAULT_PACKAGE.length),
        nVlAltura: String(DEFAULT_PACKAGE.height),
        nVlLargura: String(DEFAULT_PACKAGE.width),
        nVlDiametro: '0',
        sCdMaoPropria: 'N',
        nVlValorDeclarado: String(declaredValue || 0),
        sCdAvisoRecebimento: 'N',
      })

      const response = await fetch(
        `https://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx/CalcPrecoPrazo?${params.toString()}`,
        { next: { revalidate: 3600 } } // Cache 1h
      )

      if (!response.ok) {
        // Fallback para estimativa baseada em tabela
        results.push(generateFallbackEstimate(service, cleanCep, weight, declaredValue))
        continue
      }

      const text = await response.text()

      // Parse do XML de resposta
      const valueMatch = text.match(/<Valor>([\d,.]+)<\/Valor>/)
      const daysMatch = text.match(/<PrazoEntrega>(\d+)<\/PrazoEntrega>/)
      const errorMatch = text.match(/<MsgErro>([^<]*)<\/MsgErro>/)

      if (errorMatch && errorMatch[1].trim()) {
        results.push(generateFallbackEstimate(service, cleanCep, weight, declaredValue))
        continue
      }

      if (valueMatch && daysMatch) {
        results.push({
          serviceCode: service.code,
          serviceName: service.name,
          price: parseFloat(valueMatch[1].replace('.', '').replace(',', '.')),
          deliveryDays: parseInt(daysMatch[1], 10),
        })
      } else {
        results.push(generateFallbackEstimate(service, cleanCep, weight, declaredValue))
      }
    } catch (error) {
      console.error(`[Correios] Erro no serviço ${service.name}:`, error)
      results.push(generateFallbackEstimate(service, cleanCep, weight, declaredValue))
    }
  }

  return results.sort((a, b) => a.price - b.price)
}

/**
 * Gera uma estimativa de frete quando a API dos Correios está indisponível.
 * Baseada em faixas de distância por UF.
 */
function generateFallbackEstimate(
  service: { code: string; name: string },
  destinationCep: string,
  weight: number,
  declaredValue?: number
): ShippingOption {
  // Estimativa por região baseada nos 2 primeiros dígitos do CEP
  const cepPrefix = parseInt(destinationCep.substring(0, 2), 10)

  let regionMultiplier = 1.0
  let baseDays = service.code === '04014' ? 3 : 8 // SEDEX vs PAC

  // Regiões por faixa de CEP
  if (cepPrefix >= 1 && cepPrefix <= 19) {
    // São Paulo
    regionMultiplier = 1.0
    baseDays += 0
  } else if (cepPrefix >= 20 && cepPrefix <= 28) {
    // Rio de Janeiro
    regionMultiplier = 1.1
    baseDays += 1
  } else if (cepPrefix >= 29 && cepPrefix <= 39) {
    // Minas Gerais / Espírito Santo
    regionMultiplier = 1.15
    baseDays += 1
  } else if (cepPrefix >= 40 && cepPrefix <= 48) {
    // Bahia
    regionMultiplier = 1.3
    baseDays += 2
  } else if (cepPrefix >= 49 && cepPrefix <= 56) {
    // Nordeste (SE, AL, PE, PB)
    regionMultiplier = 1.4
    baseDays += 3
  } else if (cepPrefix >= 57 && cepPrefix <= 65) {
    // Nordeste (RN, CE, PI, MA)
    regionMultiplier = 1.5
    baseDays += 3
  } else if (cepPrefix >= 66 && cepPrefix <= 68) {
    // Norte (PA, AP)
    regionMultiplier = 1.7
    baseDays += 5
  } else if (cepPrefix >= 69 && cepPrefix <= 69) {
    // Norte (AM)
    regionMultiplier = 1.8
    baseDays += 6
  } else if (cepPrefix >= 70 && cepPrefix <= 72) {
    // Distrito Federal / Goiás
    regionMultiplier = 1.2
    baseDays += 2
  } else if (cepPrefix >= 73 && cepPrefix <= 76) {
    // Goiás / Tocantins
    regionMultiplier = 1.35
    baseDays += 3
  } else if (cepPrefix >= 77 && cepPrefix <= 77) {
    // Tocantins
    regionMultiplier = 1.5
    baseDays += 4
  } else if (cepPrefix >= 78 && cepPrefix <= 78) {
    // Mato Grosso
    regionMultiplier = 1.45
    baseDays += 3
  } else if (cepPrefix >= 79 && cepPrefix <= 79) {
    // Mato Grosso do Sul
    regionMultiplier = 1.3
    baseDays += 2
  } else if (cepPrefix >= 80 && cepPrefix <= 87) {
    // Paraná
    regionMultiplier = 1.1
    baseDays += 1
  } else if (cepPrefix >= 88 && cepPrefix <= 89) {
    // Santa Catarina
    regionMultiplier = 1.15
    baseDays += 1
  } else if (cepPrefix >= 90 && cepPrefix <= 99) {
    // Rio Grande do Sul
    regionMultiplier = 1.2
    baseDays += 2
  }

  // Preço base: SEDEX é ~2x PAC
  const basePrice = service.code === '04014' ? 22.0 : 15.0
  const weightPrice = Math.max(weight - 0.3, 0) * 8.0 // R$8 por kg acima de 300g

  const estimatedPrice = (basePrice + weightPrice) * regionMultiplier

  return {
    serviceCode: service.code,
    serviceName: service.name,
    price: Math.round(estimatedPrice * 100) / 100,
    deliveryDays: baseDays,
  }
}

/**
 * Verifica se o subtotal é elegível para frete grátis
 */
export function isFreeShipping(subtotal: number): boolean {
  return subtotal >= 199
}

/**
 * Retorna o texto formatado do frete
 */
export function formatShippingPrice(price: number): string {
  if (price === 0) return 'Grátis'
  return `R$ ${price.toFixed(2).replace('.', ',')}`
}
