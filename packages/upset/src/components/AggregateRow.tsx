import { css } from '@emotion/react';
import { Aggregate } from '@visdesignlab/upset2-core';
import { FC } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { visibleSetSelector } from '../atoms/config/visibleSetsAtoms';
import { dimensionsSelector } from '../atoms/dimensionsAtom';
import { bookmarkedIntersectionSelector, currentIntersectionAtom } from '../atoms/config/currentIntersectionAtom';
import translate from '../utils/transform';
import { highlight, mousePointer } from '../utils/styles';
import { CardinalityBar } from './CardinalityBar';
import { DeviationBar } from './DeviationBar';
import { Matrix } from './Matrix';
import { BookmarkStar } from './BookmarkStar';
import { collapsedAtom } from '../atoms/collapsedAtom';

/** @jsxImportSource @emotion/react */
type Props = {
  aggregateRow: Aggregate;
};

const expanded = (
  <text dominantBaseline="middle" className="icon" textAnchor="middle">
    &#xf107;
  </text>
);

export const collapsed = (
  <text
    transform="rotate(-90)"
    dominantBaseline="middle"
    className="icon"
    textAnchor="middle"
  >
    &#xf107;
  </text>
);

export const AggregateRow: FC<Props> = ({ aggregateRow }) => {
  const visibleSets = useRecoilValue(visibleSetSelector);
  const dimensions = useRecoilValue(dimensionsSelector);
  const currentIntersection = useRecoilValue(currentIntersectionAtom);
  const setCurrentIntersectionAtom = useSetRecoilState(currentIntersectionAtom);
  const bookmarkedIntersections = useRecoilValue(bookmarkedIntersectionSelector);
  const [ collapsedIds, setCollapsedIds ] = useRecoilState(collapsedAtom);

  let width = dimensions.body.rowWidth;
  if (aggregateRow.level === 2) {
    width -= dimensions.body.aggregateOffset;
  }

  const setAggCollapseState = (collapseState: boolean) => {
    setCollapsedIds({...collapsedIds, [aggregateRow.id]:collapseState})
  }

  const desc =
    aggregateRow.elementName.length < 14 ||
    aggregateRow.aggregateBy !== 'Overlaps'
      ? aggregateRow.elementName
      : `${aggregateRow.elementName.slice(0, 11)}...`;

  return (
    <g
      onClick={() => aggregateRow && (setCurrentIntersectionAtom(aggregateRow))}
      css={mousePointer}
    >
      <g transform={translate(aggregateRow.level === 2 ? 15 : 2, 0)}>
        <rect
          transform={translate(0, 2)}
          css={currentIntersection !== null && currentIntersection.id === aggregateRow.id ? 
            highlight : 
            css`
            fill: #cccccc;
            opacity: 0.3;
            stroke: #555555;
            stroke-width: 1px;
          `}
          height={dimensions.body.rowHeight - 4}
          width={width}
          rx={5}
          ry={10}
        />
        <g 
          transform={translate(10, dimensions.body.rowHeight / 2)}
          onClick={() => {
            if (collapsedIds[aggregateRow.id] === true) {
              setAggCollapseState(false);
            }
            else {
              setAggCollapseState(true); 
            }
          }}
        >
          { collapsedIds[aggregateRow.id] === true ? collapsed : expanded}
        </g>
        <text
          css={css`
            font-size: 12px;
          `}
          transform={translate(20, dimensions.body.rowHeight / 2)}
          dominantBaseline="middle"
        >
          <title>{aggregateRow.elementName}</title>
          {desc}
          {aggregateRow.aggregateBy === 'Degree' &&
            `( ${aggregateRow.description} )`}
        </text>
      </g>
      {['Sets', 'Overlaps'].includes(aggregateRow.aggregateBy) && (
        <Matrix
          sets={visibleSets}
          subset={aggregateRow}
          showConnectingBar={aggregateRow.aggregateBy !== 'Overlaps'}
        />
      )}
      { bookmarkedIntersections.find((b) => b.id === aggregateRow.id) &&
          <BookmarkStar row={aggregateRow} />
      }
      <CardinalityBar row={aggregateRow} size={aggregateRow.size} />
      <DeviationBar deviation={aggregateRow.deviation} />
    </g>
  );
};
