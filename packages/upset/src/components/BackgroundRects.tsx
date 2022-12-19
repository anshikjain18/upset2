import { css } from '@emotion/react';
import { useRecoilValue } from 'recoil';

import { visibleSetSelector } from '../atoms/config/visibleSetsAtoms';
import { dimensionsSelector } from '../atoms/dimensionsAtom';
import { columnHoverAtom, rowHoverAtom } from '../atoms/hoverAtom';
import { subsetSelector } from '../atoms/subsetAtoms';
import { highlightBackground } from '../utils/styles';
import translate from '../utils/transform';

/** @jsxImportSource @emotion/react */
export const BackgroundRects = () => {
  const dimensions = useRecoilValue(dimensionsSelector);
  const visibleSets = useRecoilValue(visibleSetSelector);
  const subsets = useRecoilValue(subsetSelector);
  const hoveredRow = useRecoilValue(rowHoverAtom);
  const hoveredColumn = useRecoilValue(columnHoverAtom);

  return (
    <>
      <g
        className="background-columns"
        transform={translate(dimensions.set.label.height, 0)}
      >
        {visibleSets.map((setName, idx) => (
          <g key={setName} transform={translate(idx * dimensions.set.width, 0)}>
            <rect
              className={setName}
              css={css`
                ${hoveredColumn === setName && highlightBackground}
              `}
              height={dimensions.body.height}
              width={dimensions.set.width}
              fill="none"
            />
          </g>
        ))}
      </g>
      <g
        className="background-rows"
        transform={translate(dimensions.set.label.height, 0)}
      >
        {subsets.order.map((subsetId, idx) => (
          <g
            key={subsetId}
            transform={translate(0, idx * dimensions.body.rowHeight)}
          >
            <rect
              key={subsetId}
              className={subsetId}
              css={css`
                ${hoveredRow === subsetId && highlightBackground}
              `}
              height={dimensions.body.rowHeight}
              width={dimensions.body.rowWidth}
              fill="none"
            />
          </g>
        ))}
      </g>
    </>
  );
};
