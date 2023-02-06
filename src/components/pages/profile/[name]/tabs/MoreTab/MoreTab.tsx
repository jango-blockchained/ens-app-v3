import styled, { css } from 'styled-components'

import { CacheableComponent } from '@app/components/@atoms/CacheableComponent'
import { useNameDetails } from '@app/hooks/useNameDetails'
import useOwners from '@app/hooks/useOwners'
import { useSelfAbilities } from '@app/hooks/useSelfAbilities'
import { deleteProperty } from '@app/utils/utils'

import Fuses from './Fuses'
import Miscellaneous from './Miscellaneous'
import Ownership from './Ownership'
import Resolver from './Resolver'
import Token from './Token'

const MoreContainer = styled(CacheableComponent)(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
    width: 100%;

    gap: ${theme.space['4']};
  `,
)

type Props = {
  name: string
  nameDetails: ReturnType<typeof useNameDetails>
  selfAbilities: ReturnType<typeof useSelfAbilities>
}

const MoreTab = ({ name, nameDetails, selfAbilities }: Props) => {
  const {
    ownerData,
    wrapperData,
    dnsOwner,
    isWrapped,
    basicIsCachedData,
    profileIsCachedData,
    profile,
  } = nameDetails
  const owners = useOwners({
    ownerData: ownerData!,
    wrapperData: wrapperData!,
    dnsOwner,
    selfAbilities,
  })

  return (
    <MoreContainer>
      <Miscellaneous name={name} />
      <Ownership
        name={name}
        owners={owners}
        canSend={selfAbilities.canSend}
        isCachedData={basicIsCachedData}
        isWrapped={isWrapped}
      />
      {(name.endsWith('.eth') || isWrapped) && <Token isWrapped={isWrapped} name={name} />}
      <Resolver
        name={name}
        canEdit={selfAbilities.canEdit}
        isCachedData={profileIsCachedData}
        resolverAddress={profile?.resolverAddress}
      />
      {isWrapped && wrapperData && (
        <Fuses
          canEdit={selfAbilities.canEdit}
          name={name}
          fuseObj={{
            ...deleteProperty('unnamed', wrapperData.child),
            ...deleteProperty('unnamed', wrapperData.parent),
          }}
          isCachedData={basicIsCachedData}
        />
      )}
    </MoreContainer>
  )
}

export default MoreTab