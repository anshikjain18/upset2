import { css } from "@emotion/react";
import { a, useTransition } from "react-spring";
import { SetSizeBar } from "../custom/SetSizeBar";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { dimensionsSelector } from "../../atoms/dimensionsAtom";
import { contextMenuAtom } from "../../atoms/contextMenuAtom";
import { FC, useContext } from "react";
import { ProvenanceContext } from "../Root";
import Group from "../custom/Group";
import translate from "../../utils/transform";
import { ScaleLinear } from "d3";
import { setsAtom } from "../../atoms/setsAtoms";
import { hiddenSetSortAtom } from "../../atoms/config/visibleSetsAtoms";

type Props = {
    hiddenSets: string[];
    scale: ScaleLinear<number, number>;
  };

export const HiddenSets: FC<Props> = ({hiddenSets, scale}) => {
    const { actions } = useContext(ProvenanceContext);
    const dimensions = useRecoilValue(dimensionsSelector);
    const sets = useRecoilValue(setsAtom);
    const setContextMenu = useSetRecoilState(contextMenuAtom);
    const { set } = dimensions;

    const [ hiddenSortBy, setHiddenSortBy ] = useRecoilState(hiddenSetSortAtom);

    const handleContextMenuClose = () => {
      setContextMenu(null);
    }
  
    const openContextMenu = (e: React.MouseEvent, setName: string) => {
      setContextMenu({
          mouseX: e.clientX,
          mouseY: e.clientY,
          id: `${setName}-menu`,
          items: [
            {
              label: `Add ${setName.replace('_', ': ')}`,
              onClick: () => {
                actions.addVisibleSet(setName);
                handleContextMenuClose();
              }
            },
            {
                label: `Sort by Alphabetical`,
                onClick: () => {
                  setHiddenSortBy('Name');
                  handleContextMenuClose();
                },
                disabled: hiddenSortBy === 'Name',
              },
              {
                label: `Sort by Size - Ascending`,
                onClick: () => {
                  setHiddenSortBy('Size - Asc')
                  handleContextMenuClose();
                },
                disabled: hiddenSortBy === 'Size - Asc',
              },
              {
                label: `Sort by Size - Descending`,
                onClick: () => {
                  setHiddenSortBy('Size - Desc')
                  handleContextMenuClose();
                },
                disabled: hiddenSortBy === 'Size - Desc',
              },
        ]
        }
      );
    }

    const hiddenSetsTransition = useTransition(
      hiddenSets.map((setId, idx) => ({ id: setId, x: idx * (set.width + 1) })),
      {
        keys: (d) => d.id,
        enter: ({ x }) => ({ transform: translate(x, 0) }),
        update: ({ x }) => ({ transform: translate(x, 0) }),
      },
    );

    return (
        <Group
            tx={
                dimensions.matrixColumn.width +
                dimensions.bookmarkStar.gap +
                dimensions.bookmarkStar.width +
                dimensions.bookmarkStar.gap
            }
            ty={0}
        >
            {hiddenSetsTransition(({ transform }, item) => {
            return (
                <a.g
                transform={transform}
                onContextMenu={(e) => {
                    e.preventDefault();
                    openContextMenu(e, item.id);
                }}
                css={css`cursor: context-menu;`}
                >
                <SetSizeBar
                    scale={scale}
                    setId={item.id}
                    size={sets[item.id].size}
                    foregroundOpacity={0.4}
                    label={sets[item.id].elementName}
                    showLabel
                />
                </a.g>
            );
            })}
        </Group>
    )
}