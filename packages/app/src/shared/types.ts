import { ReserveConfiguration, ReserveData } from '@bindings/pool';

type ReserveConfigurationCustom = Map<keyof ReserveConfiguration, any>;

export interface ReserveDataCustom extends Omit<ReserveData, 'configuration'> {
  configuration: ReserveConfigurationCustom;
}
