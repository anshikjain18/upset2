import { css } from '@emotion/react';
import { ScaleLinear } from 'd3';
import { FC, useContext } from 'react';
import { useRecoilValue } from 'recoil';

import { dimensionsSelector } from '../../atoms/dimensionsAtom';
import translate from '../../utils/transform';
import { ProvenanceContext } from '../Root';
import Group from './Group';

/** @jsxImportSource @emotion/react */
const matrixColumnBackgroundRect = css`
  fill: #f0f0f0;
`;
const matrixColumnForegroundRect = css`
  fill: #636363;
  stroke: #fff;
  stroke-width: 1px;
`;

type Props = {
  scale: ScaleLinear<number, number>;
  setId: string;
  size: number;
  label: string;
  showLabel?: boolean;
  foregroundOpacity?: number;
  tx?: number;
  ty?: number;
};

export const SetSizeBar: FC<Props> = ({
  scale,
  size,
  setId,
  label,
  tx = 0,
  ty = tx,
  foregroundOpacity = 1,
  showLabel = false,
}) => {
  const { actions } = useContext(ProvenanceContext);
  const dimensions = useRecoilValue(dimensionsSelector);

  return (
    <Group
      tx={tx}
      ty={ty}
      onClick={() => {
        if (!showLabel) actions.removeVisibleSet(setId);
      }}
    >
      <title>
        {label} - {size}
      </title>

      <rect
        css={css`
          ${matrixColumnBackgroundRect}
        `}
        height={dimensions.set.cardinality.height}
        width={dimensions.set.width}
        stroke="none"
        fill="gray"
      />
      <rect
        css={css`
          ${matrixColumnForegroundRect}
        `}
        height={scale(size)}
        width={dimensions.set.width}
        stroke="none"
        fill="gray"
        opacity={foregroundOpacity}
        transform={translate(
          0,
          dimensions.set.cardinality.height - scale(size),
        )}
      />
      {showLabel && (
        <text
          dominantBaseline="middle"
          transform={`${translate(dimensions.set.width / 2, 5)}rotate(90)`}
        >
          {label}
        </text>
      )}
    </Group>
  );
};
