import { Aggregate, Subset, isRowAggregate } from '@visdesignlab/upset2-core';
import React, { FC } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { dimensionsSelector } from '../atoms/dimensionsAtom';
import { columnHoverAtom } from '../atoms/hoverAtom';
import ConnectingLine from './custom/ConnectingLine';
import Group from './custom/Group';
import MemberShipCircle from './custom/MembershipCircle';
import { defaultBackground, hoverHighlight } from '../utils/styles';
import translate from '../utils/transform';

type Props = {
  subset: Subset | Aggregate;
  sets: string[];
  showConnectingBar?: boolean;
};

export const Matrix: FC<Props> = ({
  subset,
  showConnectingBar = true,
  sets = [],
}) => {
  const dimensions = useRecoilValue(dimensionsSelector);
  const setHoveredColumn = useSetRecoilState(columnHoverAtom);

  const [ hover, setHover ] = useRecoilState(columnHoverAtom);

  const membership = sets.map((s) => subset.setMembership[s]);
  const memberCount = membership.filter((v) => v === 'Yes').length;

  let firstMember = 0;
  let lastMember = 0;

  if (memberCount > 0) firstMember = membership.indexOf('Yes');

  if (memberCount > 1) lastMember = membership.lastIndexOf('Yes');

  return (
    <Group tx={dimensions.xOffset} ty={0}>
      <Group tx={dimensions.set.width / 2} ty={0}>
        {sets.map((set, idx) => {
          const membershipStatus = subset.setMembership[set];

          return (
            <Group
              key={set}
              height={dimensions.body.rowHeight}
              width={dimensions.set.width}
              onMouseEnter={() => setHover(set)}
              onMouseLeave={() => setHover(null)}
            >
              <rect transform={translate(idx * dimensions.set.width - dimensions.set.width/2, 0)} height={dimensions.body.rowHeight} width={dimensions.set.width} css={hover === set ? hoverHighlight : defaultBackground}></rect>
              <MemberShipCircle
                membershipStatus={membershipStatus}
                cx={idx * dimensions.set.width}
                cy={dimensions.body.rowHeight / 2}
                pointerEvents="all"
                onMouseEnter={() => {
                  setHoveredColumn(set);
                }}
                onMouseLeave={() => {
                  setHoveredColumn(null);
                }}
                showOutline={isRowAggregate(subset)}
              />
            </Group>
          );
        })}
        {showConnectingBar && memberCount > 1 && (
          <ConnectingLine
            x1={firstMember * dimensions.set.width}
            x2={lastMember * dimensions.set.width}
            y1={dimensions.body.rowHeight / 2}
            y2={dimensions.body.rowHeight / 2}
          />
        )}
      </Group>
    </Group>
  );
};
