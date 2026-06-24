import { useParams } from "react-router-dom";

function DetailTukang() {

    const { id } = useParams();

    return (
        <div>
            <h1>Detail Tukang #{id}</h1>
        </div>
    );

}

export default DetailTukang;