

const TypesRow = ({ data, idx }) => {


    return (
        <>
            {
                data?.assetTypes.map((type, tdx) =>
                    <tr className={`even:bg-[#fdf7f4]  hover:bg-secondary `}>
                        <th>{idx + 1}.{tdx + 1}</th>
                        <td>{type.assetType}</td>
                        <td>{type.totalAssets}</td>
                        <td>{type.acquisVal}</td>
                        <td>{type.bookVal}</td>
                    </tr>
                )
            }
        </>
    )
}

export default TypesRow