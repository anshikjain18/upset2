import { createAction, initProvenance } from '@visdesignlab/trrack';
import { AggregateBy, SortBy, UpsetConfig } from '@visdesignlab/upset2-core';

import { defaultConfig } from '../atoms/config/upsetConfigAtoms';

export type Events = 'Test';

export type Metadata = {
  [key: string]: unknown;
};

const firstAggAction = createAction<UpsetConfig, [AggregateBy], Events>(
  (state, aggBy) => {
    state.firstAggregateBy = aggBy;
    if (aggBy === 'None' || aggBy === state.secondAggregateBy) {
      state.secondAggregateBy = 'None';
    }
    return state;
  },
);

const firstOverlapAction = createAction<UpsetConfig, [number], Events>(
  (state, overlap) => {
    state.firstOverlapDegree = overlap;
    return state;
  },
);

const secondAggAction = createAction<UpsetConfig, [AggregateBy], Events>(
  (state, aggBy) => {
    state.secondAggregateBy = aggBy;
    return state;
  },
);

const secondOverlapAction = createAction<UpsetConfig, [number], Events>(
  (state, overlap) => {
    state.secondOverlapDegree = overlap;
    return state;
  },
);

const sortByAction = createAction<UpsetConfig, [SortBy], Events>(
  (state, sort) => {
    state.sortBy = sort;
    return state;
  },
);

const maxVisibleAction = createAction<UpsetConfig, [number], Events>(
  (state, maxVisible) => {
    state.filters.maxVisible = maxVisible;
    return state;
  },
);

const minVisibleAction = createAction<UpsetConfig, [number], Events>(
  (state, minVisible) => {
    state.filters.minVisible = minVisible;
    return state;
  },
);

const hideEmptyAction = createAction<UpsetConfig, [boolean], Events>(
  (state, hide) => {
    state.filters.hideEmpty = hide;
    return state;
  },
);

const addToVisibleAction = createAction<UpsetConfig, [string], Events>(
  (state, newSet) => {
    state.visibleSets = [...new Set([...state.visibleSets, newSet])];
    return state;
  },
);

const removeFromVisibleAction = createAction<UpsetConfig, [string], Events>(
  (state, newSet) => {
    state.visibleSets = state.visibleSets.filter((v) => v !== newSet);
    return state;
  },
);

const addToVisibleAttributeAction = createAction<UpsetConfig, [string], Events>(
  (state, attribute) => {
    state.visibleAttributes = [
      ...new Set([...state.visibleAttributes, attribute]),
    ];
    return state;
  },
);

const addMultipleVisibleAttributes = createAction<
  UpsetConfig,
  [string[]],
  Events
>((state, attributes) => {
  state.visibleAttributes = attributes;
  return state;
});

const removeFromVisibleAttributes = createAction<UpsetConfig, [string], Events>(
  (state, attribute) => {
    state.visibleAttributes = state.visibleAttributes.filter(
      (v) => v !== attribute,
    );
    return state;
  },
);

const removeMultipleVisibleAttributes = createAction<
  UpsetConfig,
  [string[]],
  Events
>((state, attribute) => {
  state.visibleAttributes = state.visibleAttributes.filter(
    (v) => !attribute.includes(v),
  );
  return state;
});

export function initializeProvenanceTracking(
  config: Partial<UpsetConfig> = {},
  setter?: (state: UpsetConfig) => void,
) {
  const finalConfig: UpsetConfig = { ...defaultConfig, ...config };
  const provenance = initProvenance<UpsetConfig, Events, Metadata>(
    finalConfig,
    {
      loadFromUrl: false,
    },
  );

  if (setter) {
    provenance.addGlobalObserver(() => setter(provenance.state));
  }

  provenance.done();

  return provenance;
}

export type UpsetProvenance = ReturnType<typeof initializeProvenanceTracking>;

export function getActions(provenance: UpsetProvenance) {
  return {
    firstAggregateBy: (aggBy: AggregateBy) =>
      provenance.apply(
        firstAggAction.setLabel(`First aggregate by ${aggBy}`)(aggBy),
      ),
    firstOverlapBy: (overlap: number) =>
      provenance.apply(
        firstOverlapAction.setLabel(`First overlap by ${overlap}`)(overlap),
      ),
    secondAggregateBy: (aggBy: AggregateBy) =>
      provenance.apply(
        secondAggAction.setLabel(`Second aggregate by ${aggBy}`)(aggBy),
      ),
    secondOverlapBy: (overlap: number) =>
      provenance.apply(
        secondOverlapAction.setLabel(`Second overlap by ${overlap}`)(overlap),
      ),
    sortBy: (sort: SortBy) =>
      provenance.apply(sortByAction.setLabel(`Sort by ${sort}`)(sort)),
    setMaxVisible: (val: number) =>
      provenance.apply(
        maxVisibleAction.setLabel(`Hide intersections above ${val}`)(val),
      ),
    setMinVisible: (val: number) =>
      provenance.apply(
        minVisibleAction.setLabel(`Hide intersections below ${val}`)(val),
      ),
    setHideEmpty: (val: boolean) =>
      provenance.apply(
        hideEmptyAction.setLabel(
          val ? 'Hide empty intersections' : 'Show empty intersections',
        )(val),
      ),
    addVisibleSet: (set: string) =>
      provenance.apply(addToVisibleAction.setLabel(`Add set ${set}`)(set)),
    removeVisibleSet: (set: string) =>
      provenance.apply(
        removeFromVisibleAction.setLabel(`Remove set ${set}`)(set),
      ),
    addAttribute: (attr: string) =>
      provenance.apply(
        addToVisibleAttributeAction.setLabel(`Show ${attr}`)(attr),
      ),
    removeAttribute: (attr: string) =>
      provenance.apply(
        removeFromVisibleAttributes.setLabel(`Hide ${attr}`)(attr),
      ),
    addMultipleAttributes: (attrs: string[]) =>
      provenance.apply(
        addMultipleVisibleAttributes.setLabel(
          `Show ${attrs.length} attributes`,
        )(attrs),
      ),
    removeMultipleVisibleAttributes: (attrs: string[]) =>
      provenance.apply(
        removeMultipleVisibleAttributes.setLabel(
          `Hide ${attrs.length} attributes`,
        )(attrs),
      ),
  };
}

export type UpsetActions = ReturnType<typeof getActions>;
