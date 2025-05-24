import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

const Row = ({ index, style, data }) => {
    const asset = data.assets[index];
    return (
        <tr style={style}>
            <td>
                <label className="flex items-center gap-2">
                    {data.isEdit && (
                        <input
                            type="checkbox"
                            checked={data.selectedItems.includes(asset.assetNumber)}
                            onChange={(e) =>
                                data.handleSelectItem(e.target.checked, asset.assetNumber)
                            }
                            className="checkbox checkbox-warning print:hidden"
                        />
                    )}
                    <span>{index + 1}</span>
                </label>
            </td>
            <td>{asset.assetNumber}</td>
            <td>{asset.assetClass}</td>
            <td>{asset.assetType}</td>
            <td>
                <div className="tooltip tooltip-bottom">
                    <p>{asset?.assetDescription}</p>
                    <div className="tooltip-content text-left">
                        <p>Cap.Date:{asset?.capDate}</p>
                        <p>Acquis.Val:{asset?.acquisationVal}</p>
                        <p>Book Val:{asset?.bookVal}</p>
                    </div>
                </div>
            </td>
            <td colSpan={5}>
                <AssetLocationInput
                    departmentData={data.departmentData}
                    rowData={asset}
                    handleLocationInfo={data.handleLocationInfo}
                />
            </td>
        </tr>
    );
};
