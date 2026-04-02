/**
 * Serviço de consulta de CEP via ViaCEP API
 * @see https://viacep.com.br
 */

export interface ViaCepResponse {
  cep: string
  logradouro: string
  complemento: string
  unidade: string
  bairro: string
  localidade: string
  uf: string
  estado: string
  ibge: string
  gia: string
  ddd: string
  siafi: string
  erro?: boolean
}

export interface AddressFromCep {
  street: string
  complement: string
  district: string
  city: string
  state: string
  ibge: string
}

/**
 * Busca endereço pelo CEP usando a API ViaCEP
 * @param cep - CEP no formato "00000000" ou "00000-000"
 * @returns Endereço encontrado ou null se CEP inválido
 */
export async function fetchAddressByCep(cep: string): Promise<AddressFromCep | null> {
  const cleanCep = cep.replace(/\D/g, '')

  if (cleanCep.length !== 8) {
    return null
  }

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`, {
      next: { revalidate: 86400 }, // Cache por 24h
    })

    if (!response.ok) {
      return null
    }

    const data: ViaCepResponse = await response.json()

    if (data.erro) {
      return null
    }

    return {
      street: data.logradouro,
      complement: data.complemento,
      district: data.bairro,
      city: data.localidade,
      state: data.uf,
      ibge: data.ibge,
    }
  } catch (error) {
    console.error('[ViaCEP] Erro ao buscar CEP:', error)
    return null
  }
}
