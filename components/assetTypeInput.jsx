import { useState } from "react";
import { FaCaretSquareDown, FaCaretSquareUp } from "react-icons/fa";

const AssetTypeInput = ({ rowData, handleAssetTypeChange }) => {
    const [showDropdown, setShowDropdown] = useState(false);

    return (
        <div className="relative z-10">
            <input
                type="text"
                value={rowData.assetType || ""}
                onChange={(e) =>
                    handleAssetTypeChange({
                        assetNumber: rowData.assetNumber,
                        selectedAssetType: e.target.value,
                    })
                }
                placeholder="Enter asset type"
                className="border px-2 py-1 rounded w-full"
            />
            {Array.isArray(rowData.assetTypes) && rowData.assetTypes.length > 0 && (
                <button
                    type="button"
                    className="absolute top-1/2 right-2 transform -translate-y-1/2 text-blue"
                    onClick={() => setShowDropdown(!showDropdown)}
                >
                    {showDropdown ? <FaCaretSquareUp /> : <FaCaretSquareDown />}
                </button>
            )}

            {showDropdown && (
                <ul className="absolute z-0 w-full bg-white border mt-1 rounded shadow h-96 overflow-auto">
                    {rowData.assetTypes.map((type) => (
                        <li
                            key={type}
                            onClick={() => {
                                handleAssetTypeChange({
                                    assetNumber: rowData.assetNumber,
                                    selectedAssetType: type,
                                });
                                setShowDropdown(false);
                            }}
                            className="px-3 py-1 hover:bg-gray-100 cursor-pointer uppercase"
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