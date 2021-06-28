import { registerEnumType } from '@nestjs/graphql';

export enum CreditCardType {
  AMERICAN_EXPRESS = 'AX',
  DISCOVER = 'DS',
  MASTER_CARD = 'MC',
  VISA = 'VS',
}

registerEnumType(CreditCardType, {
  name: 'CreditCardType',
});
