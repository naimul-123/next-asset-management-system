"use client";
import { useEffect, useMemo, useState } from "react";
import { postData } from "../../../lib/api";
import * as XLSX from "xlsx";
import AssetTypeInput from "@/components/assetTypeInput";
import { useSession } from "next-auth/react";


const UpdateAssets = () => {
  const [error, setError] = useState("");
  const [requiredError, setRequiredError] = useState("");
  const [data, setData] = useState([]);
  const { data: session, status } = useSession()
  const [assetTypesInfo, setAssetTypesInfo] = useState([]);
  const [missingtypesAssets, setMissingtypesAssets] = useState([]);

  const user = session?.user
    || null
  // console.log(user);
  const requiredFields = [
    "assetNumber",
    "assetDescription",
    "capDate",
    "acquisVal",
    "accumDep",
    "bookVal",
  ];

  const assetTypesMap = useMemo(() => {
    const map = new Map();
    assetTypesInfo?.forEach(({ assetClass, assetTypes }) => {
      map.set(assetClass, assetTypes);
    });
    return map;
  }, [assetTypesInfo]);

  // console.log(assetTypesMap.get('Low value Asset'));
  const handleFileUpload = async (e) => {
    setData([]);
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary", cellDates: true });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];

      const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1 });
      const headersRow = jsonData[0];

      const missingHeaders = requiredFields.filter(
        (field) =>
          !headersRow.some(
            (header) =>
              header && header.toString().toLowerCase() === field.toLowerCase()
          )
      );

      if (missingHeaders.length > 0) {
        setRequiredError(
          `Mandatory field(s) missing: ${missingHeaders.join(", ")}`
        );
        return;
      }

      const rawData = XLSX.utils.sheet_to_json(ws, { raw: false });
      const assetNumbers = rawData?.map((d) => d.assetNumber);
      const res = await postData("/api/processeuploaddata", { assetNumbers });
      console.log(res.data);

      if (res?.data.enhancedData) {
        const enrichedData = res?.data.enhancedData;
        const enrichedMap = new Map(
          enrichedData.map((d) => [String(d.assetNumber), d])
        );
        const finalData = rawData.map((item) => {
          const enriched = enrichedMap.get(String(item.assetNumber)) || {
            assetClass: null,
            assetType: null,
            isTypeExist: false,
          };
          return {
            ...item,
            ...enriched,
          };
        });

        setData(finalData);
      }

      if (res?.data?.assetTypesInfo) {
        setAssetTypesInfo(res.data.assetTypesInfo);
      }

      setError("");
    };

    reader.readAsBinaryString(file);
  };

  const handleAssetTypeMissing = (data) => {
    setMissingtypesAssets([]);
    setError("");
    const missingtypesAssets = data.reduce(
      (acc, item) =>
        !item.assetType && item.assetNumber ? [...acc, item.assetNumber] : acc,
      []
    );
    if (missingtypesAssets.length > 0) {
      setMissingtypesAssets(missingtypesAssets);
      setError(
        `Asset number(s)${missingtypesAssets.join(", ")} are missing assetType.`
      );
    }
  };

  const handleSavedata = async () => {
    try {
      if (missingtypesAssets.length > 0) {
        return;
      } else {
        const res = await postData("/api/updateassets", {
          data,
          role: user?.role,
        });
        console.log(res);
      }
    } catch (err) {
      console.log(err);
      setError("Failed to save data. Try again.");
    }
  };

  const handleAssetTypeChange = async ({ assetNumber, selectedAssetType }) => {
    const updated = data.map((item) =>
      item.assetNumber === assetNumber
        ? { ...item, assetType: selectedAssetType }
        : item
    );
    setData(updated);
  };

  useEffect(() => {
    handleAssetTypeMissing(data);
  }, [data]);
  // console.log(data);
  return (
    <div className="mx-auto w-full flex flex-col h-full space-y-1 ">
      {data?.length > 0 ? (
        <>
          <div className="overflow-auto h-full max-h-[calc(100vh-250px)]">
            <table className="table table-xs">
              <thead>
                <tr className="bg-gray-200 sticky top-0 z-20">
                  {/* {Object.keys(data[0]).map((header, index) => (
                                        <th key={index}>{header}</th>
                                    ))} */}
                  <th>SL</th>
                  <th>Asset Number</th>
                  <th>Asset Class</th>
                  <th>Asset Type</th>
                  <th>Asset Description</th>
                  <th>Acquis Date</th>
                  <th>Acquis. Val</th>
                  <th>Accum. Dep</th>
                  <th>Book Val</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 &&
                  data?.map((rowData, idx) => (
                    <tr key={idx} className="even:bg-gray-300">
                      <td>{idx + 1}</td>
                      <td>{rowData?.assetNumber}</td>
                      <td>{rowData?.assetClass}</td>
                      <td>
                        {rowData.isTypeExist ? (
                          rowData.assetType
                        ) : (
                          <AssetTypeInput
                            isMissingType={missingtypesAssets.includes(
                              rowData.assetNumber
                            )}
                            rowData={rowData}
                            assetTypes={
                              assetTypesMap.get(rowData.assetClass) || []
                            }
                            handleAssetTypeChange={handleAssetTypeChange}
                          />
                        )}
                      </td>
                      <td>{rowData?.assetDescription}</td>
                      <td>{rowData?.capDate}</td>

                      <td>{rowData?.acquisVal}</td>
                      <td>{rowData?.accumDep}</td>
                      <td>{rowData?.bookVal}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {error ? (
            <div className="bg-rose-400 text-white text-wrap px-3 py-2">
              <span>{error}</span>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => setData([])}
                className="btn btn-error mt-2 btn-sm text-white"
              >
                Clear
              </button>
              <button
                onClick={handleSavedata}
                className="btn btn-info btn-sm text-white mt-2"
              >
                Save
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="form-control">
            <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />

          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-green">Please make a excel file with below headings and than upload the file.</h3>
            <table className="table border">
              <thead>
                <tr className="bg-ColumbiaBlue">
                  {requiredFields?.map(field => <>
                    <th key={field} className="border">{field}</th>
                  </>)}
                </tr>
              </thead>
            </table>
          </div>
        </>
      )}

      {requiredError && (
        <div className="bg-rose-400 text-wrap text-white px-3 py-2">
          <span>{requiredError}</span>
        </div>
      )}
    </div>
  );
};

export default UpdateAssets;
