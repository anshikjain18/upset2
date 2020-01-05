import { Provenance } from '@visdesignlab/provenance-lib-core';
import UpsetState from './UpsetState';
import { DatasetInfo } from './DatasetInfo';
import { AggregationOptions } from './AggregationOptions';
import { SortingOptions } from './SortOptions';

export default interface UpsetProvenance {
  provenance: Provenance<UpsetState>;
  actions: {
    goForward: () => void;
    goBack: () => void;
    setDataset: (datasetInfo: DatasetInfo) => void;
    setFirstAggregation: (agg: AggregationOptions) => void;
    setSecondAggregation: (agg: AggregationOptions) => void;
    setSortBy: (sortBy: SortingOptions) => void;
    setHideEmpty: (hide: boolean) => void;
    setMinDegree: (degree: number) => void;
    setMaxDegree: (degree: number) => void;
  };
}
