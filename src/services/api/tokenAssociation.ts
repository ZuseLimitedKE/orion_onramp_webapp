import { Api } from '../api'

export type TokenType = 'KESy_MAINNET' | 'KESy_TESTNET'

export interface TokenAssociationCheckResponse {
  isAssociated: boolean
  walletAddress: string
  tokenId?: string
  tokenName?: string
  tokenType?: TokenType
}

export const checkTokenAssociation = async (
  walletAddress: string,
  tokenType: TokenType = 'KESy_TESTNET',
): Promise<TokenAssociationCheckResponse> => {
  return Api.get(`/api/token-association/check/${walletAddress}?tokenType=${tokenType}`)
}

export default {
  checkTokenAssociation,
}
