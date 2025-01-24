
import ProtectedRoute from "../../components/ProtectedRoute";
export default function RootLayout({
    children,
}) {



    return (



        <ProtectedRoute>

            {children}

        </ProtectedRoute>



    );
}
