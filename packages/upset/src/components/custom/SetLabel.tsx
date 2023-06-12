import { css } from '@emotion/react';
import { FC } from 'react';
import { useRecoilValue } from 'recoil';

import { dimensionsSelector } from '../../atoms/dimensionsAtom';
import translate from '../../utils/transform';
import Group from './Group';
import { columnHoverAtom, columnSelectAtom } from '../../atoms/highlightAtom';
import { highlight, hoverHighlight } from '../../utils/styles';

type Props = {
  setId: string;
  name: string;
};

/** @jsxImportSource @emotion/react */
const matrixColumnBackgroundRect = css`
  fill: #f0f0f0;
`;

export const SetLabel: FC<Props> = ({ setId, name }) => {
  const dimensions = useRecoilValue(dimensionsSelector);
  const columnHover = useRecoilValue(columnHoverAtom);
  const columnSelect = useRecoilValue(columnSelectAtom);

  const gap = 4;

  return (
    <Group tx={0} ty={dimensions.set.cardinality.height}>
      <rect
        className={setId}
        css={
          columnSelect === setId // if the column is selected, highlight
          ? highlight 
          : columnHover === setId // if the column isn't select, but is hovered, highlight with hover
            ? hoverHighlight
            : matrixColumnBackgroundRect
        }
        height={dimensions.set.label.height - gap}
        width={dimensions.set.width - gap / 2}
        transform={`${translate(
          gap / 4,
          gap
        )}`}
      />
      <foreignObject
          transform={`${translate(0, dimensions.set.label.height - 2)}rotate(-90)`}
          height={dimensions.set.width}
          width={dimensions.set.label.height}
          z={100}
        >
          <p css={css`
            color: #000000; 
            font-size: 14px;
            overflow: hidden;
            text-overflow: ellipsis; 
            font-weight: 500;
            height: 100%;
            padding: 0;
            margin: 2px 0 0 0;
          `}>{name}</p>
        </foreignObject>
    </Group>
  );
};
