import { Upset } from '@visdesignlab/upset2-react';
import { useRecoilValue } from 'recoil';

import { dataAtom } from '../atoms/dataAtom';
import { doesHaveSavedQueryParam, queryParamAtom } from '../atoms/queryParamAtom';

type Props = {
  yOffset: number;
};

export const Body = ({ yOffset }: Props) => {
  const { workspace, table } = useRecoilValue(queryParamAtom);
  const data = useRecoilValue(dataAtom);

  if ((!workspace || !table) && !doesHaveSavedQueryParam())
    return <div>Please click Load Data button to go to data interface.</div>;

  if (!data) return null;

  return (
    <Upset
      data={data}
      loadAttributes={3}
      yOffset={yOffset === -1 ? 0 : yOffset}
    />
  );
};
