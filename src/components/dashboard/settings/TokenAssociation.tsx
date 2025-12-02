import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'
import { Wallet, CheckCircle2, AlertCircle, Copy } from 'lucide-react'
import { useBusinessContext } from '@/contexts/BusinessContext'
import {
  checkTokenAssociation,
  type TokenType,
} from '@/services/api/tokenAssociation'
import { TokenAssociateTransaction, Status } from '@hashgraph/sdk'
import {
  useAccountId,
  useWallet,
  type HederaSignerType,
  type HWBridgeSigner,
} from '@buidlerlabs/hashgraph-react-wallets'
import { HWCConnector } from '@buidlerlabs/hashgraph-react-wallets/connectors'
import { useChain } from '@buidlerlabs/hashgraph-react-wallets'

function isHederaSigner(signer: HWBridgeSigner): signer is HederaSignerType {
  // Check based on properties that are unique to HederaSignerType
  return (signer as HederaSignerType)?.topic !== undefined
}

const TokenAssociation = () => {
  const { currentBusiness } = useBusinessContext()
  const [isChecking, setIsChecking] = useState(false)
  const [isAssociated, setIsAssociated] = useState<boolean | null>(null)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [isAssociating, setIsAssociating] = useState(false)
  const [tokenId, setTokenId] = useState<string | null>(null)

  const { isConnected, connect, disconnect } = useWallet(HWCConnector)
  const { data: accountId } = useAccountId()
  const { signer } = useWallet()
  const { data: chainData } = useChain()

  const getTokenType = (): TokenType => {
    if (!chainData?.id || chainData.id === 296) {
      return 'KESy_TESTNET'
    }
    return 'KESy_MAINNET'
  }

  useEffect(() => {
    if (currentBusiness?.cryptoWalletAddress) {
      setWalletAddress(currentBusiness.cryptoWalletAddress)
      checkAssociation(currentBusiness.cryptoWalletAddress)
    }
  }, [currentBusiness])

  const handleConnect = async () => {
    try {
      await connect()
    } catch (error) {
      toast.error('Failed to connect wallet')
      console.error(error)
    }
  }
  const handleDisconnect = async () => {
    try {
      await disconnect()
      toast.success('Wallet disconnected')
    } catch (error) {
      toast.error('Failed to disconnect wallet')
      console.error(error)
    }
  }

  const checkAssociation = async (address: string) => {
    try {
      setIsChecking(true)
      const tokenType = getTokenType()
      const result = await checkTokenAssociation(address, tokenType)
      setIsAssociated(result.isAssociated)
      // Store the token ID returned from the backend
      if (result.tokenId) {
        setTokenId(result.tokenId)
      }
    } catch (error) {
      console.error('Failed to check token association:', error)
      toast.error('Failed to check token association status')
    } finally {
      setIsChecking(false)
    }
  }

  const handleAssociateToken = async () => {
    if (!isConnected || !accountId || !signer) {
      toast.error('Please connect your wallet first!')
      return
    }

    if (!isHederaSigner(signer)) {
      toast.error('Invalid signer')
      return
    }

    if (!tokenId) {
      toast.error('Token ID not available. Please refresh the page.')
      return
    }

    setIsAssociating(true)

    try {
      const txTokenAssociate = await new TokenAssociateTransaction()
        .setAccountId(accountId)
        .setTokenIds([tokenId])

      const signTxTokenAssociate =
        await txTokenAssociate.freezeWithSigner(signer)
      const txResponse = await signTxTokenAssociate.executeWithSigner(signer)
      const receipt = await txResponse.getReceiptWithSigner(signer)

      if (receipt.status === Status.Success) {
        toast.success('Token association successful!')
        setTimeout(() => {
          if (walletAddress) {
            checkAssociation(walletAddress)
          }
        }, 2000)
      } else {
        toast.error(
          `Token association failed. Status: ${receipt.status.toString()}`,
        )
      }
    } catch (error) {
      console.error('Token association failed:', error)
      toast.error('Token association failed. Please try again.')
    } finally {
      setIsAssociating(false)
    }
  }

  const handleRefresh = () => {
    if (walletAddress) {
      checkAssociation(walletAddress)
    }
  }

  if (!currentBusiness) {
    return (
      <Card className="border-border">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Wallet className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-semibold text-foreground">
            No Business Selected
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Please select a business to manage token association
          </p>
        </CardContent>
      </Card>
    )
  }

  if (!walletAddress) {
    return (
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            <CardTitle>Token Association</CardTitle>
          </div>
          <CardDescription>
            Associate your wallet with KESy to receive payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No wallet address configured. Please add your Hedera wallet
              address in the Business Profile section first.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            <CardTitle>Token Association</CardTitle>
          </div>
          {!isConnected ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleConnect}
              className="ml-4 cursor-pointer"
            >
              <Wallet className="mr-2 h-4 w-4" /> Connect Wallet
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDisconnect}
              className="ml-4 cursor-pointer"
            >
              <Wallet className="mr-2 h-4 w-4" /> Disconnect Wallet
            </Button>
          )}
        </div>
        <CardDescription>
          Your wallet must be associated with KESy to receive payments
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Wallet Address Display */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Your Wallet Address
          </label>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 border border-border">
            <code className="flex-1 text-sm font-mono truncate">
              {walletAddress}
            </code>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(walletAddress)
                toast.success('Address copied!')
              }}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {/* Association Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">
              Association Status
            </label>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isChecking}
            >
              {isChecking ? 'Checking...' : 'Refresh Status'}
            </Button>
          </div>
          {isChecking ? (
            <div className="p-4 rounded-lg bg-secondary/50 border border-border">
              <p className="text-sm text-muted-foreground">
                Checking association status...
              </p>
            </div>
          ) : isAssociated === true ? (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Your wallet is associated with KESy. You can receive payments!
              </AlertDescription>
            </Alert>
          ) : isAssociated === false ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Your wallet is NOT associated with KESy. You cannot receive
                payments until you associate.
                <Button
                  className="mt-2"
                  onClick={handleAssociateToken}
                  disabled={isAssociating}
                >
                  {isAssociating ? 'Associating...' : 'Associate Token'}
                </Button>
              </AlertDescription>
            </Alert>
          ) : null}
        </div>
        {/* Help Section */}
        <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
          <p className="text-sm font-medium text-blue-900 mb-1">
            Why is this needed?
          </p>
          <p className="text-xs text-blue-800">
            On Hedera, wallets must explicitly opt-in to receive tokens. This
            protects you from receiving unwanted tokens and helps prevent spam.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default TokenAssociation
