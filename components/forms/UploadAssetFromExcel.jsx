"use client"
import React, { useState } from 'react'

export const UploadAssetFromExcel = () => {
    const [pasteData, setPasteData] = useState();
    const [data, setData] = useState([]);
    const [headers, setHeaders] = useState([])

    const handlePaset = (event) => {
        setData([]);
        setPasteData([]);
        const pastedText = event.clipboardData.getData('text').replace(/\r/g, '');
        setPasteData(pastedText);

        const rows = pastedText.trim().split("\n");
        const headers = rows[0].split("\t");
        setHeaders(headers)
        const dataArray = rows.slice(1).map((row) => {
            const values = row.split("\t");
            return headers.reduce((obj, header, index) => {
                obj[header] = values[index] || ""
                return obj
            }, {})
        })
        setData(dataArray)

    }


    return (
        <dialog id="my_modal_3" className="modal">
            <div className="modal-box flex flex-col absolute max-w-screen-2xl top-0  h-96 overflow-auto  z-[99]  ">
                <div className='flex'>
                    <h2 className='text-center grow text-2xl font-bold'>Pick Asset from database</h2>
                    <form method="dialog" className='flex justify-end' >
                        <button className="btn ">Close</button>
                    </form>
                </div>
                {
                    data.length > 0 ? (
                        <div className="flex flex-col mx-auto overflow-x-auto max-w-screen-lg">
                            <table className="table border-none  static table-md  mx-auto  ">
                                <thead>
                                    <tr className="bg-gray-200">
                                        {headers.map((header, index) => (
                                            <th key={index} className="border border-gray-300 p-2">
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((rowData, rowIndex) => (
                                        <tr key={rowIndex} className="even:bg-gray-100">
                                            {
                                                headers.map((header, colIndex) =>
                                                    <td key={`${rowIndex}-${colIndex}`} className="border border-gray-300 p-2">
                                                        {rowData[header]}
                                                    </td>

                                                )
                                            }

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <button onClick={() => { setData([]); setPasteData(null) }} className='btn'>Clear Table Data</button>
                        </div>
                    ) : (<div className="flex flex-col grow max-w-screen-lg mx-auto"> <textarea
                        className="textarea textarea-sm w-ful shrink-0 w-screen-2xl  textarea-bordered"
                        placeholder="Paste Excel d  Here...."
                        defaultValue={pasteData}
                        onPaste={handlePaset}
                        rows={1}
                    >
                    </textarea></div>)
                }
            </div>


        </dialog>
    )
}
