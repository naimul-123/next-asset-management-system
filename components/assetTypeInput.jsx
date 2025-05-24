import { useState } from "react";
import { FaCaretSquareDown, FaCaretSquareUp } from "react-icons/fa";

const AssetTypeInput = ({ isMissingType, rowData, assetTypes, handleAssetTypeChange }) => {
    const [showDropdown, setShowDropdown] = useState(false);

    // const assetTypes = assetTypesInfo?.find(info => info?.assetClass === rowData.assetClass)?.assetTypes || []

    return (
        <div className="relative">
            <div><input
                type="text"
                value={rowData.assetType || ""}
                onChange={(e) =>
                    handleAssetTypeChange({
                        assetNumber: rowData.assetNumber,
                        selectedAssetType: e.target.value,
                    })
                }
                placeholder="Enter asset type"
                className={`border  px-2 py-1 rounded w-full ${isMissingType ? 'border-red' : null}`}
            />
                {Array.isArray(assetTypes) && assetTypes.length > 0 && (
                    <button
                        type="button"
                        className="absolute top-1/2 right-2 transform -translate-y-1/2 text-blue"
                        onClick={() => setShowDropdown(!showDropdown)}
                    >
                        {showDropdown ? <FaCaretSquareUp /> : <FaCaretSquareDown />}
                    </button>
                )}</div>

            {showDropdown && (
                <ul className="absolute min-w-fit z-10  bg-white border mt-1 rounded shadow max-h-48  overflow-auto">
                    {Array.isArray(assetTypes) && assetTypes.length > 0 && assetTypes?.map((type) => (
                        <li
                            key={type}
                            onClick={() => {
                                handleAssetTypeChange({
                                    assetNumber: rowData.assetNumber,
                                    selectedAssetType: type,
                                });
                                setShowDropdown(false);
                            }}
                            className="px-3  py-1 hover:bg-gray-100 cursor-pointer uppercase"
                        >
                            {type}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
export default AssetTypeInput