"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const Home = () => {
  const router = useRouter();
  const pathname = usePathname();
  const publicRoutes = ["/", "/login", "/register", "/view_asset"];

  useEffect(() => {
    if (!publicRoutes.includes(pathname)) {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="flex flex-col h-[calc(100vh-150px)] overflow-auto border mx-auto w-full  items-center justify-center">
      <div className="text-center flex-1 font-bold  space-y-2">
        <h1 className="text-3xl capitalize text-primary">
          Welcome to dead stock asset management system.
        </h1>
        <p className="text-xs text-deepBlue">
          Dead Stock Section, Bangladesh Bank, Barishal Office.
        </p>
        <Link
          href="/view_asset"
          className="btn btn-success btn-outline hover:btn-link hover:link-success "
        >
          Click Here To See Assets
        </Link>
      </div>
    </div>
  );
};

export default Home;
